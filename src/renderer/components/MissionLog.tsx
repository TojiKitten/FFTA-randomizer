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
      if (newAmount <= 0) {
        delete newItems[rewardName];
      }
    });

    setMissionItems({
      ...newItems,
    });
  }

  function missionItemReqsMet(
    missionItem1: string,
    missionItem2: string
  ): boolean {
    if (missionItem1 == "" && missionItem2 == "") {
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
      throw new Error("Required item not handled;");
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
                missionItemReqsMet={missionItemReqsMet}
              />
            );
          }
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
