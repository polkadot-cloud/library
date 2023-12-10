// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import { parse } from "yaml";
import {
  getPackages,
  getPackagesDirectory,
  getSourcePackageJson,
  getTopDirectory,
  getDirectoryTemplate,
  writeDataIntro,
  writeDataContent,
} from "../utils.mjs";

export const build = async () => {
  try {
    const packages = await getPackages();

    // Open file to get directory header.
    // ---------------------------------
    let data = await getDirectoryTemplate();

    for (const pkg of packages) {
      // Get needed data from packages source package.json file.
      // -------------------------------------------------------
      const { description: npmDescription } = await getSourcePackageJson(pkg);

      // Create package directory title and description.
      // -----------------------------------------------
      data += writeDataIntro(pkg, npmDescription);

      // Get needed data from package yml file.
      // --------------------------------------
      const { directory } = parse(
        await fs.readFile(`${getPackagesDirectory()}/${pkg}/index.yml`, "utf-8")
      );

      // Append the directory items onto data.
      // -------------------------------------
      data += writeDataContent(directory);
    }

    // Write to docs directory.
    // ------------------------
    await fs.writeFile(`${getTopDirectory()}/docs/README.md`, data);

    console.log("✅ Generated directory successfully.");
  } catch (err) {
    console.log(err);
  }
};
