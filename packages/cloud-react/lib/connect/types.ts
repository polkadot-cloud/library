// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  ExtensionAccount,
  ExtensionInterface,
} from "./ExtensionsProvider/types";

export type AccountSource = "extension" | "external" | "ledger" | "vault";

export type ImportedAccount =
  | ExtensionAccount
  | ExternalAccount
  | LedgerAccount
  | VaultAccount;

export interface ExternalAccount {
  address: string;
  network: string;
  name: string;
  source: string;
  addedBy: ExternalAccountAddedBy;
}

export interface LedgerAccount {
  address: string;
  network: string;
  name: string;
  source: string;
  index: number;
}

export interface VaultAccount {
  address: string;
  network: string;
  name: string;
  source: string;
  index: number;
}

export type ExternalAccountAddedBy = "system" | "user";

export type ExtensionStatusWithEnable = Record<
  string,
  (name?: string) => Promise<ExtensionInterface>
>;

export type ExtensionEnableStatus =
  | "valid"
  | "extension_not_found"
  | "enable_invalid";

export interface ExtensionEnableResult {
  extension?: ExtensionInterface;
  connected: boolean;
  error?: string;
}

export type ExtensionEnableResults = Record<
  string,
  {
    enable?: (n?: string) => Promise<ExtensionInterface>;
    status: ExtensionEnableStatus;
  }
>;
