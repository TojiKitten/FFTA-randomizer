import { FFTAObject } from "../FFTAObject";

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

export class FFTAUnit extends FFTAObject {
  constructor(memory: number, properties: Uint8Array) {
   super(memory, properties, undefined);
  }

  setLevel(level:number)
  {
    this.setProperty(OFFSET.UNITLEVEL, 1, level);
  }

  setJob(jobID:number)
  {
    this.setProperty(OFFSET.UNITJOB, 1, jobID);
  }
}
