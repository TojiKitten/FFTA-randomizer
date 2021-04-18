import { FFTAObject } from "../FFTAObject";

const enum OFFSET {
  NAME = 0x00,
  ANIMATIONTYPE = 0x06, // ?? Might have to do with offsets available
  ANIMATIONS = 0x07,
  REQUIREMENTS = 0x30,
}

export class FFTAJob extends FFTAObject {
  jobId:number;
  constructor(memory: number, id:number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
    this.jobId = id;
  }

  setRequirements(requirementsID:number)
  {
    this.setProperty(OFFSET.REQUIREMENTS, 1, requirementsID);
  }
}