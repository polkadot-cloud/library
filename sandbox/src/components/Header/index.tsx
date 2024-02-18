/* @license Copyright 2024 @polkadot-cloud/library authors & contributors",
"SPDX-License-Identifier: GPL-3.0-only */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useTheme } from "../../contexts/Theme";

export const Header = () => {
  const { mode, toggleMode, theme, setTheme } = useTheme();
  const allThemes = [
    ["Polkadot", "polkadot-relay"],
    ["Kusama", "kusama-relay"],
    ["Westend", "westend-relay"],
  ];

  return (
    <div className="app-header">
      <section>
        <div className="title">
          <h3>Sandbox</h3>
        </div>
      </section>
      <section>
        {allThemes.map(([name, key]) => (
          <button
            key={`theme_${key}`}
            className={`${theme === key ? " selected" : ``}`}
            onClick={() => setTheme(key)}
          >
            {name}
          </button>
        ))}
        <span
          style={{
            margin: "0 1rem 0 0.75rem",
          }}
        ></span>
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
