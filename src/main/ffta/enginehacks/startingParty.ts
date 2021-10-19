import { getShortUint8Array, getWordUint8Array } from "../utils/FFTAUtils";
import { FFTAUnit } from "../DataWrapper/FFTAUnit";
import { FFTAItem, ITEMTYPES } from "../DataWrapper/FFTAItem";
import { FFTAJob } from "../DataWrapper/FFTAJob";
import NoiseGenerator from "../utils/NoiseGenerator";
import { FFTARaceAbility, ABILITYTYPE } from "../DataWrapper/FFTARaceAbility";

/**
 * Sets starting gold to a value.
 * @param rom - A buffer holding FFTA
 * @param gold - The gold to start with
 */
export function setStartingGold(rom: Uint8Array, gold: number) {
  rom.set(getWordUint8Array(gold, true), 0x986c);
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
  raceAbilities: Map<string, FFTARaceAbility[]>,
  options: {
    name: string;
    raceChangeable: boolean;
    race: string;
    job: string;
    rngEquip: boolean;
    level: number;
    masteredAbilities: number;
    masterType: string;
  },
  rng: NoiseGenerator
) {
  unit.level = options.level;
  // Change Job
  let newJob = getNewJob(options.race, options.job, raceJobs, rng);
  unit.jobID = newJob.jobId;
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

  if (options.masteredAbilities > 0 && options.name != "NPC") {
    // get set of random abilities and master them
    let mastered: Array<number> = new Array<number>();
    switch (options.masterType) {
      case "abilities":
        mastered = getRandomAbilityIDs(
          newJob,
          unit,
          options.masteredAbilities,
          rng
        );
        break;
      case "jobs":
        mastered = getJobMasteryAbilityIDs(
          unit,
          raceJobs.get(newJob.race)!,
          raceAbilities.get(newJob.race)!,
          options.masteredAbilities,
          rng
        );
        break;
    }
    mastered.forEach((ability) => {
      unit.setMasterAbility(ability, true);
    });
  }

  if (options.name === "NPC") {
    for (var i = 0; i < 0x8c; i++) {
      unit.setMasterAbility(i, false);
    }
    unit.reaction = 0;
    unit.support = 0;
    // Clear out A Ability unless it is "Blank Card"
    if (unit.AAbilityID != 0x4d) unit.AAbilityID = 0;

    let mastered = getEnemyMasteryAbilityIDs(
      unit,
      raceJobs.get(newJob.race)!,
      raceAbilities.get(newJob.race)!,
      options.masteredAbilities,
      rng
    );

    mastered.forEach((ability) => {
      unit.setMasterAbility(ability, true);
    });
  }
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
    let typedWeapons = items.filter((item) => item.itemType === iter);
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
    let typedArmor = items.filter((item) => item.itemType === iter);
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

  if (randomized) {
    validWeapons.filter((weapon) => weapon.allowed);
    validArmor.filter((armor) => armor.allowed);
  }

  //find valid weapon from validweapons array and find the correct index for full item array
  let weaponID = rng.randomIntMax(validWeapons.length - 1);
  loadout.push(validWeapons[weaponID].itemID);

  const FEMALEONLY = [
    "Cachusha",
    "Barette",
    "Ribbon",
    "Minerva Plate",
    "Rubber Suit",
    "Tiara",
  ];

  //find valid armor from validArmors array and find the correct index for full item array
  //doesnt allow for female only items right now
  validArmor = validArmor.filter(
    (armor) => !FEMALEONLY.includes(armor.displayName!)
  );
  let armorID = rng.randomIntMax(validArmor.length - 1);
  loadout.push(validArmor[armorID].itemID);

  if (validWeapons[weaponID].worn == 1 && job.isTypeAllowed(ITEMTYPES.Shield)) {
    let shieldID = items.findIndex(
      (item) => item.itemType === ITEMTYPES.Shield
    );
    loadout.push(items[shieldID].itemID);
  }

  //fill empty item slots with nothing if not randomized
  if (!randomized) {
    while (loadout.length < 5) {
      if (!randomized) {
        loadout.push(0);
      }
    }
  } else {
    const additionalItemTypes = [
      ITEMTYPES.Helmet,
      ITEMTYPES.Hat,
      ITEMTYPES.Shoes,
      ITEMTYPES.Armlet,
      ITEMTYPES.Accessory,
    ];

    const allowedItemTypes = additionalItemTypes.filter((type) =>
      job.isTypeAllowed(type)
    );

    while (loadout.length < 5) {
      // Get a random item type
      const selectedType = allowedItemTypes.splice(
        rng.randomIntMax(allowedItemTypes.length - 1),
        1
      )[0];
      // For the item type, get all items that are allowed and not in viera only
      const itemsForType = items.filter(
        (item) =>
          item.itemType === selectedType &&
          item.allowed &&
          !FEMALEONLY.includes(item.displayName!)
      );
      // get a random item from all items
      const selectedItem =
        itemsForType[rng.randomIntMax(itemsForType.length - 1)];
      // Push to loadout
      loadout.push(selectedItem.itemID);
    }
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

function getJobMasteryAbilityIDs(
  unit: FFTAUnit,
  raceJobs: Array<FFTAJob>,
  raceAbilities: Array<FFTARaceAbility>,
  count: number,
  rng: NoiseGenerator
): Array<number> {
  let abilityIndicies: Array<number> = [];
  let unusedJobs: Array<FFTAJob> = [...raceJobs];

  count = count <= raceJobs.length ? count : raceJobs.length;

  // Master Unit's job
  const firstJob = raceJobs.find((job) => job.jobId === unit.jobID);
  if (firstJob != undefined) {
    // Add non duplicate A-Abilities
    abilityIndicies = abilityIndicies.concat(
      removeDuplicateIndicies(firstJob.getAbilityIDs(), raceAbilities, [
        ABILITYTYPE.ACTION0,
      ])
    );
    unusedJobs = unusedJobs.filter((job) => firstJob.jobId != job.jobId);
  } else throw new Error("Job Mastery Error: First Job not found");

  if (count >= 2 && unit.AAbilityID != 0x4d) {
    const secondJob = unusedJobs[rng.randomIntMax(unusedJobs.length - 1)];
    if (secondJob != undefined) {
      abilityIndicies = abilityIndicies.concat(
        removeDuplicateIndicies(secondJob.getAbilityIDs(), raceAbilities, [
          ABILITYTYPE.ACTION0,
        ])
      );
      unit.AAbilityID = secondJob.jobId;
      unusedJobs = unusedJobs.filter((job) => secondJob.jobId != job.jobId);
    } else throw new Error("Job Mastery Error: Second Job not found");
  }

  if (count >= 3) {
    for (var i = 2; i < count; i++) {
      const additionalJob = unusedJobs[rng.randomIntMax(unusedJobs.length - 1)];
      if (additionalJob != undefined) {
        abilityIndicies = abilityIndicies.concat(
          removeDuplicateIndicies(
            additionalJob.getAbilityIDs(),
            raceAbilities,
            [ABILITYTYPE.ACTION0]
          )
        );
        unusedJobs = unusedJobs.filter(
          (job) => additionalJob.jobId != job.jobId
        );
      } else throw new Error("Job Mastery Error: Second Job not found");
    }
  }
  abilityIndicies = removeDuplicateIndicies(abilityIndicies, raceAbilities, [
    ABILITYTYPE.SUPPORT,
    ABILITYTYPE.REACTION,
    ABILITYTYPE.COMBO,
  ]);
  return abilityIndicies;
}

/**
 *
 * @param abilityIndicies The list of ability indicies to check
 * @param raceAbilities The abilities for the race
 * @param types The types to check for duplicates
 * @returns The list of ability indicies that are not duplicates of the passed in types. Abilities that are not duplicate checked are not removed.
 */
function removeDuplicateIndicies(
  abilityIndicies: Array<number>,
  raceAbilities: Array<FFTARaceAbility>,
  types: Array<number>
) {
  let potentialMastered = abilityIndicies.map((index) => {
    return raceAbilities[index];
  });

  let nonDuplicate: Array<number> = [];

  abilityIndicies.forEach((index, n) => {
    // Push index if we aren't checking the type
    if (types && !types.includes(potentialMastered[n].type)) {
      nonDuplicate.push(index);
    }
    // Otherwise, check to see if this ability appears later in the list
    else {
      const remainingAbilities = potentialMastered.slice(n + 1);
      const remainingAbilityNames = remainingAbilities.map(
        (ability: FFTARaceAbility) => {
          if (ability) return ability.displayName;
        }
      );

      if (!remainingAbilityNames.includes(potentialMastered[n].displayName)) {
        nonDuplicate.push(index);
      }
    }
  });

  return nonDuplicate;
}

function getEnemyMasteryAbilityIDs(
  unit: FFTAUnit,
  raceJobs: Array<FFTAJob>,
  raceAbilities: FFTARaceAbility[],
  count: number,
  rng: NoiseGenerator
): Array<number> {
  let abilityIndicies: Array<number> = [];
  let unusedJobs: Array<FFTAJob> = [...raceJobs];

  // Get Unit's Primary job
  const firstJob = raceJobs.find((job) => job.jobId === unit.jobID);
  if (firstJob != undefined) {
    abilityIndicies = abilityIndicies.concat(firstJob.getAbilityIDs());
    unusedJobs = unusedJobs.filter((job) => firstJob.jobId != job.jobId);
  } else throw new Error("Job Mastery Error: First Job not found");

  // Get Unit's Secondary job
  // 0x4d prevents us from changing "Blank Card"
  if (unit.AAbilityID != 0x4d) {
    const secondJob = unusedJobs[rng.randomIntMax(unusedJobs.length - 1)];
    if (secondJob != undefined) {
      abilityIndicies = abilityIndicies.concat(secondJob.getAbilityIDs());
      unit.AAbilityID = secondJob.jobId;
      unusedJobs = unusedJobs.filter((job) => secondJob.jobId != job.jobId);
    } else throw new Error("Job Mastery Error: Second Job not found");
  }
  abilityIndicies = abilityIndicies.filter(
    (abilityID) => rng.randomIntRange(1, 100) <= count
  );

  const masteredAbilities = abilityIndicies.map(
    (abilityID) => raceAbilities[abilityID]
  );

  // Finds the first valid ability from all mastered abilities of the specified type
  const getAbilityByType = (abilityType: ABILITYTYPE): number => {
    const validAbility = masteredAbilities.find(
      (ability) => ability.type === abilityType
    );
    if (validAbility != undefined) {
      return (
        raceAbilities.findIndex(
          (ability) => ability.displayName === validAbility.displayName
        ) + 1
      );
    } else {
      return 0;
    }
  };

  unit.reaction = getAbilityByType(ABILITYTYPE.REACTION);
  unit.support = getAbilityByType(ABILITYTYPE.SUPPORT);

  return abilityIndicies;
}
