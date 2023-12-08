// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import minimist from "minimist";
import * as packages from "./tasks/packages.mjs";

const args = minimist(process.argv.slice(2));

const { t: task, ...rest } = args;

switch (task) {
  case "packages:prebuild":
    packages.prebuild();
    break;

  case "package:build":
    packages.build(rest);
    break;

  case "packages:postbuild":
    packages.postbuild();
    break;

  case "packages:patch":
    packages.patch();
    break;

  default:
    console.log("❌ No task provided.");
}
