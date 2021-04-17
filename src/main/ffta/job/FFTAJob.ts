import { FFTAObject } from "../FFTAData";

const enum OFFSET {
  NAME = 0x00,
  ANIMATIONTYPE = 0x06, // ?? Might have to do with offsets available
  ANIMATIONS = 0x07,
  REQUIREMENTS = 0x30,
}

export class FFTAJob implements FFTAObject {
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
