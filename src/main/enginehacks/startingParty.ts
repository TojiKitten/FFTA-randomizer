import { RaceMap } from "../ffta/FFTAData";
import { getShortUint8Array } from "../ffta/FFTAUtils";
import { FFTAUnit } from "../ffta/formation/FFTAUnit";
import { FFTAItem, ITEMTYPES } from "../ffta/item/FFTAItem";
import { FFTAJob } from "../ffta/job/FFTAJob";
import NoiseGenerator from "../ffta/NoiseGenerator";

export function setStartingGold(rom: Uint8Array, gold: number) {
  rom.set(getShortUint8Array(gold, true), 0x986c);
}

export function setUnitData(
  unit: FFTAUnit,
  raceJobs: RaceMap<FFTAJob>,
  items: Array<FFTAItem>,
  options: {
    name: string;
    raceChangeable: boolean;
    race: string;
    job: string;
    rngEquip: boolean;
    level: number;
    masteredAbilities: number;
  },
  rng: NoiseGenerator
) {
  unit.setLevel(options.level);
  // Change Job
  let newJob = changeUnitJob(options.race, options.job, raceJobs, unit, rng);
  // Change Equipment (Make sure it's valid)
  let newLoadout: Array<number> = getValidLoadOut(newJob, items, options.rngEquip, rng);
  newLoadout.forEach((item, i) => {
    unit.setItem(item, i);
  });
  // Set mastered Abilities
  masteredAbilities(newJob, unit, options.masteredAbilities, rng);
}

function changeUnitJob(
  raceString: string,
  jobString: string,
  raceJobs: RaceMap<FFTAJob>,
  unit: FFTAUnit,
  rng: NoiseGenerator
) {
  let allowedJobs = getAvailableJobs(raceString, raceJobs);
  if (allowedJobs.length === 0) throw new Error("No allowed jobs");
  if (jobString === "random") {
    let randomJob = allowedJobs[rng.randomIntMax(allowedJobs.length - 1)];
    unit.setJob(randomJob.jobId);
    return randomJob;
  } else {
    let selectedJob = allowedJobs.filter((job) => {
      if (job.displayName?.replaceAll(" ", "").toLowerCase() === jobString.toLowerCase()) {
        return job;
      }
    });
    if (selectedJob.length === 0) throw new Error(jobString + " not found");
    unit.setJob(selectedJob[0].jobId);
    return selectedJob[0];
  }
}

function getAvailableJobs(race: string, raceJobs: RaceMap<FFTAJob>) {
  let allowedJobs: Array<FFTAJob> = [];
  switch (race) {
    case "human":
      raceJobs.Human.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
    case "bangaa":
      raceJobs.Bangaa.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
    case "nuMou":
      raceJobs.NuMou.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
    case "viera":
      raceJobs.Viera.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
    case "moogle":
      raceJobs.Moogle.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
    default:
      raceJobs.Human.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      raceJobs.Bangaa.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      raceJobs.NuMou.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      raceJobs.Viera.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      raceJobs.Moogle.forEach((job) => {
        if (job.allowed) {
          allowedJobs.push(job);
        }
      });
      break;
  }

  return allowedJobs;
}

///
///randomizer = false, pick starting weapon of class; true pick random valid weapon
///
function getValidLoadOut(
  job: FFTAJob,
  items: Array<FFTAItem>,
  randomized: boolean,
  rng: NoiseGenerator
): Array<number> {
  let loadout: Array<number> = [];

  let validWeapons: Array<FFTAItem> = [];
  let validArmor: Array<FFTAItem> = [];


  //get validWeapons
  for (let iter = 1; iter <= ITEMTYPES.Gun; iter++) {
    let typedWeapons = items.filter((item) => item.getType() === iter);
    typedWeapons.forEach((element) => {
      if (job.isTypeAllowed(element.getType())) {
        validWeapons.push(element);
      }
    });
  }

  //get validArmor
  for (let iter = ITEMTYPES.Armor; iter <= ITEMTYPES.Robe; iter++){
    let typedArmor = items.filter((item) => item.getType() === iter);
    typedArmor.forEach((element) => {
      if (job.isTypeAllowed(element.getType())) {
        validArmor.push(element);
      }
    });
  }


  let weaponID = randomized ? rng.randomIntMax(validWeapons.length - 1) : 0;
  loadout.push(weaponID);

  enum FEMALEONLY {
    CACHUSHA = "Cachusha",
    BARETTE = "Barette",
    RIBBON = "Ribbon",
    MINERVAPLATE = "Minerva Plate",
    RUBBERSUIT = "Rubber Suit",
  }

  //find an allowed armorId for a non FEMALEONLY ITEM
  let armorID = 0;
  do {
    armorID = randomized?rng.randomIntMax(validArmor.length - 1):0;
  } while (validArmor[armorID].displayName! in FEMALEONLY);

  loadout.push(armorID);

  if (validWeapons[weaponID].getWorn() == 1 && job.isTypeAllowed(ITEMTYPES.Shield)) {
    let shieldID = items.findIndex((item) => item.getType() === ITEMTYPES.Shield);
    loadout.push(shieldID);
  }

  //fill empty item slots
  while (loadout.length < 5) {
    loadout.push(0);
  }

  return loadout;
}

function masteredAbilities(job: FFTAJob, unit: FFTAUnit, count: number, rng: NoiseGenerator) {
  let abilityIndicies: Array<number> = [];
  for (var i = 0; i < job.abilityLimit; i++) {
    abilityIndicies.push(i);
  }

  abilityIndicies.sort((a, b) => {
    return rng.randomBit() ? 1 : -1;
  });

  for (var i = 0; i < count && i < job.abilityLimit; i++) {
    unit.setMasterAbility(abilityIndicies[i], true);
  }
}
