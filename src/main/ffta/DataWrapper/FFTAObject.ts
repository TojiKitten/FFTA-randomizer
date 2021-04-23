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
    this.properties = properties;
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
    if (bytes === 2) {
      this.properties.set(FFTAUtils.getShortUint8Array(value, true), offset);
    } else {
      this.properties.set(new Uint8Array([value]), offset);
    }
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
