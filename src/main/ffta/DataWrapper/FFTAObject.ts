import * as FFTAUtils from "../utils/FFTAUtils";

/**
 * Represents a piece of information in FFTA.
 * @see memory - The memory address of an object
 * @see properties - The buffer holding the information of an object
 * @see displayName? - Optional attribute to hold the name of an object
 * @see allowed - Determines if the randomizer should use the object
 */
export class FFTAObject {
  memory: number;
  properties: Uint8Array;
  displayName?: string;
  allowed: boolean;

  /**
   * Constructor for an object
   * @param memory - The memory address of an object
   * @param properties - The buffer holding the information of an object
   * @param displayName - The name of an object
   */
  constructor(memory: number, properties: Uint8Array, displayName?: string) {
    this.memory = memory;
    this.properties = new Uint8Array(properties);
    this.displayName = displayName;
    this.allowed = true;
  }

  /**
   * Sets a value of a given size in byte at the given offset of the properties buffer.
   * @param offset - The offset to set in properties
   * @param bytes - The size, in bytes, of the value to set
   * @param value - The number, in decimal, to set
   */
  protected setProperty(offset: number, bytes: 1 | 2 | 4, value: number): void {
    switch (bytes) {
      case 1:
        this.properties.set(new Uint8Array([value]), offset);
        break;
      case 2:
        this.properties.set(FFTAUtils.getShortUint8Array(value, true), offset);
        break;
      case 4:
        this.properties.set(FFTAUtils.getWordUint8Array(value, true), offset);
        break;
    }
  }

  /**
   * Gets the value of a given size in byte at the given offset of the properties buffer.
   * @param offset - The offset to set in properties
   * @param bytes - The size, in bytes, of the value to set
   */
  protected getProperty(offset: number, bytes: 1 | 2 | 4): number {
    if (bytes === 2) {
      return FFTAUtils.convertShortUint8Array(
        this.properties.slice(offset, offset + 2),
        true
      );
    } else {
      return this.properties[offset];
    }
  }

  /**
   * Sets an inner bit of the given offset
   * @param offset - The offset of the property
   * @param flag - The offset of the flag to set
   * @param value - The bit value to which the flag is set
   */
  protected setFlag(offset: number, flag: number, value: 0 | 1): void {
    let mask = 0x1 << flag;
    let newFlags = new Uint8Array([
      (this.properties[offset] & ~mask) | (value << flag),
    ]);
    this.properties.set(newFlags, offset);
  }

  /**
   * Sets an inner bit of the given offset
   * @param offset - The offset of the property
   * @param bytes - The number of bytes of the offset
   * @param flag - The offset of the flag to set
   * @returns The value of an inner bit of a given offet
   */
  protected getFlag(offset: number, bytes: 1 | 2 | 4, flag: number): number {
    return (this.getProperty(offset, bytes) >> flag) & 1;
  }

  /**
   * Sets the allowed flag to the given value
   * @param allowed - The value to set
   */
  setAllowed(allowed: boolean) {
    this.allowed = allowed;
  }
}

export default FFTAObject;
