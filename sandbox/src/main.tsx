/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import * as ReactDOM from "react-dom/client";
import { App } from "./App";

import "./theme/fonts.css";
import "./theme/theme.css";
import "../../packages/cloud-core/dist/theme/default/index.css";
import "../../packages/cloud-core/dist/css/styles/index.css";

import "./styles/index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
