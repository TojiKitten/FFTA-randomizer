import * as React from "react";
import { Config, Job } from "../utils/types";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const GeneralSettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  return (
    <div className="generalSettings">
      <div className="generalSettingsOption">
        <label htmlFor="missionScaleOption">Story Enemy Levels</label>
        <select
          id="missionScaleOption"
          value={state.generalSettings.missionScaling}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { missionScaling: event.target.value },
            });
          }}
        >
          <option value="normal">Normal</option>
          <option value="lerp">Modified</option>
          <option value="average">Scaled - Average</option>
          <option value="highest">Scaled - Highest</option>
        </select>
      </div>
      <div className="generalSettingsOption">
        <label htmlFor="levelModifierOption">Level Modifier</label>
        <input
          id="levelModifierOption"
          type="Range"
          min="1"
          max="50"
          value={state.generalSettings.missionScalingValue}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { missionScalingValue: parseInt(event.target.value) },
            });
          }}
        />
        {state.generalSettings.missionScalingValue}
      </div>
      <div className="generalSettingsOption">
        <label htmlFor="randomEnemies">Randomize Enemies</label>
        <input
          id="randomEnemies"
          type="checkbox"
          checked={state.generalSettings.randomEnemies}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { randomEnemies: event.target.checked },
            });
          }}
        />
      </div>
      <div className="generalSettingsOption">
        <label htmlFor="cutsceneOption">Cutscenes</label>
        <select
          id="cutsceneOption"
          value={state.generalSettings.cutscenes}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { cutscenes: event.target.value },
            });
          }}
        >
          <option value="all">All</option>
          <option value="none">None</option>
          <option value="noTutorial">None + No Tutorial</option>
        </select>
      </div>
      <div className="generalSettingsOption">
        <label htmlFor="missionRewardOption">Mission Rewards</label>
        <select
          id="missionRewardOption"
          value={state.generalSettings.missionRewards}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { missionRewards: event.target.value },
            });
          }}
        >
          <option value="normal">Normal</option>
          <option value="random">Random</option>
          <option value="shuffled">Shuffled</option>
        </select>
      </div>
      <div className="generalSettingsOption">
        <label htmlFor="apOption">AP Boost</label>
        <input
          id="apOption"
          type="Range"
          min="0"
          max="1000"
          step="10"
          value={state.generalSettings.apBoost}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { apBoost: parseInt(event.target.value) },
            });
          }}
        />
        {state.generalSettings.apBoost}
      </div>
      <div className="generalSettingsOption">
        <label htmlFor="lawOption">Laws</label>
        <select
          id="lawOption"
          value={state.generalSettings.laws}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { laws: event.target.value },
            });
          }}
        >
          <option value="normal">Normal</option>
          <option value="shuffled">Shuffled</option>
        </select>
      </div>
      <div className="generalSettingsOption">
        <label htmlFor="goldOption">Starting Gold</label>
        <input
          id="goldOption"
          type="number"
          value={state.generalSettings.startingGold}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { startingGold: parseInt(event.target.value) },
            });
          }}
        />
      </div>
      <div className="generalSettingsOption">
        <label htmlFor="frostyOption">Frosty Mage Boost</label>
        <input
          id="frostyOption"
          type="checkbox"
          checked={state.generalSettings.frostyMageBoost}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { frostyMageBoost: event.target.checked },
            });
          }}
        />
      </div>
      <div className="generalSettingsOption">
        <label htmlFor="noJudgeOption">No Judge Turn</label>
        <input
          id="noJudgeOption"
          type="checkbox"
          checked={state.generalSettings.noJudgeTurn}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { noJudgeTurn: event.target.checked },
            });
          }}
        />
      </div>
    </div>
  );
};

export default GeneralSettings;
