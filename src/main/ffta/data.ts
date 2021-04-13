import { initial } from "lodash";
import { FFTAItem } from "./item";

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
      (item: { memory: string; displayName: string; femaleOnly: boolean }) =>
        new FFTAItem(
          parseInt(item.memory, 16),
          parseInt(item.displayName, 16),
          item.displayName,
          item.femaleOnly,
          buffer
        )
    );
  }

  writeData(): void {
    this.items.forEach((item) => {
      this.rom.set(item.properties, item.memory);
    });
  }

  readShort(offset: number, littleEndian: boolean): number {
    var firstByte = this.rom[offset];
    var secondByte = this.rom[offset + 1];

    if (littleEndian) {
      return (secondByte << 0x8) | firstByte;
    } else {
      return (firstByte << 0x8) | secondByte;
    }
  }
}

export default FFTAData;
