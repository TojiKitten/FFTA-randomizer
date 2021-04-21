import { FFTAAbility } from "../ffta/ability/FFTAAbility";
import { FFTARaceAbility } from "../ffta/ability/FFTARaceAbility";
import { FFTAJob } from "../ffta/job/FFTAJob";
import NoiseGenerator from "../ffta/NoiseGenerator";

export function percentageMPRegen(rom: Uint8Array) {
  const codeInject = [
    0x0a,
    0x21,
    0xaf,
    0xf0,
    0x10,
    0xfb,
    0x04,
    0x1c,
    0x46,
    0x46,
    0x70,
    0x68,
    0x00,
    0x68,
    0x15,
    0x21,
    0x34,
    0xf0,
    0xff,
    0xfe,
    0x24,
    0x18,
    0x70,
    0x68,
    0x00,
    0x68,
    0x16,
    0x21,
    0x34,
    0xf0,
    0xf9,
    0xfe,
    0x25,
    0x1c,
    0x84,
    0x42,
    0x02,
    0xd9,
    0x05,
    0x1c,
  ];

  rom.set([0x16], 0x9308c);
  rom.set(codeInject, 0x93092);
}

// Set jobs to have no requirements
export function unlockAllJobs(jobs: Map<string, Array<FFTAJob>>) {
  for(let jobsElement of jobs.values()){
    jobsElement.forEach((job) => {
      job.setRequirements(0x0);
    });
  }
}

// Set jobs to have impossible requirements
export function lockAllJobs(jobs: Map<string, Array<FFTAJob>>) {
  for(let jobsElement of jobs.values()){
    jobsElement.forEach((job) => {
      job.setRequirements(0x20);
    });
  }
}

export function changeRaceAbilities(
  raceAbilities: Map<string, Array<FFTARaceAbility>>,
  rng: NoiseGenerator,
  shuffled: boolean
): Map<string, Array<FFTARaceAbility>> {
  // Get an array of all race abilities
  // For randomized case, abilities that appear multiple times are more likely to appear
  // Examples: Fire, Shield Bearer, Counter, Bow Combo
  let abilityRecord = flattenRaceMapAbilities(raceAbilities);

  // Set up a new map with new abilities to return
  let newMap: Map<string, Array<FFTARaceAbility>> = new Map();

   for(let [key, value] of raceAbilities){
    let abilityState = abilityReplace(value, abilityRecord, rng, shuffled);
    newMap.set(key,abilityState.randomizedAbilities)
    abilityRecord = abilityState.newSortedAbilities;
  }

  return newMap;
}

function flattenRaceMapAbilities(raceAbilities: Map<string, Array<FFTARaceAbility>>) {
  let abilityRecord: Array<FFTARaceAbility> = [];

  // Map all abilities according to their type
  // Add to new array
  for(let abilities of raceAbilities.values()){
    abilities.forEach((ability) => {
      abilityRecord.push(ability);
    });
  }
  return abilityRecord;
}

function abilityReplace(
  raceAbilities: Array<FFTARaceAbility>,
  sortedAbilities: Array<FFTARaceAbility>,
  rng: NoiseGenerator,
  shuffle: boolean
) {
  // Create a new array to store new abilities
  let newRaceAbilities: Array<FFTARaceAbility> = [];

  // Randomize each ability in the passed in list
  raceAbilities.forEach((ability) => {
    // Iterate through all abilities and filter to matching ability types
    // Removes duplicates
    // Shuffled case, sortedAbilities gets smaller and smaller
    let type = sortedAbilities.filter((iter, i) => {
      return (
        iter.getAbilityType() === ability.getAbilityType() &&
        sortedAbilities.indexOf(iter) === i
      );
    });

    // Get a random valid ability and its information
    let abilityIndex = rng.randomIntMax(type.length - 1);
    let selectedAbility = type[abilityIndex];
    let name = selectedAbility.displayName ? selectedAbility.displayName : "";
    // Create a new ability and add it to the new list
    newRaceAbilities.push(
      new FFTARaceAbility(ability.memory, name, selectedAbility.properties)
    );

    // If shuffling abilities, remove the selected ability from the list
    // Uses memory address for duplicate case
    if (shuffle && sortedAbilities.length > 0) {
      let globalIndex: number = sortedAbilities.findIndex((iter) => {
        return iter.memory === selectedAbility.memory;
      });
      if (globalIndex === -1) throw new Error("Couldn't find ability index");
      sortedAbilities.splice(globalIndex, 1);
    }
  });

  return {
    randomizedAbilities: newRaceAbilities,
    newSortedAbilities: sortedAbilities,
  };
}

