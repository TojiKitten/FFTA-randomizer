import { FFTARaceAbility } from "../ffta/ability/FFTARaceAbility";
import { RaceMap } from "../ffta/FFTAData";
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

export function unlockAllJobs(jobs: RaceMap<FFTAJob>) {
  let allJobs = [jobs.Human, jobs.Bangaa, jobs.NuMou, jobs.Viera, jobs.Moogle];

  allJobs.forEach((race) => {
    race.forEach((job) => {
      job.setRequirements(0x0);
    });
  });
}

export function lockAllJobs(jobs: RaceMap<FFTAJob>) {
  let allJobs = [jobs.Human, jobs.Bangaa, jobs.NuMou, jobs.Viera, jobs.Moogle];

  allJobs.forEach((race) => {
    race.forEach((job) => {
      job.setRequirements(0x20);
    });
  });
}

export function changeRaceAbilities(
  raceAbilities: RaceMap<FFTARaceAbility>,
  rng: NoiseGenerator,
  shuffled: boolean
) {
  // Get an array of abilities sorted by type for each race
  let abilityRecord = sortedRaceAbilities(raceAbilities);
  // For each race's abilities, change the ID, name, and cost to a matching ability type
  // Based on shuffle setting, remove "used" abilities or not
  let abilityState;
  let allRaceAbilities = [raceAbilities.Human, raceAbilities.Bangaa, raceAbilities.NuMou, raceAbilities.Viera, raceAbilities.Moogle];

  allRaceAbilities.forEach((iter) =>{
    abilityState = abilityReplace(iter, abilityRecord, rng, shuffled);
    iter = abilityState.randomizedAbilities;
    abilityRecord = abilityState.newSortedAbilities
  })
}

export function shuffleAbilities(
  raceAbilities: RaceMap<FFTARaceAbility>,
  rng: NoiseGenerator
) {
  let abilityRecord: Array<Array<FFTARaceAbility>> = [[], [], [], [], [], []];

  // Map all abilities according to their type
  raceAbilities.Human.forEach((ability) => {
    abilityRecord[ability.getAbilityType()].push(ability);
  });
  raceAbilities.Bangaa.forEach((ability) => {
    abilityRecord[ability.getAbilityType()].push(ability);
  });
  raceAbilities.NuMou.forEach((ability) => {
    abilityRecord[ability.getAbilityType()].push(ability);
  });
  raceAbilities.Viera.forEach((ability) => {
    abilityRecord[ability.getAbilityType()].push(ability);
  });
  raceAbilities.Moogle.forEach((ability) => {
    abilityRecord[ability.getAbilityType()].push(ability);
  });

  abilityRecord.forEach((array) => {
    array.sort((a, b) => {
      return rng.randomBit() === 1 ? 1 : -1;
    });
  });

  // For each race's abilities, change the ID, name, and cost to a matching ability type
  raceAbilities.Human.forEach((ability) => {
    let type = abilityRecord[ability.getAbilityType()];
    let newAbility = type.pop();
    if (newAbility) {
      ability.properties = newAbility.properties;
    } else {
      throw new Error("Ran out of abilities");
    }
  });
  raceAbilities.Bangaa.forEach((ability) => {
    let type = abilityRecord[ability.getAbilityType()];
    let newAbility = type.pop();
    if (newAbility) {
      ability.properties = newAbility.properties;
    } else {
      throw new Error("Ran out of abilities");
    }
  });
  raceAbilities.NuMou.forEach((ability) => {
    let type = abilityRecord[ability.getAbilityType()];
    let newAbility = type.pop();
    if (newAbility) {
      ability.properties = newAbility.properties;
    } else {
      throw new Error("Ran out of abilities");
    }
  });
  raceAbilities.Viera.forEach((ability) => {
    let type = abilityRecord[ability.getAbilityType()];
    let newAbility = type.pop();
    if (newAbility) {
      ability.properties = newAbility.properties;
    } else {
      throw new Error("Ran out of abilities");
    }
  });
  raceAbilities.Moogle.forEach((ability) => {
    let type = abilityRecord[ability.getAbilityType()];
    let newAbility = type.pop();
    if (newAbility) {
      ability.properties = newAbility.properties;
    } else {
      throw new Error("Ran out of abilities");
    }
  });
}


function sortedRaceAbilities(raceAbilities: RaceMap<FFTARaceAbility>)
{
  let abilityRecord: Array<FFTARaceAbility> = [];

  // Map all abilities according to their type
  raceAbilities.Human.forEach((ability) => {
    abilityRecord.push(ability);
  });
  raceAbilities.Bangaa.forEach((ability) => {
    abilityRecord.push(ability);
  });
  raceAbilities.NuMou.forEach((ability) => {
    abilityRecord.push(ability);
  });
  raceAbilities.Viera.forEach((ability) => {
    abilityRecord.push(ability);
  });
  raceAbilities.Moogle.forEach((ability) => {
    abilityRecord.push(ability);
  });

  return abilityRecord;
}

function abilityReplace(raceAbilities:Array<FFTARaceAbility>, sortedAbilities:Array<FFTARaceAbility>, rng: NoiseGenerator, shuffle:boolean)
{
  console.log(raceAbilities);
  //console.log(sortedAbilities);
  raceAbilities.forEach((ability) => {
    // Iterate through all abilities and filter to matching ability types
    let type = sortedAbilities.filter((iter) =>{iter.getAbilityType() === ability.getAbilityType()});
    let abilityIndex = rng.randomIntMax(type.length - 1);
    ability.properties = type[abilityIndex].properties;
    if(shuffle) sortedAbilities.splice(abilityIndex, 1);
  });
  return {randomizedAbilities: raceAbilities, newSortedAbilities: sortedAbilities};
}