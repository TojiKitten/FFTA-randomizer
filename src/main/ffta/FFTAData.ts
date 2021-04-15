import { initial } from "lodash";
import { FFTAItem } from "./item/FFTAItem";
import * as FFTAUtils from "./FFTAUtils";
import { FFTAFormation } from "./formation/FFTAFormation";

// References
const enum BYTELENGTH {
  ITEM = 0x20,
  STRINGTABLE = 0x4,
  FORMATION = 0x28,
}

const enum KNOWNOFFSET {
  ITEM = 0x51d1a0,
  STRINGTABLE = 0x526680,
  FORMATION = 0x54d1a0, //Starts at 0x54CD90, but this is starting party address
}

const enum QUANTITY {
  ITEM = 375,
  STRINGTABLE = 753,
  FORMATION = 414, // Accounts for starting at Starting Party
}

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
  items: Array<FFTAItem> = [];
  stringNames: Array<string> = [];
  formations: Array<FFTAFormation> = [];

  constructor(buffer: Uint8Array) {
    this.rom = buffer;

    // Initialize known string names
    for (var i = 0; i < QUANTITY.STRINGTABLE; i++) {
      let memory = KNOWNOFFSET.STRINGTABLE + BYTELENGTH.STRINGTABLE * i;
      let stringLookupTable: Uint8Array = buffer.slice(
        memory,
        memory + BYTELENGTH.STRINGTABLE
      );
      let address = FFTAUtils.getLittleEndianAddress(stringLookupTable);

      let startingByte = address;
      let endingByte = startingByte;
      do {
        endingByte += 0x01;
      } while (buffer[endingByte] !== 0);

      this.stringNames.push(
        FFTAUtils.decodeFFTAText(buffer.slice(startingByte, endingByte))
      );
    }

    // Initialize Items
    for (var i = 0; i < QUANTITY.ITEM; i++) {
      let memory = KNOWNOFFSET.ITEM + BYTELENGTH.ITEM * i;
      let newItem = new FFTAItem(
        memory,
        i + 1,
        this.stringNames[(buffer[memory + 1] << 8) | buffer[memory]],
        buffer.slice(memory, memory + BYTELENGTH.ITEM)
      );
      this.items.push(newItem);
    }

    // Initialize Formations
    for (var i = 0; i < 1 /*QUANTITY.FORMATION*/; i++) {
      let memory = KNOWNOFFSET.FORMATION + BYTELENGTH.FORMATION * i;
      let newFormation = new FFTAFormation(
        memory,
        buffer.slice(memory, memory + BYTELENGTH.FORMATION)
      );
      newFormation.loadUnits(
        buffer.slice(newFormation.unitStart, newFormation.unitEnd)
      );
      this.formations.push(newFormation);
    }
  }

  writeData(): void {
    this.items.forEach((item) => {
      this.rom.set(item.properties, item.memory);
    });
  }
}

export default FFTAData;
