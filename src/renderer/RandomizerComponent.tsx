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

  React.useEffect(() => {
    console.log(state.generalSettings.romLoaded);
    console.log("CHANGED");
    setLoaded(state.generalSettings.romLoaded);
  }, [state.generalSettings.romLoaded]);

  return (
    <>
      <h1>FFTA Randomizer</h1>
      <RomLoader />
      {loaded && <RomSaver />}
      {loaded && <SettingsLoader />}
      {loaded && <SettingsSaver />}
      {loaded && <RandomizerSettings />}
      {loaded && <RomSettings />}
    </>
  );
}

export default RandomizerComponent;
