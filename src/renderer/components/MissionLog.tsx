import * as React from "react";
import MissionView from "./MissionView";

//window.api gets available at runtime so we can ignore that error
// @ts-ignore
const { api } = window;

const requiredMissionItems = [
  "Adaman Alloy",
  "Adamantite",
  "Ahriman Eye",
  "Ahriman Wing",
  "Ally Finder",
  "Ally Finder2",
  "Ancient Bills",
  "Ancient Medal",
  "Animal Bone",
  "Bent Sword",
  "Black Thread",
  "Blod Apple",
  "Blood Apple",
  "Blood Shawl",
  "Body Ceffyl",
  "Bomb Shell",
  "Broken Sword",
  "Caravan Musk",
  "Cat's Tears",
  "Choco Bread",
  "Choco Gratin",
  "Chocobo Egg",
  "Chocobo Skin",
  "Clock Gear",
  "Clock Post",
  "Crusite Alloy",
  "Dame's Blush",
  "Danbukwood",
  "Delta Fang",
  "Dictionary",
  "Dragon Bone",
  "Earth Sigil",
  "Elda's Cup",
  "Fairy Wing",
  "Feather Badge",
  "Fire Sigil",
  "Flower Vase",
  "Goldcap",
  "Grownup Bread",
  "Gun Gear",
  "Gyshal Greens",
  "Helje Key",
  "Homework",
  "Insignia",
  "Jerky",
  "Kiddy Bread",
  "Leestone",
  "Life Water",
  "Magic Cloth",
  "Magic Cotton",
  "Magic Medal",
  "Malboro Wine",
  "Materite",
  "Mind Ceffyl",
  "Monster Guide",
  "Moon Bloom",
  "Moonwood",
  "Mysidia Alloy",
  "Mythril Pick",
  "Neighbor Pin",
  "Old Statue",
  "Rabbit Tail",
  "Rainbowite",
  "Rat Tail",
  "Runba's Tale",
  "Rusty Spear",
  "Rusty Sword",
  "Secret Books",
  "Silk Bloom",
  "Silvril",
  "Skull",
  "Spirit Stone",
  "Spiritstone",
  "Stasis Rope",
  "Stilpool Scroll",
  "Stolen Gil",
  "Stormstone",
  "Stradivari",
  "Sylvril",
  "Thunderstone",
  "Tonberry Lamp",
  "Tranquil Box",
  "Water Sigil",
  "White Thread",
  "Wind Sigil",
  "Wyrmstone",
  "Zodiac Ore",
];

