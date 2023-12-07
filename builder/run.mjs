// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import minimist from "minimist";
import * as packageGenerate from "./tasks/packageGenerate.mjs";

const args = minimist(process.argv.slice(2));

const { t: task, ...rest } = args;

switch (task) {
  // Generates a package.json for the provided package.
  case "package":
    packageGenerate.run(rest);
    break;

  default:
    console.log("❌ No task provided.");
}
