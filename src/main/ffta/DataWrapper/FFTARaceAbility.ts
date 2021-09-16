import { FFTAObject } from "./FFTAObject";

const enum OFFSET {
  NAME = 0x00,
  DESCRIPTION = 0x02,
  ABILITYID = 0x04,
  TYPE = 0x06,
  APCOST = 0x07, //Multiply by 10
}

export const enum ABILITYTYPE {
  ACTION2 = 0,
  ACTION0 = 1,
  REACTION = 2,
  SUPPORT = 3,
  ACTION1 = 4,
  COMBO = 5,
}

export interface RaceAbilityLite {
  displayName: string;
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
   * @returns Lightweight object for the item
   */
  getRaceAbilityInfo(): RaceAbilityLite {
    return {
      displayName: this.displayName!,
    };
  }

  /**
   * @returns The id of the ability
   */
  getAbilityID() {
    return this.getProperty(OFFSET.ABILITYID, 1);
  }

  /**
   * @returns The type of the ability
   */
  getAbilityType() {
    return this.properties[OFFSET.TYPE];
  }
}
