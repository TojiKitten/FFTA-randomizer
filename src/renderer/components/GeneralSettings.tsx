import * as React from "react";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const GeneralSettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  const { generalSettings } = state;
  const {
    cutscenes,
    laws,
    disableClans,
    quickOptions,
    noJudgeTurn,
    mpRegen,
    frostyMageBoost,
    raceMode,
  } = generalSettings;

  const [cutSceneHelp, setcutSceneHelp] = React.useState("");
  React.useEffect(() => {
    switch (cutscenes) {
      case "all":
        setcutSceneHelp("Cutscenes are unchanged.");
        break;
      case "none":
        setcutSceneHelp("Many story cut scenes are skipped.");
        break;
      case "noTutorial":
        setcutSceneHelp(
          "Many story cut scenes are skipped and New Game starts at the overworld."
        );
        break;
    }
  }, [cutscenes]);

  const [lawHelp, setLawHelp] = React.useState("");
  React.useEffect(() => {
    switch (laws) {
      case "normal":
        setLawHelp("Laws are unchanged.");
        break;
      case "shuffled":
        setLawHelp("Laws are shuffled and may also appear in different ranks.");
        break;
    }
  }, [laws]);

  const [noJudgeHelp, setNoJudgeHelp] = React.useState("");
  React.useEffect(() => {
    noJudgeTurn
      ? setNoJudgeHelp("The judge will not take turns.")
      : setNoJudgeHelp("The judge is unchanged.");
  }, [noJudgeTurn]);

  const [frostyHelp, setFrostyHelpHelp] = React.useState("");
  React.useEffect(() => {
    frostyMageBoost
      ? setFrostyHelpHelp("The Frosty Mage mission has level 50 pillars.")
      : setFrostyHelpHelp("The Frosty Mage mission is unchanged.");
  }, [frostyMageBoost]);

  return (
    <div className="generalSettings">
      <div className="generalSettingsOption has-help-text">
        <label htmlFor="raceModeOption">Race Mode</label>
        <input
          id="raceModeOption"
          type="checkbox"
          checked={raceMode}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { raceMode: event.target.checked },
            });
          }}
        />
        <div className="help-text">
          When enabled, mission rewards and job stat growths set to fixed
          values.
        </div>
      </div>
      <div className="generalSettingsOption has-help-text">
        <label htmlFor="cutsceneOption">Cutscenes</label>
        <select
          id="cutsceneOption"
          value={cutscenes}
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
        <div className="help-text">{cutSceneHelp}</div>
      </div>
      <div className="generalSettingsOption has-help-text">
        <label htmlFor="lawOption">Laws</label>
        <select
          id="lawOption"
          value={laws}
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
        <div className="help-text">{lawHelp}</div>
      </div>
      <div className="generalSettingsOption">
        <label htmlFor="goldOption">Starting Gil</label>
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
      <div className="jobOption">
        <label htmlFor="mpRegen">MP Regen</label>
        <select
          id="mpRegen"
          value={mpRegen}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { mpRegen: event.target.value },
            });
          }}
        >
          <option value="normal">5 MP gained per turn</option>
          <option value="precentage">10% of Max MP gained per turn</option>
        </select>
      </div>
      <div className="generalSettingsOption">
        <label htmlFor="disableClans">Disable Clans</label>
        <input
          id="disableClans"
          type="checkbox"
          checked={disableClans}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { disableClans: event.target.checked },
            });
          }}
        />
      </div>
      <div className="generalSettingsOption has-help-text">
        <label htmlFor="quickOptions">Quick Options</label>
        <input
          id="quickOptions"
          type="checkbox"
          checked={quickOptions}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { quickOptions: event.target.checked },
            });
          }}
        />
        <div className="help-text">
          When enabled, changes default in game options to use quick options.
        </div>
      </div>
      <div className="generalSettingsOption has-help-text">
        <label htmlFor="noJudgeOption">No Judge Turn</label>
        <input
          id="noJudgeOption"
          type="checkbox"
          checked={noJudgeTurn}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { noJudgeTurn: event.target.checked },
            });
          }}
        />
        <div className="help-text">{noJudgeHelp}</div>
      </div>
      <div className="generalSettingsOption has-help-text">
        <label htmlFor="frostyOption">Frosty Mage Boost</label>
        <input
          id="frostyOption"
          type="checkbox"
          checked={frostyMageBoost}
          onChange={(event) => {
            dispatch({
              type: "generalSettings",
              option: { frostyMageBoost: event.target.checked },
            });
          }}
        />
        <div className="help-text">{frostyHelp}</div>
      </div>
    </div>
  );
};

export default GeneralSettings;
