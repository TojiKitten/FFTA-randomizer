import * as React from "react";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const GeneralSettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  return (
    <div className="generalSettings">
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
