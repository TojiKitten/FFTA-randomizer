import * as React from "react";

import { RandomizerProvider } from "./components/RandomizerProvider";
import { RandomizerComponent } from "./RandomizerComponent";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export function MainComponent() {
  return (
    <div className="appGrid">
      <RandomizerProvider>
        <RandomizerComponent />
      </RandomizerProvider>
    </div>
  );
}

export default MainComponent;
