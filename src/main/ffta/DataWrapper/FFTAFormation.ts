import { FFTAObject } from "./FFTAObject";
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
  SPAWNADDRESS = 0x24
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
    super(memory, properties, undefined);

    this.unitStart = FFTAUtils.getLittleEndianAddress(
      properties.slice(OFFSET.MEMBERSADDRESS, OFFSET.MEMBERSADDRESS + 4)
    );
    this.unitEnd = this.unitStart + UNITSIZE * properties[OFFSET.MEMBERSSIZE] - 1;
  }

  /**
   * Create a new instance for each unit in the memory space and it to the array of units.
   *
   * @param unitBuffer - A buffer holding all of the FFTAUnits
   */
  loadUnits(unitBuffer: Uint8Array) {
    let unitAddress = FFTAUtils.getLittleEndianAddress(
      this.properties.slice(OFFSET.MEMBERSADDRESS, OFFSET.MEMBERSADDRESS + 3)
    );

    for (var i = 0; i < this.properties[OFFSET.MEMBERSSIZE]; i++) {
      let newUnit = new FFTAUnit(unitAddress + UNITSIZE * i, unitBuffer.slice(UNITSIZE * i, UNITSIZE * (i + 1)));
      this.units.push(newUnit);
    }
  }
}
