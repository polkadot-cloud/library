/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */
import fs from "fs";
import http from "https";
import { parse } from "yaml";

import { POLKADOT_NETWORK_URL, NETWORKS } from "./config.js";

const dirs = ["./lib/external/yaml", "./lib/external/json"];

fs.rmSync("./lib/external/json", { recursive: true, force: true });
fs.rmSync("./lib/external/yaml", { recursive: true, force: true });

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

const writeStream = fs.createWriteStream("./lib/external/index.ts");
writeStream.write(`export * from "./json/index";`);
writeStream.write(`export * from "./types";`);
writeStream.end();

const some = async (f) => {
  const yamlFile = f + ".yaml";
  const jsonFile = f + ".json";
  const downloadFile = fs.createWriteStream("./lib/external/yaml/" + yamlFile);
  http.get(POLKADOT_NETWORK_URL + yamlFile, (response) => {
    response.pipe(downloadFile);
    // after download completed, convert to JSON and close filestream
    downloadFile.on("finish", () => {
      const ymlFile = fs.readFileSync(
        "./lib/external/yaml/" + yamlFile,
        "utf8"
      );
      fs.writeFileSync(
        `./lib/external/json/${jsonFile}`,
        JSON.stringify(parse(ymlFile))
      );
      downloadFile.close();
    });
  });
};

fs.copyFileSync(
  "./lib/external/json_export_index",
  "./lib/external/json/index.tsx"
);

for (const f of NETWORKS) {
  some(f);
}
