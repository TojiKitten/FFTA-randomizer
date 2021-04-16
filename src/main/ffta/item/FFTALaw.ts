import { FFTAObject } from "../FFTAData";

const enum OFFSET {
  NAME = 0x00,
  REQUIREMENTS = 0x30,
}

export class FFTALaw implements FFTAObject {
  properties: Uint8Array;
  memory = -1;
  displayName = "";
  allowed = true;

  constructor(memory: number, name: string, properties: Uint8Array) {
    // Save FFTAObject Properties
    this.memory = memory;
    this.properties = properties;
    this.displayName = name;
  }
}

export class FFTALawSet implements FFTAObject {
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
