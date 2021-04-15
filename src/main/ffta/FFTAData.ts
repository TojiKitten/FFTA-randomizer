import { initial } from "lodash";
import { FFTAItem } from "./item/FFTAItem";
import * as FFTAUtils from "./FFTAUtils";
import { FFTAFormation } from "./formation/FFTAFormation";

const DataTypes = {
  Item: {
    offset: 0x51d1a0,
    byteSize: 0x20,
    length: 375,
  },
  StringTable: {
    offset: 0x526680,
    byteSize: 0x4,
    length: 753,
  },
  Formation: {
    offset: 0x54d1a0, //Starts at 0x54CD90, but this is Starting Party address
    byteSize: 0x28,
    length: 414, // Accounts for starting at Starting Party address
  },
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
  formations: Array<FFTAFormation>;

  constructor(buffer: Uint8Array) {
    this.rom = buffer;
    this.stringNames = this.initializeStringNames();
    this.items = this.initializeItems();
    this.formations = this.initializeFormations();
  }

  initializeStringNames(): Array<string> {
    let names: Array<string> = [];
    let dataType = DataTypes.StringTable;

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
    let dataType = DataTypes.Item;

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
    let dataType = DataTypes.Formation;

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

  writeData(): void {
    this.items.forEach((item) => {
      this.rom.set(item.properties, item.memory);
    });
  }
}

export default FFTAData;
