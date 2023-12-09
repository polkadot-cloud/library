// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import YAML from "yaml";
import { getPackages, getPackagesDirectory } from "../utils.mjs";

// Retrieve the content from the index.ymls in the packages
// Place the content to the position under the title session
export const yamlToReadme = async () => {
  const packages = await getPackages();
  for (const pkg of packages) {
    const allYmls = `${getPackagesDirectory()}/${pkg}/index.yml`;
    if (!allYmls) {
      throw `❌ ${pkg}/index.yml is missing for package.`;
    }
    const allReadmes = `${getPackagesDirectory()}/${pkg}/README.md`;
    if (!allReadmes) {
      throw `❌ ${pkg}/README.md is missing for package.`;
    }
    const yamlContents = await fs.readFile(allYmls, "utf-8");
    // Convert yml into json
    const ymls = YAML.parse(yamlContents);

    let data = "## Directory /n";
    Object.entries(ymls).forEach(([fKey, fValue]) => {
      Object.entries(fValue).forEach(([sKey, sValue]) => {
        Object.entries(sValue).forEach(([tKey, tValue]) => {
          Object.entries(tValue).forEach(([, foValue]) => {
            let title;
            if (fKey == "npm" && sKey == "title") {
              title = formattedTitle(sValue);
            }

            let contents;
            if (fKey == "npm" && sKey == "contents") {
              contents = foValue;
            }

            let list;
            let listName;
            let listDescription;
            let listDoc;
            if (fKey == "directory" && tKey == "name") {
              listName = tValue;
            }
            if (fKey == "directory" && tKey == "description") {
              listDescription = tValue;
            }
            if (fKey == "directory" && tKey == "doc") {
              listDoc = tValue;
            }
            list = `- [${listName}](${listDoc}): ${listDescription}`;

            data += `#### ${title}  &nbsp;[[source](https://github.com/polkadot-cloud/library/tree/main/packages/${pkg}) &nbsp;|&nbsp; [npm](https://www.npmjs.com/package/@polkadot-cloud/${pkg})]

              ${contents}

              ${list}

              `;
            fs.appendFile(`${getPackagesDirectory()}/${pkg}/README.md`, data);
          });
        });
      });
    });
  }
};
const formattedTitle = (title) => {
  return `@${title.toLowerCase().replace(" ", "-").replace(": ", "/")}`;
};

yamlToReadme();
