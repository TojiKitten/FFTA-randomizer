import { FFTAMission } from "../DataWrapper/FFTAMission";
import * as FFTAUtils from "../utils/FFTAUtils";
import FFTAData from "../FFTAData";
import { FFTAFormation } from "../DataWrapper/FFTAFormation";
import { FFTALawSet } from "../DataWrapper/FFTALaw";
import NoiseGenerator from "../utils/NoiseGenerator";
import { FFTAItem, FFTARewardItemSet } from "../DataWrapper/FFTAItem";

/**
 * Sets the story missions interpolate between a minium and maximum value.
 * @param formations - An array of all formations
 * @param liGrimLevel - The desired ending level of the final boss
 */
export function lerpStoryMissionLevels(
  formations: Array<FFTAFormation>,
  liGrimLevel: number
) {
  // Interpolate the max level for all Story Missions
  for (var i = 3; i < 33; i++) {
    formations[i].units.forEach((unit) => {
      unit.level = Math.ceil(liGrimLevel * (i / 33));
    });
  }
  // Set remaining missions to scale
  for (var i = 33; i < formations.length; i++) {
    formations[i].units.forEach((unit) => {
      unit.level = 0;
    });
  }
}

/**
 * Sets all non starting party formations to 0. Causing the game to scale all fights.
 * @param formations - An array of all formations
 */
export function averageMissionLevels(formations: Array<FFTAFormation>) {
  // When "Level" is set to 0, the game scales automatically to avg party level
  formations.forEach((formation, i) => {
    // Don't apply this to starting party
    if (i !== 0) {
      formation.units.forEach((unit) => {
        unit.level = 0;
      });
    }
  });
}

/**
 * Sets all non starting party formations to 0. Also change the game to scale to highest level unit.
 * @param fftaData - Buffer holding FFTA
 */
export function highestMissionLevels(fftaData: FFTAData) {
  // When "Level" is set to 0, the game scales automatically to avg party level
  // In addition, change the code so it scales to highest party member level
  fftaData.formations.forEach((formation, i) => {
    // Don't apply this to starting party
    if (i !== 0) {
      formation.units.forEach((unit) => {
        unit.level = 0;
      });
    }
  });

  // Change ASM to use highest member level
  fftaData.rom.set([0x50, 0x79, 0xa0, 0x42], 0xca088);
  fftaData.rom.set([0xdd, 0x04, 0x1c, 0x00, 0x00, 0x00, 0x00], 0xca08d);
  fftaData.rom.set([0x20, 0x1c], 0xca0aa);
}

/**
 * Removes the clan stat requirements for missions.
 * @param missions - Array of missions to clear
 */
export function clearMissionStatRequirements(missions: Array<FFTAMission>) {
  missions.forEach((mission) => {
    mission.requiredSkill = 0;
  });
}

/**
 * Removes the clan stat requirements for missions.
 * @param missions - Array of missions to clear
 */
export function clearMissionJobRequirements(missions: Array<FFTAMission>) {
  missions.forEach((mission) => {
    mission.requiredJob = 0;
  });
}

/**
 * Sets the two orbs on Frosty Mage to level 50
 * @param rom - A buffer holding FFTA
 */
export function frostyMageBoost(rom: Uint8Array) {
  rom.set([0x32], 0x53fb63);
  rom.set([0x32], 0x53fb93);
}

/**
 * Sets judges to have 0 speed. Missing some?
 * @param rom - A buffer holding FFTA
 */
export function noJudgeTurn(rom: Uint8Array) {
  rom.set([0x0], 0x522f4d);
  rom.set([0x0], 0x522f81);
  rom.set([0x0], 0x522fb5);
}

/**
 * Changes laws to appear in a different order and set.
 * @param lawSets - An array of all law sets
 * @param rng - The {@link NoiseGenerator} for the randomizer.
 */
export function shuffleLaws(lawSets: Array<FFTALawSet>, rng: NoiseGenerator) {
  const numberLaws = 20;
  let allLaws: Array<number> = [];

  // Get all laws into one array
  lawSets.forEach((set) => {
    for (var i = 0; i < numberLaws; i++) {
      allLaws.push(set.getLaw(i));
    }
  });

  // Set each law to a random law from the pool
  lawSets.forEach((set) => {
    for (var i = 0; i < numberLaws; i++) {
      set.setLaw(allLaws.splice(rng.randomIntMax(allLaws.length - 1), 1)[0], i);
    }
  });
}

