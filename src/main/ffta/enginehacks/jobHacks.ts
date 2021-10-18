import { ABILITYTYPE, FFTARaceAbility } from "../DataWrapper/FFTARaceAbility";
import { FFTAJob } from "../DataWrapper/FFTAJob";
import NoiseGenerator from "../utils/NoiseGenerator";

/**
 * Set MP to recover 10% instead of a flat 5 MP per turn
 * @param rom - Buffer holding FFTA
 */
export function percentageMPRegen(rom: Uint8Array) {
  const codeInject = [
    0x0a, 0x21, 0xaf, 0xf0, 0x10, 0xfb, 0x04, 0x1c, 0x46, 0x46, 0x70, 0x68,
    0x00, 0x68, 0x15, 0x21, 0x34, 0xf0, 0xff, 0xfe, 0x24, 0x18, 0x70, 0x68,
    0x00, 0x68, 0x16, 0x21, 0x34, 0xf0, 0xf9, 0xfe, 0x25, 0x1c, 0x84, 0x42,
    0x02, 0xd9, 0x05, 0x1c,
  ];

  rom.set([0x16], 0x9308c);
  rom.set(codeInject, 0x93092);
}

/**
 * Sets all jobs to have no job requirements.
 * @param jobs - An array of all jobs
 */
export function unlockAllJobs(jobs: Map<string, Array<FFTAJob>>) {
  for (let jobsElement of jobs.values()) {
    jobsElement.forEach((job) => {
      job.requirements = 0x0;
    });
  }
}

/**
 * Sets all jobs to have impossible job requirements.
 * @param jobs - An array of all jobs
 */
export function lockAllJobs(jobs: Map<string, Array<FFTAJob>>) {
  for (let jobsElement of jobs.values()) {
    jobsElement.forEach((job) => {
      job.requirements = 0x20;
    });
  }
}

/**
 * Changes the abilities that races learn.
 * @remark When shuffling is true, the same occurences of each ability is maintained as vanilla.
 * When shuffling is false, an ability may appear more or fewer times as compared to vanilla.
 * @param raceAbilities - A map of races and an array of their abilities
 * @param rng - The {@link NoiseGenerator} for the randomizer
 * @param shuffled - The value of shuffling or randomizing
 * @returns A new map of races and an array of their abilities with updated information.
 */
export function changeRaceAbilities(
  raceAbilities: Map<string, Array<FFTARaceAbility>>,
  rng: NoiseGenerator,
  shuffled: boolean
): Map<string, Array<FFTARaceAbility>> {
  // Get an array of all race abilities
  // For randomized case, abilities that appear multiple times are more likely to appear
  // Examples: Fire, Shield Bearer, Counter, Bow Combo
  let abilityRecord = flattenRaceMapAbilities(raceAbilities);

  // Remove banned abilities from the pool
  abilityRecord = abilityRecord.filter((ability) => ability.allowed);

  // If shuffled, replace banned abilities in the pool with allowed abilities
  if (shuffled) {
    let bannedAbilities = flattenRaceMapAbilities(raceAbilities).filter(
      (ability) => !ability.allowed
    );

    let additionalAbilities: Array<FFTARaceAbility> = [];

    // Find a random ability matching the type in Ability Record
    // Replace the banned ability with the random ability and push to abilityRecord
    bannedAbilities.forEach((bannedAbility) => {
      if (bannedAbility.type != ABILITYTYPE.ACTION2) {
        const abilType = bannedAbility.type;
        const typeArray = abilityRecord.filter(
          (iter, i) => iter.type === abilType && iter.allowed
        );

        // Get a random valid ability and its information
        const abilityIndex = rng.randomIntMax(typeArray.length - 1);
        const selectedAbility = typeArray[abilityIndex];
        const name = selectedAbility.displayName
          ? selectedAbility.displayName
          : "";
        // Create a clone of the new ability, set its memory to the ability to replace, and update the name
        let newAbility = new FFTARaceAbility(bannedAbility.memory, name);
        newAbility.copy(selectedAbility);
        additionalAbilities.push(newAbility);
      }
    });
    // Push all new abilities to the ability record
    abilityRecord.push(...additionalAbilities);
  }

  // Set up a new map with new abilities to return
  let newMap: Map<string, Array<FFTARaceAbility>> = new Map();

  for (let [key, value] of raceAbilities) {
    let { randomizedAbilities, newSortedAbilities } = abilityReplace(
      value,
      abilityRecord,
      rng,
      shuffled
    );
    newMap.set(key, randomizedAbilities);
    abilityRecord = newSortedAbilities;
  }

  return newMap;
}

