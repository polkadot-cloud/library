// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs";
import { join } from "path";
import minimist from "minimist";
import {
  addTypescriptPropertiesIfMain,
  ensurePackageOutputExists,
  formatJson,
  formatNpmPackageName,
  getPackagesDirectory,
  writePackageJsonToOutput,
} from "./utils.mjs";
import { PACKAGE_OUTPUT, REQUIRED_PACKAGE_JSON_KEYS } from "./config.mjs";

// Retrieve arguments from command.
const { p: packageName, m: main } = minimist(process.argv.slice(2));

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
  const sourcePackageJson = JSON.parse(
    fs.readFileSync(join(packagePath, "package.json")).toString()
  );

  // Required properties to be copied to the npm build package.json file.
  // --------------------------------------------------------------------
  const requiredProperties = Object.entries(sourcePackageJson).filter((k) =>
    REQUIRED_PACKAGE_JSON_KEYS.includes(k[0])
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
  if (!packageJson) {
    throw "❌ Could not format package.json";
  }

  // Create output directory if it does not exist.
  // --------------------------------------------
  if (!(await ensurePackageOutputExists(packagePath))) {
    throw `❌ Could not create ${packageName} ${PACKAGE_OUTPUT} directory`;
  }

  // Write package.json to the output directory.
  // -------------------------------------------
  if (!(await writePackageJsonToOutput(packagePath, packageJson))) {
    throw `❌ Could not write package.json for ${packageName}`;
  }

  console.log(`✅ package.json injected into package ${packageName}.`);
} catch (e) {
  console.error(`❌ Could not generate  ${packageName} package.json:`, e);
}
