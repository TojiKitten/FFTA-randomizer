import { initial } from "lodash";
import { FFTAItem } from "./item/FFTAItem";
import * as FFTAUtils from "./FFTAUtils";
import { FFTAFormation } from "./formation/FFTAFormation";
import { FFTARaceAbility } from "./ability/FFTARaceAbility";
import { FFTAAbility } from "./ability/FFTAAbility";

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

type StringTableSpaces = {
  readonly Items: MemorySpace;
  readonly Abilities: MemorySpace;
};

type FFTAMemoryMap = {
  readonly StringTables: StringTableSpaces;
  readonly RaceAbilities: RaceAbilitySpaces;
  readonly Items: MemorySpace;
  readonly Formations: MemorySpace;
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
};

type RaceAbilities = {
  Human: Array<FFTAAbility>;
  Bangaa: Array<FFTAAbility>;
  NuMou: Array<FFTAAbility>;
  Viera: Array<FFTAAbility>;
  Moogle: Array<FFTAAbility>;
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
  stringNames: Array<string>;
  abilityNames: Array<string>;
  formations: Array<FFTAFormation>;
  raceAbilities: RaceAbilities;

  constructor(buffer: Uint8Array) {
    this.rom = buffer;
    this.stringNames = this.initializeItemNames();
    this.abilityNames = this.initializeAbilityNames();
    this.items = this.initializeItems();
    this.formations = this.initializeFormations();
    this.raceAbilities = this.initializeRaceAbilities();
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

  initializeItems(): Array<FFTAItem> {
    let items: Array<FFTAItem> = [];
    let dataType = FFTAMap.Items;

    for (var i = 0; i < dataType.length; i++) {
      let memory = dataType.offset + dataType.byteSize * i;
      let newItem = new FFTAItem(
        memory,
        i + 1,
        this.stringNames[(this.rom[memory + 1] << 8) | this.rom[memory]],
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

  initializeRaceAbilities(): RaceAbilities {
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

    let abilities: RaceAbilities = {
      Human: allAbilities[0],
      Bangaa: allAbilities[1],
      NuMou: allAbilities[2],
      Viera: allAbilities[3],
      Moogle: allAbilities[4],
    };

    return abilities;
  }

  writeData(): void {
    this.items.forEach((item) => {
      this.rom.set(item.properties, item.memory);
    });
  }
}

export default FFTAData;
