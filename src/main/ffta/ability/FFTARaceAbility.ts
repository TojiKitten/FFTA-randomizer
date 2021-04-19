import * as FFTAUtils from "../FFTAUtils";
import { FFTAObject } from "../FFTAObject";

const enum OFFSET {
  NAME = 0x00,
  DESCRIPTION = 0x02,
  ABILITYID = 0x04,
  TYPE = 0x06,
  APCOST = 0x07, //Multiply by 10
}

export class FFTARaceAbility extends FFTAObject {
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
  }

  getAbilityType() {
    return this.properties[OFFSET.TYPE];
  }
}
