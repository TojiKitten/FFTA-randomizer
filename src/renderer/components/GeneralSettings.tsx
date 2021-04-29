import * as React from "react";
import { Config, Job } from "../utils/types";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

interface props {
  globalState: Array<Config>;
  callback: (nconf: Config) => void;
}

export const GeneralSettings = ({ globalState, callback }: props) => {
  let enemyLevel = globalState.find((element) => element.setting === "missionScaling")!;
  let enemyLevelRange = globalState.find((element) => element.setting === "missionScalingValue")!;
  let cutscenes = globalState.find((element) => element.setting === "cutscenes")!;
  let missionRewards = globalState.find((element) => element.setting === "missionRewards")!;
  let apBoost = globalState.find((element) => element.setting === "apBoost")!;
  let laws = globalState.find((element) => element.setting === "laws")!;
  let startingGold = globalState.find((element) => element.setting === "startingGold")!;
  let frostyMageBoost = globalState.find((element) => element.setting === "frostyMageBoost")!;
  let noJudgeTurn = globalState.find((element) => element.setting === "noJudgeTurn")!;
  return (
    <div>
      Story Enemy Levels:
      <select
        value={String(enemyLevel.value)}
        onChange={(event) => {
          callback({ setting: "missionScaling", value: event.target.value });
        }}>
        <option value="normal">Normal</option>
        <option value="lerp">Modified</option>
        <option value="average">Scaled - Average</option>
        <option value="highest">Scaled - Highest</option>
      </select>
      <input
        type="Range"
        min="1"
        max="50"
        value={Number(enemyLevelRange.value)}
        onChange={(event) => {
          callback({ setting: "missionScalingValue", value: event.target.value });
        }}
      />
      {enemyLevelRange.value}
      <br />
      cutscenes:
      <select
        value={String(cutscenes.value)}
        onChange={(event) => {
          callback({ setting: "cutscenes", value: event.target.value });
        }}>
        <option value="all">All</option>
        <option value="none">None</option>
        <option value="noTutorial">None + No Tutorial</option>
      </select>
      <br />
      Mission Rewards:
      <select
        value={String(missionRewards.value)}
        onChange={(event) => {
          callback({ setting: "missionRewards", value: event.target.value });
        }}>
        <option value="normal">Normal</option>
        <option value="random">Random</option>
        <option value="shuffled">Shuffled</option>
      </select>
      <br />
      AP Boost:
      <input
        type="Range"
        min="0"
        max="1000"
        step="10"
        value={Number(apBoost.value)}
        onChange={(event) => {
          callback({ setting: "apBoost", value: event.target.value });
        }}
      />
      {apBoost.value}
      <br />
      Laws:
      <select
        value={String(laws.value)}
        onChange={(event) => {
          callback({ setting: "laws", value: event.target.value });
        }}>
        <option value="normal">Normal</option>
        <option value="shuffled">Shuffled</option>
      </select>
      <br />
      Starting Gold:
      <input
        type="number"
        value={Number(startingGold.value)}
        onChange={(event) => {
          callback({ setting: "startingGold", value: event.target.value });
        }}
      />
      <br />
      <input
        type="checkbox"
        checked={Boolean(frostyMageBoost.value)}
        onChange={(event) => {
          callback({ setting: "frostyMageBoost", value: !frostyMageBoost.value });
        }}
      />
      <label>Frosty Mage Boost</label>
      <br />
      <input
        type="checkbox"
        checked={Boolean(noJudgeTurn.value)}
        onChange={(event) => {
          callback({ setting: "noJudgeTurn", value: !noJudgeTurn.value });
        }}
      />
      <label>no Judge Turn</label>
    </div>
  );
};

export default GeneralSettings;