/**
 * Changes mission rewards to appear in different sets.
 * @param rewardSets - An array of all reward sets
 * @param rng - The {@link NoiseGenerator} for the randomizer
 */
export function shuffleRewards(
  rewardSets: Array<FFTARewardItemSet>,
  rng: NoiseGenerator
) {
  const numberRewards = 20;
  let allRewards: Array<number> = [];

  // Get all reward items into one array
  rewardSets.forEach((set) => {
    for (var i = 0; i < numberRewards; i++) {
      allRewards.push(set.getItem(i));
    }
  });

  // Set each item to a random item from the pool
  rewardSets.forEach((set) => {
    for (var i = 0; i < numberRewards; i++) {
      set.setItem(
        allRewards.splice(rng.randomIntMax(allRewards.length - 1), 1)[0],
        i
      );
    }
  });
}

/**
 * Changes mission rewards to random items.
 * @param rewardSets - An array of all reward sets
 * @param rng - The {@link NoiseGenerator} for the randomizer
 */
export function randomRewards(
  rewardSets: Array<FFTARewardItemSet>,
  items: Array<FFTAItem>,
  rng: NoiseGenerator
) {
  const numberRewards = 20;

  //Create an array of allowed items
  const allowedItems = items.filter((item) => item.allowed);

  // Distribute items across reward sets with no repeats
  rewardSets.forEach((set) => {
    for (var i = 0; i < numberRewards; i++) {
      let randomItemIndex = rng.randomIntRange(0, allowedItems.length - 1);
      set.setItem(allowedItems[randomItemIndex].itemID, i);
      allowedItems.splice(randomItemIndex, 1);
    }
  });
}

/**
 * Distributes items across all missions and replaces random rewards entirely.
 * @param items An array of items to distribute
 * @param missions An array of missions to distribute items over
 * @param rng The {@link NoiseGenerator} for the randomizer
 */
export function distributeItems(
  items: Array<FFTAItem>,
  missions: Array<FFTAMission>,
  rng: NoiseGenerator
) {
  let allowedItems = items.filter((item) => {
    return item.allowed;
  });

  missions.forEach((mission) => {
    if (mission.itemReward1 > 0xfff0) {
      let removed = allowedItems.splice(
        rng.randomIntMax(allowedItems.length - 1),
        1
      )[0];
      mission.itemReward1 = allowedItems.length > 0 ? removed.itemID : 0;
    }

    if (mission.itemReward2 > 0xfff0) {
      let removed = allowedItems.splice(
        rng.randomIntMax(allowedItems.length - 1),
        1
      )[0];
      mission.itemReward2 = allowedItems.length > 0 ? removed.itemID : 0;
    }
  });
}

export function hideRewardPreviews(missions: Array<FFTAMission>) {
  missions.forEach((mission) => {
    if (mission.itemReward1 != 0x00) mission.itemReward1Hidden = true;
    if (mission.itemReward2 != 0x00) mission.itemReward2Hidden = true;
  });
}

// Helper function to set the mission's prereq to a given mission
const setNewUnlockFlag = (mission: FFTAMission, previousMissionID: number) => {
  mission.setUnlockFlag1(
    previousMissionID - (1 % 255),
    3 + Math.floor((previousMissionID - 1) / 255),
    0x01
  );
  mission.setUnlockFlag2(0x00, 0x00, 0x00);
  mission.setUnlockFlag3(0x00, 0x00, 0x00);
};

