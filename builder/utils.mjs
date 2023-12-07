// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PACKAGE_OUTPUT, PACKAGE_SCOPE } from "./config.mjs";
import { format } from "prettier";

//--------------------------------------------------
// Directory and file validation utils
//--------------------------------------------------

// Gets the packages directory from the current directory.
export const getPackagesDirectory = () => {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "packages");
};

// Checks that all given files are present in all the provided packages.
export const checkFilesExistInPackages = async (pkgs, files) => {
  let allFilesExist = true;
  await Promise.all(
    pkgs.map(async (pkg) => {
      await Promise.all(
        files.map(async (file) => {
          try {
            await fs.stat(`./packages/${pkg}/${file}`);
          } catch (err) {
            console.error(`❌ ${file} not found in ${pkg}`);
            allFilesExist = false;
          }
        })
      );
    })
  );
  return allFilesExist;
};

// Checks whether the provided folders exist in a directory.
export const checkFoldersInDirectory = async (dir, folders) => {
  let allFoldersExist = true;

  for (let folder of folders) {
    try {
      const stat = await fs.stat(`${dir}/${folder}`);
      if (!stat.isDirectory()) {
        console.error(`❌ ${dir}/${folder} is not a directory.`);
        allFoldersExist = false;
      }
    } catch (err) {
      console.error(`❌ Folder in ${dir}/${folder} not found`);
      allFoldersExist = false;
    }
  }
  return allFoldersExist;
};

//--------------------------------------------------
// Formatting utils
//--------------------------------------------------

// Formats npm package name from package source folder name.
export const formatNpmPackageName = (name) => {
  return `@${PACKAGE_SCOPE}/${removePrefix(name, "cloud-")}`;
};

// Remove a prefix from a string if it exists.
export const removePrefix = (str, prefix) => {
  const result = str.startsWith(prefix) ? str.slice("cloud-".length) : str;
  return result;
};

// Formats a JSON string using prettier.
export const formatJson = async (json) => {
  try {
    const data = await format(JSON.stringify(json), {
      parser: "json",
    });
    return data;
  } catch (err) {
    return false;
  }
};

//--------------------------------------------------
// Package build utils
//--------------------------------------------------

// Gets the list of packges.
export const getPackages = async () => {
  const packages = await fs.readdir(getPackagesDirectory());
  return packages;
};

// Get the source package.json file for a package.
export const getSourcePackageJson = async (path) => {
  const file = await fs.readFile(`${path}/package.json`, "utf-8");
  return JSON.parse(file.toString());
};

// Gets a dist package.json file.
export const getDistPackageJson = async (path) => {
  return JSON.parse(
    await fs.readFile(
      `${getPackagesDirectory()}/${path}/${PACKAGE_OUTPUT}/package.json`
    )
  );
};

// Checks whether properties exist in an object.
export const allPropertiesExist = (obj, properties) => {
  return properties.every((property) => obj.includes(property));
};

// Attempts to retrieve a package.json's scripts property, or returns an empty object.
export const getPackageScripts = async (pkg) => {
  const file = await fs.readFile(
    `${getPackagesDirectory()}/${pkg}/package.json`,
    "utf-8"
  );
  return Object.keys(JSON.parse(file)?.scripts || {}) || {};
};

// Adds Typescript related properties to a package.json file.
export const addTypescriptPropertiesIfMain = (main, json) => {
  if (main) {
    return {
      ...json,
      types: "index.d.ts",
      main,
      module: main,
      typescript: {
        definition: "index.d.ts",
      },
    };
  }
  return json;
};

// Creates a package output directory if it does not exist.
export const ensurePackageOutputExists = async (path) => {
  if (!(await fs.stat(`${path}/${PACKAGE_OUTPUT}`))) {
    await fs.mkdir(`${path}/${PACKAGE_OUTPUT}`);
  }
};

// Writes a package.json file to a directory.
export const writePackageJsonToOutput = async (path, data) => {
  await fs.writeFile(`${path}/${PACKAGE_OUTPUT}/package.json`, data);
};
