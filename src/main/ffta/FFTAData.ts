import { FFTAItem, FFTARewardItemSet } from "./DataWrapper/FFTAItem";
import * as FFTAUtils from "./utils/FFTAUtils";
import { FFTAFormation } from "./DataWrapper/FFTAFormation";
import { FFTARaceAbility } from "./DataWrapper/FFTARaceAbility";
import { FFTAAbility } from "./DataWrapper/FFTAAbility";
import { FFTAJob } from "./DataWrapper/FFTAJob";
import { FFTALaw, FFTALawSet } from "./DataWrapper/FFTALaw";
import { FFTAMission } from "./DataWrapper/FFTAMission";
import * as CutsceneHacks from "./enginehacks/cutsceneskip";
import * as MissionHacks from "./enginehacks/missionHacks";
import * as StartingPartyHacks from "./enginehacks/startingParty";
import * as JobHacks from "./enginehacks/jobHacks";
import * as ItemHacks from "./enginehacks/itemHacks";
import * as ForcedHacks from "./enginehacks/forcedHacks";
import NoiseGenerator from "./utils/NoiseGenerator";
import { JobSettingsState } from "_/renderer/components/RandomizerProvider";

export enum RACES {
  Human = "human",
  Bangaa = "bangaa",
  NuMou = "nuMou",
  Viera = "viera",
  Moogle = "moogle",
}

type MemorySpace = {
  readonly offset: number;
  readonly byteSize: number;
  readonly length: Number;
};

type RaceAbilitySpaces = {
  readonly Human: MemorySpace;
  readonly Bangaa: MemorySpace;
  readonly NuMou: MemorySpace;
  readonly Viera: MemorySpace;
  readonly Moogle: MemorySpace;
};

type RaceJobSpaces = {
  readonly Human: MemorySpace;
  readonly Bangaa: MemorySpace;
  readonly NuMou: MemorySpace;
  readonly Viera: MemorySpace;
  readonly Moogle: MemorySpace;
};

type StringTableSpaces = {
  readonly ItemNames: MemorySpace;
  readonly AbilitityNames: MemorySpace;
  readonly MissionNames: MemorySpace;
  readonly Animations: MemorySpace;
};

type FFTAMemoryMap = {
  readonly PointerTables: StringTableSpaces;
  readonly RaceAbilities: RaceAbilitySpaces;
  readonly RaceJobs: RaceJobSpaces;
  readonly Items: MemorySpace;
  readonly Formations: MemorySpace;
  readonly Abilities: MemorySpace;
  readonly LawSets: MemorySpace;
  readonly RewardSets: MemorySpace;
  readonly Missions: MemorySpace;
};

const FFTAMap: FFTAMemoryMap = {
  RaceAbilities: {
    Human: {
      offset: 0x51bb6c, // Human
      byteSize: 0x8,
      length: 0x8c, // There's more than this, but some of those are judge abilities
    },
    Bangaa: {
      offset: 0x51bfdc, // Bangaa
      byteSize: 0x8,
      length: 0x4c,
    },
    NuMou: {
      offset: 0x51c244, // Nu Mou
      byteSize: 0x8,
      length: 0x5e,
    },
    Viera: {
      offset: 0x51c53c, // Viera
      byteSize: 0x8,
      length: 0x54,
    },
    Moogle: {
      offset: 0x51c7e4, // Moogle
      byteSize: 0x8,
      length: 0x57,
    },
  },
  RaceJobs: {
    Human: {
      offset: 0x521a7c, // Human
      byteSize: 0x34,
      length: 11, // There's more than this, but some of those are judge abilities
    },
    Bangaa: {
      offset: 0x521cb8, // Bangaa
      byteSize: 0x34,
      length: 7,
    },
    NuMou: {
      offset: 0x521e24, // Nu Mou
      byteSize: 0x34,
      length: 8,
    },
    Viera: {
      offset: 0x521fc4, // Viera
      byteSize: 0x34,
      length: 8,
    },
    Moogle: {
      offset: 0x522164, // Moogle
      byteSize: 0x34,
      length: 8,
    },
  },
  PointerTables: {
    ItemNames: {
      offset: 0x526680,
      byteSize: 0x4,
      length: 753,
    },
    AbilitityNames: {
      offset: 0x5567f0,
      byteSize: 0x4,
      length: 767,
    },
    MissionNames: {
      offset: 0x55a650,
      byteSize: 0x4,
      length: 396,
    },
    Animations: {
      offset: 0x390e44,
      byteSize: 0x4,
      length: 248,
    },
  },
  Items: {
    offset: 0x51d1a0,
    byteSize: 0x20,
    length: 375,
  },
  Formations: {
    offset: 0x54d1a0, //Starts at 0x54CD90, but this is Starting Party address
    byteSize: 0x28,
    length: 414, // Accounts for starting at Starting Party address
  },
  Abilities: {
    offset: 0x55187c,
    byteSize: 0x1c,
    length: 0x15a,
  },
  LawSets: {
    offset: 0x528e1c,
    byteSize: 0x28,
    length: 7,
  },
  RewardSets: {
    offset: 0x529494,
    byteSize: 0x28,
    length: 8,
  },
  Missions: {
    offset: 0x55ae4c,
    byteSize: 0x46,
    length: 396,
  },
};
const allowedWeaponAddress = 0x51d0f4;
const allowedWeaponSize = 0x4;

