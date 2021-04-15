import { initial } from "lodash";
import { FFTAItem } from "./item/FFTAItem";
import * as FFTAUtils from "./FFTAUtils";

// References
const enum BYTELENGTH {
  ITEM = 0x20,
  STRINGTABLE = 0x32,
}

const enum KNOWNOFFSET {
  ITEM = 0x51d1a0,
  STRINGTABLE = 0x526680,
}

const enum QUANTITY {
  ITEM = 375,
  STRINGTABLE = 0,
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
    this.stringNames = [];

    let stringLookupTable = buffer.slice(KNOWNOFFSET.STRINGTABLE, 0x527244);
    for (var i = 0; i < stringLookupTable.length; i+=4) {
      let address = new Uint32Array([
        (stringLookupTable[i + 3] << 24) |
          (stringLookupTable[i + 2] << 16) |
          (stringLookupTable[i + 1] << 8) |
          stringLookupTable[i],
      ]);

      let startingByte = address[0] - 0x08000000;
      let endingByte = startingByte;
      do {
        endingByte += 0x01;
      }while (buffer[endingByte] !== 0);

      this.stringNames.push(FFTAUtils.decodeFFTAText(buffer.slice(startingByte, endingByte)));
    }

    // Initialize Items
    this.items = new Array<FFTAItem>();
    for (var i = 0; i < QUANTITY.ITEM; i++) {
      let memory = KNOWNOFFSET.ITEM + BYTELENGTH.ITEM * i;
      let newItem = new FFTAItem(
        memory,
        i + 1,
        this.stringNames[(buffer[memory+1] << 8) | buffer[memory]],
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
