// Copyright 2023 @polkadot-cloud/library authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconSVG from "../../svg/icon.svg?react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useTheme } from "../../contexts/Theme";

export const Header = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <div className="app-header">
      <section>
        <div className="icon">
          <IconSVG />
        </div>
        <div className="title">
          <h3>Sandbox</h3>
        </div>
      </section>
      <section>
        <button
          className={`link${mode === "light" ? " selected" : ``}`}
          onClick={() => toggleMode("light")}
        >
          Light
        </button>
        <button
          className={`link${mode === "dark" ? " selected" : ``}`}
          onClick={() => toggleMode("dark")}
        >
          Dark
        </button>
        <a
          href="https://github.com/polkadot-cloud/library"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon
            icon={faGithub}
            transform="grow-7"
            style={{ marginLeft: "0.75rem" }}
          />
        </a>
      </section>
    </div>
  );
};
