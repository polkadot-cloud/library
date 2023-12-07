// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import {
  checkFilesExistInPackages,
  formatNpmPackageName,
  getPackagesDirectory,
} from "./utils.mjs";
import { PACKAGE_OUTPUT } from "./config.mjs";

try {
  const packages = await fs.readdir(getPackagesDirectory());

  // Check the correct output folder exists in each package.
  if (!(await checkFilesExistInPackages(packages, [PACKAGE_OUTPUT]))) {
    throw `❌ ${PACKAGE_OUTPUT} folder missing for package.`;
  }

  for (let pkg of packages) {
    // Read and parse package.json file.
    const packageJson = JSON.parse(
      await fs.readFile(
        `${getPackagesDirectory()}/${pkg}/${PACKAGE_OUTPUT}/package.json`
      )
    );

    if (packageJson?.name !== formatNpmPackageName(pkg)) {
      throw `❌ package.json name field does not match the naming requirement`;
    }
  }

  console.log("✅ Post-build integrity checks complete.");
} catch (err) {
  console.error("❌ Could not complete integrity checks.", err);
}
