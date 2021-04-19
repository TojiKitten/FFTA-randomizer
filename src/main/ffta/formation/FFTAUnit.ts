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

  setLevel(level: number) {
    this.setProperty(OFFSET.UNITLEVEL, 1, level);
  }

  setJob(jobID: number) {
    this.setProperty(OFFSET.UNITJOB, 1, jobID);
  }

  setItem(itemID: number, slot: number) {
    if (slot < 5) {
      let offset = OFFSET.UNITITEM1 + slot * 2;
      this.setProperty(offset, 2, itemID);
    }
  }

  setMasterAbility(offset:number, mastered:boolean){
    let masteredBit = mastered? 1 : 0;
    let abilityByte = OFFSET.UNITABILITIES + Math.floor(offset/8); 
    let abilityBit = offset%8;
    let mask = 0x1 << abilityBit;

    let newFlags = new Uint8Array([
      (this.properties[abilityByte] & ~mask) | (masteredBit << abilityBit),
    ]);
    this.properties.set(newFlags, abilityByte);
  }
}
