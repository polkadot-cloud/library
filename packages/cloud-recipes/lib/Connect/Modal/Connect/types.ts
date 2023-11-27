// Copyright 2023 @polkadot-cloud/polkadot-cloud authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Any } from "@polkadot-cloud/react/utils/types";

export interface ExtensionProps {
  meta: ExtensionMetaProps;
  installed?: Any;
  size?: string;
  message?: string;
  flag?: boolean;
  status?: string;
}

export interface ExtensionMetaProps {
  id: string;
  title: string;
  status?: string;
  website: string | [string, string];
}

export interface ListWithInputProps {
  setInputOpen: (k: boolean) => void;
  inputOpen: boolean;
}

export interface forwardRefProps {
  setSection?: Any;
  readOnlyOpen: boolean;
  setReadOnlyOpen: (e: boolean) => void;
}