export const MissionLog = () => {
  const [allMissions, setAllMissions] = React.useState(new Array<any>());
  const [missionItems, setMissionItems] = React.useState({} as any);

  const [showAllMissions, setShowAll] = React.useState(false);
  const [showCompletedMissions, setShowCompleted] = React.useState(false);
  const [showRepeatableMissions, setShowRepeatable] = React.useState(true);
  const [showMissingMissionItems, setShowMissingItems] = React.useState(true);
  const [searchString, setSearchString] = React.useState("");

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

  function getShownMissions() {
    return showAllMissions
      ? allMissions
      : allMissions
          .filter((mission) => {
            return missionReqsMet([
              mission["Required Mission 1"],
              mission["Required Mission 2"],
              mission["Required Mission 3"],
            ]);
          })
          .filter((mission) => {
            return (
              (mission.Completed == 0 &&
                (showMissingMissionItems ||
                  missionItemReqsMet(
                    mission["Required Item 1"],
                    mission["Required Item 2"]
                  ))) ||
              (mission.Repeatable == "No" &&
                mission.Completed > 0 &&
                showCompletedMissions) ||
              (mission.Repeatable == "Yes" &&
                mission.Completed > 0 &&
                (showRepeatableMissions || showCompletedMissions))
            );
          })
          .filter((mission) => {
            return mission["Name"].includes(searchString);
          });
  }

  function updateMissionItems(itemsArray: any) {
    let newItems = { ...missionItems };
    Object.entries(itemsArray).forEach((entry: any) => {
      const [rewardName, amount] = entry;
      const newAmount = missionItems[rewardName]
        ? missionItems[rewardName] + amount
        : amount;
      newItems = { ...newItems, [rewardName]: newAmount };
      if (newAmount <= 0) {
        delete newItems[rewardName];
      }
    });

    setMissionItems({
      ...newItems,
    });
  }

  function missionReqsMet(missionNames: Array<string>): boolean {
    var reqsMet = 0;
    const requiredMissionNames = missionNames.filter(
      (missionName) => missionName != ""
    );

    requiredMissionNames.forEach((missionName) => {
      const missionInfo = allMissions.find(
        (mission) => mission["Name"] === missionName
      );

      const cleared =
        missionName === "" ||
        (missionName != "" && missionInfo["Completed"] >= 1)
          ? true
          : false;

      if (cleared) reqsMet++;
    });

    return reqsMet === requiredMissionNames.length;
  }

  function missionItemReqsMet(
    missionItem1: string,
    missionItem2: string
  ): boolean {
    if (missionItem1 === "" && missionItem2 === "") {
      return true;
    } else if (missionItem1 === missionItem2 && missionItem1 != "") {
      return missionItems[missionItem1] - 2 >= 0;
    } else if (missionItem1 != "" && missionItem2 != "") {
      return (
        missionItems[missionItem1] - 1 >= 0 &&
        missionItems[missionItem2] - 1 >= 0
      );
    } else if (missionItem1 != "" && missionItem2 === "") {
      return missionItems[missionItem1] - 1 >= 0;
    } else if (missionItem1 === "" && missionItem2 != "") {
      return missionItems[missionItem2] - 1 >= 0;
    } else {
      throw new Error("Required item not handled.");
    }
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
        <label htmlFor="showAll">Include All Missions</label>
        <input
          id="showAll"
          type="checkbox"
          checked={showAllMissions}
          onChange={(event) => setShowAll(event.target.checked)}
        />
      </div>
      <div className="grid-full">
        <label htmlFor="includeCompleted">Include All Completed</label>
        <input
          id="includeCompleted"
          type="checkbox"
          checked={showCompletedMissions}
          onChange={(event) => setShowCompleted(event.target.checked)}
        />
      </div>
      <div className="grid-full">
        <label htmlFor="includeRepeatable">Include Repetable Completed </label>
        <input
          id="includeRepeatable"
          type="checkbox"
          checked={showRepeatableMissions}
          onChange={(event) => setShowRepeatable(event.target.checked)}
        />
      </div>
      <div className="grid-full">
        <label htmlFor="includeMissingItems">
          Include Missions Missing Item Requirements
        </label>
        <input
          id="includeMissingItems"
          type="checkbox"
          checked={showMissingMissionItems}
          onChange={(event) => setShowMissingItems(event.target.checked)}
        />
      </div>
      <div className="grid-full">
        <div>Missions Shown: {getShownMissions().length}</div>
      </div>
      <div className="grid-full">
        <label htmlFor="showUnavailable">Search Mission Name</label>
        <input
          id="searchMissions"
          type="search"
          value={searchString}
          onChange={(event) => setSearchString(event.target.value)}
        />
      </div>
      <div className="mission-list">
        {getShownMissions().map((mission) => {
          return (
            <MissionView
              mission={mission}
              updateAllMissions={updateAllMissions}
              updateMissionItems={updateMissionItems}
              missionItemReqsMet={missionItemReqsMet}
              missionReqsMet={missionReqsMet}
            />
          );
        })}
      </div>
      <aside className="mission-item-view">
        <div>
          {Object.entries(missionItems)
            .filter((element) => requiredMissionItems.includes(element[0]))
            .sort()
            .map((entry) => {
              return (
                <div>
                  {entry[0]}: {entry[1]}
                </div>
              );
            })}
        </div>
      </aside>
    </div>
  ) : (
    <div className="mission-log">{}</div>
  );
};

export default MissionLog;