export function randomizeLinearStory(
  missions: Array<FFTAMission>,
  storyLength: number,
  rng: NoiseGenerator
) {
  // Sets all missions to have impossible unlock criteria
  missions.forEach((mission) => {
    mission.setUnlockFlag1(0x02, 0x03, 0x01);
    mission.setUnlockFlag2(0x02, 0x03, 0x00);
    mission.setUnlockFlag3(0x00, 0x00, 0x00);
  });

  const unsupportedMissions = [
    "dummy",
    "Another World",
    "Snowball Fight",
    "Memories",
    "Decision Time",
  ];

  // Filter to all encounter missions
  const validMissions = missions.filter((mission, n) => {
    return (
      !unsupportedMissions.includes(mission.displayName!) &&
      mission.displayName != "Royal Valley" &&
      mission.encounterMission === true &&
      mission.linkMission === false &&
      mission.missionRank > 0 &&
      mission.missionLocation != 0
    );
  });

  // Create new "path" for the story
  let newStory: Array<FFTAMission> = [];
  for (var i = 0; i < storyLength - 1; i++) {
    // Get a random mission and remove it from t he valid missions
    const selectedMission = validMissions.splice(
      rng.randomIntMax(validMissions.length - 1),
      1
    )[0];

    // Give two new random tier rewards
    selectedMission.itemReward1 = 0xfff0 + rng.randomIntRange(1, 7);
    selectedMission.itemReward2 = 0xfff0 + rng.randomIntRange(1, 7);

    // Set the unlock of this mission to the previous mission, if it exists
    if (newStory.length > 0) {
      setNewUnlockFlag(
        selectedMission,
        newStory[newStory.length - 1].missionID
      );
      // Otherwise clear all requirements, since it is the starting mission
    } else {
      selectedMission.setUnlockFlag1(0x00, 0x00, 0x00);
      selectedMission.setUnlockFlag2(0x00, 0x00, 0x00);
      selectedMission.setUnlockFlag3(0x00, 0x00, 0x00);
    }
    newStory.push(selectedMission);
  }

  // Find Royal Valley, and set it to unlock after the last "new story" mission is completed
  const royalValley = missions.find(
    (mission) => mission.displayName === "Royal Valley"
  )!;

  setNewUnlockFlag(royalValley, newStory[newStory.length - 1].missionID);
  newStory.push(royalValley);

  // Fix certain things about the missions
  newStory.forEach((mission, n) => {
    //mission.missionType = 0x0a;
    const specialRecruits = [0x98, 0x9e, 0x9a, 0x96];
    if (!specialRecruits.includes(mission.recruit)) mission.recruit = 0x00;
    mission.daysAvaiblable = 0;
    mission.requiredItem1 = 0x0000;
    mission.requiredItem2 = 0x0000;
    mission.price = 0;
    mission.itemReward1Hidden = false;
    mission.itemReward2Hidden = false;
    mission.encounterType = 0x01;
    mission.storyMission = false;
    mission.repeatable = false;
    mission.cancelable = true;
    mission.eliteMission = false;
    mission.monthVisibile = "Any";
    mission.daysVisible = 1;
    mission.timeoutDays = 0;
    mission.cityAppearance = 0;
    mission.hideOnLocationMenu = false;
  });
}

