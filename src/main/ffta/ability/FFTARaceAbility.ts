import { FFTAObject } from "../FFTAData";

const enum OFFSET {
  NAME = 0x00,
  DESCRIPTION = 0x02,
  ABILITYID = 0x04,
  TYPE = 0x06,
  COST = 0x07,
}

export class FFTARaceAbility implements FFTAObject {
  properties: Uint8Array;
  memory = -1;
  displayName = "";
  allowed = true;

  constructor(memory: number, name: string, properties: Uint8Array) {
    this.memory = memory;
    this.displayName = name;
    this.properties = properties;
  }
}
