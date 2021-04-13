import { FFTAItem, knownItems } from "./item";

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
    this.items = knownItems.map(
      (item) =>
        new FFTAItem(item.memory, item.displayName, item.femaleOnly, this)
    );
  }

  writeData(): void {
    this.items.forEach((item) => item.write(this));
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

  // Convenience to be explicit about how we write shorts
  writeShort(offset: number, value: number, littleEndian: boolean): void {
    var firstByte = littleEndian ? value & 0xff : (value >> 0x8) & 0xff;
    var secondByte = littleEndian ? (value >> 0x8) & 0xff : value & 0xff;
    this.rom.set([firstByte, secondByte], offset);
  }

  readByte(offset: number): number {
    return this.rom[offset];
  }

  writeByte(offset: number, value: number): void {
    //console.log(this.rom[offset]);
    this.rom.set([value], offset);
    //console.log(this.rom[offset]);
  }
}

export default FFTAData;
