import { FFTAObject } from "../FFTAObject";
import { FFTAUnit } from "./FFTAUnit";
import * as FFTAUtils from "../FFTAUtils";

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

export class FFTAFormation extends FFTAObject {
  units: Array<FFTAUnit> = [];
  unitStart: number;
  unitEnd: number;

  constructor(memory: number, properties: Uint8Array) {
    super(memory, properties, undefined);

    this.unitStart = FFTAUtils.getLittleEndianAddress(
      properties.slice(OFFSET.MEMBERSADDRESS, OFFSET.MEMBERSADDRESS + 4)
    );
    this.unitEnd =
      this.unitStart + UNITSIZE * properties[OFFSET.MEMBERSSIZE] - 1;
  }

  loadUnits(unitBuffer: Uint8Array) {
    let unitAddress = FFTAUtils.getLittleEndianAddress(
      this.properties.slice(OFFSET.MEMBERSADDRESS, OFFSET.MEMBERSADDRESS + 3)
    );

    for (var i = 0; i < this.properties[OFFSET.MEMBERSSIZE]; i++) {
      let newUnit = new FFTAUnit(
        unitAddress + UNITSIZE * i,
        unitBuffer.slice(UNITSIZE * i, UNITSIZE * (i + 1))
      );
      this.units.push(newUnit);
    }
  }
}
