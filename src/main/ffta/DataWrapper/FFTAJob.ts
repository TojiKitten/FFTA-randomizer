import { ITEMTYPES } from "./FFTAItem";
import { FFTAObject } from "./FFTAObject";

const enum OFFSET {
  NAME = 0x00,
  RACEID = 0x04,
  ANIMATIONTYPE = 0x06, // ?? Might have to do with offsets available
  ANIMATIONS = 0x07,
  FIRSTABILITY = 0x1f,
  LASTABILITY = 0x20,
  ALLOWEDWEAPONS = 0x2d,
  REQUIREMENTS = 0x30,
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
    properties: Uint8Array
  ) {
    super(memory, properties, name);
    this.jobId = id;
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
