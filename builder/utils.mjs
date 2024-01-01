// Copyright 2024 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PACKAGE_OUTPUT, PACKAGE_SCOPE } from "./config.mjs";
import { format } from "prettier";
import { parse } from "yaml";

//--------------------------------------------------
// Directory and file validation utils
//--------------------------------------------------

// Gets the packages directory from the current directory.
export const getPackagesDirectory = () =>
  join(dirname(fileURLToPath(import.meta.url)), "..", "packages");

// Gets the top level directory from the current directory.
export const getTopDirectory = () =>
  join(dirname(fileURLToPath(import.meta.url)), "..");

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
export const formatNpmPackageName = (name) =>
  `@${PACKAGE_SCOPE}/${removePrefix(name, "cloud-")}`;

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

// Bumps a semver patch version.
export const bumpSemverPatch = (currentVersion) => {
  const pieces = currentVersion.split(/[.]+/);
  const increment = Number(pieces.pop()) + 1;
  return `${pieces.join(".")}.${increment}`;
};

// Format the package introduction data in the README file.
export const formatDirectoryHeaders = (pkg, description) =>
  "\n#### `" +
  formatNpmPackageName(pkg) +
  "`&nbsp; [[source](https://github.com/polkadot-cloud/library/tree/main/packages/" +
  pkg +
  ") &nbsp;|&nbsp; [npm](https://www.npmjs.com/package/" +
  formatNpmPackageName(pkg) +
  ")]\n\n" +
  description +
  "\n";

// Format the package content data in the README file.
export const formatDirectoryEntry = (directory) =>
  directory.reduce(
    (str, { name, description, doc }) =>
      str +
      "\n- [" +
      name +
      "](" +
      doc +
      ")" +
      (description ? ": " + description : "") +
      "\n",
    ""
  );

// License content on dist/README.md.
export const npmLicenseContent = (license) =>
  "## License" +
  "\n\n" +
  "[" +
  license +
  "](https://spdx.org/licenses/" +
  license +
  ".html)" +
  "\n";

// Header content on dist/README.md.
export const npmHeaderContent = (title, description) =>
  "# " + title + "\n\n" + "**" + description + "**" + "\n\n";

//--------------------------------------------------
// Package build utils
//--------------------------------------------------

// Gets the list of packges.
export const getPackages = async () => {
  const packages = await fs.readdir(getPackagesDirectory());
  return packages;
};

// Checks whether properties exist in an object.
export const allPropertiesExist = (obj, properties) =>
  properties.every((property) => obj.includes(property));

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
  try {
    await fs.stat(`${path}/${PACKAGE_OUTPUT}`);
  } catch (_) {
    await fs.mkdir(`${path}/${PACKAGE_OUTPUT}`);
  }
};

//--------------------------------------------------
// Read and write utils
//--------------------------------------------------

// Gets release please manifest file.
export const getReleasePleaseManifest = async () => {
  const path = join(dirname(fileURLToPath(import.meta.url)), "..");
  const file = await fs.readFile(
    `${path}/.release-please-manifest.json`,
    "utf-8"
  );
  return JSON.parse(file.toString());
};

// Writes a package.json file to output directory.
export const writeReleasePleaseManifest = async (data) => {
  const path = join(dirname(fileURLToPath(import.meta.url)), "..");
  await fs.writeFile(`${path}/.release-please-manifest.json`, data);
};

// Get the source package.json file for a package.
export const getSourcePackageJson = async (path) => {
  const file = await fs.readFile(
    `${getPackagesDirectory()}/${path}/package.json`,
    "utf-8"
  );
  return JSON.parse(file.toString());
};

// Gets a dist package.json file.
export const getDistPackageJson = async (path) =>
  JSON.parse(
    await fs.readFile(
      `${getPackagesDirectory()}/${path}/${PACKAGE_OUTPUT}/package.json`
    )
  );

// Get the source index.yml file for a package.
export const getSourceIndexYml = async (path) =>
  parse(
    await fs.readFile(`${getPackagesDirectory()}/${path}/index.yml`, "utf-8")
  );

// Writes a package.json file to source directory.
export const writePackageJsonToSource = async (path, data) => {
  await fs.writeFile(`${getPackagesDirectory()}/${path}/package.json`, data);
};

// Writes a package.json file to output directory.
export const writePackageJsonToOutput = async (path, data) => {
  await fs.writeFile(`${path}/${PACKAGE_OUTPUT}/package.json`, data);
};

// Writes a README file to output directory.
export const writeReadmeToOutput = async (path, data) => {
  await fs.writeFile(`${path}/${PACKAGE_OUTPUT}/README.md`, data);
};

// Get the source markdown file for the directory.
export const getTemplate = async (name) => {
  const file = await fs.readFile(
    `${getTopDirectory()}/builder/templates/${name}.md`,
    "utf-8"
  );
  return file.toString();
};

// Get the template markdown and write a README file to output directory.
export const generatePackageReadme = async (packageName, path) => {
  // Open file to get npm header.
  let readmeMd = (await getTemplate("npm")) + "\n";

  // Format data from package `index.yml`.
  const { directory, npm } = await getSourceIndexYml(packageName);

  // Get needed data from packages source package.json file.
  const { description: npmDescription, license } =
    await getSourcePackageJson(packageName);

  // Append the npm entries.
  readmeMd += npmHeaderContent(npm.title, npmDescription);

  if (npm.contents) {
    for (const item of npm.contents) {
      readmeMd += "- " + item.item + "\n\n";
    }
  }

  readmeMd += "## Docs" + "\n\n";

  // Append the directory entries.
  readmeMd += formatDirectoryEntry(directory) + npmLicenseContent(license);

  // Write README.md to the output directory.
  await writeReadmeToOutput(path, readmeMd);
};
