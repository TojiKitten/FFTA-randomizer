import * as FFTAUtils from "./FFTAUtils";

// Common Properties
export class FFTAObject {
  memory: number;
  properties: Uint8Array;
  displayName?: string;
  allowed: boolean;

  constructor(memory:number, properties:Uint8Array, displayName?:string)
  {
    this.memory = memory;
    this.properties = properties;
    this.displayName = displayName;
    this.allowed = true;
  }

  protected setProperty(offset: number, bytes: 1|2|4, value: number): void {
    if (bytes === 2) {
      this.properties.set(FFTAUtils.getShortUint8Array(value, true), offset);
    } else {
      this.properties.set(new Uint8Array([value]), offset);
    }
  }
}

export default FFTAObject;