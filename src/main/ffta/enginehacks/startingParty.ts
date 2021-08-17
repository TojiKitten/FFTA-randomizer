import { getShortUint8Array } from "../utils/FFTAUtils";
import { FFTAUnit } from "../DataWrapper/FFTAUnit";
import { FFTAItem, ITEMTYPES } from "../DataWrapper/FFTAItem";
import { FFTAJob } from "../DataWrapper/FFTAJob";
import NoiseGenerator from "../utils/NoiseGenerator";

/**
 * Sets starting gold to a value.
 * @param rom - A buffer holding FFTA
 * @param gold - The gold to start with
 */
export function setStartingGold(rom: Uint8Array, gold: number) {
  rom.set(getShortUint8Array(gold, true), 0x986c);
}

/**
 * Sets unit data for the starting party to the values from the randomizer UI
 * @param unit - The unit to change
 * @param raceJobs - All Race Jobs
 * @param items - All items
 * @param options - The options from UI
 * @param rng - The {@link NoiseGenerator} for the randomizer
 */
export function setUnitData(
  unit: FFTAUnit,
  raceJobs: Map<string, Array<FFTAJob>>,
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
  let newJob = getNewJob(options.race, options.job, raceJobs, rng);
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

/**
 * Changes the job of a unit to a new value
 * @param raceString - The name of the race
 * @param jobString - The name of the job of the race
 * @param raceJobs - All race jobs
 * @param rng - The {@link NoiseGenerator} for the randomizer
 * @returns - The selected job for the unit
 */
function getNewJob(
  raceString: string,
  jobString: string,
  raceJobs: Map<string, Array<FFTAJob>>,
  rng: NoiseGenerator
): FFTAJob {
  const raceStrings = ["human", "bangaa", "nuMou", "viera", "moogle"];
  // If the race is included in the list, get the available jobs
  // If race is not included in the list, get a random race and then the jobs

  let allowedJobs = raceStrings.includes(raceString)
    ? getAvailableJobs(raceString, raceJobs)
    : getAvailableJobs(
        raceStrings[rng.randomIntMax(rng.randomIntMax(raceStrings.length - 1))],
        raceJobs
      );

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
  if (!selectedJob) {
    throw new Error(jobString + " not found");
  }
  return selectedJob;
}

/**
 * Gets an array of jobs that are allowed
 * @param race - The race of jobs to check
 * @param raceJobs - All race jobs
 * @returns An array of jobs that are allowed
 */
function getAvailableJobs(race: string, raceJobs: Map<string, Array<FFTAJob>>) {
  let allowedJobs: Array<FFTAJob> = [];
  if (raceJobs.has(race)) {
    allowedJobs = raceJobs.get(race)!.filter((job) => job.allowed === true);
  } else {
    for (let jobs of raceJobs.values()) {
      allowedJobs = allowedJobs.concat(
        jobs.filter((job) => job.allowed === true)
      );
    }
  }
  return allowedJobs;
}

///
///randomizer = false, pick starting weapon of class; true pick random valid weapon
///
/**
 * Given a job, builds a loadout weapon and armor loadout for the job of only allowed items.
 * @param job - The job of the loadout
 * @param items - An array of all items
 * @param randomized - Determines a random items or the first items of each item type used
 * @param rng - The {@link NoiseGenerator} for the randomizer
 * @returns An array of the items for a unit
 */
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
  loadout.push(armorID + items[0].ITEMIDOFFSET); //+1 because item ids start at 1 not 0 NotLikeThis

  if (
    validWeapons[subWeaponID].getWorn() == 1 &&
    job.isTypeAllowed(ITEMTYPES.Shield)
  ) {
    let shieldID = items.findIndex(
      (item) => item.getType() === ITEMTYPES.Shield
    );
    loadout.push(shieldID + items[0].ITEMIDOFFSET); //+1 because item ids start at 1 not 0 NotLikeThis
  }

  //fill empty item slots
  while (loadout.length < 5) {
    loadout.push(0);
  }
  return loadout;
}

/**
 * Returns an array of abilities to master for a race.
 * @param job - The job of the unit
 * @param unit - The unit
 * @param count - The number of abilities to master
 * @param rng - The {@link NoiseGenerator} for the randomizer
 * @returns An array of abilities to master
 */
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