/*
NOT CURRENTLY WORKING
export function randomizeBranchingStory(
  missions: Array<FFTAMission>,
  storyLength: number,
  rng: NoiseGenerator
) {
  // Helper function to set the mission's prereq to a given mission
  const setNewUnlockFlag = (
    mission: FFTAMission,
    previousMissionID: number,
    alternateOption1MissionID: number,
    alternateOption2MissionID: number
  ) => {
    mission.setUnlockFlag1(
      previousMissionID - (1 % 255),
      3 + Math.floor((previousMissionID - 1) / 255),
      0x01
    );
    mission.setUnlockFlag2(
      alternateOption1MissionID - (1 % 255),
      3 + Math.floor((alternateOption1MissionID - 1) / 255),
      0x00
    );
    mission.setUnlockFlag3(
      alternateOption2MissionID - (1 % 255),
      3 + Math.floor((alternateOption2MissionID - 1) / 255),
      0x00
    );
    mission.requiredItem1 = 0x0001;
    mission.requiredItem2 = 0x0000;
  };

  const updateStoryInfo = (
    mission: FFTAMission,
    previousID: number,
    alternateMissionID1: number,
    alternateMissionID2: number
  ) => {
    // Set the mission type to appear as purchasable in shop and selectable at location
    mission.missionType = 0x0a;
    // Set the extra flags to show on the location menu
    mission.setMoreFlags(0x00);
    // Set the unlock of this mission to the previous mission, if it exists
    if (previousID > 0) {
      setNewUnlockFlag(
        mission,
        previousID,
        alternateMissionID1,
        alternateMissionID2
      );
      // Otherwise clear all requirements, since it is the starting mission
    } else {
      mission.setUnlockFlag1(0x00, 0x00, 0x00);
      mission.setUnlockFlag2(0x00, 0x00, 0x00);
      mission.setUnlockFlag3(0x00, 0x00, 0x00);
    }
    mission.itemReward1 = 0x178;
    mission.itemReward2 = 0xfff0 + rng.randomIntRange(1, 7);
  };

  // Sets all missions to have impossible unlock criteria
  missions.forEach((mission) => {
    mission.setUnlockFlag1(0x02, 0x03, 0x01);
    mission.setUnlockFlag2(0x02, 0x03, 0x00);
    mission.setUnlockFlag3(0x00, 0x00, 0x00);
  });

  // Filter to all encounter missions
  const validMissions = missions.filter(
    (mission) =>
      mission.displayName != "dummy" &&
      mission.displayName != "Royal Valley" &&
      mission.encounterMission === 1 &&
      mission.linkMission === 0 &&
      mission.missionType << (8 + mission.missionRank) != 0x0d01
  );

  // Create new "path" for the story
  let newStory: Array<FFTAMission> = [];
  const firstMission = validMissions.splice(
    rng.randomIntMax(validMissions.length - 1),
    1
  )[0];
  firstMission.setUnlockFlag1(0, 0, 0);
  firstMission.setUnlockFlag2(0, 0, 0);
  firstMission.setUnlockFlag3(0, 0, 0);
  firstMission.requiredItem1 = 0x0000;
  firstMission.requiredItem2 = 0x0000;
  firstMission.itemReward1 = 0x0178;
  firstMission.itemReward2 = 0xfff0 + rng.randomIntRange(1, 7);
  newStory.push(firstMission);

  for (var i = 0; i < storyLength - 2; i++) {
    // Get a random mission and remove it from t he valid missions
    const option1 = validMissions.splice(
      rng.randomIntMax(validMissions.length - 1),
      1
    )[0];
    const option2 = validMissions.splice(
      rng.randomIntMax(validMissions.length - 1),
      1
    )[0];
    const option3 = validMissions.splice(
      rng.randomIntMax(validMissions.length - 1),
      1
    )[0];
    updateStoryInfo(
      option1,
      newStory[newStory.length - 1].missionID,
      option2.missionID,
      option3.missionID
    );
    updateStoryInfo(
      option2,
      newStory[newStory.length - 1].missionID,
      option1.missionID,
      option3.missionID
    );
    updateStoryInfo(
      option3,
      newStory[newStory.length - 1].missionID,
      option1.missionID,
      option2.missionID
    );

    newStory.push(option1);
    newStory.push(option2);
    newStory.push(option3);
  }

  newStory[newStory.length - 1].itemReward1 = 0x0179;
  newStory[newStory.length - 2].itemReward1 = 0x0179;
  newStory[newStory.length - 3].itemReward1 = 0x0179;

  // Find Royal Valley, and set it to unlock after the last "new story" mission is completed
  const royalValley = missions.find(
    (mission) => mission.displayName === "Royal Valley"
  )!;
  royalValley.missionType = 0x0a;
  royalValley.setMoreFlags(0x00);
  royalValley.setUnlockFlag1(0, 0, 0);
  royalValley.setUnlockFlag2(0, 0, 0);
  royalValley.setUnlockFlag3(0, 0, 0);
  royalValley.requiredItem1 = 0x02;
  royalValley.requiredItem2 = 0x0000;
  newStory.push(royalValley);

  // Fix certain things about the missions
  newStory.forEach((mission) => {
    mission.recruit = 0x00;
    mission.monthVisibile = "Any"; // Clears info to pick up in specific days
    mission.daysVisible = 1;
    mission.timeoutDays = 0;
    mission.price = 0;
    mission.cityAppearance = 0;
  });
}*/

export function setStaticRewards(
  missions: Array<FFTAMission>,
  rewardSets: Array<FFTARewardItemSet>,
  rng: NoiseGenerator
) {
  missions.forEach((mission) => {
    let { itemReward1, itemReward2 } = mission;
    if (((itemReward1 >> 8) & 0xff) === 0xff) {
      const rewardSet = rewardSets[itemReward1 & 0xf];
      const randomIndex = rng.randomIntMax(19);
      mission.itemReward1 = rewardSet.getItem(randomIndex);
    }
    if (((itemReward2 >> 8) & 0xff) === 0xff) {
      const rewardSet = rewardSets[itemReward2 & 0xf];
      const randomIndex = rng.randomIntMax(19);
      mission.itemReward2 = rewardSet.getItem(randomIndex);
    }
  });
}
