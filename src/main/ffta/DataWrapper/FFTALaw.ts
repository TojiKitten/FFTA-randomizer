import { FFTAObject, ROMProperty, isROMProperty } from "./FFTAObject";

const enum OFFSET {}

/**
 * An {@link FFTAObject} representing a law.
 */
export class FFTALaw extends FFTAObject {
  /**
   * Constructor for a ;aw
   * @param memory - The memory address of an object
   * @param properties - The buffer holding the information of an object
   * @param displayName - The name of an object
   */
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, name);
    this.load(properties);
  }
}

/**
 * An {@link FFTAObject} representing a set of laws.
 */
export class FFTALawSet extends FFTAObject {
  /**
   * Constructor for a set of laws
   * @param memory - The memory address of an object
   * @param properties - The buffer holding the information of an object
   */
  constructor(memory: number, properties: Uint8Array) {
    super(memory, undefined);
    this.load(properties);
  }

  setLaw(itemID: number, offset: number) {
    Object.values(this)
      .filter(isROMProperty)
      .find((itemProperty) => itemProperty.byteOffset === offset * 2).value =
      itemID;
  }
  getLaw(offset: number) {
    return Object.values(this)
      .filter(isROMProperty)
      .find((itemProperty) => itemProperty.byteOffset === offset * 2).value;
  }
  private _law1: ROMProperty = {
    byteOffset: 0,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law2: ROMProperty = {
    byteOffset: 2,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law3: ROMProperty = {
    byteOffset: 4,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law4: ROMProperty = {
    byteOffset: 6,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law5: ROMProperty = {
    byteOffset: 8,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law6: ROMProperty = {
    byteOffset: 10,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law7: ROMProperty = {
    byteOffset: 12,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law8: ROMProperty = {
    byteOffset: 14,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law9: ROMProperty = {
    byteOffset: 16,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law10: ROMProperty = {
    byteOffset: 18,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law11: ROMProperty = {
    byteOffset: 20,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law12: ROMProperty = {
    byteOffset: 22,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law13: ROMProperty = {
    byteOffset: 24,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law14: ROMProperty = {
    byteOffset: 26,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law15: ROMProperty = {
    byteOffset: 28,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law16: ROMProperty = {
    byteOffset: 30,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law17: ROMProperty = {
    byteOffset: 32,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law18: ROMProperty = {
    byteOffset: 34,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law19: ROMProperty = {
    byteOffset: 36,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _law20: ROMProperty = {
    byteOffset: 38,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
}
