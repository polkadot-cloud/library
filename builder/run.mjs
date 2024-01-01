// Copyright 2024 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import minimist from "minimist";
import * as packages from "./tasks/packages.mjs";
import * as directory from "./tasks/directory.mjs";

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

  case "directory:build":
    directory.build();
    break;

  default:
    console.log("❌ No task provided.");
}
