import * as React from "react";

import FileOpener from "./components/FileOpener";
import FileSaver from "./components/FileSaver";
import RandomizerSettings from "./components/RandomizerSettings";
import RomSettings from "./components/RomSettings";
import {Config, Job} from "./utils/types"

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export function MainComponent() {
  const [config, setConfig] = React.useState([
    //first page settings
    { setting: "romLoaded", value: false },
    { setting: "currentPage", value: "general" },
    { setting: "isRandomized", value: false },
    { setting: "randomizerSeed", value: 0 },
    { setting: "missionScaling", value: "normal" },
    { setting: "missionScalingValue", value: 1 },
    { setting: "cutscenes", value: "all" },
    { setting: "missionRewards", value: "normal" },
    { setting: "apBoost", value: 0 },
    { setting: "laws", value: "normal" },
    { setting: "startingGold", value: 5000 },
    { setting: "frostyMageBoost", value: false },
    { setting: "noJudgeTurn", value: false },
    {
      setting: "partyMember",
      value: [
        {
          name: "march",
          raceChangable: false,
          race: "human",
          class: "fighter",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "montblanc",
          raceChangable: false,
          race: "moogle",
          job: "blackMage",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "unit 3",
          raceChangable: true,
          race: "human",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "unit 4",
          raceChangable: true,
          race: "human",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "unit 5",
          raceChangable: true,
          race: "human",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "unit 6",
          raceChangable: true,
          race: "human",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
      ],
    },
    {setting: "jobRequirements", value: "normal"},
    {setting: "abilities", value: "normal"},
    {setting: "mpRegen", value: "normal"},
    {
      setting: "humanJobs",
      value: [
        { name: "soldier", enabled: true },
        { name: "paladin", enabled: true },
        { name: "fighter", enabled: true },
        { name: "thief", enabled: true },
        { name: "ninja", enabled: true },
        { name: "whiteMage", enabled: true },
        { name: "blackMage", enabled: true },
        { name: "illusionist", enabled: true },
        { name: "blueMage", enabled: true },
        { name: "archer", enabled: true },
        { name: "hunter", enabled: true },
      ],
    },
    {
      setting: "bangaaJobs",
      value: [
        { name: "warrior", enabled: true },
        { name: "dragoon", enabled: true },
        { name: "defender", enabled: true },
        { name: "gladiator", enabled: true },
        { name: "whiteMonk", enabled: true },
        { name: "bishop", enabled: true },
        { name: "templar", enabled: true },
      ],
    },
    {
      setting: "nuMouJobs",
      value: [
        { name: "whiteMage", enabled: true },
        { name: "blackMage", enabled: true },
        { name: "timeMage", enabled: true },
        { name: "illusionist", enabled: true },
        { name: "alchemist", enabled: true },
        { name: "beastmaster", enabled: true },
        { name: "morpher", enabled: true },
        { name: "sage", enabled: true},
      ],
    },
    {
      setting: "vieraJobs",
      value: [
        { name: "fencer", enabled: true },
        { name: "elementalist", enabled: true },
        { name: "regMage", enabled: true },
        { name: "whiteMage", enabled: true },
        { name: "summoner", enabled: true },
        { name: "archer", enabled: true },
        { name: "assassin", enabled: true },
        { name: "sniper", enabled: true },
      ],
    },
    {
      setting: "moogleJobs",
      value: [
        { name: "animist", enabled: true },
        { name: "mogKnight", enabled: true },
        { name: "gunner", enabled: true },
        { name: "thief", enabled: true },
        { name: "juggler", enabled: true },
        { name: "gadgeteer", enabled: true },
        { name: "blackMage", enabled: true },
        { name: "timeMage", enabled: true },
      ],
    },
    {setting: "shopitems", value: "default"}
  ]);

  api.receive("FileName-Change", function (msg: any) {
    changeSetting({setting: "romLoaded", value: true});
  });

  const changeSetting = (nconfig: Config) => {
    let newConfig = Array.from(config);
    newConfig.find((element) => element.setting === nconfig.setting)!.value = nconfig.value;
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
