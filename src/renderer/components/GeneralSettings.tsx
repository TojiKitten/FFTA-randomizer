import * as React from "react";
//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

interface props {
  globalState: Array<{ setting: string; value: any }>;
  callback: Function;
}

export const GeneralSettings = ({ globalState, callback }: props) => {
  let enemyLevel = globalState.find((element) => element.setting === "storyEnemyLevels")!;
  let enemyLevelRange = globalState.find((element) => element.setting === "storyEnemyLevelsScale")!;
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
        value={enemyLevel.value}
        onChange={(event) => {
          callback("storyEnemyLevels", event.target.value);
        }}
      >
        <option value="normal">Normal</option>
        <option value="lerp">Modified</option>
        <option value="average">Scaled - Average</option>
        <option value="highest">Scaled - Highest</option>
      </select>
      <input
        type="Range"
        min="1"
        max="50"
        value={enemyLevelRange.value}
        onChange={(event) => {
          callback("storyEnemyLevelsScale", event.target.value);
        }}
      />
      {enemyLevelRange.value}
      <br />
      cutscenes:
      <select
        value={cutscenes.value}
        onChange={(event) => {
          callback("cutscenes", event.target.value);
        }}
      >
        <option value="all">All</option>
        <option value="none">None</option>
        <option value="noTutorial">None + No Tutorial</option>
      </select>
      <br />
      Mission Rewards:
      <select
        value={missionRewards.value}
        onChange={(event) => {
          callback("missionRewards", event.target.value);
        }}
      >
        <option value="normal">Normal</option>
        <option value="random">Random</option>
        <option value="shuffled">Shuffled</option>
      </select>
      <br />
      AP Boost:
      <input
        type="Range"
        min="0"
        max="500"
        step="10"
        value={apBoost.value}
        onChange={(event) => {
          callback("apBoost", event.target.value);
        }}
      />
      {apBoost.value}
      <br />
      Laws:
      <select
        value={laws.value}
        onChange={(event) => {
          callback("laws", event.target.value);
        }}
      >
        <option value="Normal">Normal</option>
        <option value="Shuffled">Shuffled</option>
      </select>
      <br />
      Starting Gold:
      <input
        type="number"
        value={parseInt(startingGold.value)}
        onChange={(event) => {
          callback("startingGold", event.target.value);
        }}
      />
      <br />
      <input
        type="checkbox"
        id="frostyBoost"
        checked={frostyMageBoost.value}
        onChange={(event) => {
          callback("frostyMageBoost", !frostyMageBoost.value);
        }}
      />
      <label htmlFor="frostyBoost">Frosty Mage Boost</label>
      <br />
      <input
        type="checkbox"
        id="noJudgeTurn"
        checked={noJudgeTurn.value}
        onChange={(event) => {
          callback("noJudgeTurn", !noJudgeTurn.value);
        }}
      />
      <label htmlFor="noJudgeTurn">no Judge Turn</label>
    </div>
  );
};

export default GeneralSettings;
