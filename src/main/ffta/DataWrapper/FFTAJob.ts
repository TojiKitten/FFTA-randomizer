import { ITEMTYPES } from "./FFTAItem";
import { FFTAObject } from "./FFTAObject";

const enum OFFSET {
  NAME = 0x00,
  RACEID = 0x04,
  ANIMATIONTYPE = 0x06, // ?? Might have to do with offsets available
  ANIMATIONS = 0x07,
  ALLOWEDWEAPONS = 0x2d,
  FIRSTABILITY = 0x2e,
  LASTABILITY = 0x2f,
  REQUIREMENTS = 0x30,
}

export interface JobLite {
  displayName: string;
  id: number;
  race: string;
}

/**
 * An {@link FFTAObject} representing a job for a race.
 * @see jobId - The number used to reference the job
 * @see allowedWeapons - A buffer holding the bit values of weapons equippable by the job
 * @see abilityLimit - The maximum number of abilities available to the Race of the Job
 */
export class FFTAJob extends FFTAObject {
  jobId: number;
  allowedWeapons: Uint8Array;
  abilityLimit: number;
  race: string;

  /**
   * Constructor of a Job
   * @param memory - The address of the ROM
   * @param id - The number used to reference the job
   * @param name - The name of the job
   * @param properties - A buffer starting from the address in the ROM
   */
  constructor(
    memory: number,
    id: number,
    name: string,
    race: string,
    properties: Uint8Array
  ) {
    super(memory, properties, name);
    this.jobId = id;
    this.race = race;
  }

  /**
   * Returns lightweight information for the job
   */
  getJobInfo(): JobLite {
    return {
      displayName: this.displayName!,
      id: this.jobId,
      race: this.race,
    };
  }

  /**
   * Sets the BYTE holding the ID of the requirements to unlock this job.
   * @param requirementsID - The ID to set
   */
  setRequirements(requirementsID: number) {
    this.setProperty(OFFSET.REQUIREMENTS, 1, requirementsID);
  }

  /**
   * Gets the BYTE holding the ID of the set of allowed weapons for this job.
   * @returns - The ID of the set
   */
  getAllowedWeapons() {
    return this.properties[OFFSET.ALLOWEDWEAPONS];
  }

  /**
   *
   * @returns The race string of the job
   */
  getRace() {
    return this.race;
  }

  /**
   *
   * @returns An array containing the ability ID's for the job.
   */
  getAbilityIDs() {
    const firstAbility = this.getProperty(OFFSET.FIRSTABILITY, 1);
    const lastAbility = this.getProperty(OFFSET.LASTABILITY, 1);
    return Array.from(
      {
        length: lastAbility + 1 - firstAbility,
      },
      (_, iter) => firstAbility - 1 + iter
    );
  }

  /**
   * Checks if a given item type is allowed to be equipped.
   * @param type - The item type to check
   * @see ITEMTYPES
   * @returns True if the item type is allowed for this job
   */
  isTypeAllowed(type: ITEMTYPES) {
    type -= 1; // Accounts for wrong offset
    return this.allowedWeapons[Math.floor(type / 8)] & (0x1 << type % 8);
  }
}
