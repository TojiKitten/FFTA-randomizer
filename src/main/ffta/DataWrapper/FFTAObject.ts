import * as FFTAUtils from "../utils/FFTAUtils";

export type ROMProperty = {
  readonly byteOffset: number;
  readonly byteLength: number;
  readonly bitOffset?: number;
  displayName: string;
  value: number;
};

export function isROMProperty<ROMProperty>(
  argument: ROMProperty | undefined
): argument is ROMProperty {
  return argument !== undefined;
}

/**
 * Represents a piece of information in FFTA.
 * @see memory - The memory address of an object
 * @see properties - The buffer holding the information of an object
 * @see displayName? - Optional attribute to hold the name of an object
 * @see allowed - Determines if the randomizer should use the object
 */
export class FFTAObject {
  memory: number;
  protected usedProperties: Array<ROMProperty>;
  displayName?: string;
  allowed: boolean;

  /**
   * Constructor for an object
   * @param memory - The memory address of an object
   * @param properties - The buffer holding the information of an object
   * @param displayName - The name of an object
   */
  constructor(memory: number, displayName?: string) {
    this.memory = memory;
    this.displayName = displayName;
    this.allowed = true;
  }

  /**
   * Sets the allowed flag to the given value
   * @param allowed - The value to set
   */
  setAllowed = (allowed: boolean) => {
    this.allowed = allowed;
  };

  protected loadProperty = (romProp: ROMProperty, properties: Uint8Array) => {
    const start = romProp.byteOffset;
    const end = start + romProp.byteLength;

    switch (romProp.byteLength) {
      case 0x1:
        romProp.value = properties.slice(start, end)[0];
        break;
      case 0x2:
        romProp.value = FFTAUtils.convertShortUint8Array(
          properties.slice(start, end),
          true
        );
        break;
      case 0x4:
        romProp.value = FFTAUtils.convertWordUint8Array(
          properties.slice(start, end),
          true
        );
        break;
    }
  };

  protected writeProperty = (romProp: ROMProperty, rom: Uint8Array) => {
    switch (romProp.byteLength) {
      case 0x1:
        rom.set(
          new Uint8Array([romProp.value]),
          this.memory + romProp.byteOffset
        );
        break;
      case 0x2:
        rom.set(
          FFTAUtils.getShortUint8Array(romProp.value, true),
          this.memory + romProp.byteOffset
        );
        break;
      case 0x4:
        rom.set(
          FFTAUtils.getWordUint8Array(romProp.value, true),
          this.memory + romProp.byteOffset
        );
        break;
    }
  };

  load = (rom: Uint8Array) => {
    Object.values(this)
      .filter(isROMProperty)
      .forEach((property) => {
        this.loadProperty(property, rom);
      });
  };

  write = (rom: Uint8Array) => {
    Object.values(this)
      .filter(isROMProperty)
      .forEach((property) => {
        this.writeProperty(property, rom);
      });
  };

  copy = (fftaObject: FFTAObject) => {
    Object.values(this)
      .filter(isROMProperty)
      .forEach((property: ROMProperty) => {
        const matchingProperty = Object.values(fftaObject)
          .filter(isROMProperty)
          .find(
            (itemProperty) => itemProperty.byteOffset === property.byteOffset
          );
        property.value = matchingProperty.value;
      });
  };

  // /**
  //  * Sets a value of a given size in byte at the given offset of the properties buffer.
  //  * @param offset - The offset to set in properties
  //  * @param bytes - The size, in bytes, of the value to set
  //  * @param value - The number, in decimal, to set
  //  */
  // protected setProperty(offset: number, bytes: 1 | 2 | 4, value: number): void {
  //   switch (bytes) {
  //     case 1:
  //       this.properties.set(new Uint8Array([value]), offset);
  //       break;
  //     case 2:
  //       this.properties.set(FFTAUtils.getShortUint8Array(value, true), offset);
  //       break;
  //     case 4:
  //       this.properties.set(FFTAUtils.getWordUint8Array(value, true), offset);
  //       break;
  //   }
  // }

  // /**
  //  * Gets the value of a given size in byte at the given offset of the properties buffer.
  //  * @param offset - The offset to set in properties
  //  * @param bytes - The size, in bytes, of the value to set
  //  */
  // protected getProperty(offset: number, bytes: 1 | 2 | 4): number {
  //   if (bytes === 2) {
  //     return FFTAUtils.convertShortUint8Array(
  //       this.properties.slice(offset, offset + 2),
  //       true
  //     );
  //   } else {
  //     return this.properties[offset];
  //   }
  // }

  // /**
  //  * Sets an inner bit of the given offset
  //  * @param offset - The offset of the property
  //  * @param flag - The offset of the flag to set
  //  * @param value - The bit value to which the flag is set
  //  */
  // protected setFlag(
  //   offset: number,
  //   bytes: 1 | 2 | 4,
  //   flag: number,
  //   value: 0 | 1
  // ): void {
  //   let mask = 0x1 << flag;
  //   let currentFlags = this.getProperty(offset, bytes);
  //   let newFlags = (currentFlags & ~mask) | (value << flag);
  //   this.setProperty(offset, bytes, newFlags);
  // }

  // /**
  //  * Sets an inner bit of the given offset
  //  * @param offset - The offset of the property
  //  * @param bytes - The number of bytes of the offset
  //  * @param flag - The offset of the flag to set
  //  * @returns The value of an inner bit of a given offet
  //  */
  // protected getFlag(offset: number, bytes: 1 | 2 | 4, flag: number): number {
  //   return (this.getProperty(offset, bytes) >> flag) & 1;
  // }
}

export default FFTAObject;
