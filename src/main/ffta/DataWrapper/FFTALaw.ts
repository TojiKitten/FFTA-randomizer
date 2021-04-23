import { FFTAObject } from "./FFTAObject";

const enum OFFSET {}

/**
 * An {@link FFTAObject} representing a law. 
 */
export class FFTALaw extends FFTAObject {
  /**
   * Constructor for a ;aw
   * @param memory - The memory address of an object
   * @param properties - The buffer holding the information of an object
   * @param displayName - The name of an object
   */
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
  }
}

/**
 * An {@link FFTAObject} representing a set of laws.
 */
export class FFTALawSet extends FFTAObject {
  /**
   * Constructor for a set of laws
   * @param memory - The memory address of an object
   * @param properties - The buffer holding the information of an object
   */
  constructor(memory: number, properties: Uint8Array) {
    super(memory, properties, undefined);
  }
}
