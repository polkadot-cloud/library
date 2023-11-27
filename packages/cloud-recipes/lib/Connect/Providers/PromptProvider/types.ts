// Copyright 2023 @polkadot-cloud/polkadot-cloud authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ReactNode } from "react";
import type { MaybeString } from "@polkadot-cloud/react/utils/types";

export interface PromptContextInterface {
  openPromptWith: (o: ReactNode | null, s?: string) => void;
  closePrompt: () => void;
  setStatus: (s: number) => void;
  setPrompt: (d: MaybeString) => void;
  size: string;
  status: number;
  Prompt: ReactNode | null;
}
