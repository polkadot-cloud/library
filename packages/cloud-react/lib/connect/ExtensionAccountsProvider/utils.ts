// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from "@polkadot-cloud/utils";
import Keyring from "@polkadot/keyring";
import { ExtensionAccount } from "../ExtensionsProvider/types";
import {
  ExtensionEnableResult,
  ExternalAccount,
  RawExtensionEnable,
  RawExtensions,
} from "../types";

/*------------------------------------------------------------
   Extension validation utils.
 ------------------------------------------------------------*/

// Gets all the available extensions and their `enable` property if it exists. If enable does not
// exist, or the extension is not found, enable will return undefined.
export const getExtensionsEnable = (extensionIds: string[]): RawExtensions => {
  const rawExtensions = new Map<string, RawExtensionEnable>();

  extensionIds.forEach(async (id) => {
    // Whether extension is locally stored (previously connected).
    if (extensionIsLocal(id)) {
      // Attempt to get extension `enable` property, or remove from local storage otherwise.
      const { enable } = window.injectedWeb3[id];
      if (enable !== undefined && typeof enable === "function") {
        rawExtensions.set(id, enable);
      } else {
        removeFromLocalExtensions(id);
      }
    }
  });

  return rawExtensions;
};

// Calls `enable` and formats the results of an extension's `enable` function.
export const enableExtensionsAndFormat = async (
  extensions: RawExtensions,
  dappName: string
): Promise<Map<string, ExtensionEnableResult>> => {
  // Call `enable` and accumulate extension statuses (summons extension popup).
  const results = await Promise.allSettled(
    Object.values(extensions).map((enable) => enable(dappName))
  );

  // Accumulate resulting extensions state after attempting to enable.
  const extensionsState = new Map<string, ExtensionEnableResult>();

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const id = extensions.keys()[i];

    if (result.status === "fulfilled") {
      extensionsState.set(id, {
        extension: result.value,
        connected: true,
      });
    } else if (result.status === "rejected") {
      extensionsState.set(id, {
        connected: false,
        error: result.reason,
      });
    }
  }

  return extensionsState;
};

// Calls `enable` and formats the results of an extension's `enable` function.
export const getExtensionsAccounts = async (
  extensions: ExtensionEnableResult[]
): Promise<ExtensionAccount[]> => {
  // Call `accounts.get()` and collect results.
  const results = await Promise.allSettled(
    extensions.map(({ extension }) => extension.accounts.get())
  );

  // Accumulate resulting extensions state after attempting to enable.
  const accounts: ExtensionAccount[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      accounts.push(...result.value);
    }
  }
  return accounts;
};

/*------------------------------------------------------------
   localStorage utils.
 ------------------------------------------------------------*/

// Gets local `active_acount` for a network.
export const getActiveAccountLocal = (network: string, ss58: number) => {
  const keyring = new Keyring();
  keyring.setSS58Format(ss58);
  let account = localStorageOrDefault(`${network}_active_account`, null);
  if (account !== null) {
    account = keyring.addFromAddress(account).address;
  }
  return account;
};

// Adds an extension to local `active_extensions`.
export const addToLocalExtensions = (id: string) => {
  const localExtensions = localStorageOrDefault<string[]>(
    `active_extensions`,
    [],
    true
  );
  if (Array.isArray(localExtensions)) {
    if (!localExtensions.includes(id)) {
      localExtensions.push(id);
      localStorage.setItem(
        "active_extensions",
        JSON.stringify(localExtensions)
      );
    }
  }
};

// Gets accounts that exist in local `external_accounts`.
export const getInExternalAccounts = (
  accounts: ExtensionAccount[],
  network: string
) => {
  const localExternalAccounts = getLocalExternalAccounts(network);

  return (
    localExternalAccounts.filter(
      (a) => (accounts || []).find((b) => b.address === a.address) !== undefined
    ) || []
  );
};

// Gets local external accounts, formatting their addresses using active network ss58 format.
export const getLocalExternalAccounts = (network?: string) => {
  let localAccounts = localStorageOrDefault<ExternalAccount[]>(
    "external_accounts",
    [],
    true
  ) as ExternalAccount[];
  if (network) {
    localAccounts = localAccounts.filter((l) => l.network === network);
  }
  return localAccounts;
};

// Check if an extension exists in local `active_extensions`.
export const extensionIsLocal = (id: string) => {
  const localExtensions = localStorageOrDefault<string[]>(
    `active_extensions`,
    [],
    true
  );
  let foundExtensionLocally = false;
  if (Array.isArray(localExtensions)) {
    foundExtensionLocally = localExtensions.find((l) => l === id) !== undefined;
  }
  return foundExtensionLocally;
};

// Removes extension from local `active_extensions`.
export const removeFromLocalExtensions = (id: string) => {
  let localExtensions = localStorageOrDefault<string[]>(
    `active_extensions`,
    [],
    true
  );
  if (Array.isArray(localExtensions)) {
    localExtensions = localExtensions.filter((l: string) => l !== id);
    localStorage.setItem("active_extensions", JSON.stringify(localExtensions));
  }
};
