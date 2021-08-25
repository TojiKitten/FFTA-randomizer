import * as React from "react";
import MissionView from "./MissionView";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

export const MissionLog = () => {
  const [allMissions, setAllMissions] = React.useState(new Array<any>());

  function updateAllMissions(updatedMission: any, completed: boolean) {
    setAllMissions(
      allMissions.map((mission) => {
        if (mission.Name == updatedMission.Name) {
          return { ...mission, Completed: completed };
        } else {
          return mission;
        }
      })
    );
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
      {allMissions.map((mission) => (
        <MissionView mission={mission} updateAllMissions={updateAllMissions} />
      ))}
    </div>
  ) : (
    <div className="mission-log">{}</div>
  );
};

export default MissionLog;
