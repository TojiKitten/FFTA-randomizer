import { FFTAObject } from "../FFTAObject";

const enum OFFSET {
}

export class FFTALaw extends FFTAObject {
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
  }
}

export class FFTALawSet extends FFTAObject {
  constructor(memory: number, properties: Uint8Array) {
    super(memory, properties, undefined);
  }
}
