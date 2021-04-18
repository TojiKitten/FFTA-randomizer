import { FFTAItem, FFTARewardItemSet } from "./item/FFTAItem";
import * as FFTAUtils from "./FFTAUtils";
import { FFTAFormation } from "./formation/FFTAFormation";
import { FFTARaceAbility } from "./ability/FFTARaceAbility";
import { FFTAAbility } from "./ability/FFTAAbility";
import { FFTAJob } from "./job/FFTAJob";
import { FFTALaw, FFTALawSet } from "./item/FFTALaw";
import { FFTAMission } from "./mission/FFTAMission";
import * as CutsceneHacks from "../enginehacks/cutsceneskip";
import * as MissionHacks from "../enginehacks/missionHacks";
import * as StartingPartyHacks from "../enginehacks/startingParty";
import * as JobHacks from "../enginehacks/jobHacks";
import NoiseGenerator from "./NoiseGenerator";

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

export type RaceMap<Type> = {
  Human: Array<Type>;
  Bangaa: Array<Type>;
  NuMou: Array<Type>;
  Viera: Array<Type>;
  Moogle: Array<Type>;
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

// Only one of these should exist
export class FFTAData {
  rom: Uint8Array;
  items: Array<FFTAItem>;
  itemJobNames: Array<string>;
  abilityNames: Array<string>;
  missionNames: Array<string>;
  animations: Array<Array<number>>;
  formations: Array<FFTAFormation>;
  missions: Array<FFTAMission>;
  raceAbilities: RaceMap<FFTAAbility>;
  abilities: Array<FFTAAbility>;
  jobs: RaceMap<FFTAJob>;
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

  // Verify nothing breaks by Open and Save in Randomizer, then data compare in hex editor to find 0 changes
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

    this.raceAbilities.Human.forEach((raceAbility) => {
      this.rom.set(raceAbility.properties, raceAbility.memory);
    });
    this.raceAbilities.Bangaa.forEach((raceAbility) => {
      this.rom.set(raceAbility.properties, raceAbility.memory);
    });
    this.raceAbilities.NuMou.forEach((raceAbility) => {
      this.rom.set(raceAbility.properties, raceAbility.memory);
    });
    this.raceAbilities.Viera.forEach((raceAbility) => {
      this.rom.set(raceAbility.properties, raceAbility.memory);
    });
    this.raceAbilities.Moogle.forEach((raceAbility) => {
      this.rom.set(raceAbility.properties, raceAbility.memory);
    });

    this.abilities.forEach((ability) => {
      this.rom.set(ability.properties, ability.memory);
    });

    this.jobs.Human.forEach((job) => {
      this.rom.set(job.properties, job.memory);
    });
    this.jobs.Bangaa.forEach((job) => {
      this.rom.set(job.properties, job.memory);
    });
    this.jobs.NuMou.forEach((job) => {
      this.rom.set(job.properties, job.memory);
    });
    this.jobs.Viera.forEach((job) => {
      this.rom.set(job.properties, job.memory);
    });
    this.jobs.Moogle.forEach((job) => {
      this.rom.set(job.properties, job.memory);
    });

    this.lawSets.forEach((lawSet) => {
      this.rom.set(lawSet.properties, lawSet.memory);
    });

    this.rewardItemSets.forEach((rewardSet) => {
      this.rom.set(rewardSet.properties, rewardSet.memory);
    });
  }

  // Initializers
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

  initializeItems(): Array<FFTAItem> {
    let items: Array<FFTAItem> = [];
    let dataType = FFTAMap.Items;

    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let newItem = new FFTAItem(
        memory,
        i + 1,
        this.itemJobNames[(this.rom[memory + 1] << 8) | this.rom[memory]],
        this.rom.slice(memory, memory + dataType.byteSize)
      );
      items.push(newItem);
    }
    return items;
  }

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

  initializeRaceAbilities(): RaceMap<FFTAAbility> {
    let dataType = FFTAMap.RaceAbilities;
    let races: Array<MemorySpace> = [
      dataType.Human,
      dataType.Bangaa,
      dataType.NuMou,
      dataType.Viera,
      dataType.Moogle,
    ];
    let allAbilities: Array<Array<FFTARaceAbility>> = [];
    races.forEach((race, i) => {
      let raceAbilities: Array<FFTARaceAbility> = [];
      for (var i = 0; i < race.length; i++) {
        let memory = race.offset + race.byteSize * i;

        let newAbility = new FFTARaceAbility(
          memory,
          this.abilityNames[(this.rom[memory + 1] << 8) | this.rom[memory]],
          this.rom.slice(memory, memory + race.byteSize)
        );
        raceAbilities.push(newAbility);
      }
      allAbilities.push(raceAbilities);
    });

    let abilities: RaceMap<FFTAAbility> = {
      Human: allAbilities[0],
      Bangaa: allAbilities[1],
      NuMou: allAbilities[2],
      Viera: allAbilities[3],
      Moogle: allAbilities[4],
    };

    return abilities;
  }

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

  initializeJobs(): RaceMap<FFTAJob> {
    let dataType = FFTAMap.RaceJobs;
    let races: Array<MemorySpace> = [
      dataType.Human,
      dataType.Bangaa,
      dataType.NuMou,
      dataType.Viera,
      dataType.Moogle,
    ];
    let allJobs: Array<Array<FFTAJob>> = [];
    races.forEach((race, i) => {
      let raceJobs: Array<FFTAJob> = [];
      for (var i = 0; i < race.length; i++) {
        let memory = race.offset + race.byteSize * i;

        let newJob = new FFTAJob(
          memory,
          this.itemJobNames[(this.rom[memory + 1] << 8) | this.rom[memory]],
          this.rom.slice(memory, memory + race.byteSize)
        );
        raceJobs.push(newJob);
      }
      allJobs.push(raceJobs);
    });

    let jobs: RaceMap<FFTAJob> = {
      Human: allJobs[0],
      Bangaa: allJobs[1],
      NuMou: allJobs[2],
      Viera: allJobs[3],
      Moogle: allJobs[4],
    };
    return jobs;
  }

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

  // Handlers
  handleMissionScaling(option: any, level: number) {
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

  handleAPBoost(option: any) {
    if (option > 0) {
      MissionHacks.apBoost(this.missions, option);
    }
  }

  handleStartingGold(option: any) {
    StartingPartyHacks.setStartingGold(this.rom, option);
  }

  handleFrostyBoost(option: any) {
    if (option) MissionHacks.frostyMageBoost(this.rom);
  }

  handleNoJudgeTurn(option: any) {
    if (option) MissionHacks.noJudgeTurn(this.rom);
  }

  handleJobRequirements(option: any) {
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

  handleLawOptions(option: any) {
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

  handleRewardOptions(option: any) {
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

  handlePercentageMP(option: any) {
    if (option) JobHacks.percentageMPRegen(this.rom);
  }

  handleCutScene(option: any) {
    switch (option) {
      case "all":
        break;
      case "none":
        this.rom = CutsceneHacks.skipCutscenes(this.rom, false);
        break;
      case "noTutorial":
        console.log("branch noTutorial");
        this.rom = CutsceneHacks.skipCutscenes(this.rom, true);
        break;
      default:
        throw new Error("case: " + option + " unhandled!");
    }
  }
}

export default FFTAData;
