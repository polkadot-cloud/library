// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useEffect, useRef, useState } from "react";
import { localStorageOrDefault, setStateWithRef } from "@polkadot-cloud/utils";
import { defaultExtensionAccountsContext } from "./defaults";
import { ExtensionStatusWithEnable, ImportedAccount } from "../types";
import {
  ExtensionAccount,
  ExtensionInterface,
} from "../ExtensionsProvider/types";
import {
  ExtensionAccountsContextInterface,
  ExtensionAccountsProviderProps,
  Sync,
} from "./types";
import {
  addToLocalExtensions,
  enableExtensionsAndFormat,
  getExtensionsAccounts,
  getExtensionsByStatus,
  getExtensionsEnable,
  removeFromLocalExtensions,
} from "./utils";
import { AnyFunction, AnyJson } from "../../utils/types";
import { useImportExtension } from "./useImportExtension";
import { useExtensions } from "../ExtensionsProvider/useExtensions";
import { useEffectIgnoreInitial } from "../../base/hooks/useEffectIgnoreInitial";
import { initPolkadotSnap } from "./snap";
import { SnapNetworks } from "@chainsafe/metamask-polkadot-types";

export const ExtensionAccountsContext =
  createContext<ExtensionAccountsContextInterface>(
    defaultExtensionAccountsContext
  );

