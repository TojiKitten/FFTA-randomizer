import { initial } from "lodash";
import { FFTAItem } from "./item/item";
import * as FFTAUtils from "./FFTAUtils";

// References
const enum BYTELENGTH {
  ITEM = 0x20,
  ITEMNAMES = 0x1C1D
}

const enum KNOWNOFFSET {
  ITEM = 0x51d1a0,
  ITEMNAMES = 0x52396a
}

const enum QUANTITY {
  ITEM = 375
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
  itemNames: Array<string>;

  constructor(buffer: Uint8Array) {
    this.rom = buffer;
        
    // Read in Item Names
    this.itemNames = FFTAUtils.decodeFFTAText(buffer.slice(KNOWNOFFSET.ITEMNAMES, KNOWNOFFSET.ITEMNAMES + BYTELENGTH.ITEMNAMES));

    // Initialize Items
    this.items = new Array<FFTAItem>();
    for(var i = 0; i < QUANTITY.ITEM; i++) {
      let memory = KNOWNOFFSET.ITEM + BYTELENGTH.ITEM * i;
      let newItem = new FFTAItem(
        memory,
        i + 1,
        this.itemNames[i],
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
