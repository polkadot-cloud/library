/* @license Copyright 2023 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { LoaderProps } from "../../base/types";
import "@polkadot-cloud/core/css/loaders/Line/index.css";

export const Line = ({ text }: LoaderProps) => (
  <div className="line-loading">
    {text && <p>{text}</p>}
    <span></span>
  </div>
);
