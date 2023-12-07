// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import {
  allPropertiesExist,
  checkFilesExistInPackages,
  checkFoldersInDirectory,
  getPackageScripts,
  getPackagesDirectory,
} from "../utils.mjs";
import {
  PACKAGE_REQUIRED_SCRIPTS,
  PACKAGE_REQUIRED_FILES,
} from "../config.mjs";

try {
  const packages = await fs.readdir(getPackagesDirectory());

  // Ensure all package directories exist.
  if (!(await checkFoldersInDirectory(getPackagesDirectory(), packages))) {
    throw `❌ Package directories missing. Must have ${packages.join(
      ", "
    )} directories`;
  }

  // Check required files exist for each package.
  if (!(await checkFilesExistInPackages(packages, PACKAGE_REQUIRED_FILES))) {
    throw `❌ Required files missing in packages. Must have ${PACKAGE_REQUIRED_FILES.join(
      ", "
    )} files`;
  }

  for (const pkg of packages) {
    if (
      !allPropertiesExist(
        await getPackageScripts(pkg),
        PACKAGE_REQUIRED_SCRIPTS
      )
    ) {
      throw `❌ Missing script field(s) in package.json. Must have ${PACKAGE_REQUIRED_SCRIPTS.join(
        ", "
      )} properties`;
    }
  }

  console.log("✅ Pre-build packages integrity checks succeeded.");
} catch (err) {
  console.error(err);
}
