import { FFTAObject } from "./FFTAObject";

const enum OFFSET {
  NAME = 0x00,
  AP = 0x34,
}

export class FFTAMission extends FFTAObject {
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
  }

  setAPReward(ap: number) {
    this.setProperty(OFFSET.AP, 1, ap / 10);
  }
}
