import { initial } from "lodash";
import { FFTAItem, FFTARewardItemSet } from "./item/FFTAItem";
import * as FFTAUtils from "./FFTAUtils";
import { FFTAFormation } from "./formation/FFTAFormation";
import { FFTARaceAbility } from "./ability/FFTARaceAbility";
import { FFTAAbility } from "./ability/FFTAAbility";
import { FFTAJob } from "./job/FFTAJob";
import { FFTALaw, FFTALawSet } from "./item/FFTALaw";
import { FFTAMission } from "./mission/FFTAMission";

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
  readonly Items: MemorySpace;
  readonly Abilities: MemorySpace;
  readonly Missions: MemorySpace;
};

type RaceMap<Type> = {
  Human: Array<FFTAAbility>;
  Bangaa: Array<FFTAAbility>;
  NuMou: Array<FFTAAbility>;
  Viera: Array<FFTAAbility>;
  Moogle: Array<FFTAAbility>;
};

type FFTAMemoryMap = {
  readonly StringTables: StringTableSpaces;
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
  },RaceJobs: {
    Human: {
      offset: 0x521A7C, // Human
      byteSize: 0x34,
      length: 11, // There's more than this, but some of those are judge abilities
    },
    Bangaa: {
      offset: 0x521CB8, // Bangaa
      byteSize: 0x34,
      length: 7,
    },
    NuMou: {
      offset: 0x521E24, // Nu Mou
      byteSize: 0x34,
      length: 8,
    },
    Viera: {
      offset: 0x521FC4, // Viera
      byteSize: 0x34,
      length: 8,
    },
    Moogle: {
      offset: 0x522164, // Moogle
      byteSize: 0x34,
      length: 8,
    },
  },
  StringTables: {
    Items: {
      offset: 0x526680,
      byteSize: 0x4,
      length: 753,
    },
    Abilities: {
      offset: 0x5567f0,
      byteSize: 0x4,
      length: 767,
    },
    Missions: {
      offset: 0x55A650,
      byteSize: 0x4,
      length: 396
    }
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
    offset: 0x55187C,
    byteSize: 0x1C,
    length: 0x15A
  },
  LawSets: {
    offset: 0x528E1C,
    byteSize: 0x28,
    length: 7
  },
  RewardSets: {
    offset: 0x529494,
    byteSize: 0x28,
    length: 8
  },
  Missions: {
    offset: 0x55AE4C,
    byteSize: 0x46,
    length: 396
  }
};

// Common Properties
export interface FFTAObject {
  memory: number;
  properties: Uint8Array;
  displayName?: string;
  allowed?: boolean;
}

// Only one of these should exist
export class FFTAData {
  rom: Uint8Array;
  items: Array<FFTAItem>;
  itemJobNames: Array<string>;
  abilityNames: Array<string>;
  missionNames: Array<string>;
  formations: Array<FFTAFormation>;
  missions: Array<FFTAMission>;
  raceAbilities: RaceMap<FFTAAbility>;
  abilities: Array<FFTAAbility>;
  jobs: RaceMap<FFTAJob>;
  lawSets: Array<FFTALawSet>;
  rewardItemSets: Array<FFTARewardItemSet>;

  constructor(buffer: Uint8Array) {
    this.rom = buffer;
    this.itemJobNames = this.initializeItemNames();
    this.abilityNames = this.initializeAbilityNames();
    this.missionNames = this.initializeMissionNames();
    this.items = this.initializeItems();
    this.formations = this.initializeFormations();
    this.missions = this.initializeMissions();
    this.raceAbilities = this.initializeRaceAbilities();
    this.abilities = this.initializeAbilities();
    this.jobs = this.initializeJobs();
    this.lawSets = this.initializeLawSets();
    this.rewardItemSets = this.initializeRewardItemSets();
  }

  initializeItemNames(): Array<string> {
    let names: Array<string> = [];
    let dataType = FFTAMap.StringTables.Items;

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
    let dataType = FFTAMap.StringTables.Abilities;

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
    let dataType = FFTAMap.StringTables.Missions;

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

  initializeRaceAbilities(): RaceMap<FFTAAbility>{
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

  initializeAbilities()
  {
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

  initializeJobs(): RaceMap<FFTAJob>{
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

  writeData(): void {
    this.items.forEach((item) => {
      this.rom.set(item.properties, item.memory);
    });
  }
}

export default FFTAData;
