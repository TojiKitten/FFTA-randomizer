import { FFTAObject, ROMProperty } from "./FFTAObject";
import { FFTAUnit } from "./FFTAUnit";
import * as FFTAUtils from "../utils/FFTAUtils";

const enum OFFSET {
  UNKNOWNADDRESS = 0x08,
  MEMBERSSIZE = 0x14,
  MAP = 0x16,
  MEMBERSADDRESS = 0x18,
  DEFAULTFACING = 0x1c,
  SPAWNLENGTH = 0x20,
  SPAWNFACING = 0x23,
  SPAWNADDRESS = 0x24,
}

const UNITSIZE = 0x30;

/**
 * An {@link FFTAObject} that represents a collection of {@link FFTAUnit} for an encounter.
 * @see units - An array of FFTAUnits in the formation
 * @see unitStart - The address of the first FFTAUnit in the formation
 * @see unitEnd - The address after the last FFTAUnit in the formation
 */
export class FFTAFormation extends FFTAObject {
  units: Array<FFTAUnit> = [];
  unitStart: number;
  unitEnd: number;

  /**
   * The constructor for a Formation
   *
   * @param memory - The address of the ROM
   * @param properties - A buffer starting from the address in the ROM
   */
  constructor(memory: number, properties: Uint8Array) {
    super(memory, undefined);
    this.load(properties);

    this.unitStart = FFTAUtils.getLittleEndianAddress(
      properties.slice(OFFSET.MEMBERSADDRESS, OFFSET.MEMBERSADDRESS + 4)
    );
    this.unitEnd =
      this.unitStart + UNITSIZE * properties[OFFSET.MEMBERSSIZE] - 1;
  }

  /**
   * Create a new instance for each unit in the memory space and it to the array of units.
   *
   * @param unitBuffer - A buffer holding all of the FFTAUnits
   */
  loadUnits(unitBuffer: Uint8Array) {
    for (var i = 0; i < this.membersCount; i++) {
      let newUnit = new FFTAUnit(
        this.membersOffset + UNITSIZE * i,
        unitBuffer.slice(UNITSIZE * i, UNITSIZE * (i + 1))
      );
      this.units.push(newUnit);
    }
  }

  private _membersCount: ROMProperty = {
    byteOffset: OFFSET.MEMBERSSIZE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get membersCount() {
    return this._membersCount.value;
  }
  set membersCount(count: number) {
    this._membersCount.value = count;
  }

  private _membersAddress: ROMProperty = {
    byteOffset: OFFSET.MEMBERSADDRESS,
    byteLength: 4,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get membersOffset() {
    return this._membersAddress.value & 0xffffff;
  }
  set membersOffset(offset: number) {
    this._membersAddress.value = 0x08000000 | offset;
  }
}
