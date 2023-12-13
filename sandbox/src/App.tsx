/* @license Copyright 2023 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { useState } from "react";
import reactLogo from "./svg/icon-filled.svg";
import "./App.css";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <img src={reactLogo} className="logo" alt="Polkadot Cloud Logo" />
      </div>
      <h1>Polkadot Cloud Sandbox</h1>
      <div className="card">
        <button onClick={() => setCount((prev) => prev + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR.
        </p>
      </div>
    </>
  );
};

export default App;
