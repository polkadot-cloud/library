// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { join } from "path";
import {
  addTypescriptPropertiesIfMain,
  ensurePackageOutputExists,
  formatJson,
  formatNpmPackageName,
  getPackagesDirectory,
  getSourcePackageJson,
  writePackageJsonToOutput,
} from "../utils.mjs";
import { PACKAGE_REQUIRED_JSON_KEYS } from "../config.mjs";

export const run = async ({ p: packageName, m: main }) => {
  try {
    // A package name must be provided.
    // --------------------------------
    if (!packageName) {
      throw "❌ Please provide package name with the -p flag";
    }

    // Full package directory path.
    // ----------------------------
    const packagePath = join(getPackagesDirectory(), packageName);

    // Source package.json as a parsed JSON object.
    // ----------------------------------------------
    const sourcePackageJson = await getSourcePackageJson(packagePath);

    // Required properties to be copied to the npm build package.json file.
    // --------------------------------------------------------------------
    const requiredProperties = Object.entries(sourcePackageJson).filter((k) =>
      PACKAGE_REQUIRED_JSON_KEYS.includes(k[0])
    );

    //Inject formatted package `name` into required properties.
    // --------------------------------------------------------
    requiredProperties.unshift(["name", formatNpmPackageName(packageName)]);

    // Format package.json as Typeacript module if `main` was provided.
    // ----------------------------------------------------------------
    let finalProperties = Object.fromEntries(requiredProperties);
    finalProperties = addTypescriptPropertiesIfMain(main, finalProperties);

    // Format final package.json for output.
    // -------------------------------------
    const packageJson = await formatJson(finalProperties);

    // Create output directory if it does not exist.
    // --------------------------------------------
    await ensurePackageOutputExists(packagePath);

    // Write package.json to the output directory.
    // -------------------------------------------
    await writePackageJsonToOutput(packagePath, packageJson);

    console.log(`✅ package.json injected into package ${packageName}.`);
  } catch (err) {
    console.error(`❌ Could not generate  ${packageName} package.json:`, err);
  }
};
