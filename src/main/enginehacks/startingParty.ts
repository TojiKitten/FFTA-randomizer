import { RaceMap } from "../ffta/FFTAData";
import { getShortUint8Array } from "../ffta/FFTAUtils";
import { FFTAUnit } from "../ffta/formation/FFTAUnit";
import FFTAItem from "../ffta/item/FFTAItem";
import { FFTAJob } from "../ffta/job/FFTAJob";
import NoiseGenerator from "../ffta/NoiseGenerator";
import * as FFTAUtils from "../ffta/FFTAUtils";

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
  let newLoadout: Array<number> = getValidLoadOut(
    newJob,
    items,
    options.rngEquip,
    rng
  );
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
      if (
        job.displayName?.replaceAll(" ", "").toLowerCase() ===
        jobString.toLowerCase()
      ) {
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

function getValidLoadOut(
  job: FFTAJob,
  items: Array<FFTAItem>,
  randomized: boolean,
  rng: NoiseGenerator
) {
  let loadout: Array<number> = [];

  // Filter Items to type
  let itemsByType: Array<Array<FFTAItem>> = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ];

  items.forEach((item) => {
    itemsByType[item.getType()].push(item);
  });

  // Shuffle Items if random equipment
  if (randomized) {
    itemsByType.forEach((type) => {
      type.sort((a, b) => {
        return rng.randomBit() ? 1 : -1;
      });
    });
  }

  enum ItemTypes {
    Null = 0,
    Sword,
    Blade,
    Saber,
    KnightSword,
    GreatSword,
    BroadSword,
    Knife,
    Rapier,
    Katana,
    Staff,
    Rod,
    Mace,
    Bow,
    GreatBow,
    Spear,
    Instrument,
    Knuckle,
    Soul,
    Gun,
    Shield,
    Helmet,
    Ribbon,
    Hat,
    Armor,
    Cloth,
    Robe,
    Shoes,
    Armlet,
    Accessory,
    Consumable,
  }

  let validWeapons: Array<FFTAItem> = [];
  let validArmor: Array<FFTAItem> = [];
  // Get Random Valid Weapon

  itemsByType.forEach((type, i) => {
    if (
      type.length > 0 &&
      type[0].getType() <= ItemTypes.Gun &&
      job.isTypeAllowed(type[0].getType())
    ) {
      validWeapons.push(type[0]);
    }
    if (
      type.length > 0 &&
      type[0].getType() >= ItemTypes.Armor &&
      type[0].getType() <= ItemTypes.Robe &&
      job.isTypeAllowed(type[0].getType())
    ) {
      validArmor.push(type[0]);
    }
  });

  let weapon = validWeapons[rng.randomIntMax(validWeapons.length - 1)];
  loadout.push(weapon.itemID);

  enum FEMALEONLY {
    CACHUSHA = "Cachusha",
    BARETTE = "Barette",
    RIBBON = "Ribbon",
    MINERVAPLATE = "Minerva Plate",
    RUBBERSUIT = "Rubber Suit",
  }

  let armor; 
  do{
    armor = validArmor[rng.randomIntMax(validArmor.length - 1)];
  }while(armor.displayName && armor.displayName in FEMALEONLY)
  
  loadout.push(armor.itemID);

  if (weapon.getWorn() == 1 && job.isTypeAllowed(ItemTypes.Shield)) {
    let shield = itemsByType[ItemTypes.Shield][0];
    loadout.push(shield.itemID);
  }

  while (loadout.length < 5) {
    loadout.push(0);
  }

  return loadout;
}

function masteredAbilities(
  job: FFTAJob,
  unit: FFTAUnit,
  count: number,
  rng: NoiseGenerator
) {
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
