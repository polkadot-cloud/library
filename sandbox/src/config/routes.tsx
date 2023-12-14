/* @license Copyright 2023 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { ReactNode } from "react";
import { Components } from "../pages/Components";
import { Buttons } from "../pages/Buttons";

type Routes = {
  name: string;
  path: string;
  default?: boolean;
  element: ReactNode;
}[];

type RouteCategories = ((RouteCategoryPath | RouteCategoryMulti) & {
  name?: string;
})[];

interface RouteCategoryPath {
  path: string;
}

export interface RouteCategoryMulti {
  paths: {
    heading?: string;
    paths: string[];
  }[];
}

const pages = [
  {
    path: "components",
    name: "Components",
    element: <Components />,
    default: true,
  },
  {
    path: "buttons",
    name: "Buttons",
    element: <Buttons />,
  },
];

export const routes: Routes = [
  {
    path: "/",
    name: "Components",
    element: <Components />,
  },
  ...pages,
];

export const routeCategories: RouteCategories = [
  {
    name: "Navigation",
    paths: [
      {
        paths: ["components", "buttons"],
      },
    ],
  },
];

export const nameFromRoute = (path: string): string | undefined =>
  routes?.find((r) => r.path === path)?.name;

export const isDefaultRoute = (path: string): boolean =>
  !!routes?.find((r) => r.default === true && r.path === path);
