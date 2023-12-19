// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ReactNode } from "react";
import { LedgerAccount } from "../types";

export interface LedgerAccountsContextInterface {
  ledgerAccountExists: (a: string) => boolean;
  addLedgerAccount: (
    a: string,
    i: number,
    callback?: () => void
  ) => LedgerAccount | null;
  removeLedgerAccount: (a: string, callback?: () => void) => void;
  renameLedgerAccount: (a: string, name: string) => void;
  getLedgerAccount: (a: string) => LedgerAccount | null;
  ledgerAccounts: LedgerAccount[];
}

export interface LedgerAccountsProviderProps {
  children: ReactNode;
  network: string;
}

export interface LedgerAddress {
  address: string;
  index: number;
  name: string;
  network: string;
  pubKey: string;
}
