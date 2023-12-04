/* @license Copyright 2023 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { AccountCard } from "@packages/cloud-recipes/lib/AccountCard";
import { SimpleEditor } from "@docs/SimpleEditor";
import { Demo } from "@docs/Demo";

export const AccountCardPageSimpleNoIcon = () => {
  const code = `
import { AccountCard } from "@polkadot-cloud/recipes/AccountCard";
...
return (
  <AccountCard style={{ padding: "1rem" }} title={{ address: "1f1yYj2bCFhJCTVdeWLDueUsrZynLAaj6jeMy18fjZ7Cr73" }} />
);`;

  return (
    <>
      <Demo showThemes={false}>
        <AccountCard
          style={{ padding: "1rem" }}
          title={{ address: "1f1yYj2bCFhJCTVdeWLDueUsrZynLAaj6jeMy18fjZ7Cr73" }}
        />
      </Demo>
      <SimpleEditor code={code} />
    </>
  );
};
