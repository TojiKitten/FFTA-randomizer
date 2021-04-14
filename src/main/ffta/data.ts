import { initial } from "lodash";
import { FFTAItem } from "./item/item";

const knownAddresses = require("./knownAddresses.json");

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
    this.items = knownAddresses.knownItems.map(
      (
        item: { memory: string; displayName: string; femaleOnly: boolean },
        index: number
      ) =>
        new FFTAItem(
          parseInt(item.memory, 16),
          index + 1,
          item.displayName,
          buffer
        )
    );
  }

  writeData(): void {
    this.items.forEach((item) => {
      this.rom.set(item.properties, item.memory);
    });
  }
}

export default FFTAData;
