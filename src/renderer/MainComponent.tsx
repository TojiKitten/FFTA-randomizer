import * as React from "react";

import FileOpener from "./components/FileOpener";
import FileSaver from "./components/FileSaver";
import RandomizerSettings from "./components/RandomizerSettings";
import RomSettings from "./components/RomSettings";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export function MainComponent() {
  const [config, setConfig] = React.useState([
    //first page settings
    { setting: "romLoaded", value: false },
    { setting: "currentPage", value: "General" },
    { setting: "isRandomized", value: false },
    { setting: "randomizerSeed", value: 0 },
    { setting: "storyEnemyLevels", value: "normal" },
    { setting: "storyEnemyLevelsScale", value: 1 },
    { setting: "cutscenes", value: "all" },
    { setting: "missionRewards", value: "normal" },
    { setting: "apBoost", value: 0 },
    { setting: "laws", value: "normal" },
    { setting: "startingGold", value: 5000 },
    { setting: "frostyMageBoost", value: false },
    { setting: "missionRewards", value: false },
    { setting: "noJudgeTurn", value: false},
  ]);

  api.receive("FileName-Change", function (msg: any) {
    changeSetting("romLoaded", "true");
  });

  const changeSetting = (csetting: string, cvalue: any) => {
    let newConfig = Array.from(config);
    let value = cvalue;
    newConfig.find((element) => element.setting === csetting)!.value = value;
    setConfig(newConfig);
  };

  return (
    <div className="app">
      <h1>FFTA Randomizer</h1>
      <br />
      <div className="div-fileButtons">
        <div className="centering-wrapper">
          <FileOpener />
          <FileSaver globalState={config} />
        </div>
      </div>

      <RandomizerSettings globalState={config} callback={changeSetting} />
      <RomSettings globalState={config} callback={changeSetting} />
    </div>
  );
}

export default MainComponent;
