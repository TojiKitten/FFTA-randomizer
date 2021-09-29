import { clamp } from "lodash";
import * as React from "react";
import { useRandomizer, useRandomizerUpdate } from "./RandomizerProvider";

export const MissionSettings = () => {
  const dispatch = useRandomizerUpdate();
  const state = useRandomizer();
  const {
    storySetting,
    apBoost,
    gilReward,
    missionRewards,
    disableRewardPreview,
    missionScaling,
    missionScalingValue,
    randomEnemies,
    enemyAbilityPercentage,
    storyLength,
  } = state.missionSettings;

  const [showStoryLength, setShowStoryLength] = React.useState(false);
  const [maxStoryLength, setMaxStoryLength] = React.useState(126);
  const [storyHelp, setStoryHelp] = React.useState("");

  const [levelModifierText, setLevelModifierText] =
    React.useState("Level Modifier");
  const [enemyLevelHelp, setEnemyLevelHelp] = React.useState("");
  const [showLevelModifier, setShowLevelModifier] = React.useState(false);
  const [minLevelModifier, setMinLevelModifier] = React.useState(0);

  const [missionRewardHelp, setMissionRewardHelp] = React.useState("");
  const [missionPreviewHelp, setMissionPreviewHelp] = React.useState("");

  const [gilRewardText, setGilRewardText] = React.useState("Off");
  const [apRewardText, setAPRewardText] = React.useState("Off");

  const [showEnemyAbilities, setShowEnemyAbilities] = React.useState(false);

  const validMissions = 119;
  // Update UI based on story setting option
  React.useEffect(() => {
    switch (storySetting) {
      case "normal":
        setShowStoryLength(false);
        setStoryHelp("The game is unchanged.");
        break;
      case "linear":
        setShowStoryLength(true);
        setMaxStoryLength(validMissions);
        setStoryHelp(
          "Only one mission is available in the pub, and completing it unlocks the next mission. The last mission will always be Royal Valley."
        );
        dispatch({
          type: "missionSettings",
          option: { missionScaling: "average" },
        });
        break;
      case "branching":
        setShowStoryLength(true);
        setMaxStoryLength(Math.floor((validMissions - 1) / 3) + 1);
        setStoryHelp("This mode does not work.");
        dispatch({
          type: "missionSettings",
          option: { missionScaling: "average" },
        });
        break;
    }
  }, [storySetting]);

  // Update UI based on mission scaling option
  React.useEffect(() => {
    switch (missionScaling) {
      case "normal":
        setLevelModifierText("Level Modifier");
        setMinLevelModifier(0);
        setShowLevelModifier(false);
        setEnemyLevelHelp("Enemy levels are unchanged.");
        break;
      case "lerp":
        setLevelModifierText("Li Grim Level");
        setMinLevelModifier(1);
        setShowLevelModifier(true);
        dispatch({
          type: "missionSettings",
          option: {
            missionScalingValue: clamp(missionScalingValue, 1, 50),
          },
        });
        setEnemyLevelHelp(
          "Each story mission leading up to Royal Valley interpolates to the value. Non-story missions will scale to the average clan level."
        );
        break;
      case "average":
        setLevelModifierText("Additional Enemy Levels");
        setMinLevelModifier(0);
        setShowLevelModifier(true);
        setEnemyLevelHelp(
          "Missions scale to the average clan level. Additional Enemy Levels will be added into the calculation."
        );
        break;
      case "highest":
        setLevelModifierText("Additional Enemy Levels");
        setMinLevelModifier(0);
        setShowLevelModifier(true);
        setEnemyLevelHelp(
          "Missions scale to the highest level member of the clan. Additional Enemy Levels will be added into the calculation."
        );
        break;
    }
  }, [missionScaling]);

  // Update UI based on mission reward option
  React.useEffect(() => {
    switch (missionRewards) {
      case "normal":
        setMissionRewardHelp("Mission reward sets are unchanged.");
        break;
      case "random":
        setMissionRewardHelp("Mission reward sets are randomized.");
        break;
      case "shuffled":
        setMissionRewardHelp(
          "Mission reward items may appear in different sets."
        );
        break;
    }
  }, [missionRewards]);

  // Update UI based on mission preview option
  React.useEffect(() => {
    disableRewardPreview
      ? setMissionPreviewHelp(
          'Mission item reward previews are replaced by "???" bags.'
        )
      : setMissionPreviewHelp("Mission item reward previews are unchanged.");
  }, [disableRewardPreview]);

  // Update UI based on gil reward option
  React.useEffect(() => {
    gilReward < 0
      ? setGilRewardText("Off")
      : setGilRewardText((gilReward * 200).toString());
  }, [gilReward]);

  // Update UI based on AP reward option
  React.useEffect(() => {
    apBoost < 0
      ? setAPRewardText("Off")
      : setAPRewardText((apBoost * 10).toString());
  }, [apBoost]);

  // Update UI based on random enemies option
  React.useEffect(() => {
    setShowEnemyAbilities(randomEnemies);
  }, [randomEnemies]);

  return (
    <div className="missionSettings">
      <div className="missionSettingsOption has-help-text">
        <label htmlFor="storyOption">Story Setting</label>
        <select
          id="storyOption"
          value={storySetting}
          onChange={(event) => {
            dispatch({
              type: "missionSettings",
              option: { storySetting: event.target.value },
            });
          }}
        >
          <option value="normal">Normal</option>
          <option value="linear">Randomized Linear</option>
          {false && <option value="branching">Randomized Branching</option>}
        </select>
        <div className="help-text">{storyHelp}</div>
      </div>
      {showStoryLength && (
        <div className="missionSettingsOption">
          <label htmlFor="storyLength">Story Length</label>
          <input
            id="storyLength"
            type="Range"
            min="2"
            max={maxStoryLength.toString()}
            value={storyLength}
            onChange={(event) => {
              const { value } = event.target;
              dispatch({
                type: "missionSettings",
                option: { storyLength: parseInt(value) },
              });
            }}
          />
          {storyLength} encounter missions to beat the game.
        </div>
      )}
      <div className="missionSettingsOption has-help-text">
        <label htmlFor="missionScaleOption">Enemy Levels</label>
        <select
          id="missionScaleOption"
          value={missionScaling}
          onChange={(event) => {
            dispatch({
              type: "missionSettings",
              option: { missionScaling: event.target.value },
            });
          }}
        >
          <option value="normal">Normal</option>
          {storySetting === "normal" && <option value="lerp">Modified</option>}
          <option value="average">Scale to Average Team Level</option>
          <option value="highest">Scale to Highest Member Level</option>
        </select>
        <div className="help-text">{enemyLevelHelp}</div>
      </div>
      {showLevelModifier && (
        <div className="missionSettingsOption">
          <label htmlFor="levelModifierOption">{levelModifierText}</label>
          <input
            id="levelModifierOption"
            type="Range"
            min={minLevelModifier.toString()}
            max="50"
            value={missionScalingValue}
            onChange={(event) => {
              const { value } = event.target;
              dispatch({
                type: "missionSettings",
                option: {
                  missionScalingValue: parseInt(value),
                },
              });
            }}
          />
          {missionScalingValue}
        </div>
      )}
      <div className="missionSettingsOption">
        <label htmlFor="randomEnemies">Randomize Enemies</label>
        <input
          id="randomEnemies"
          type="checkbox"
          checked={randomEnemies}
          onChange={(event) => {
            dispatch({
              type: "missionSettings",
              option: { randomEnemies: event.target.checked },
            });
          }}
        />
      </div>
      {showEnemyAbilities && (
        <div className="missionSettingsOption">
          <label htmlFor="enemyAbilityPercentage">
            Percent of Abilities Learned
          </label>
          <input
            id="enemyAbilityPercentage"
            type="Range"
            min="0"
            max="100"
            value={enemyAbilityPercentage}
            onChange={(event) => {
              const { value } = event.target;
              dispatch({
                type: "missionSettings",
                option: {
                  enemyAbilityPercentage: parseInt(value),
                },
              });
            }}
          />
          Enemies will learn {enemyAbilityPercentage}% of their abilities.
        </div>
      )}
      <div className="missionSettingsOption has-help-text">
        <label htmlFor="missionRewardOption">Item Rewards</label>
        <select
          id="missionRewardOption"
          value={missionRewards}
          onChange={(event) => {
            dispatch({
              type: "missionSettings",
              option: { missionRewards: event.target.value },
            });
          }}
        >
          <option value="normal">Normal</option>
          <option value="random">Random</option>
          <option value="shuffled">Shuffled</option>
        </select>
        <div className="help-text">{missionRewardHelp}</div>
      </div>
      <div className="missionSettingsOption has-help-text">
        <label htmlFor="disableRewardPreview">Disable Reward Preview</label>
        <input
          id="disableRewardPreview"
          type="checkbox"
          checked={disableRewardPreview}
          onChange={(event) => {
            dispatch({
              type: "missionSettings",
              option: { disableRewardPreview: event.target.checked },
            });
          }}
        />
        <div className="help-text">{missionPreviewHelp}</div>
      </div>
      <div className="missionSettingsOption">
        <label htmlFor="gilReward">Universal Gil Reward</label>
        <input
          id="apOption"
          type="Range"
          min="-1"
          max="255"
          step="1"
          value={gilReward}
          onChange={(event) => {
            const gilValue = parseInt(event.target.value);
            dispatch({
              type: "missionSettings",
              option: { gilReward: gilValue },
            });
          }}
        />
        {gilRewardText}
      </div>
      <div className="missionSettingsOption">
        <label htmlFor="apOption">Universal AP Reward</label>
        <input
          id="apOption"
          type="Range"
          min="-1"
          max="100"
          value={apBoost}
          onChange={(event) => {
            const apValue = parseInt(event.target.value);
            dispatch({
              type: "missionSettings",
              option: { apBoost: apValue },
            });
          }}
        />
        {apRewardText}
      </div>
    </div>
  );
};

export default MissionSettings;
