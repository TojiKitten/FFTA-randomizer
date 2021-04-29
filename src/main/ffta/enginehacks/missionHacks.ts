import { FFTAMission } from "../DataWrapper/FFTAMission";
import * as FFTAUtils from "../utils/FFTAUtils";
import FFTAData from "../FFTAData";
import { FFTAFormation } from "../DataWrapper/FFTAFormation";
import { FFTALawSet } from "../DataWrapper/FFTALaw";
import NoiseGenerator from "../utils/NoiseGenerator";
import FFTAItem, { FFTARewardItemSet } from "../DataWrapper/FFTAItem";

/**
 * Sets the story missions interpolate between a minium and maximum value.
 * @param formations - An array of all formations
 * @param liGrimLevel - The desired ending level of the final boss
 */
export function lerpStoryMissionLevels(formations: Array<FFTAFormation>, liGrimLevel: number) {
  // Create lerp function
  let lerp = (min: number, max: number, value: number) => {
    return min * (1 - value) + max * value;
  };
  // Interpolate the max level for all Story Missions
  for (var i = 3; i < 33; i++) {
    formations[i].units.forEach((unit) => {
      unit.setLevel(Math.ceil(lerp(1, liGrimLevel, i)));
    });
  }
  // Set remaining missions to scale
  for (var i = 33; i < formations.length; i++) {
    formations[i].units.forEach((unit) => {
      unit.setLevel(0);
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
        unit.setLevel(0);
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
        unit.setLevel(0);
      });
    }
  });

  // Change ASM to use highest member level
  fftaData.rom.set([0x50, 0x79, 0xa0, 0x42], 0xca088);
  fftaData.rom.set([0xdd, 0x04, 0x1c, 0x00, 0x00, 0x00, 0x00], 0xca08d);
  fftaData.rom.set([0x20, 0x1c], 0xca0aa);
}

/**
 * Sets all missions to give a certain amount of AP.
 * @param missions - An array of all missions
 * @param apBoost - The AP to set
 */
export function apBoost(missions: Array<FFTAMission>, apBoost: number) {
  missions.forEach((mission) => {
    mission.setAPReward(apBoost);
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
 * @param noiseGenerator - The {@link NoiseGenerator} for the randomizer.
 */
export function shuffleLaws(lawSets: Array<FFTALawSet>, noiseGenerator: NoiseGenerator) {
  const numberLaws = 20;
  const lawSize = 2;
  let allLaws: Array<number> = [];

  // Get all laws into one array
  lawSets.forEach((set) => {
    for (var i = 0; i < numberLaws; i++) {
      let offset = lawSize * i;
      allLaws.push(FFTAUtils.convertShortUint8Array(set.properties.slice(offset, offset + 2), true));
    }
  });

  // Sort the array randomly
  allLaws.sort((a, b) => {
    return noiseGenerator.randomBit() === 1 ? 1 : -1;
  });

  // For every law, write it back to the correct space
  allLaws.forEach((law, i) => {
    let newLaw = FFTAUtils.getShortUint8Array(allLaws[i], true);
    lawSets[Math.floor(i / numberLaws)].properties.set(newLaw, (i * lawSize) % (numberLaws * lawSize));
  });
}

/**
 * Changes mission rewards to appear in different sets.
 * @param rewardSets - An array of all reward sets
 * @param noiseGenerator - The {@link NoiseGenerator} for the randomizer
 */
export function shuffleRewards(rewardSets: Array<FFTARewardItemSet>, noiseGenerator: NoiseGenerator) {
  const numberRewards = 20;
  const rewardSize = 2;
  let allRewards: Array<number> = [];

  // Get all reward items into one array
  rewardSets.forEach((set) => {
    for (var i = 0; i < numberRewards; i++) {
      let offset = rewardSize * i;
      allRewards.push(FFTAUtils.convertShortUint8Array(set.properties.slice(offset, offset + 2), true));
    }
  });

  // Sort the array randomly
  allRewards.sort((a, b) => {
    return noiseGenerator.randomBit() == 1 ? 1 : -1;
  });

  // For every reward item, write it back to the correct space
  allRewards.forEach((reward, i) => {
    let newLaw = FFTAUtils.getShortUint8Array(allRewards[i], true);
    rewardSets[Math.floor(i / numberRewards)].properties.set(newLaw, (i * rewardSize) % (numberRewards * rewardSize));
  });
}

/**
 * Changes mission rewards to random items.
 * @param rewardSets - An array of all reward sets
 * @param noiseGenerator - The {@link NoiseGenerator} for the randomizer
 */
export function randomRewards(rewardSets: Array<FFTARewardItemSet>, items: Array<FFTAItem>, rng: NoiseGenerator) {
  const numberRewards = 20;
  const rewardSize = 2;
  // Get all reward items into one array
  rewardSets.forEach((set) => {
    for (var i = 0; i < numberRewards; i++) {
      let offset = rewardSize * i;
      let randomItemID = rng.randomIntRange(1, items.length);
      let randomItemUint8Array = FFTAUtils.getShortUint8Array(randomItemID, true);
      set.properties.set(randomItemUint8Array, offset);
    }
  });
}
