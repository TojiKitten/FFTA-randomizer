import { FFTAObject } from "../FFTAData";

const enum OFFSET {
  NAME = 0x00,
  AP = 0x34,
}

export class FFTAMission implements FFTAObject {
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