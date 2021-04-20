import { FFTAMission } from "../ffta/mission/FFTAMission";
import * as FFTAUtils from "../ffta/FFTAUtils";
import FFTAData from "../ffta/FFTAData";
import { FFTAFormation } from "../ffta/formation/FFTAFormation";
import { FFTALawSet } from "../ffta/item/FFTALaw";
import NoiseGenerator from "../ffta/NoiseGenerator";
import FFTAItem, { FFTARewardItemSet } from "../ffta/item/FFTAItem";

export function lerpStoryMissionLevels(
  formations: Array<FFTAFormation>,
  liGrimLevel: number
) {
  // Create lerp function
  let lerp = (min: number, max: number, value: number) => {
    return min * (1 - value) + max * value;
  };
  // Interpolate the max level for all Story Missions
  for (var i = 3; i < 33; i++) {
    formations[i].units.forEach((unit) => {
      unit.setLevel(Math.floor(lerp(1, liGrimLevel, i)));
    });
  }
  // Set remaining missions to scale
  for (var i = 33; i < formations.length; i++) {
    formations[i].units.forEach((unit) => {
      unit.setLevel(0);
    });
  }
}

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

export function apBoost(missions: Array<FFTAMission>, apBoost: number) {
  missions.forEach((mission) => {
    mission.setAPReward(apBoost);
  });
}

export function frostyMageBoost(rom: Uint8Array) {
  rom.set([0x32], 0x53fb63);
  rom.set([0x32], 0x53fb93);
}

export function noJudgeTurn(rom: Uint8Array) {
  rom.set([0x0], 0x522f4d);
  rom.set([0x0], 0x522f81);
  rom.set([0x0], 0x522fb5);
}

export function shuffleLaws(
  lawSets: Array<FFTALawSet>,
  noiseGenerator: NoiseGenerator
) {
  const numberLaws = 20;
  const lawSize = 2;
  let allLaws: Array<number> = [];

  // Get all laws into one array
  lawSets.forEach((set) => {
    for (var i = 0; i < numberLaws; i++) {
      let offset = lawSize * i;
      allLaws.push(
        FFTAUtils.convertShortUint8Array(
          set.properties.slice(offset, offset + 2),
          true
        )
      );
    }
  });

  // Sort the array randomly
  allLaws.sort((a, b) => {
    return noiseGenerator.randomBit() === 1 ? 1 : -1;
  });

  // For every law, write it back to the correct space
  allLaws.forEach((law, i) => {
    let newLaw = FFTAUtils.getShortUint8Array(allLaws[i], true);
    lawSets[Math.floor(i / numberLaws)].properties.set(
      newLaw,
      (i * lawSize) % (numberLaws * lawSize)
    );
  });
}

export function shuffleRewards(
  rewardSets: Array<FFTARewardItemSet>,
  noiseGenerator: NoiseGenerator
) {
  const numberRewards = 20;
  const rewardSize = 2;
  let allRewards: Array<number> = [];

  // Get all reward items into one array
  rewardSets.forEach((set) => {
    for (var i = 0; i < numberRewards; i++) {
      let offset = rewardSize * i;
      allRewards.push(
        FFTAUtils.convertShortUint8Array(
          set.properties.slice(offset, offset + 2),
          true
        )
      );
    }
  });

  // Sort the array randomly
  allRewards.sort((a, b) => {
    return noiseGenerator.randomBit() == 1 ? 1 : -1;
  });

  // For every reward item, write it back to the correct space
  allRewards.forEach((reward, i) => {
    let newLaw = FFTAUtils.getShortUint8Array(allRewards[i], true);
    rewardSets[Math.floor(i / numberRewards)].properties.set(
      newLaw,
      (i * rewardSize) % (numberRewards * rewardSize)
    );
  });
}

export function randomRewards(
  rewardSets: Array<FFTARewardItemSet>,
  items: Array<FFTAItem>,
  rng: NoiseGenerator
) {
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
