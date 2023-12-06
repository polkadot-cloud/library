// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs";
import { join } from "path";
import { format } from "prettier";
import minimist from "minimist";
import { getPackagesDirectory } from "./utils.mjs";
import { PACKAGE_SCOPE, REQUIRED_PACKAGE_JSON_KEYS } from "./config.mjs";

// Retrieve arguments from command.
const { p: packageName, m: main } = minimist(process.argv.slice(2));

try {
  // A package name must be provided.
  if (!packageName) {
    throw "❌ Please provide package name with the -p flag";
  }

  // Package directory.
  const packagePath = join(getPackagesDirectory(), packageName);

  // Read package's `package.json`.
  const packageJson = JSON.parse(
    fs.readFileSync(join(packagePath, "package.json")).toString()
  );

  // Get required package properties.
  const requiredProperties = Object.entries(packageJson).filter((k) =>
    REQUIRED_PACKAGE_JSON_KEYS.includes(k[0])
  );

  // If the package folder name starts with `cloud-` remove this from the npm published package
  // name.
  let publishName = packageJson.name.split(`${PACKAGE_SCOPE}-`)[1];
  if (publishName.startsWith("cloud-")) {
    // remove "cloud-"" from the start of `publishName`.
    publishName = publishName.slice("cloud-".length);
  }

  // Add `name` with npm package name to the begining of required fields.
  requiredProperties.unshift(["name", `@${PACKAGE_SCOPE}/${publishName}`]);

  // Finalise package.json properties. If main is provided, add typescript related properties.
  //
  // TODO: this could be improved.
  const merged = Object.assign(
    {},
    Object.fromEntries(requiredProperties),
    main
      ? {
          types: "index.d.ts",
          main,
          module: main,
          typescript: {
            definition: "index.d.ts",
          },
        }
      : {}
  );

  // Format merged JSON.
  format(JSON.stringify(merged), { parser: "json" }).then((data) => {
    // Create `dist` directory if it doesn't exist.
    if (!fs.existsSync(`${packagePath}/dist`)) {
      fs.mkdirSync(`${packagePath}/dist`);
    }

    // Write `package.json` to the bundle.
    fs.writeFile(`${packagePath}/dist/package.json`, data, (err) => {
      if (err) {
        console.error(`❌ ${err.message}`);
      }
      console.debug(
        `✅ package.json has been injected into ${packageName} bundle.`
      );
    });
  });
} catch (e) {
  console.error(
    `❌ Could not find package.json in the specified package directory: ${packageName}`
  );
}
