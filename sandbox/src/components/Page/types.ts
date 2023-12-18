/* @license Copyright 2023 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { CSSProperties, ReactNode } from "react";

export interface PageProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}
