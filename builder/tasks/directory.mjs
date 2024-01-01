// Copyright 2024 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import {
  getPackages,
  getSourcePackageJson,
  getTopDirectory,
  getTemplate,
  formatDirectoryHeaders,
  formatDirectoryEntry,
  getSourceIndexYml,
} from "../utils.mjs";

export const build = async () => {
  try {
    const packages = await getPackages();

    // Open file to get directory header.
    // ----------------------------------
    let data = await getTemplate("directory");

    for (const pkg of packages) {
      // Get needed data from packages source package.json file.
      // -------------------------------------------------------
      const { description: npmDescription } = await getSourcePackageJson(pkg);

      // Create package directory title and description.
      // -----------------------------------------------
      data += formatDirectoryHeaders(pkg, npmDescription);

      // Format directory data from package `index.yml`.
      // -----------------------------------------------
      const { directory } = await getSourceIndexYml(pkg);

      // Append the directory entries.
      // -----------------------------
      data += formatDirectoryEntry(directory);
    }

    // Write to docs/README.md.
    // ------------------------
    await fs.writeFile(`${getTopDirectory()}/docs/README.md`, data);

    console.log("✅ Generated directory successfully.");
  } catch (err) {
    console.log(err);
  }
};
