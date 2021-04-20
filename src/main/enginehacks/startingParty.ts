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
  let newJob = getNewJob(options.race, options.job, raceJobs, unit, rng);
  unit.setJob(newJob.jobId);
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
  // get set of random abilities and master them
  let mastered: Array<number> = getRandomAbilityIDs(
    newJob,
    unit,
    options.masteredAbilities,
    rng
  );
  mastered.forEach((ability) => {
    unit.setMasterAbility(ability, true);
  });
}

function getNewJob(
  raceString: string,
  jobString: string,
  raceJobs: RaceMap<FFTAJob>,
  unit: FFTAUnit,
  rng: NoiseGenerator
): FFTAJob {
  let allowedJobs = getAvailableJobs(raceString, raceJobs);
  if (allowedJobs.length === 0) throw new Error("No allowed jobs");
  if (jobString === "random") {
    let randomJob = allowedJobs[rng.randomIntMax(allowedJobs.length - 1)];
    return randomJob;
  }
  let selectedJob = allowedJobs.find(
    (job) =>
      job.displayName?.replaceAll(" ", "").toLowerCase() ===
      jobString.toLowerCase()
  );
  if (!selectedJob) throw new Error(jobString + " not found");
  return selectedJob;
}

function getAvailableJobs(race: string, raceJobs: RaceMap<FFTAJob>) {
  let allowedJobs: Array<FFTAJob> = [];
  switch (race) {
    case "human":
      allowedJobs = raceJobs.Human.filter((job) => job.allowed === true);
      break;
    case "bangaa":
      allowedJobs = raceJobs.Bangaa.filter((job) => job.allowed === true);
      break;
    case "nuMou":
      allowedJobs = raceJobs.NuMou.filter((job) => job.allowed === true);
      break;
    case "viera":
      allowedJobs = raceJobs.Viera.filter((job) => job.allowed === true);
      break;
    case "moogle":
      allowedJobs = raceJobs.Moogle.filter((job) => job.allowed === true);
      break;
    default:
      allowedJobs = allowedJobs.concat(
        raceJobs.Human.filter((job) => job.allowed === true)
      );
      allowedJobs = allowedJobs.concat(
        raceJobs.Bangaa.filter((job) => job.allowed === true)
      );
      allowedJobs = allowedJobs.concat(
        raceJobs.NuMou.filter((job) => job.allowed === true)
      );
      allowedJobs = allowedJobs.concat(
        raceJobs.Viera.filter((job) => job.allowed === true)
      );
      allowedJobs = allowedJobs.concat(
        raceJobs.Moogle.filter((job) => job.allowed === true)
      );
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
    if (job.isTypeAllowed(iter)) {
      if (!randomized) {
        validWeapons.push(typedWeapons[0]);
        continue;
      }
      typedWeapons.forEach((element) => {
        validWeapons.push(element);
      });
    }
  }

  //get validArmor
  for (let iter = ITEMTYPES.Armor; iter <= ITEMTYPES.Robe; iter++) {
    let typedArmor = items.filter((item) => item.getType() === iter);
    if (job.isTypeAllowed(iter)) {
      if (!randomized) {
        validArmor.push(typedArmor[0]);
        continue;
      }
      typedArmor.forEach((element) => {
        validArmor.push(element);
      });
    }
  }

  //find valid weapon from validweapons array and find the correct index for full item array
  let subWeaponID = rng.randomIntMax(validWeapons.length - 1);
  let weaponID = items.findIndex(
    (element) => element === validWeapons[subWeaponID]
  );
  loadout.push(weaponID + 1); //+1 because item ids start at 1 not 0 NotLikeThis

  enum FEMALEONLY {
    CACHUSHA = "Cachusha",
    BARETTE = "Barette",
    RIBBON = "Ribbon",
    MINERVAPLATE = "Minerva Plate",
    RUBBERSUIT = "Rubber Suit",
  }

  //find valid armor from validArmors array and find the correct index for full item array
  //doesnt allow for female only items right now
  let subArmorID = 0;
  do {
    subArmorID = rng.randomIntMax(validArmor.length - 1);
  } while (validArmor[subArmorID].displayName! in FEMALEONLY);

  let armorID = items.findIndex(
    (element) => element === validArmor[subWeaponID]
  );
  loadout.push(armorID + 1); //+1 because item ids start at 1 not 0 NotLikeThis

  if (
    validWeapons[subWeaponID].getWorn() == 1 &&
    job.isTypeAllowed(ITEMTYPES.Shield)
  ) {
    let shieldID = items.findIndex(
      (item) => item.getType() === ITEMTYPES.Shield
    );
    loadout.push(shieldID + 1); //+1 because item ids start at 1 not 0 NotLikeThis
  }

  //fill empty item slots
  while (loadout.length < 5) {
    loadout.push(0);
  }
  return loadout;
}

function getRandomAbilityIDs(
  job: FFTAJob,
  unit: FFTAUnit,
  count: number,
  rng: NoiseGenerator
): Array<number> {
  let abilityIndicies: Array<number> = [];
  count = count <= job.abilityLimit ? count : job.abilityLimit; //check for ability limit on per job bases
  //get "count" amount of random abilities no doubles
  while (abilityIndicies.length < count) {
    let abilityIndex = rng.randomIntMax(job.abilityLimit);
    if (!abilityIndicies.includes(abilityIndex)) {
      abilityIndicies.push(abilityIndex);
    }
  }
  return abilityIndicies;
}
