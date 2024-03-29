import { FFTAItem, FFTARewardItemSet, ITEMTYPES } from "./DataWrapper/FFTAItem";
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
import * as AnimationHacks from "./enginehacks/animationHacks";
import NoiseGenerator from "./utils/NoiseGenerator";
import {
  JobSettingsState,
  RandomizerState,
} from "_/renderer/components/RandomizerProvider";
import { FFTAUnit } from "./DataWrapper/FFTAUnit";

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
      offset: 0x55a64c,
      byteSize: 0x4,
      length: 0x196,
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
    length: 0x196,
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
      item.write(this.rom);
    });

    this.formations.forEach((formation) => {
      formation.write(this.rom);
      formation.units.forEach((unit) => {
        unit.write(this.rom);
      });
    });

    this.missions.forEach((mission) => {
      mission.write(this.rom);
    });

    for (let raceAbilitiesElement of this.raceAbilities.values()) {
      raceAbilitiesElement.forEach((raceAbility) => {
        raceAbility.write(this.rom);
      });
    }

    this.abilities.forEach((ability) => {
      ability.write(this.rom);
    });

    for (let jobsElement of this.jobs.values()) {
      jobsElement.forEach((job) => {
        job.write(this.rom);
      });
    }
    this.lawSets.forEach((lawSet) => {
      lawSet.write(this.rom);
    });
    this.rewardItemSets.forEach((rewardSet) => {
      rewardSet.write(this.rom);
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
        i + 1,
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
      let abilityOffset = 0x520080 + newItem.abilitySet * itemAbilitiesSize;
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
          allowedWeaponAddress + allowedWeaponSize * newJob.allowedWeaponsID;
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

  handleSeed(seed: number) {
    this.rom.set(FFTAUtils.getWordUint8Array(seed, true), 0xa3991c);
  }

  /**
   * Sets abilities to be not allowed, which removes them from random ability pools.
   * @param bannedAbilities The ID's of abilities to be banned
   */
  handleBannedAbilities(bannedAbilities: Array<string>) {
    const bannedRaceAbilities: Array<FFTARaceAbility> = Array.from(
      this.raceAbilities.entries()
    )
      .map((entry) => entry[1])
      .flat()
      .filter((ability) => bannedAbilities.includes(ability.displayName!));

    bannedRaceAbilities.forEach((ability) => (ability.allowed = false));
  }

  /**
   * Sets items to be not allowed, which removes them from random item pools.
   * @param bannedItems The ID's of items to be banned
   */
  handleBannedItems(bannedItems: Array<number>) {
    const bannedFFTAItems: Array<FFTAItem> = this.items.filter((item) =>
      bannedItems.includes(item.memory)
    );

    bannedFFTAItems.forEach((item) => (item.allowed = false));
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
   * Updates each formation to randomize enemy loadouts
   * @param options - Randomizer UI selected options
   */
  handleRandomEnemies(
    randomEnemies: boolean,
    abilityPercentage: number,
    randomItems: boolean
  ) {
    if (randomEnemies || randomItems) {
      // Randomize non Guest, non monster enemies
      const flatJobs = Array.from(this.jobs.values()).flat();
      for (var i = 3; i < this.formations.length; i++) {
        const formation = this.formations[i];
        formation.units
          .filter(
            (unit) =>
              unit.type === 1 &&
              unit.jobID >= this.jobs.get(RACES.Human)![0].jobId &&
              unit.jobID <=
                this.jobs.get(RACES.Moogle)![
                  this.jobs.get(RACES.Moogle)!.length - 1
                ].jobId
          )
          .forEach((unit) => {
            const currentJob = flatJobs.filter(
              (job) => job.jobId === unit.jobID
            )[0];

            StartingPartyHacks.setUnitData(
              unit,
              this.jobs,
              this.items,
              this.raceAbilities,
              {
                name: "NPC",
                raceChangeable: true,
                race: randomEnemies
                  ? unit.AAbilityID != 0x4d
                    ? "random"
                    : "human"
                  : currentJob.race,
                job: randomEnemies
                  ? "random"
                  : currentJob.displayName![0].toLowerCase() +
                    currentJob.displayName!.substr(1).replaceAll(" ", ""),
                rngEquip: randomItems,
                level: unit.level,
                masteredAbilities: abilityPercentage,
                masterType: "abilities",
              },
              this.rng
            );
          });
      }

      type specialUnitLocation = {
        formation: number;
        position: number;
        race: RACES;
      };
      const guests: Array<specialUnitLocation> = [
        { formation: 6, position: 5, race: RACES.Viera }, // Ritz Cheetah's
        { formation: 6, position: 6, race: RACES.Viera }, // Shara Cheetah's
        { formation: 17, position: 4, race: RACES.Viera }, // Ritz Golden Clock
        { formation: 17, position: 5, race: RACES.Viera }, // Shara Golden Clock
        { formation: 29, position: 0, race: RACES.Viera }, // Ritz Over the Hill
        { formation: 29, position: 1, race: RACES.Viera }, // Shara Over the Hill
      ];

      guests.forEach((unit) => {
        const { formation, position, race } = unit;
        const member = this.formations[formation].units[position];
        const currentJob = flatJobs.filter(
          (job) => job.jobId === member.jobID
        )[0];
        StartingPartyHacks.setUnitData(
          member,
          this.jobs,
          this.items,
          this.raceAbilities,
          {
            name: "NPC",
            raceChangeable: false,
            race: race,
            job: randomEnemies
              ? "random"
              : currentJob.displayName![0].toLowerCase() +
                currentJob.displayName!.substr(1).replaceAll(" ", ""),
            rngEquip: randomItems,
            level: member.level,
            masteredAbilities: abilityPercentage,
            masterType: "abilities",
          },
          this.rng
        );
      });

      StartingPartyHacks.setUnitData(
        this.formations[5].units[1],
        this.jobs,
        this.items,
        this.raceAbilities,
        {
          name: "NPC",
          raceChangeable: false,
          race: RACES.Human,
          job: "thief",
          rngEquip: randomItems,
          level: this.formations[5].units[1].level,
          masteredAbilities: abilityPercentage,
          masterType: "abilities",
        },
        this.rng
      );

      StartingPartyHacks.setUnitData(
        this.formations[25].units[0],
        this.jobs,
        this.items,
        this.raceAbilities,
        {
          name: "NPC",
          raceChangeable: false,
          race: RACES.Bangaa,
          job: "templar",
          rngEquip: randomItems,
          level: this.formations[25].units[0].level,
          masteredAbilities: abilityPercentage,
          masterType: "abilities",
        },
        this.rng
      );
    }
  }

  /**
   * Sets universal AP reward for missions
   * @param apAmount - The amount of AP to reward
   */
  handleAPBoost(apAmount: number) {
    if (apAmount >= 0) {
      this.missions.forEach((mission) => {
        mission.apReward = apAmount;
      });
    }
  }

  /**
   * Sets universal Gil reward for missions
   * @param gilAmount - The amount of Gil to reward
   */
  handleGilReward(gilAmount: number) {
    if (gilAmount >= 0) {
      this.missions.forEach((mission) => {
        mission.gilReward = gilAmount;
      });
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
        MissionHacks.clearMissionJobRequirements(this.missions);
        break;
      default:
        throw new Error("case: " + option + " unhandled!");
    }
  }

  handleRandomJobItems(
    option: boolean,
    weaponCount: number,
    armorCount: number
  ) {
    if (option) {
      const weaponTypes = [
        ITEMTYPES.Sword,
        ITEMTYPES.Blade,
        ITEMTYPES.Saber,
        ITEMTYPES.KnightSword,
        ITEMTYPES.GreatSword,
        ITEMTYPES.BroadSword,
        ITEMTYPES.Knife,
        ITEMTYPES.Rapier,
        ITEMTYPES.Katana,
        ITEMTYPES.Staff,
        ITEMTYPES.Rod,
        ITEMTYPES.Mace,
        ITEMTYPES.Bow,
        ITEMTYPES.GreatBow,
        ITEMTYPES.Spear,
        ITEMTYPES.Instrument,
        ITEMTYPES.Knuckle,
        ITEMTYPES.Soul,
        ITEMTYPES.Gun,
      ];

      const armorTypes = [ITEMTYPES.Armor, ITEMTYPES.Cloth, ITEMTYPES.Robe];

      // Split out additional item types so a valid armor is always assigned
      const additionalTypes = [
        ITEMTYPES.Helmet,
        ITEMTYPES.Hat,
        ITEMTYPES.Shoes,
        ITEMTYPES.Armlet,
        ITEMTYPES.Accessory,
      ];

      weaponCount = Math.max(1, weaponCount);
      armorCount = Math.max(5, armorCount);

      const allJobs = Array.from(this.jobs.values()).flat();
      let randomizedJobs: Array<number> = [];
      allJobs.forEach((job) => {
        if (!randomizedJobs.includes(job.allowedWeaponsID)) {
          randomizedJobs.push(job.allowedWeaponsID);
          let possibleWeaponTypes = [...weaponTypes];
          let possibleArmorTypes = [...armorTypes];

          // Get the pointer to the current allowed item set
          const oldAllowedDataAddress =
            allowedWeaponAddress + allowedWeaponSize * job.allowedWeaponsID;

          // Get the data at the allowed item set pointer
          let newAllowedData = FFTAUtils.convertWordUint8Array(
            this.rom.slice(
              oldAllowedDataAddress,
              oldAllowedDataAddress + allowedWeaponSize
            ),
            true
          );

          // Remove possible weapons from the list until it is within the weapon count
          while (possibleWeaponTypes.length > weaponCount) {
            possibleWeaponTypes.splice(
              this.rng.randomIntMax(possibleWeaponTypes.length),
              1
            );
          }

          // If the weapon count allows for at least 1 body armor, add in additional armor types
          if (armorCount > 1) {
            possibleArmorTypes.push(...additionalTypes);
          }

          // Remove possible armor from the list until it is within the armor count
          while (possibleArmorTypes.length > armorCount) {
            possibleArmorTypes.splice(
              this.rng.randomIntMax(possibleArmorTypes.length),
              1
            );
          }

          // Enable all types
          [...weaponTypes, ...armorTypes].forEach((id) => {
            const allowedBit =
              possibleWeaponTypes.includes(id) ||
              possibleArmorTypes.includes(id)
                ? 1
                : 0;
            const mask = 0x1 << (id - 1);
            newAllowedData =
              (newAllowedData & ~mask) | (allowedBit << (id - 1));
          });

          // Set the data at the pointer to the new values
          this.rom.set(
            FFTAUtils.getWordUint8Array(newAllowedData, true),
            oldAllowedDataAddress
          );

          // Set the data on the job for quick reference in the randomizer
          job.allowedWeapons = FFTAUtils.getWordUint8Array(
            newAllowedData,
            true
          );
        }
      });
    }
  }

  /**
   * Randomizes resistances for each race.
   * @param option - If the option is enabled
   */
  handleRandomResistances(option: boolean) {
    if (option) {
      JobHacks.randomizeElementalResist(this.jobs, this.rng);
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
  handleRandomizedStory(mode: string, length: number) {
    this.rng.setPosition(4000);
    switch (mode) {
      case "normal":
        break;
      case "linear":
        MissionHacks.randomizeLinearStory(this.missions, length, this.rng);
        MissionHacks.clearMissionStatRequirements(this.missions);
        break;
      case "branching":
        //MissionHacks.randomizeBranchingStory(this.missions, length, this.rng);
        break;
      default:
        throw new Error("Reward case: " + mode + " unhandled!");
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
      case "distributed":
        MissionHacks.distributeItems(this.items, this.missions, this.rng);
        break;
      default:
        throw new Error("Reward case: " + option + " unhandled!");
    }
  }

  /**
   * Swaps all mission reward item previews with a ??? bag
   * @param disable - True means Item Preview shows ??? bag, false means vanilla
   */
  handleRewardPreview(disable: boolean) {
    disable ? MissionHacks.hideRewardPreviews(this.missions) : false;
  }

  /**
   * Sets mission recruitment to force a recruit every time
   * @param enable - True means missions will have forced recruits
   */
  handleForcedRecruits(enable: boolean) {
    if (enable) {
      MissionHacks.enableForcedRecruits(this.missions, this.rng);
      ForcedHacks.guaranteeRecruitment(this.rom);
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
        MissionHacks.clearMissionStatRequirements(this.missions);
        break;
      case "noTutorial":
        this.rom = CutsceneHacks.skipCutscenes(this.rom, true);
        MissionHacks.clearMissionStatRequirements(this.missions);
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
      const jobsForRace: any = jobSettings[key as keyof typeof jobSettings];
      let uiJobs = [...jobsForRace];
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
        break;
      case "random":
        this.raceAbilities = JobHacks.changeRaceAbilities(
          this.raceAbilities,
          this.rng,
          false
        );
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
          this.raceAbilities,
          unit,
          this.rng
        );
      });

      // Set Monty to match Guest Monty
      const monty = this.formations[0].units[1];
      this.formations[3].units[2] = Object.create(
        Object.getPrototypeOf(monty),
        Object.getOwnPropertyDescriptors(monty)
      );
    }
  }

  /**
   * Updates the state of all items appearing in shop
   * @param options - State of shop items
   */
  handleShopItems(options: string, randomChance: number) {
    this.rng.setPosition(1100);
    switch (options) {
      case "default":
        break;
      case "limited":
        this.items = ItemHacks.toggleLimitedShopItems(this.items, this.rng);
        break;
      case "random":
        this.items = ItemHacks.toggleRandomShopItems(
          this.items,
          this.rng,
          randomChance
        );
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

  handleRaceMode(raceMode: boolean) {
    if (raceMode) {
      this.rng.setPosition(3000);

      // Set mission items to be fixed from their pool instead of random
      MissionHacks.setStaticRewards(
        this.missions,
        this.rewardItemSets,
        this.rng
      );

      // Set jobs to have fixed stat growths
      // Add flat value to the base stat
      JobHacks.setStaticJobGrowth(
        Array.from(this.jobs.values()).flat(),
        this.rng
      );

      // Disable "Descent" for Li Grim
      this.formations[32].units[0].setMasterAbility(6, false);
    }
  }

  /**
   * Runs a set of hacks that cannot be skipped
   */
  runForcedHacks(options: RandomizerState) {
    ForcedHacks.ASMHacks(this.rom);

    if (options.abilitySettings.abilities != "normal") {
      //ForcedHacks.animationFixRaw(this.rom);
      ForcedHacks.injectAnimationFixes(this.rom);
      AnimationHacks.createNewAnimations(this);
    }
    if (options.jobSettings.jobRequirements != "normal") {
      ForcedHacks.injectUnlockJobs(this.rom);
    }
    if (options.missionSettings.storySetting != "normal") {
      this.rng.setPosition(8000);
      ForcedHacks.randomizeLocations(this.rom, this.rng);
      ForcedHacks.injectAllLocations(this.rom);
      ForcedHacks.stopClans(this.rom);
    }
    if (options.generalSettings.disableClans) {
      ForcedHacks.stopClans(this.rom);
    }
    if (options.generalSettings.quickOptions) {
      ForcedHacks.setQuickOptions(this.rom);
    }
  }
}

export default FFTAData;
