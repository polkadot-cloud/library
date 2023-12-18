// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Route, Routes } from "react-router-dom";
import { Side } from "../../packages/cloud-react/lib/base/structure/Side";
import { Body } from "../../packages/cloud-react/lib/base/structure/Body";
import { Main } from "../../packages/cloud-react/lib/base/structure/Main";
import { routes } from "./config/routes";
import { Menu } from "./components/Menu";
import { Header } from "./components/Header";
import { useUi } from "./contexts/UI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const Router = () => {
  const { sideMenuOpen } = useUi();

  return (
    <>
      <Body>
        {/* App header */}
        <Header />

        {/*Fixed menu toggle on smaller screens */}
        <ToggleMenu />

        {/* Left side menu */}
        <Side
          open={sideMenuOpen}
          minimised={false}
          style={{
            minHeight: "calc(100vh - 5.5rem)",
          }}
          width="20rem"
        >
          <Menu />
        </Side>

        <Main
          style={{
            minHeight: "calc(100vh - 5.5rem)",
          }}
        >
          <div className="main-area">
            <div>
              <Routes>
                {routes.map((route) => (
                  <Route key={`nav_page_${route.path}`} {...route} />
                ))}
              </Routes>
            </div>
          </div>
        </Main>
      </Body>
    </>
  );
};

const ToggleMenu = () => {
  const { setSideMenu, sideMenuOpen } = useUi();

  if (sideMenuOpen) {
    return <></>;
  }

  return (
    <button
      className="toggle-menu"
      type="button"
      onClick={() => setSideMenu(!sideMenuOpen)}
    >
      <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>{" "}
    </button>
  );
};
