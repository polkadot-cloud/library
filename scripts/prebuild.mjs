// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import { checkFilesExistInPackage, checkFoldersInDirectory } from "./utils.mjs";

const matchScripts = async (dir, files) => {
  for (let file of files) {
    try {
      const filePath = `${dir}${file}/package.json`;

      // Read and parse package.json file.
      const json = JSON.parse(await fs.readFile(filePath));

      const scripts = Object.keys(json?.scripts || {});

      // Check if all required scripts are present.
      const requiredScripts = ["build:mock", "build", "clear"];
      if (!requiredScripts.every((script) => scripts.includes(script))) {
        console.error(
          `❌ All of the scripts field in package.json are required to have build:mock, build, and clear properties`
        );
      }
    } catch (err) {
      console.error(`❌ package.json file not found in ${dir}${file}`);
    }
  }
};

try {
  // Ensure that the package directory exists.
  const files = await fs.readdir("./packages");

  // Ensure packages directory only contains folders.
  await checkFoldersInDirectory("./packages/", files);

  // Check `LICENSE`, `README.md`, `README.npm.md`, `package.json`, `lib` exist in each package.
  await checkFilesExistInPackage(files, [
    "README.md",
    "README.npm.md",
    "package.json",
    "lib",
  ]);
  matchScripts("./packages/", files);

  console.log("✅ Pre-build integrity checks complete.");
} catch (e) {
  console.error("❌ Could not complete integrity checks.");
}
