// Copyright 2023 @polkadot-cloud/polkadot-cloud authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionAccount } from "@polkadot-cloud/react/connect/ExtensionsProvider/types";
import type { MaybeAddress } from "@polkadot-cloud/react/utils/types";
import type { ImportedAccount } from "@polkadot-cloud/react/connect/types";

export interface ImportedAccountsContextInterface {
  accounts: ImportedAccount[];
  getAccount: (address: MaybeAddress) => ExtensionAccount | null;
  isReadOnlyAccount: (address: MaybeAddress) => boolean;
  accountHasSigner: (address: MaybeAddress) => boolean;
  requiresManualSign: (address: MaybeAddress) => boolean;
}