export const ExtensionAccountsProvider = ({
  children,
  network,
  ss58,
  dappName,
  activeAccount,
  setActiveAccount,
  onExtensionEnabled,
}: ExtensionAccountsProviderProps) => {
  const {
    handleImportExtension,
    getActiveExtensionAccount,
    connectActiveExtensionAccount,
  } = useImportExtension();

  const {
    extensionsStatus,
    setExtensionStatus,
    removeExtensionStatus,
    checkingInjectedWeb3,
    extensionHasFeature,
  } = useExtensions();

  // Store connected extension accounts.
  const [extensionAccounts, setExtensionAccounts] = useState<ImportedAccount[]>(
    []
  );
  const extensionAccountsRef = useRef(extensionAccounts);

  // Store whether extension accounts have been synced.
  const [extensionAccountsSynced, setExtensionAccountsSynced] =
    useState<Sync>("unsynced");

  // Store extensions whose account subscriptions have been initialised.
  const [extensionsInitialised, setExtensionsInitialised] = useState<AnyJson[]>(
    []
  );
  const extensionsInitialisedRef = useRef(extensionsInitialised);

  // Store unsubscribe handlers for connected extensions.
  const unsubs = useRef<Record<string, AnyFunction>>({});

  // Helper for setting active account. Ignores if not a valid function.
  const maybeSetActiveAccount = (address: string) => {
    if (typeof setActiveAccount === "function")
      setActiveAccount(address ?? null);
  };

  // Helper for calling extension enabled callback. Ignores if not a valid function.
  const maybeOnExtensionEnabled = (id: string) => {
    if (typeof onExtensionEnabled === "function") onExtensionEnabled(id);
  };

  const connectToAccount = (account: ImportedAccount | null) => {
    maybeSetActiveAccount(account?.address ?? null);
  };

  // connectActiveExtensions
  //
  // Connects to extensions that already have been connected to and stored in localStorage. Loop
  // through extensions and connect to accounts. If `activeAccount` exists locally, we wait until
  // all extensions are looped before connecting to it; there is no guarantee it still exists - must
  // explicitly find it.
  const connectActiveExtensions = async () => {
    const extensionIds = Object.keys(extensionsStatus);
    if (!extensionIds.length) return;

    // Pre-connect: Inject extensions into `injectedWeb3` if not already injected.
    await handleExtensionAdapters(extensionIds);

    const activeWalletAccount: ImportedAccount | null = null;

    // Iterate previously connected extensions and format their status.
    // ----------------------------------------------------------------

    // Acccumulate avaialble extensions or return errors if they do not exist.
    const rawExtensions = getExtensionsEnable(extensionIds);

    // Get available extensions to connect to.
    const extensionsToConnect: ExtensionStatusWithEnable =
      getExtensionsByStatus(rawExtensions, "valid");

    // Attempt to connect to extensions via `enable`, and format the results.
    // ----------------------------------------------------------------------

    // Accumulate resulting extensions state after attempting to enable.
    const enableResults = await enableExtensionsAndFormat(
      extensionsToConnect,
      dappName
    );

    // Retrieve the resulting connected extensions only.
    const connectedExtensions = Object.fromEntries(
      Object.entries(enableResults).filter(
        ([, state]) => state.connected === true
      )
    );

    // Add connected extensions to local storage.
    Object.keys(connectedExtensions).forEach((id) => addToLocalExtensions(id));

    // Initial fetch of extension accounts to populate accounts & extensions state.
    // ----------------------------------------------------------------------------

    const initialAccounts = await getExtensionsAccounts(
      Object.values(connectedExtensions)
    );

    // TODO: refactor to handle multiple ids and take enable = undefined / enable failed / connected = false.
    // handleExtensionError(id, String(err));

    // TODO: refactor to handle multiple ids. Successfully connected.
    // setExtensionStatus(id, "connected");

    // TODO: refactor to handle multiple ids.
    // updateInitialisedExtensions(id);

    // Set active account if it has been imported..
    if (initialAccounts.find(({ address }) => address === activeAccount)) {
      connectActiveExtensionAccount(activeWalletAccount, connectToAccount);
    }

    // Initiate account subscriptions for connected extensions.
    // --------------------------------------------------------

    for (const [id, { extension }] of Object.entries(connectedExtensions)) {
      const handleAccounts = (accounts: ExtensionAccount[]) => {
        const {
          newAccounts,
          meta: { accountsToForget },
        } = handleImportExtension(
          id,
          extensionAccountsRef.current,
          extension.signer,
          accounts,
          {
            network,
            ss58,
          }
        );

        // Forget any removed accounts.
        if (accountsToForget.length) {
          forgetAccounts(accountsToForget);
        }
        // Concat new accounts and store.
        addExtensionAccount(newAccounts);
      };

      // If account subscriptions are supported, subscribe to accounts for real-time updates.
      if (extensionHasFeature(id, "subscribeAccounts")) {
        const unsub = extension.accounts.subscribe((accounts) => {
          handleAccounts(accounts || []);
        });

        // Add unsub to context ref; safe to call in loop as this does not cause re-render.
        addToUnsubscribe(id, unsub);
      }
    }
  };

  // connectExtensionAccounts
  //
  // Similar to the above but only connects to a single extension. This is invoked by the user by
  // clicking on an extension. If activeAccount is not found here, it is simply ignored.
  const connectExtensionAccounts = async (id: string): Promise<boolean> => {
    const extensionIds = Object.keys(extensionsStatus);
    const exists = extensionIds.find((key) => key === id) || undefined;

    if (!exists) {
      updateInitialisedExtensions(
        `unknown_extension_${extensionsInitialisedRef.current.length + 1}`
      );
    } else {
      // Pre-connect: Inject into `injectedWeb3` if the provided extension is not already injected.
      await handleExtensionAdapters([id]);

      try {
        // Attempt to get extension `enable` property.
        const { enable } = window.injectedWeb3[id];

        // Summons extension popup.
        const extension: ExtensionInterface = await enable(dappName);

        // Continue if `enable` succeeded, and if the current network is supported.
        if (extension !== undefined) {
          // Call optional `onExtensionEnabled` callback.
          maybeOnExtensionEnabled(id);
          addToLocalExtensions(id);
          setExtensionStatus(id, "connected");

          // Handler for new accounts.
          const handleAccounts = (accounts: ExtensionAccount[]) => {
            const {
              newAccounts,
              meta: { removedActiveAccount, accountsToForget },
            } = handleImportExtension(
              id,
              extensionAccountsRef.current,
              extension.signer,
              accounts,
              { network, ss58 }
            );
            // Set active account for network if not yet set.
            if (!activeAccount) {
              const activeExtensionAccount = getActiveExtensionAccount(
                { network, ss58 },
                newAccounts
              );
              if (
                activeExtensionAccount?.address !== removedActiveAccount &&
                removedActiveAccount !== null
              )
                connectActiveExtensionAccount(
                  activeExtensionAccount,
                  connectToAccount
                );
            }
            // Forget any removed accounts.
            if (accountsToForget.length) {
              forgetAccounts(accountsToForget);
            }
            // Concat accounts and store.
            addExtensionAccount(newAccounts);
            // Update initialised extensions.
            updateInitialisedExtensions(id);
          };

          // If account subscriptions are not supported, simply get the account(s) from the extnsion. Otherwise, subscribe to accounts.
          if (!extensionHasFeature(id, "subscribeAccounts")) {
            const accounts = await extension.accounts.get();
            handleAccounts(accounts);
          } else {
            const unsub = extension.accounts.subscribe((accounts) => {
              handleAccounts(accounts || []);
            });
            addToUnsubscribe(id, unsub);
          }
          return true;
        }
      } catch (err) {
        handleExtensionError(id, String(err));
      }
    }
    return false;
  };

  // Handle errors when communiating with extensions.
  const handleExtensionError = (id: string, err: string) => {
    // if not general error (maybe enabled but no accounts trust app).
    if (err.startsWith("Error")) {
      // remove extension from local `active_extensions`.
      removeFromLocalExtensions(id);
      // extension not found (does not exist).
      if (err.substring(0, 17) === "NotInstalledError") {
        removeExtensionStatus(id);
      } else {
        // declare extension as no imported accounts authenticated.
        setExtensionStatus(id, "not_authenticated");
      }
    }
    // mark extension as initialised.
    updateInitialisedExtensions(id);
  };

  // Handle adaptors for extensions that are not supported by `injectedWeb3`.
  const handleExtensionAdapters = async (extensionIds: string[]) => {
    // Connect to Metamask Polkadot Snap and inject into `injectedWeb3` if avaialble.
    if (extensionIds.find((id) => id === "metamask-polkadot-snap")) {
      await initPolkadotSnap({
        networkName: network as SnapNetworks,
        addressPrefix: ss58,
      });
    }
  };

  // Handle forgetting of an imported extension account.
  const forgetAccounts = (forget: ImportedAccount[]) => {
    // Unsubscribe and remove unsub from context ref.
    if (forget.length) {
      for (const { address } of forget) {
        if (extensionAccountsRef.current.find((a) => a.address === address)) {
          const unsub = unsubs.current[address];
          if (unsub) {
            unsub();
            delete unsubs.current[address];
          }
        }
      }
      // Remove forgotten accounts from context state.
      setStateWithRef(
        [...extensionAccountsRef.current].filter(
          (a) => forget.find((s) => s.address === a.address) === undefined
        ),
        setExtensionAccounts,
        extensionAccountsRef
      );
      // If the currently active account is being forgotten, disconnect.
      if (activeAccount) {
        if (
          forget.find(({ address }) => address === activeAccount) !== undefined
        )
          maybeSetActiveAccount(null);
      }
    }
  };

  // Update initialised extensions.
  const updateInitialisedExtensions = (id: string) => {
    if (!extensionsInitialisedRef.current.includes(id)) {
      setStateWithRef(
        [...extensionsInitialisedRef.current].concat(id),
        setExtensionsInitialised,
        extensionsInitialisedRef
      );
    }
  };

  // Add an extension account to context state.
  const addExtensionAccount = (accounts: ImportedAccount[]) => {
    setStateWithRef(
      [...extensionAccountsRef.current].concat(accounts),
      setExtensionAccounts,
      extensionAccountsRef
    );
  };

  // add an extension id to unsubscribe state.
  const addToUnsubscribe = (id: string, unsub: AnyFunction) => {
    unsubs.current[id] = unsub;
  };

  // Unsubscrbe all account subscriptions.
  const unsubscribe = () => {
    Object.values(unsubs.current).forEach((unsub) => {
      unsub();
    });
  };

  // Re-sync extensions accounts on `unsynced`.
  useEffect(() => {
    // wait for injectedWeb3 check to finish before starting account import process.
    if (!checkingInjectedWeb3 && extensionAccountsSynced === "unsynced") {
      // unsubscribe from all accounts and reset state
      unsubscribe();
      setStateWithRef([], setExtensionAccounts, extensionAccountsRef);
      setStateWithRef([], setExtensionsInitialised, extensionsInitialisedRef);
      // if extensions have been fetched, get accounts if extensions exist and
      // local extensions exist (previously connected).
      if (Object.keys(extensionsStatus).length) {
        // get active extensions
        const localExtensions = localStorageOrDefault(
          `active_extensions`,
          [],
          true
        );
        if (Object.keys(extensionsStatus).length && localExtensions.length) {
          setExtensionAccountsSynced("syncing");
          connectActiveExtensions();
        } else setExtensionAccountsSynced("synced");
      }
    }
    return () => unsubscribe();
  }, [extensionsStatus, checkingInjectedWeb3, extensionAccountsSynced]);

  // Change syncing to unsynced on `ss58` change.
  useEffectIgnoreInitial(() => {
    setExtensionAccountsSynced("unsynced");
  }, [ss58]);

  // Once initialised extensions equal total extensions present in `injectedWeb3`, mark extensions
  // as fetched.
  useEffectIgnoreInitial(() => {
    if (
      !checkingInjectedWeb3 &&
      extensionsInitialised.length === Object.keys(extensionsStatus).length
    ) {
      setExtensionAccountsSynced("synced");
    }
  }, [checkingInjectedWeb3, extensionsInitialised]);

  return (
    <ExtensionAccountsContext.Provider
      value={{
        connectExtensionAccounts,
        extensionAccountsSynced,
        forgetAccounts,
        extensionAccounts: extensionAccountsRef.current,
      }}
    >
      {children}
    </ExtensionAccountsContext.Provider>
  );
};
