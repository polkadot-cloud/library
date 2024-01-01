/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { useTheme } from "../../contexts/Theme";
// Import the base cloud-core styles to ensure the theme styles are applied instead of doc styles.
import "../../../../packages/cloud-core/dist/css/styles/index.css";
// Import each supported theme here.
import "../../../../packages/cloud-core/dist/accent/polkadot-relay.css";
import "../../../../packages/cloud-core/dist/accent/kusama-relay.css";
import "../../../../packages/cloud-core/dist/accent/westend-relay.css";
import "../../../../packages/cloud-core/dist/theme/default/index.css";

import { PageProps } from "./types";

export const Page = ({ children, className, style }: PageProps) => {
  const { theme, mode } = useTheme();

  return (
    <div
      className={`page theme-${theme} theme-${mode}${
        className ? ` ${className}` : ``
      }`}
      style={style ? { ...style } : undefined}
    >
      {children}
    </div>
  );
};
