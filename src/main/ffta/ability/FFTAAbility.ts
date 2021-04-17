import { FFTAObject } from "../FFTAData";

const enum OFFSET {
  NAME = 0x00,
  DESCRIPTION = 0x02
}

export class FFTAAbility implements FFTAObject {
  properties: Uint8Array;
  memory = -1;
  displayName = "";
  allowed = true;

  constructor(memory: number, name: string, properties: Uint8Array) {
    // Save FFTAObject Properties
    this.memory = memory;
    this.displayName = name;
    this.properties = properties;
  }
}
