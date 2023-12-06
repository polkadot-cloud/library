// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import { checkFilesExistInPackages } from "./utils.mjs";

// Checks that a generated package name matches that in the dist/package.json file.
const matchName = async (dir, files) => {
  for (let file of files) {
    try {
      const filePath = `${dir}${file}/dist/package.json`;

      // Read and parse package.json file.
      const json = JSON.parse(await fs.readFile(filePath));

      // Remove "cloud-" prefix from the name if it exists.
      const nameFromFile = file.startsWith("cloud-")
        ? file.slice("cloud-".length)
        : file;

      if (json?.name !== `@polkadot-cloud/${nameFromFile}`) {
        console.error(
          `❌ package.json name field does not match the naming requirement`
        );
      }
    } catch (err) {
      console.error(`❌ dist/package.json file not found in ${dir}${file}`);
    }
  }
};

try {
  // Get packages.
  const packages = await fs.readdir("./packages");

  // Check the dist folder exists in each package.
  await checkFilesExistInPackages(packages, ["dist"]);
  matchName("./packages/", packages);

  console.log("✅ Post-build integrity checks complete.");
} catch (e) {
  console.error("❌ Could not complete integrity checks.");
}
