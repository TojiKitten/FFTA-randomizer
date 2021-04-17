import { FFTAObject } from "../FFTAObject";

const enum OFFSET {
  NAME = 0x00,
  ANIMATIONTYPE = 0x06, // ?? Might have to do with offsets available
  ANIMATIONS = 0x07,
  REQUIREMENTS = 0x30,
}

export class FFTAJob extends FFTAObject {
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
  }

  setRequirements(requirementsID:number)
  {
    this.setProperty(OFFSET.REQUIREMENTS, 1, requirementsID);
  }
}