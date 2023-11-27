// Copyright 2023 @polkadot-cloud/polkadot-cloud authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LedgerTask } from "../../Providers/HardwareProviders/types";
import type { AnyJson } from "@polkadot-cloud/react/utils/types";

export interface LederLoopProps {
  tasks: LedgerTask[];
  options: {
    uid?: number;
    accountIndex?: () => number;
    payload?: () => Promise<AnyJson>;
  };
  network?: string;
  mounted: () => boolean;
}
