// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// ----------------------------
// Package scope to publish to.
// ----------------------------
export const PACKAGE_SCOPE = "polkadot-cloud";

// ----------------------------
// Package build output folder.
// ----------------------------
export const PACKAGE_OUTPUT = "dist";

// ----------------------------------------------
// Files that are required to exist in a package.
// ----------------------------------------------
export const PACKAGE_REQUIRED_FILES = [
  "index.yml",
  "lib",
  "package.json",
  "README.md",
];

// --------------------------------------------------------------------
// Scripts that are required to exist in a package's package.json file.
// --------------------------------------------------------------------
export const PACKAGE_REQUIRED_SCRIPTS = ["build:mock", "build", "clear"];

// --------------------------------------------------------------
// Required package.json properties to copy to the package build.
// --------------------------------------------------------------
export const PACKAGE_REQUIRED_JSON_KEYS = [
  "license",
  "version",
  "keywords",
  "bugs",
  "homepage",
  "contributors",
  "description",
  "dependencies",
  "peerDependencies",
];
