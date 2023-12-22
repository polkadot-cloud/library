// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from "@polkadot-cloud/utils";
import {
  ExtensionEnableResult,
  ExtensionEnableResults,
  RawExtensionEnable,
  RawExtensions,
} from "../types";
import {
  ExtensionAccount,
  ExtensionInterface,
} from "../ExtensionsProvider/types";

export class Extensions {
  // Gets a map of extensions with their enable functions from `injectedWeb3`.
  static getFromIds = (extensionIds: string[]): RawExtensions => {
    const rawExtensions = new Map<string, RawExtensionEnable>();

    extensionIds.forEach(async (id) => {
      if (this.isLocal(id)) {
        const { enable } = window.injectedWeb3[id];

        if (enable !== undefined && typeof enable === "function") {
          rawExtensions.set(id, enable);
        } else {
          this.removeFromLocal(id);
        }
      }
    });
    return rawExtensions;
  };

  // Calls `enable` for the provided extensions.
  static enable = async (
    extensions: RawExtensions,
    dappName: string
  ): Promise<PromiseSettledResult<ExtensionInterface>[]> => {
    const results = await Promise.allSettled(
      Object.values(extensions).map((enable) => enable(dappName))
    );
    return results;
  };

  // Formats the results of an extension's `enable` function.
  static formatEnabled = (
    extensions: RawExtensions,
    results: PromiseSettledResult<ExtensionInterface>[]
  ): ExtensionEnableResults => {
    // Accumulate resulting extensions state after attempting to enable.
    const extensionsState = new Map<string, ExtensionEnableResult>();

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const id = extensions.keys()[i];

      if (result.status === "fulfilled") {
        extensionsState.set(id, {
          extension: result.value,
          connected: true,
        });
      } else if (result.status === "rejected") {
        extensionsState.set(id, {
          connected: false,
          error: result.reason,
        });
      }
    }
    return extensionsState;
  };

  // Return successfully connected extensions.
  static connected = (
    extensions: ExtensionEnableResults
  ): ExtensionEnableResults => {
    return new Map(
      Array.from(extensions.entries()).filter(([, state]) => state.connected)
    );
  };

  static withError = (
    extensions: ExtensionEnableResults
  ): ExtensionEnableResults => {
    return new Map(
      Array.from(extensions.entries()).filter(([, state]) => !state.connected)
    );
  };

  // Calls `enable` and formats the results of an extension's `enable` function.
  static getAllAccounts = async (
    extensions: ExtensionEnableResults
  ): Promise<ExtensionAccount[]> => {
    const results = await Promise.allSettled(
      Array.from(extensions.values()).map(({ extension }) =>
        extension.accounts.get()
      )
    );

    const all: ExtensionAccount[] = [];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === "fulfilled") {
        all.push(...result.value);
      }
    }
    return all;
  };

  // Check if an extension exists in local `active_extensions`.
  static isLocal = (id: string): boolean => {
    const current = localStorageOrDefault<string[]>(
      `active_extensions`,
      [],
      true
    );
    let isLocal = false;
    if (Array.isArray(current)) {
      isLocal = current.find((l) => l === id) !== undefined;
    }
    return !!isLocal;
  };

  // Adds an extension to local `active_extensions`.
  static addToLocal = (id: string): void => {
    const current = localStorageOrDefault<string[]>(
      `active_extensions`,
      [],
      true
    );
    if (Array.isArray(current)) {
      if (!current.includes(id)) {
        current.push(id);
        localStorage.setItem("active_extensions", JSON.stringify(current));
      }
    }
  };

  // Removes extension from local `active_extensions`.
  static removeFromLocal = (id: string): void => {
    let current = localStorageOrDefault<string[]>(
      `active_extensions`,
      [],
      true
    );
    if (Array.isArray(current)) {
      current = current.filter((localId: string) => localId !== id);
      localStorage.setItem("active_extensions", JSON.stringify(current));
    }
  };
}
