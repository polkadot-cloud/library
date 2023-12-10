// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import {
  getPackages,
  getPackagesDirectory,
  getSourcePackageJson,
  formatNpmPackageName,
} from "../utils.mjs";
import { parse } from "yaml";

// Retrieve the content from the index.ymls in the packages
// Place the content to the position under the title session
export const build = async () => {
  try {
    const packages = await getPackages();

    for (const pkg of packages) {
      // Open file to get directory(README.md).
      let data = await getDirectory(pkg);

      // get needed data from packages source package.json file.
      const { description: npmDescription } = await getSourcePackageJson(pkg);

      // create package directory title and description.
      let intro =
        "## Directory" +
        "\n\n" +
        "#### `" +
        formatNpmPackageName(pkg) +
        "`&nbsp;[[source](https://github.com/polkadot-cloud/library/tree/main/packages/" +
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

      let content = directory.reduce((str, { name, description, doc }) => {
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

      const indexOfSecondTitle = data.indexOf("##");
      if (indexOfSecondTitle != -1) {
        const head = data.substring(0, indexOfSecondTitle);
        const tail = data.substring(indexOfSecondTitle);

        data = head + intro + content + tail;
      } else {
        data += intro;

        // append the directory items onto data.
        data += content;
      }
      // Write to docs directory.
      await fs.writeFile(`${getPackagesDirectory()}/${pkg}/README.md`, data);
    }

    console.log("✅ Generated directory successfully.");
  } catch (err) {
    console.log(err);
  }
};

// Get the source README.md file for a package.
export const getDirectory = async (path) => {
  const file = await fs.readFile(
    `${getPackagesDirectory()}/${path}/README.md`,
    "utf-8"
  );
  return file.toString();
};
