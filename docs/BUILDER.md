# Polkadot Cloud Builder

The Polkadot Cloud Builder is a separate package named `bullder` at the top level of this repository. It consists of a set of scripts and configuration files that are used in the package build pipeline.

Builder commands can be invoked from the command line, or from a `package.json` script.

## Build All Packages

Initiate the build pipeline at the top level of the repository:

```
yarn build
```

This command will call `yarn build` for each package under the workspace's `packages/` directory. prebuild and postbuild scripts are also run, both for the workspace and for each package.

## Builder Commands

### Package Build

The builder's `build` task takes the package name and an optional main file:

```
node builder/run.mjs -t package:build -p cloud-core -m index.js.
```

The above command will build the `@polkadot-cloud/core` package, with its entry point set to `index.js`.

### Packages Pre & Post Build

The builder also has `prebuild` and `postbuild` tasks designed to run integrity checks before and after a global package build:

```
// prebuild
node builder/run.mjs -t packages:prebuild

// postbuild
node builder/run.mjs -t packages:postbuild
```

### Patch All Package Versions

Increment all package patch versions in the workspace to trigger a silent NPM deployment when a PR is merged:

```
yarn patch
```

This is useful for testing silent updates and deploying hotfixes.
