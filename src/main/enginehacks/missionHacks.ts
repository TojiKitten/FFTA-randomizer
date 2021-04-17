import { FFTAMission } from "../ffta/mission/FFTAMission";

import FFTAData from "../ffta/FFTAData";
import { FFTAFormation } from "../ffta/formation/FFTAFormation";
import { FFTALawSet } from "../ffta/item/FFTALaw";
import NoiseGenerator from "../ffta/NoiseGenerator";
import { forEach } from "lodash";

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
  // Set noise generator position for consistency
  noiseGenerator.setPosition(1000);

  let allLaws: Array<Uint8Array> = [];
  // Get all laws into one array
  lawSets.forEach((set) => {
    for (var i = 0; i < set.properties.length; i += 2) {
      allLaws.push(set.properties.slice(i, i+2));
    }
  });

  allLaws.sort((a, b) => {
    return noiseGenerator.randomBit() == 1 ? 1 : -1;
  });

  lawSets.forEach((set,j) => {
    for (var i = 0; i < set.properties.length; i += 2) {
      set.properties.set(allLaws[(i/2) + (j*(set.properties.length/2))], i);
    }
    console.log(set.properties);
  });
}
