import { FFTAObject } from "../FFTAData";
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

export class FFTAFormation implements FFTAObject {
  properties: Uint8Array;
  memory = -1;
  displayName = "";
  allowed = true;
  units: Array<FFTAUnit> = [];
  unitStart: number;
  unitEnd: number;

  constructor(memory: number, properties: Uint8Array) {
    // Save FFTAObject Properties
    this.memory = memory;
    this.properties = properties;
    this.unitStart = FFTAUtils.getLittleEndianAddress(
      properties.slice(OFFSET.MEMBERSADDRESS, OFFSET.MEMBERSADDRESS + 3)
    );
    this.unitEnd = this.unitStart + UNITSIZE * properties[OFFSET.MEMBERSSIZE];
  }

  loadUnits(unitBuffer: Uint8Array) {
    for (var i = 0; i < OFFSET.MEMBERSSIZE; i++) {
      let newUnit = new FFTAUnit(
        this.properties[OFFSET.MEMBERSADDRESS + UNITSIZE * i],
        unitBuffer.slice(UNITSIZE * i, UNITSIZE * (i + 1))
      );

      this.units.push(newUnit);
    }
  }
}
