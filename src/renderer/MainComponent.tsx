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
  const [config, setConfig] = React.useState([
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
    { setting: "partyRNGEnabled", value: false },
    {
      setting: "partyMember",
      value: [
        {
          name: "march",
          raceChangeable: false,
          race: "human",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "montblanc",
          raceChangeable: false,
          race: "moogle",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "unit 3",
          raceChangeable: true,
          race: "random",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "unit 4",
          raceChangeable: true,
          race: "random",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "unit 5",
          raceChangeable: true,
          race: "random",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
        {
          name: "unit 6",
          raceChangeable: true,
          race: "random",
          job: "random",
          rngEquip: false,
          level: 3,
          masteredAbilities: 0,
        },
      ],
    },
    { setting: "jobRequirements", value: "normal" },
    { setting: "abilities", value: "normal" },
    { setting: "mpRegen", value: "normal" },
    {
      setting: "jobMap",
      value: new Map([
        [
          "human",
          [
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
        ],
        [
          "bangaa",
          [
            { name: "warrior", enabled: true },
            { name: "dragoon", enabled: true },
            { name: "defender", enabled: true },
            { name: "gladiator", enabled: true },
            { name: "whiteMonk", enabled: true },
            { name: "bishop", enabled: true },
            { name: "templar", enabled: true },
          ],
        ],
        [
          "nuMou",
          [
            { name: "whiteMage", enabled: true },
            { name: "blackMage", enabled: true },
            { name: "timeMage", enabled: true },
            { name: "illusionist", enabled: true },
            { name: "alchemist", enabled: true },
            { name: "beastmaster", enabled: true },
            { name: "morpher", enabled: true },
            { name: "sage", enabled: true },
          ],
        ],
        [
          "viera",
          [
            { name: "fencer", enabled: true },
            { name: "elementalist", enabled: true },
            { name: "regMage", enabled: true },
            { name: "whiteMage", enabled: true },
            { name: "summoner", enabled: true },
            { name: "archer", enabled: true },
            { name: "assassin", enabled: true },
            { name: "sniper", enabled: true },
          ],
        ],
        [
          "moogle",
          [
            { name: "animist", enabled: true },
            { name: "mogKnight", enabled: true },
            { name: "gunner", enabled: true },
            { name: "thief", enabled: true },
            { name: "juggler", enabled: true },
            { name: "gadgeteer", enabled: true },
            { name: "blackMage", enabled: true },
            { name: "timeMage", enabled: true },
          ],
        ],
      ]),
    },
    { setting: "shopitems", value: "default" },
  ]);

  React.useEffect(() => {
    api.receive("get-seed", (msg: any) => {
      changeSetting({ setting: "randomizerSeed", value: msg.seed });
    });

    api.receive("get-settings", ({ newConfig }: any) => {
      //delete config thats only for GUI state
      delete newConfig["romLoaded"];
      delete newConfig["currentPage"];
      delete newConfig["isRandomized"];
    });

    return () => {
      api.remove("get-seed");
      api.remove("get-settings");
    };
  }, []);

  const changeSetting = (nconfig: Config) => {
    let newConfig = Array.from(config);
    newConfig.find((element) => element.setting === nconfig.setting)!.value =
      nconfig.value;
    setConfig(newConfig);
  };

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
