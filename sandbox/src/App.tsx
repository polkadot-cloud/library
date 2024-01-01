/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { BrowserRouter } from "react-router-dom";
import { Providers } from "./Providers";

export const App = () => (
  <BrowserRouter basename="/">
    <Providers />
  </BrowserRouter>
);
