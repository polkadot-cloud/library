/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { Fragment, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  nameFromRoute,
  routeCategories,
  isDefaultRoute,
} from "../../config/routes";
import { Category } from "./Category";
import { useUi } from "../../contexts/UI";
import { useOutsideAlerter } from "../hooks/useOutsideAlerter";
import "../../styles/menu.scss";

export const Menu = () => {
  const { pathname } = useLocation();
  const { sideMenuOpen, setSideMenu } = useUi();

  useEffect(() => {
    window.addEventListener("resize", throttleCallback);
    return () => {
      window.removeEventListener("resize", throttleCallback);
    };
  }, []);

  const throttleCallback = () => {
    if (window.innerWidth >= 1150) {
      setSideMenu(false);
    }
  };

  const ref = useRef(null);
  useOutsideAlerter(ref, () => setSideMenu(false));

  return (
    <div className={`menu${sideMenuOpen ? ` open` : ``}`} ref={ref}>
      {routeCategories.map(({ name, ...rest }, i) => (
        <Fragment key={`nav_${i}`}>
          {"paths" in rest ? (
            <Category name={name} rest={rest} i={i} />
          ) : (
            <>
              <Link
                className={`link lg${
                  pathname === `/${rest.path}` ||
                  (pathname === "/" && isDefaultRoute(rest.path))
                    ? ` selected`
                    : ``
                }`}
                to={`${rest.path}`}
                onClick={() => setSideMenu(false)}
              >
                {nameFromRoute(rest.path)}
              </Link>
            </>
          )}
        </Fragment>
      ))}
    </div>
  );
};
