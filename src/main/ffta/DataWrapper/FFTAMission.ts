import { FFTAObject } from "./FFTAObject";

const enum OFFSET {
  NAME = 0x00,
  AP = 0x34,
}

/**
 * An {@link FFTAObject} representing a mission.
 */
export class FFTAMission extends FFTAObject {
  /**
   * Constructor for a mission
   * @param memory - The memory address of an object
   * @param properties - The buffer holding the information of an object
   * @param displayName - The name of an object
   */
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
  }

  /**
   * Sets the AP to be earned for a mission.
   * @param ap - The amout of AP to set
   */
  setAPReward(ap: number) {
    this.setProperty(OFFSET.AP, 1, ap / 10);
  }
}
