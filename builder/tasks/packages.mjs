// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { join } from "path";
import { parse } from "yaml";
import fs from "fs/promises";
import {
  addTypescriptPropertiesIfMain,
  allPropertiesExist,
  bumpSemverPatch,
  checkFilesExistInPackages,
  checkFoldersInDirectory,
  ensurePackageOutputExists,
  formatJson,
  formatNpmPackageName,
  getDistPackageJson,
  getPackageScripts,
  getPackages,
  getPackagesDirectory,
  getReleasePleaseManifest,
  getSourcePackageJson,
  writePackageJsonToOutput,
  writePackageJsonToSource,
  writeReleasePleaseManifest,
  writeReadmeToOutput,
  formatDirectoryEntry,
  npmLicenseContent,
  npmHearderContent,
  getTemplate,
} from "../utils.mjs";
import {
  PACKAGE_OUTPUT,
  PACKAGE_REQUIRED_FILES,
  PACKAGE_REQUIRED_JSON_KEYS,
  PACKAGE_REQUIRED_SCRIPTS,
} from "../config.mjs";

export const prebuild = async () => {
  try {
    // Get the list of package directories.
    // ------------------------------------
    const packages = await getPackages();

    // Ensure all package directories exist.
    // -------------------------------------
    if (!(await checkFoldersInDirectory(getPackagesDirectory(), packages))) {
      throw `❌ Package directories missing. Must have ${packages.join(
        ", "
      )} directories`;
    }

    // Check required files exist for each package.
    // --------------------------------------------
    if (!(await checkFilesExistInPackages(packages, PACKAGE_REQUIRED_FILES))) {
      throw `❌ Required files missing in packages. Must have ${PACKAGE_REQUIRED_FILES.join(
        ", "
      )} files`;
    }

    // Check all required properties exist for each package.
    // -----------------------------------------------------
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
};

export const build = async ({ p: packageName, m: main }) => {
  try {
    // A package name must be provided.
    // --------------------------------
    if (!packageName) {
      throw "❌ Please provide package name with the -p argument";
    }

    // Full package directory path.
    // ----------------------------
    const packagePath = join(getPackagesDirectory(), packageName);

    // Source package.json as a parsed JSON object.
    // --------------------------------------------
    const sourcePackageJson = await getSourcePackageJson(packageName);

    // Required properties to be copied to the npm build package.json file.
    // --------------------------------------------------------------------
    const requiredProperties = Object.entries(sourcePackageJson).filter((k) =>
      PACKAGE_REQUIRED_JSON_KEYS.includes(k[0])
    );

    // Inject formatted package `name` into required properties.
    // ---------------------------------------------------------
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

    // Open file to get npm header.
    // ----------------------------
    let readmeMd = await getTemplate("npm");

    // Format data from package `index.yml`.
    // -------------------------------------
    const { directory, npm } = parse(
      await fs.readFile(
        `${getPackagesDirectory()}/${packageName}/index.yml`,
        "utf-8"
      )
    );

    // Get needed data from packages source package.json file.
    // -------------------------------------------------------
    const { description: npmDescription, license } =
      await getSourcePackageJson(packageName);

    // Append the npm entries.
    // -----------------------
    readmeMd += npmHearderContent(npm.title, npmDescription);

    if (npm.contents) {
      for (const item of npm.contents) {
        readmeMd += "- " + item.item + "\n\n";
      }
    }

    readmeMd += "## Docs" + "\n\n";

    // Append the directory entries.
    // -----------------------------
    readmeMd += formatDirectoryEntry(directory) + npmLicenseContent(license);

    // Write README.md to the output directory.
    // ----------------------------------------
    await writeReadmeToOutput(packagePath, readmeMd);
    console.log(
      `✅ package.json and README.md injected into package ${packageName}.`
    );
  } catch (err) {
    console.error(
      `❌ Could not generate ${packageName} package.json and README.md:`,
      err
    );
  }
};

export const postbuild = async () => {
  try {
    const packages = await getPackages();

    // Check the correct output folder exists in each package.
    // -------------------------------------------------------
    if (!(await checkFilesExistInPackages(packages, [PACKAGE_OUTPUT]))) {
      throw `❌ ${PACKAGE_OUTPUT} folder missing for package.`;
    }

    for (let pkg of packages) {
      // Read and parse package.json file.
      // ---------------------------------
      const packageJson = await getDistPackageJson(pkg);

      // Ensure package name is correct.
      // -------------------------------
      if (packageJson?.name !== formatNpmPackageName(pkg)) {
        throw `❌ package.json name field does not match the naming requirement.`;
      }
    }

    console.log("✅ Post-build integrity checks complete.");
  } catch (err) {
    console.error("❌ Could not complete integrity checks.", err);
  }
};

export const patch = async () => {
  try {
    const packages = await getPackages();

    // Get Release Please manifest file to update.
    // -------------------------------------------
    const releasePleaseManifset = await getReleasePleaseManifest();

    for (let pkg of packages) {
      // Read and parse package.json file.
      // ---------------------------------
      const packageJson = await getSourcePackageJson(pkg);

      // Bump version patch index.
      // -------------------------
      const newVersion = bumpSemverPatch(packageJson.version);

      // Write updated package.json to the source directory.
      // ---------------------------------------------------
      await writePackageJsonToSource(
        pkg,
        await formatJson({
          ...packageJson,
          version: newVersion,
        })
      );

      // Update Release Please manifest version.
      // ---------------------------------------
      releasePleaseManifset[`packages/${pkg}`] = newVersion;
    }

    // Write updated Release Please manifest.
    // --------------------------------------
    await writeReleasePleaseManifest(await formatJson(releasePleaseManifset));

    console.log("✅ Patched all package versions.");
  } catch (err) {
    console.error(err);
  }
};
