// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import Keyring from "@polkadot/keyring";
import { isValidAddress } from "@polkadot-cloud/utils";
import type {
  ExtensionAccount,
  ExtensionInterface,
} from "../ExtensionsProvider/types";
import { ImportedAccount } from "../types";
import { HandleImportExtension, NetworkSS58 } from "./types";
import { AnyFunction } from "../../utils/types";
import { getActiveAccountLocal, getInExternalAccounts } from "./utils";
import { defaultHandleImportExtension } from "./defaults";

export const useImportExtension = () => {
  // Handles importing of extension accounts.
  //
  // Gets accounts to be imported and commits them to state.
  const handleImportExtension = (
    id: string,
    currentAccounts: ExtensionAccount[],
    extension: ExtensionInterface,
    newAccounts: ExtensionAccount[],
    forget: (accounts: ImportedAccount[]) => void,
    { network, ss58 }: NetworkSS58
  ): HandleImportExtension => {
    if (!newAccounts.length) {
      return defaultHandleImportExtension;
    }

    const keyring = new Keyring();
    keyring.setSS58Format(ss58);

    // Remove accounts that do not contain correctly formatted addresses.
    newAccounts = newAccounts.filter(({ address }) => isValidAddress(address));

    // Reformat addresses to ensure correct ss58 format.
    newAccounts.forEach(async (account) => {
      const { address } = keyring.addFromAddress(account.address);
      account.address = address;
      return account;
    });

    // Remove `newAccounts` from local external accounts if present.
    const inExternal = getInExternalAccounts(newAccounts, network);
    forget(inExternal);

    // Find any accounts that have been removed from this extension.
    const removedAccounts = currentAccounts
      .filter((j) => j.source === id)
      .filter((j) => !newAccounts.find((i) => i.address === j.address));

    // Check whether active account is present in forgotten accounts.
    const removedActiveAccount =
      removedAccounts.find(
        ({ address }) => address === getActiveAccountLocal(network, ss58)
      )?.address || null;

    // Commit remove forgotten accounts.
    forget(removedAccounts);

    // Remove accounts that have already been added to `currentAccounts` via another extension.
    newAccounts = newAccounts.filter(
      ({ address }) =>
        !currentAccounts.find(
          (j) => j.address === address && j.source !== "external"
        )
    );

    // Format accounts properties.
    newAccounts = newAccounts.map(({ address, name }) => ({
      address,
      name,
      source: id,
      signer: extension.signer,
    }));
    return {
      newAccounts,
      meta: {
        removedActiveAccount,
      },
    };
  };

  // Get active extension account.
  //
  // Checks if the local active account is in the extension.
  const getActiveExtensionAccount = (
    { network, ss58 }: NetworkSS58,
    accounts: ImportedAccount[]
  ) => {
    return (
      accounts.find(
        ({ address }) => address === getActiveAccountLocal(network, ss58)
      ) ?? null
    );
  };

  // Connect active extension account.
  //
  // Connects to active account if it is provided.
  const connectActiveExtensionAccount = (
    account: ImportedAccount | null,
    callback: AnyFunction
  ) => {
    if (account !== null) {
      callback(account);
    }
  };

  return {
    handleImportExtension,
    getActiveExtensionAccount,
    connectActiveExtensionAccount,
  };
};
