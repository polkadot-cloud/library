// Copyright 2023 @polkadot-cloud/polkadot-cloud authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require("gulp");
const ts = require("gulp-typescript");
const strip = require("gulp-strip-comments");
const sourcemaps = require("gulp-sourcemaps");
const merge = require("merge-stream");

const sass = require("gulp-sass")(require("sass"));
const lrserver = require("tiny-lr")();
const refresh = require("gulp-livereload");
const SASS_OPTIONS = { outputStyle: "compressed" };
const replace = require("gulp-replace");

const { src, dest, series } = gulp;

const buildComponents = () => {
  var tsProject = ts.createProject("tsconfig.json");
  var tsResult = tsProject.src().pipe(sourcemaps.init()).pipe(tsProject());

  return merge(tsResult, tsResult.js)
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
};

const buildCss = () => {
  return src("lib/**/*.scss")
    .pipe(sass(SASS_OPTIONS))
    .pipe(dest("dist"))
    .pipe(refresh(lrserver));
};

const replaceCss = () => {
  return src(["dist/**/*.d.ts", "dist/**/*.js", "dist/**/*.map"])
    .pipe(replace(".scss", ".css"))
    .pipe(dest("dist"));
};

const stripComments = () => {
  return src("dist/**/*.js").pipe(strip()).pipe(gulp.dest("dist"));
};

const licenseAndReadme = () => {
  return src(["LICENSE", "README.npm.md"]).pipe(dest("dist"));
};

exports.default = series(
  buildComponents,
  buildCss,
  replaceCss,
  stripComments,
  licenseAndReadme
);
