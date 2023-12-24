/* @license Copyright 2023 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */
/* eslint-disable @typescript-eslint/no-var-requires */

import gulp from "gulp";
import ts from "gulp-typescript";
import strip from "gulp-strip-comments";
import sourcemaps from "gulp-sourcemaps";
import merge from "merge-stream";

const { src, dest, series } = gulp;

const buildComponents = () => {
  var tsProject = ts.createProject("tsconfig.json");
  var tsResult = tsProject.src().pipe(sourcemaps.init()).pipe(tsProject());

  return merge(tsResult, tsResult.js)
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
};

const buildSvg = () => src("lib/**/*.svg").pipe(dest("dist/"));

const buildJsons = () => src("lib/**/*.json").pipe(dest("dist/"));

const stripComments = () =>
  src("dist/**/*.js").pipe(strip()).pipe(gulp.dest("dist"));

const copyLicense = () => src(["LICENSE"]).pipe(dest("dist"));

export default series(
  buildComponents,
  buildJsons,
  buildSvg,
  stripComments,
  copyLicense
);