/**
 * Only one of these should exist. Hold all data for FFTA used by the randomizer.
 */
export class FFTAData {
  rom: Uint8Array;
  items: Array<FFTAItem>;
  itemJobNames: Array<string>;
  abilityNames: Array<string>;
  missionNames: Array<string>;
  animations: Array<Array<number>>;
  formations: Array<FFTAFormation>;
  missions: Array<FFTAMission>;
  raceAbilities: Map<string, Array<FFTARaceAbility>>;
  abilities: Array<FFTAAbility>;
  jobs: Map<string, Array<FFTAJob>>;

  lawSets: Array<FFTALawSet>;
  rewardItemSets: Array<FFTARewardItemSet>;
  rng: NoiseGenerator;

  constructor(buffer: Uint8Array) {
    this.rom = buffer;
    this.itemJobNames = this.initializeItemNames();
    this.abilityNames = this.initializeAbilityNames();
    this.missionNames = this.initializeMissionNames();
    this.animations = this.initializeAnimations();
    this.items = this.initializeItems();
    this.formations = this.initializeFormations();
    this.missions = this.initializeMissions();
    this.raceAbilities = this.initializeRaceAbilities();
    this.abilities = this.initializeAbilities();
    this.jobs = this.initializeJobs();
    this.lawSets = this.initializeLawSets();
    this.rewardItemSets = this.initializeRewardItemSets();
    this.rng = new NoiseGenerator();
  }

  /**
   * The current seed
   * @returns RNG Seed
   */
  getSeed(): number {
    return this.rng.seed;
  }

  /**
   * Sets the seed to a new value and resets position
   * @param seed - New seed
   */
  setSeed(seed: number): void {
    this.rng.setSeed(seed);
  }

  /**
   * Write all data back to the buffer.
   */
  writeData(): void {
    this.items.forEach((item) => {
      this.rom.set(item.properties, item.memory);
    });

    this.formations.forEach((formation) => {
      this.rom.set(formation.properties, formation.memory);
      formation.units.forEach((unit) => {
        this.rom.set(unit.properties, unit.memory);
      });
    });

    this.missions.forEach((mission) => {
      this.rom.set(mission.properties, mission.memory);
    });

    for (let raceAbilitiesElement of this.raceAbilities.values()) {
      raceAbilitiesElement.forEach((raceAbility) => {
        this.rom.set(raceAbility.properties, raceAbility.memory);
      });
    }

    this.abilities.forEach((ability) => {
      this.rom.set(ability.properties, ability.memory);
    });

    for (let jobsElement of this.jobs.values()) {
      jobsElement.forEach((job) => {
        this.rom.set(job.properties, job.memory);
      });
    }

    this.lawSets.forEach((lawSet) => {
      this.rom.set(lawSet.properties, lawSet.memory);
    });

    this.rewardItemSets.forEach((rewardSet) => {
      this.rom.set(rewardSet.properties, rewardSet.memory);
    });
  }

