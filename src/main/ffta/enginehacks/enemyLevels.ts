import FFTAData from "../FFTAData";
import { FFTAFormation } from "../DataWrapper/FFTAFormation";

// Duplicate?

/**
 * Sets the story missions interpolate between a minium and maximum value.
 * @param formations - An array of all formations
 * @param liGrimLevel - The desired ending level of the final boss
 */
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