/**
 * Condenses a map Race Abilities keyed by race into a single array
 * @param raceAbilities - A map of Race Abilities
 * @returns
 */
function flattenRaceMapAbilities(
  raceAbilities: Map<string, Array<FFTARaceAbility>>
) {
  let abilityRecord: Array<FFTARaceAbility> = [];

  // Add every race ability to a single array
  for (let abilities of raceAbilities.values()) {
    abilities.forEach((ability) => {
      abilityRecord.push(ability);
    });
  }
  return abilityRecord;
}

/**
 * Changes an array of Race Abilities to have new information
 * @param raceAbilities - The race abilities to change
 * @param sortedAbilities - An array of race abilities to use as a source
 * @param rng - The {@link NoiseGenerator} for the randomizer
 * @param shuffle - The value of shuffling or randomizing
 * @returns Returns an object holding an array of new abilities with updated information, and the list of remaining abilities to use as a source.
 */
function abilityReplace(
  raceAbilities: Array<FFTARaceAbility>,
  sortedAbilities: Array<FFTARaceAbility>,
  rng: NoiseGenerator,
  shuffle: boolean
) {
  // Create a new array to store new abilities
  let newRaceAbilities: Array<FFTARaceAbility> = [];

  // Randomize each ability in the passed in list
  raceAbilities.forEach((ability, n) => {
    // Iterate through all abilities and filter to matching ability types
    // Removes duplicates
    // Shuffled case, sortedAbilities gets smaller and smaller
    const type = sortedAbilities.filter(
      (iter, i) => iter.type === ability.type
    );

    if (ability.type != ABILITYTYPE.ACTION2) {
      // Get a random valid ability and its information
      let abilityIndex = rng.randomIntMax(type.length - 1);
      let selectedAbility = type[abilityIndex];
      let name = selectedAbility.displayName ? selectedAbility.displayName : "";

      // Create a clone of the new ability, set its memory to the ability to replace, and update the name
      let newAbility = new FFTARaceAbility(ability.memory, name);
      newAbility.copy(selectedAbility);
      newRaceAbilities.push(newAbility);
      newAbility.apCost = selectedAbility.apCost;

      // If shuffling abilities, remove the selected ability from the list
      // Uses memory address for duplicate case
      if (shuffle && sortedAbilities.length > 0) {
        let globalIndex: number = sortedAbilities.findIndex((iter) => {
          return iter.memory === selectedAbility.memory;
        });
        if (globalIndex === -1) throw new Error("Couldn't find ability index");
        sortedAbilities.splice(globalIndex, 1);
      }
    }
  });
  return {
    randomizedAbilities: newRaceAbilities,
    newSortedAbilities: sortedAbilities,
  };
}

export function setStaticJobGrowth(jobs: Array<FFTAJob>, rng: NoiseGenerator) {
  jobs.forEach((job) => {
    job.hpBase =
      job.hpBase +
      rng.randomIntMax(
        Math.ceil((job.hpGrowth - Math.floor(job.hpGrowth)) * 50)
      );
    job.mpBase =
      job.mpBase +
      rng.randomIntMax(
        Math.ceil((job.mpGrowth - Math.floor(job.mpGrowth)) * 50)
      );
    job.speedBase =
      job.speedBase +
      rng.randomIntMax(
        Math.ceil((job.speedGrowth - Math.floor(job.speedGrowth)) * 50)
      );
    job.attackBase =
      job.attackBase +
      rng.randomIntMax(
        Math.ceil((job.attackGrowth - Math.floor(job.attackGrowth)) * 50)
      );
    job.defenseBase =
      job.defenseBase +
      rng.randomIntMax(
        Math.ceil((job.defenseGrowth - Math.floor(job.defenseGrowth)) * 50)
      );
    job.powerBase =
      job.powerBase +
      rng.randomIntMax(
        Math.ceil((job.powerGrowth - Math.floor(job.powerGrowth)) * 50)
      );
    job.resistanceBase =
      job.resistanceBase +
      rng.randomIntMax(
        Math.ceil(
          (job.resistanceGrowth - Math.floor(job.resistanceGrowth)) * 50
        )
      );

    job.hpGrowth = Math.floor(job.hpGrowth);
    job.mpGrowth = Math.floor(job.mpGrowth);
    job.speedGrowth = Math.floor(job.speedGrowth);
    job.attackGrowth = Math.floor(job.attackGrowth);
    job.defenseGrowth = Math.floor(job.defenseGrowth);
    job.powerGrowth = Math.floor(job.powerGrowth);
    job.resistanceGrowth = Math.floor(job.resistanceGrowth);
  });
}