  /**
   * Loads item names into an array
   * @returns An array of item names
   */
  initializeItemNames(): Array<string> {
    let names: Array<string> = [];
    let dataType = FFTAMap.PointerTables.ItemNames;

    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let stringLookupTable: Uint8Array = this.rom.slice(
        memory,
        memory + dataType.byteSize
      );
      let address = FFTAUtils.getLittleEndianAddress(stringLookupTable);

      let startingByte = address;
      let endingByte = startingByte;
      do {
        endingByte += 0x01;
      } while (this.rom[endingByte] !== 0);

      names.push(
        FFTAUtils.decodeFFTAText(this.rom.slice(startingByte, endingByte))
      );
    }

    return names;
  }

  /**
   * Loads ability names into an array
   * @returns Array of ability names
   */
  initializeAbilityNames(): Array<string> {
    let names: Array<string> = [];
    let dataType = FFTAMap.PointerTables.AbilitityNames;

    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let stringLookupTable: Uint8Array = this.rom.slice(
        memory,
        memory + dataType.byteSize
      );
      let address = FFTAUtils.getLittleEndianAddress(stringLookupTable);
      let startingByte = address;
      let endingByte = startingByte;
      do {
        endingByte += 0x01;
      } while (this.rom[endingByte] !== 0);

      names.push(
        FFTAUtils.decodeFFTAText(this.rom.slice(startingByte, endingByte))
      );
    }
    return names;
  }

  /**
   * Loads mission names into an array
   * @returns Array of mission names
   */
  initializeMissionNames(): Array<string> {
    let names: Array<string> = [];
    let dataType = FFTAMap.PointerTables.MissionNames;

    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let stringLookupTable: Uint8Array = this.rom.slice(
        memory,
        memory + dataType.byteSize
      );
      let address = FFTAUtils.getLittleEndianAddress(stringLookupTable);
      let startingByte = address;
      let endingByte = startingByte;
      do {
        endingByte += 0x01;
      } while (this.rom[endingByte] !== 0);

      names.push(
        FFTAUtils.decodeFFTAText(this.rom.slice(startingByte, endingByte))
      );
    }
    return names;
  }

  /**
   * Loads animation pointers into an array
   * @returns An array of animation pointers
   */
  initializeAnimations(): Array<Array<number>> {
    let animations: Array<Array<number>> = [];
    let dataType = FFTAMap.PointerTables.Animations;
    let animationLookup: Array<number> = [];

    // Get an array of all of the pointers to the array of animation pointers for a given unit/job
    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let encodedPointer: Uint8Array = this.rom.slice(
        memory,
        memory + dataType.byteSize
      );
      animationLookup.push(FFTAUtils.getLittleEndianAddress(encodedPointer));
    }

    // For each pointer, add the array of animation pointers to the overall list
    animationLookup.forEach((pointer, i) => {
      let unitAnimations: Array<number> = [];
      let animationCount: number;

      // Doing this, since the last pointer has no offset to reference. Manually verified where it ends
      if (i + 1 > animationLookup.length - 1) {
        animationCount = (0x390e44 - pointer) / dataType.byteSize;
      } else if (pointer == animationLookup[i + 1]) {
        animationCount = 0x1;
      } else {
        animationCount = (animationLookup[i + 1] - pointer) / dataType.byteSize;
      }

      // For each address in this range, save it to an array
      for (var i = 0; i < animationCount; i++) {
        let currentAddress = pointer + dataType.byteSize * i;
        let encodedPointer: Uint8Array = this.rom.slice(
          currentAddress,
          currentAddress + dataType.byteSize
        );
        unitAnimations.push(FFTAUtils.getLittleEndianAddress(encodedPointer));
      }
      animations.push(unitAnimations);
    });
    return animations;
  }

  /**
   * Loads items
   * @returns An array of items
   */
  initializeItems(): Array<FFTAItem> {
    let items: Array<FFTAItem> = [];
    let dataType = FFTAMap.Items;

    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let newItem = new FFTAItem(
        memory,
        this.itemJobNames[(this.rom[memory + 1] << 8) | this.rom[memory]],
        this.rom.slice(memory, memory + dataType.byteSize)
      );
      items.push(newItem);

      /*
      0x520080 is the memory address of item abilities
      0x14 is the size of each item abilities
      0x00 is the offset for number of item abilities, and 0x01 is an alignment
      0x02 - 0x14 are pairs of Job ID, Ability ID 
      */
      let itemAbilitiesSize = 0x14;
      let abilityOffset =
        0x520080 + newItem.getAbilitySet() * itemAbilitiesSize;
      newItem.updateItemAbilities(
        this.rom.slice(abilityOffset, abilityOffset + itemAbilitiesSize)
      );
    }
    return items;
  }

  /**
   * Loads formations
   * @returns An array of formations
   */
  initializeFormations(): Array<FFTAFormation> {
    let formations: Array<FFTAFormation> = [];
    let dataType = FFTAMap.Formations;

    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let newFormation = new FFTAFormation(
        memory,
        this.rom.slice(memory, memory + dataType.byteSize)
      );
      newFormation.loadUnits(
        this.rom.slice(newFormation.unitStart, newFormation.unitEnd)
      );
      formations.push(newFormation);
    }
    return formations;
  }

  /**
   * Loads missions
   * @returns An array of missions
   */
  initializeMissions(): Array<FFTAMission> {
    let items: Array<FFTAMission> = [];
    let dataType = FFTAMap.Missions;

    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let newItem = new FFTAMission(
        memory,
        this.missionNames[(this.rom[memory + 1] << 8) | this.rom[memory]],
        this.rom.slice(memory, memory + dataType.byteSize)
      );
      items.push(newItem);
    }
    return items;
  }

  /**
   * Loads race abilities for all races
   * @returns A map of Race Abilities, by race
   */
  initializeRaceAbilities(): Map<string, Array<FFTARaceAbility>> {
    let outAbilities: Map<string, Array<FFTARaceAbility>> = new Map();
    let dataType = FFTAMap.RaceAbilities;
    let races: Map<string, MemorySpace> = new Map();
    races.set(RACES.Human, dataType.Human);
    races.set(RACES.Bangaa, dataType.Bangaa);
    races.set(RACES.NuMou, dataType.NuMou);
    races.set(RACES.Viera, dataType.Viera);
    races.set(RACES.Moogle, dataType.Moogle);

    for (let [race, raceData] of races) {
      let raceAbilities: Array<FFTARaceAbility> = [];
      for (var iter = 0; iter < raceData.length; iter++) {
        let memoryOffset = raceData.offset + raceData.byteSize * iter;
        let abilityName =
          this.abilityNames[
            (this.rom[memoryOffset + 1] << 8) | this.rom[memoryOffset]
          ];
        let abilityProperties = this.rom.slice(
          memoryOffset,
          memoryOffset + raceData.byteSize
        );
        let newAbility = new FFTARaceAbility(
          memoryOffset,
          abilityName,
          abilityProperties
        );
        raceAbilities.push(newAbility);
      }
      outAbilities.set(race, raceAbilities);
    }
    return outAbilities;
  }

  /**
   * Loads abilities
   * @returns An array of abilities
   */
  initializeAbilities() {
    let abilities: Array<FFTAAbility> = [];
    let dataType = FFTAMap.Abilities;

    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let newAbility = new FFTAAbility(
        memory,
        this.abilityNames[(this.rom[memory + 1] << 8) | this.rom[memory]],
        this.rom.slice(memory, memory + dataType.byteSize)
      );
      abilities.push(newAbility);
    }
    return abilities;
  }

  /**
   * Loads jobs, by race
   * @returns A map of Jobs, by race
   */
  initializeJobs(): Map<string, Array<FFTAJob>> {
    let outJobs: Map<string, Array<FFTAJob>> = new Map();
    let dataType = FFTAMap.RaceJobs;
    let races: Map<string, MemorySpace> = new Map();
    races.set(RACES.Human, dataType.Human);
    races.set(RACES.Bangaa, dataType.Bangaa);
    races.set(RACES.NuMou, dataType.NuMou);
    races.set(RACES.Viera, dataType.Viera);
    races.set(RACES.Moogle, dataType.Moogle);

    let abilityLimits = [0x8c, 0x4c, 0x5e, 0x54, 0x57];
    let allJobs: Array<Array<FFTAJob>> = [];
    let jobID = 2; // ID of Soldier

    let abilityLimitIter = 0;
    for (let [race, raceData] of races) {
      let raceJobs: Array<FFTAJob> = [];
      for (var i = 0; i < raceData.length; i++) {
        let memory = raceData.offset + raceData.byteSize * i;
        let newJob = new FFTAJob(
          memory,
          jobID,
          this.itemJobNames[(this.rom[memory + 1] << 8) | this.rom[memory]],
          race,
          this.rom.slice(memory, memory + raceData.byteSize)
        );

        let allowedMemory =
          allowedWeaponAddress + allowedWeaponSize * newJob.getAllowedWeapons();
        newJob.allowedWeapons = this.rom.slice(
          allowedMemory,
          allowedMemory + allowedWeaponSize
        );
        newJob.abilityLimit = abilityLimits[abilityLimitIter];
        raceJobs.push(newJob);
        jobID++;
      }
      outJobs.set(race, raceJobs);
      abilityLimitIter++;
    }

    return outJobs;
  }

  /**
   * Loads law sets
   * @returns An array of law sets
   */
  initializeLawSets(): Array<FFTALawSet> {
    let lawSets: Array<FFTALawSet> = [];
    let dataType = FFTAMap.LawSets;

    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let newLawSet = new FFTALawSet(
        memory,
        this.rom.slice(memory, memory + dataType.byteSize)
      );
      lawSets.push(newLawSet);
    }
    return lawSets;
  }

  /**
   * Loads mission reward item sets
   * @returns An array of reward item sets
   */
  initializeRewardItemSets(): Array<FFTARewardItemSet> {
    let rewardItemSets: Array<FFTARewardItemSet> = [];
    let dataType = FFTAMap.RewardSets;

    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let newItemSet = new FFTARewardItemSet(
        memory,
        this.rom.slice(memory, memory + dataType.byteSize)
      );
      rewardItemSets.push(newItemSet);
    }
    return rewardItemSets;
  }

  /**
   * Updates missions to scale enemy levels
   * @param option - Type of scaling
   * @param level - Level to use for lerp scaling
   */
  handleMissionScaling(option: string, level: number) {
    switch (option) {
      case "normal":
        break;
      case "lerp":
        MissionHacks.lerpStoryMissionLevels(this.formations, level);
        break;
      case "average":
        MissionHacks.averageMissionLevels(this.formations);
        break;
      case "highest":
        MissionHacks.highestMissionLevels(this);
        break;
      default:
        throw new Error("case: " + option + " unhandled!");
    }
  }

  /**
   * Sets AP for missions, or skips if AP is 0
   * @param option - The value of AP to set
   */
  handleAPBoost(option: number) {
    if (option > 0) {
      MissionHacks.apBoost(this.missions, option);
    }
  }

  /**
   * Changes starting gold to the given value
   * @param option - Amount of starting gold
   */
  handleStartingGold(option: number) {
    StartingPartyHacks.setStartingGold(this.rom, option);
  }

  /**
   * Sets orbs of frosty mage to level 50
   * @param option - Enable flag
   */
  handleFrostyBoost(option: boolean) {
    if (option) MissionHacks.frostyMageBoost(this.rom);
  }

  /**
   * Sets judge speed to 0
   * @param option - Enable flag
   */
  handleNoJudgeTurn(option: boolean) {
    if (option) MissionHacks.noJudgeTurn(this.rom);
  }

  /**
   * Locks or unlocks jobs
   * @param option - State of job requirements
   */
  handleJobRequirements(option: string) {
    switch (option) {
      case "normal":
        break;
      case "unlocked":
        JobHacks.unlockAllJobs(this.jobs);
        break;
      case "locked":
        JobHacks.lockAllJobs(this.jobs);
        break;
      default:
        throw new Error("case: " + option + " unhandled!");
    }
  }

  /**
   * Shuffles order that laws appear
   * @param option - State of law sets
   */
  handleLawOptions(option: string) {
    this.rng.setPosition(1000);
    switch (option) {
      case "normal":
        break;
      case "shuffled":
        MissionHacks.shuffleLaws(this.lawSets, this.rng);
        break;
      default:
        throw new Error("Law case: " + option + " unhandled!");
    }
  }

  /**
   * Shuffles or randomizes mission item rewards
   * @param option - State of mission item rewards
   */
  handleRewardOptions(option: string) {
    this.rng.setPosition(1200);
    switch (option) {
      case "normal":
        break;
      case "random":
        MissionHacks.randomRewards(this.rewardItemSets, this.items, this.rng);
        break;
      case "shuffled":
        MissionHacks.shuffleRewards(this.rewardItemSets, this.rng);
        break;
      default:
        throw new Error("Reward case: " + option + " unhandled!");
    }
  }

  /**
   * Sets MP to recover 10% per turn instead of flat 5 MP
   * @param option - Enable the option
   */
  handlePercentageMP(option: string) {
    if (option != "normal") JobHacks.percentageMPRegen(this.rom);
  }

  /**
   * Skips some cutscenes in the game, optionally skip first two missions
   * @param option - State of cut scene
   */
  handleCutScene(option: string) {
    switch (option) {
      case "all":
        break;
      case "none":
        this.rom = CutsceneHacks.skipCutscenes(this.rom, false);
        break;
      case "noTutorial":
        this.rom = CutsceneHacks.skipCutscenes(this.rom, true);
        break;
      default:
        throw new Error("case: " + option + " unhandled!");
    }
  }

  /**
   * Removes jobs from randomization pool
   * @param jobMapOption - All jobs and state of removal
   */
  handleDisableJobs(jobSettings: JobSettingsState) {
    const raceKeys = ["human", "bangaa", "nuMou", "viera", "moogle"];

    raceKeys.forEach((key) => {
      let uiJobs = [...jobSettings[key as keyof typeof jobSettings]];
      let fftaJobs = this.jobs.get(key);
      uiJobs.forEach((job: { jobName: string; enabled: boolean }, id) => {
        fftaJobs![id].setAllowed(job.enabled);
      });
    });
  }

  /**
   * Changes abilities that units are able to learn through shuffling or randomness
   * @param options - State of unit abilities
   */
  handleUnitAbilities(options: string) {
    this.rng.setPosition(1300);
    switch (options) {
      case "normal":
        break;
      case "shuffled":
        this.raceAbilities = JobHacks.changeRaceAbilities(
          this.raceAbilities,
          this.rng,
          true
        );
        ForcedHacks.animationFixRaw(this.rom);
        break;
      case "random":
        this.raceAbilities = JobHacks.changeRaceAbilities(
          this.raceAbilities,
          this.rng,
          false
        );
        ForcedHacks.animationFixRaw(this.rom);
        break;
    }
  }

  /**
   * Updates each starting member according to the randomizer UI
   * @param options - Randomizer UI selected options
   */
  handlePartyMembers(
    partyRNGEnabled: boolean,
    options: Array<{
      name: string;
      raceChangeable: boolean;
      race: string;
      job: string;
      rngEquip: boolean;
      level: number;
      masteredAbilities: number;
      masterType: string;
    }>
  ) {
    if (partyRNGEnabled) {
      this.rng.setPosition(2000);
      options.forEach((unit, i) => {
        StartingPartyHacks.setUnitData(
          this.formations[0].units[i],
          this.jobs,
          this.items,
          unit,
          this.rng
        );
      });

      // Set Monty to match Guest Monty
      this.formations[3].units[2].properties = new Uint8Array(
        this.formations[0].units[1].properties
      );
    }
  }

  /**
   * Updates the state of all items appearing in shop
   * @param options - State of shop items
   */
  handleShopItems(options: string) {
    this.rng.setPosition(1100);
    switch (options) {
      case "default":
        break;
      case "limited":
        this.items = ItemHacks.toggleLimitedShopItems(this.items, this.rng);
        break;
      case "random":
        this.items = ItemHacks.toggleRandomShopItems(this.items, this.rng);
        break;
      case "all":
        this.items = ItemHacks.toggleAllShopItems(this.items, true);
        break;
      case "none":
        this.items = ItemHacks.toggleAllShopItems(this.items, false);
        break;
      default:
        throw new Error("case: " + options + " unhandled!");
    }
  }

  /**
   * Runs a set of hacks that cannot be skipped
   */
  runForcedHacks() {}
}

export default FFTAData;
