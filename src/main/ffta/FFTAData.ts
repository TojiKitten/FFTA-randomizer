import { initial } from "lodash";
import { FFTAItem } from "./item/FFTAItem";
import * as FFTAUtils from "./FFTAUtils";

// References
const enum BYTELENGTH {
  ITEM = 0x20,
  STRINGTABLE = 0x4,
}

const enum KNOWNOFFSET {
  ITEM = 0x51d1a0,
  STRINGTABLE = 0x526680,
}

const enum QUANTITY {
  ITEM = 375,
  STRINGTABLE = 753,
}

// Common Properties
export interface FFTAObject {
  memory: number;
  displayName?: string;
  allowed?: boolean;
}

// Only one of these should exist
export class FFTAData {
  rom: Uint8Array;
  items: Array<FFTAItem>;
  stringNames: Array<string>;
  stringTable: Uint32Array;

  constructor(buffer: Uint8Array) {
    this.rom = buffer;

    // Initialize known string names
    this.stringNames = [];
    for (var i = 0; i < QUANTITY.STRINGTABLE; i++) {
      let memory = KNOWNOFFSET.STRINGTABLE + BYTELENGTH.STRINGTABLE * i;
      let stringLookupTable: Uint8Array = buffer.slice(
        memory,
        memory + BYTELENGTH.STRINGTABLE
      );
      let address = new Uint32Array([
        (stringLookupTable[3] << 24) |
          (stringLookupTable[2] << 16) |
          (stringLookupTable[1] << 8) |
          stringLookupTable[0],
      ]);

      let startingByte = address[0] - 0x08000000;
      let endingByte = startingByte;
      do {
        endingByte += 0x01;
      } while (buffer[endingByte] !== 0);

      this.stringNames.push(
        FFTAUtils.decodeFFTAText(buffer.slice(startingByte, endingByte))
      );
    }

    // Initialize Items
    this.items = new Array<FFTAItem>();
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
  }

  writeData(): void {
    this.items.forEach((item) => {
      this.rom.set(item.properties, item.memory);
    });
  }
}

export default FFTAData;
