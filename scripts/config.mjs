// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// ----------------------------
// Package scope to publish to.
// ----------------------------
export const PACKAGE_SCOPE = "polkadot-cloud";

// ----------------------------------------------
// Files that are required to exist in a package.
// ----------------------------------------------
export const PACKAGE_REQUIRED_FILES = [
  "README.md",
  "README.npm.md",
  "package.json",
  "lib",
];

// --------------------------------------------------------------------
// Scripts that are required to exist in a package's package.json file.
// --------------------------------------------------------------------
export const PACKAGE_REQUIRED_SCRIPTS = ["build:mock", "build", "clear"];

// -------------------------------------------------------------
// Required package.son properties to copy to the package build.
// -------------------------------------------------------------
export const REQUIRED_PACKAGE_JSON_KEYS = [
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
