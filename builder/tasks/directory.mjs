// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import { parse } from "yaml";
import {
  formatNpmPackageName,
  getPackages,
  getPackagesDirectory,
  getSourcePackageJson,
  getTopDirectory,
  getDirectoryTemplate,
} from "../utils.mjs";

// Retrieve the content from the index.ymls in the packages
// Place the content to the position under the title session
export const build = async () => {
  try {
    const packages = await getPackages();

    // open file to get directory header.
    let data = await getDirectoryTemplate();

    for (const pkg of packages) {
      // get needed data from packages source package.json file.
      const { description: npmDescription } = await getSourcePackageJson(pkg);

      // create package directory title and description.
      data +=
        "#### `" +
        formatNpmPackageName(pkg) +
        "`&nbsp; [[source](https://github.com/polkadot-cloud/library/tree/main/packages/" +
        pkg +
        ") &nbsp;|&nbsp; [npm](https://www.npmjs.com/package/" +
        formatNpmPackageName(pkg) +
        ")]\n\n" +
        npmDescription +
        "\n\n";

      // get needed data from package yml file.
      const { directory } = parse(
        await fs.readFile(`${getPackagesDirectory()}/${pkg}/index.yml`, "utf-8")
      );

      // append the directory items onto data.
      data += directory.reduce((str, { name, description, doc }) => {
        return (
          str +
          "- [" +
          name +
          "](" +
          doc +
          ")" +
          (description ? ": " + description : "") +
          "\n\n"
        );
      }, "");
    }

    // Write to docs directory.
    await fs.writeFile(`${getTopDirectory()}/docs/README.md`, data);

    console.log("✅ Generated directory successfully.");
  } catch (err) {
    console.log(err);
  }
};
