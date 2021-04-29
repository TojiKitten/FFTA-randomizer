import { FFTAObject } from "./FFTAObject";

const enum OFFSET {
  NAME = 0x00,
  DESCRIPTION = 0x02,
  ABILITYID = 0x04,
  TYPE = 0x06,
  APCOST = 0x07 //Multiply by 10
}

/**
 * An {@link FFTAObject} representing an ability learned by a race.
 */
export class FFTARaceAbility extends FFTAObject {
  /**
   * Constructor for an ability learned by a race
   * @param memory - The memory address of an object
   * @param name - The name of an object
   * @param properties - The buffer holding the information of an object
   */
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
  }

  /**
   * Gets the ability type
   * @returns The type of ability
   */
  getAbilityType() {
    return this.properties[OFFSET.TYPE];
  }
}
