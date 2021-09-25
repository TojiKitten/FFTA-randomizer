import * as React from "react";

import RomLoader from "./components/RomLoader";
import RomSaver from "./components/RomSaver";
import RandomizerSettings from "./components/RandomizerSettings";
import RomSettings from "./components/RomSettings";
import SettingsSaver from "./components/SettingsSaver";
import SettingsLoader from "./components/SettingsLoader";
//import { ExtendedAPIPlugin } from "webpack";
import {
  useRandomizer,
  useRandomizerUpdate,
} from "./components/RandomizerProvider";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export function RandomizerComponent() {
  const state = useRandomizer();
  const [loaded, setLoaded] = React.useState(false);
  const [randomized, setRandomized] = React.useState(false);

  React.useEffect(() => {
    setLoaded(state.generalSettings.romLoaded);
  }, [state.generalSettings.romLoaded]);

  React.useEffect(() => {
    setRandomized(state.generalSettings.isRandomized);
  }, [state.generalSettings.isRandomized]);

  return (
    <>
      <div className="grid-full">
        <div className="credits">Credits</div>
        <div className="credits-text">
          <p>Development Team: FGKeiji and TojiKitten</p>
          <p>Early Testers: Vallnoir, RealNostalgic, and BlueSaxorcist</p>
          <p>
            Special thanks to Leonarth, Darthatron, and the FFTAHacktics
            community. Their work and research was referenced and used to create
            this randomizer.
          </p>
          <p>
            Special thanks to the FFTA Speedrunning Community for their support.
          </p>
          <p>Color Palette: https://lospec.com/palette-list/apollo</p>
        </div>
      </div>
      <h1>FFTA Randomizer</h1>
      <RomLoader />
      {loaded && !randomized && <RomSaver />}
      {loaded && !randomized && <SettingsLoader />}
      {loaded && <SettingsSaver />}
      {loaded && <RandomizerSettings />}
      {loaded && <RomSettings />}
    </>
  );
}

export default RandomizerComponent;
