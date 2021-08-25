import * as React from "react";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const MissionLog = (props: any) => {
  const { mission, updateAllMissions } = props;

  const pickUpKeys = [
    "Pick Up Location",
    "Pick Up Month",
    "Rank",
    "Price",
    "Difficulty",
    "Clear Conditions",
    "Days Available",
    "Mission Area",
  ];

  const requirementKeys = [
    "Required Cutscene",
    "Required Mission 1",
    "Required Mission 2",
    "Required Mission 3",
    "Pub Appears",
    "Pub Timeout",
    "Repeatable",
    "Required Item 1",
    "Required Item 2",
    "Required Job",
    "Recommended Job",
    "Forbidden Job",
  ];

  const rewardKeys = [
    "Gil Reward",
    "AP Reward",
    "CP Reward",
    "Item Reward 1",
    "Item Reward 2",
    "Law Card Reward 1",
    "Law Card Reward 2",
  ];

  return (
    <div className="mission-view">
      <h3>
        {mission.Name} (#{mission["Mission Number"].toString().padStart(3, 0)})
      </h3>
      <div className="mission-complete">
        <label htmlFor="completed">Completed</label>
        <input
          id="completed"
          type="checkbox"
          checked={mission.Completed}
          onChange={(event) => {
            updateAllMissions(mission, event.target.checked);
          }}
        ></input>
      </div>
      <div>
        {pickUpKeys.map((name) =>
          mission[name] != "" ? (
            <article className="mission-readOnly">
              <p>
                {name}: {mission[name]}
              </p>
            </article>
          ) : null
        )}
      </div>
      <div>
        {requirementKeys.map((name) =>
          mission[name] != "" ? (
            <article className="mission-readOnly">
              <p>
                {name}: {mission[name]}
              </p>
            </article>
          ) : null
        )}
      </div>
      <div>
        {rewardKeys.map((name) =>
          mission[name] != "" ? (
            <article className="mission-readOnly">
              <p>
                {name}: {mission[name]}
              </p>
            </article>
          ) : null
        )}
      </div>
    </div>
  );
};

export default MissionLog;
