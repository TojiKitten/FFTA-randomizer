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
    { setting: "noJudgeTurn", value: false },
    {
      setting: "PartyMember",
      value: [
        {
          name: "march",
          raceChangable: false,
          race: "Human",
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
          race: "random",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "unit 4",
          raceChangable: true,
          race: "random",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "unit 5",
          raceChangable: true,
          race: "random",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "unit 6",
          raceChangable: true,
          race: "random",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
      ],
    },
    {
      setting: "HumanJobs",
      value: [
        { name: "Soldier", enabled: true },
        { name: "Paladin", enabled: true },
        { name: "Fighter", enabled: true },
        { name: "Thief", enabled: true },
        { name: "Ninja", enabled: true },
        { name: "WhiteMage", enabled: true },
        { name: "BlackMage", enabled: true },
        { name: "Illusionist", enabled: true },
        { name: "BlueMage", enabled: true },
        { name: "Archer", enabled: true },
        { name: "Hunter", enabled: true },
      ],
    },
    {
      setting: "BangaaJobs",
      value: [
        { name: "Warrior", enabled: true },
        { name: "Dragoon", enabled: true },
        { name: "Defender", enabled: true },
        { name: "Gladiator", enabled: true },
        { name: "WhiteMonk", enabled: true },
        { name: "Bishop", enabled: true },
        { name: "Templar", enabled: true },
      ],
    },
    {
      setting: "NuMouJobs",
      value: [
        { name: "WhiteMage", enabled: true },
        { name: "BlackMage", enabled: true },
        { name: "TimeMage", enabled: true },
        { name: "Illusionist", enabled: true },
        { name: "Alchemist", enabled: true },
        { name: "Beastmaster", enabled: true },
        { name: "Morpher", enabled: true },
      ],
    },
    {
      setting: "VieraJobs",
      value: [
        { name: "Fencer", enabled: true },
        { name: "Elementalist", enabled: true },
        { name: "RegMage", enabled: true },
        { name: "WhiteMage", enabled: true },
        { name: "Summoner", enabled: true },
        { name: "Archer", enabled: true },
        { name: "Assassin", enabled: true },
        { name: "Sniper", enabled: true },
      ],
    },
    {
      setting: "VieraJobs",
      value: [
        { name: "Animist", enabled: true },
        { name: "MogKnight", enabled: true },
        { name: "Gunner", enabled: true },
        { name: "Thief", enabled: true },
        { name: "Juggler", enabled: true },
        { name: "Gadgeteer", enabled: true },
      ],
    },
    {setting: "shopitems", value: "Default"}
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
