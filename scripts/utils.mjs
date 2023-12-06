// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Gets the packages directory from the current directory.
export const getPackagesDirectory = () =>
  join(dirname(fileURLToPath(import.meta.url)), "..", "packages");

// Checks whether files exist in a package directory.
export const checkFilesExistInPackage = async (pkgs, files) => {
  await Promise.all(
    pkgs.map(async (pkg) => {
      await Promise.all(
        files.map(async (file) => {
          try {
            await fs.stat(`./packages/${pkg}/${file}`);
          } catch (err) {
            console.error(`❌ ${file} not found in ${pkg}`);
          }
        })
      );
    })
  );
};

// Checks whether the provided folders exist in a directory.
export const checkFoldersInDirectory = async (dir, files) => {
  for (let file of files) {
    try {
      const stat = await fs.stat(`${dir}${file}`);
      if (!stat.isDirectory()) {
        console.error(`❌ ${dir} must only contain folders.`);
      }
    } catch (err) {
      console.error(`❌ Folder in ${dir} not found`);
    }
  }
};
