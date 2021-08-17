import * as React from "react";

import RomLoader from "./components/RomLoader";
import RomSaver from "./components/RomSaver";
import RandomizerSettings from "./components/RandomizerSettings";
import RomSettings from "./components/RomSettings";
import { Config, Job } from "./utils/types";
import SettingsSaver from "./components/SettingsSaver";
import SettingsLoader from "./components/SettingsLoader";
//import { ExtendedAPIPlugin } from "webpack";
import FFTAData from "_/main/ffta/FFTAData";
import { RandomizerProvider } from "./components/RandomizerProvider";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export function MainComponent() {
  return (
    <div className="appGrid">
      <RandomizerProvider>
        <h1>FFTA Randomizer</h1>
        <RomLoader />
        <RomSaver />
        <SettingsLoader />
        <SettingsSaver />
        <RandomizerSettings />
        <RomSettings />
      </RandomizerProvider>
    </div>
  );
}

export default MainComponent;
