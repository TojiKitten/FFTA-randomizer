import * as React from "react";
import MissionView from "./MissionView";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const MissionLog = () => {
  const [allMissions, setAllMissions] = React.useState(new Array<any>());
  const [missionItems, setMissionItems] = React.useState({} as any);
  const [showCompletedMissions, setShowCompleted] = React.useState(false);
  function updateAllMissions(updatedMission: any, amount: number) {
    setAllMissions(
      allMissions.map((mission) => {
        if (mission.Name == updatedMission.Name) {
          return { ...mission, Completed: mission.Completed + amount };
        } else {
          return mission;
        }
      })
    );
  }

  function updateMissionItems(itemsArray: any) {
    let newItems = { ...missionItems };
    Object.entries(itemsArray).forEach((entry: any) => {
      const [rewardName, amount] = entry;
      const newAmount = missionItems[rewardName]
        ? missionItems[rewardName] + amount
        : amount;
      newItems = { ...newItems, [rewardName]: newAmount };
    });
    setMissionItems({
      ...newItems,
    });
  }

  React.useEffect(() => {
    api.receive("get-missions", (parms: any) => {
      setAllMissions(parms.payload);
    });

    api.send("load-mission-log", {});
    return () => {
      api.remove("get-missions");
    };
  }, []);

  React.useEffect(() => {
    api.send("save-mission-log", {
      payload: allMissions,
    });
  });

  return allMissions.length > 0 ? (
    <div className="mission-log">
      <div className="grid-full">
        <label htmlFor="showCompleted">Show Completed</label>
        <input
          id="showCompleted"
          type="checkbox"
          checked={showCompletedMissions}
          onChange={(event) => setShowCompleted(event.target.checked)}
        />
      </div>
      <div className="mission-list">
        {allMissions.map((mission) => {
          if (
            mission.Completed == 0 ||
            (mission.Completed > 0 && showCompletedMissions) ||
            mission.Repeatable == "Yes"
          ) {
            return (
              <MissionView
                mission={mission}
                updateAllMissions={updateAllMissions}
                updateMissionItems={updateMissionItems}
              />
            );
          }
        })}
      </div>
      <aside className="mission-item-view">
        {Object.entries(missionItems).map((entry) => {
          return (
            <div>
              {entry[0]}: {entry[1]}
            </div>
          );
        })}
      </aside>
    </div>
  ) : (
    <div className="mission-log">{}</div>
  );
};

export default MissionLog;
