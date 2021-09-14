import * as React from "react";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const MissionLog = (props: any) => {
  const { mission, updateAllMissions, updateMissionItems, missionItemReqsMet } =
    props;

  const columnKeys = [
    ["Pick Up Location", "Pick Up Month", "Mission Area"],
    [
      "Required Cutscene",
      "Required Mission 1",
      "Required Mission 2",
      "Required Mission 3",
    ],
    [
      "Required Item 1",
      "Required Item 2",
      "Required Job",
      "Recommended Job",
      "Forbidden Job",
    ],
    ["Item Reward 1", "Item Reward 2"],
    ["Repeatable", "Days Available", "Clear Conditions", "Difficulty"],
  ];

  const additionalKeys = [
    "Price",
    "Rank",
    "Pub Appears",
    "Pub Timeout",
    "Gil Reward",
    "AP Reward",
    "CP Reward",
    "Law Card Reward 1",
    "Law Card Reward 2",
  ];

  return (
    <div className="mission-view">
      <h3>
        {mission.Name} (#{mission["Mission Number"].toString().padStart(3, 0)}){" "}
        {mission.Completed > 0 && "COMPLETED"}{" "}
        {mission.Completed > 0 &&
          mission.Repeatable == "Yes" &&
          `x${mission.Completed}`}
      </h3>
      {(mission.Completed == 0 ||
        (mission.Completed > 0 && mission.Repeatable == "Yes")) &&
        missionItemReqsMet(
          mission["Required Item 1"],
          mission["Required Item 2"]
        ) && (
          <div className="mission-complete">
            <button
              onClick={(event) => {
                updateAllMissions(mission, 1);
                let itemRewards = {} as any;

                const updateItemRewards = (
                  itemName: string,
                  amount: number
                ) => {
                  if (itemName != "")
                    if (itemRewards[itemName]) {
                      itemRewards = {
                        ...itemRewards,
                        [itemName]: itemRewards[itemName] + amount,
                      };
                    } else {
                      itemRewards = {
                        ...itemRewards,
                        [itemName]: amount,
                      };
                    }
                };

                updateItemRewards(mission["Required Item 1"], -1);
                updateItemRewards(mission["Required Item 2"], -1);
                updateItemRewards(mission["Item Reward 1"], 1);
                updateItemRewards(mission["Item Reward 2"], 1);

                if (Object.entries(itemRewards).length > 0) {
                  updateMissionItems(itemRewards);
                }
              }}
            >
              Complete
            </button>
          </div>
        )}
      {columnKeys.map((column) => (
        <div className="mission-readOnly">
          {column.map((name) =>
            mission[name] != "" ? (
              <div>
                {name}: {mission[name]}
              </div>
            ) : null
          )}
        </div>
      ))}
      <details className="mission-readOnly">
        <summary>Additional Info</summary>
        {additionalKeys.map((name) =>
          mission[name] != "" ? (
            <div>
              {name}: {mission[name]}
            </div>
          ) : null
        )}
      </details>
    </div>
  );
};

export default MissionLog;
