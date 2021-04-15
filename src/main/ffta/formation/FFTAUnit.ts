import { FFTAObject } from "../FFTAData";

const enum OFFSET {
  TYPE = 0x00,
  UNITJOB = 0x01,
  UNITABILITY = 0x02,
  UNITLEVEL = 0x03,
  UNITMODIFIER = 0x04,
  UNITITEM1 = 0x08,
  UNITITEM2 = 0x0a,
  UNITITEM3 = 0x0c,
  UNITITEM4 = 0x0e,
  UNITITEM5 = 0x10,
  UNITABILITIES = 0x14,
  UNITREACTION = 0x28,
  UNITSUPPORT = 0x29,
}

export class FFTAUnit implements FFTAObject {
  properties: Uint8Array;
  memory = -1;
  displayName = "";
  allowed = true;

  constructor(memory: number, properties: Uint8Array) {
    // Save FFTAObject Properties
    this.memory = memory;
    this.properties = properties;
  }
}
