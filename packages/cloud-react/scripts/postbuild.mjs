// Copyright 2024 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import fs, { existsSync } from "fs";
import { exec } from "child_process";

const main = async () => {
  // Generate package.json and inject.
  exec(
    "node ../../builder/run.mjs -t package:build -p cloud-react -m index.js",
    (error, _, stderr) => {
      error && console.log(`❌: ${error.message}`);
      stderr && console.log(`❌: ${stderr}`);
    }
  );

  // Rmmove generated content.
  const pathsToRemove = [
    { path: "./lib/index.tsx", options: {} },
    { path: "./lib/types", options: { recursive: true, force: true } },
    { path: "./lib/providers", options: { recursive: true, force: true } },
    { path: "./lib/hooks", options: { recursive: true, force: true } },
  ];
  for (const { path, options } of pathsToRemove) {
    if (existsSync(path)) {
      fs.rmSync(path, options);
    }
  }
};

await main();
