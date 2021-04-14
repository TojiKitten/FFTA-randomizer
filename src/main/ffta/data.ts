import { initial } from "lodash";
import { FFTAItem } from "./item/item";

const knownAddresses = require("./knownAddresses.json");
// NOTES
// Item Names 52396A (shortsword) 523587 (phoenix Down)

// References
const enum BYTELENGTH {
  ITEM = 0x20,
}

const enum KNOWNOFFSET {
  ITEM = 0x51d1a0,
}

const enum QUANTITY {
  ITEM = 375,
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
  items: FFTAItem[];

  constructor(buffer: Uint8Array) {
    this.rom = buffer;

    // Initialize Items
    for (var i = 0; i < QUANTITY.ITEM; i++) {
      let memory = KNOWNOFFSET.ITEM + BYTELENGTH.ITEM * i;
      let newItem = new FFTAItem(
        memory,
        i + 1,
        knownAddresses[i],
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
