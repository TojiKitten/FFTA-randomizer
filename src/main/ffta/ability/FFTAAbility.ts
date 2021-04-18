import { FFTAObject } from "../FFTAObject";

const enum OFFSET {
  NAME = 0x00,
  DESCRIPTION = 0x02
}

export class FFTAAbility extends FFTAObject {
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
  }


}
