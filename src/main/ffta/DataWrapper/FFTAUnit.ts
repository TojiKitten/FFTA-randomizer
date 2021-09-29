import { FFTAObject } from "./FFTAObject";

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

/**
 * An {@link FFTAObject} representing a unit.
 */
export class FFTAUnit extends FFTAObject {
  /**
   * Constructor for a unit
   * @param memory - The memory address of an object
   * @param properties - The buffer holding the information of an object
   */
  constructor(memory: number, properties: Uint8Array) {
    super(memory, properties, undefined);
  }

  /**
   * @returns The job type of a unit.
   */
  getType() {
    return this.getProperty(OFFSET.TYPE, 1);
  }

  /**
   * Sets the job of a unit to the specified id.
   * @param jobID -The id of the job to set
   */
  setJob(jobID: number) {
    this.setProperty(OFFSET.UNITJOB, 1, jobID);
  }

  /**
   * @returns The job id of a unit.
   */
  getJob() {
    return this.getProperty(OFFSET.UNITJOB, 1);
  }

  /**
   * Sets the A Ability of a unit.
   * @param setID - The ID of the A Ability set
   */
  setAAbility(setID: number) {
    this.setProperty(OFFSET.UNITABILITY, 1, setID);
  }
  getAAbility(): number {
    return this.getProperty(OFFSET.UNITABILITY, 1);
  }

  /**
   * Sets the level of a unit.
   * @param level - The level to set
   */
  setLevel(level: number) {
    this.setProperty(OFFSET.UNITLEVEL, 1, level);
  }

  /**
   * @returns The level of the unit.
   */
  getLevel(): number {
    return this.getProperty(OFFSET.UNITLEVEL, 1);
  }

  /**
   * Sets an item slot to a specified item id.
   * @param itemID - The id of the item to set
   * @param slot - The item slot to set
   */
  setItem(itemID: number, slot: number) {
    if (slot < 5) {
      let offset = OFFSET.UNITITEM1 + slot * 2;
      this.setProperty(offset, 2, itemID);
    }
  }

  /**
   * Sets the bit of a mastered ability at an offset to a given value.
   * @param offset - The offset of the ability
   * @param mastered - The bit to set
   */
  setMasterAbility(offset: number, mastered: boolean) {
    let masteredBit = mastered ? 1 : 0;
    let abilityByte = OFFSET.UNITABILITIES + Math.floor(offset / 8);
    let abilityBit = offset % 8;
    let mask = 0x1 << abilityBit;

    let newFlags = new Uint8Array([
      (this.properties[abilityByte] & ~mask) | (masteredBit << abilityBit),
    ]);
    this.properties.set(newFlags, abilityByte);
  }

  /**
   * Sets the Reaction Ability of a unit.
   * @param abilityID - The level to set
   */
  setReaction(abilityID: number) {
    this.setProperty(OFFSET.UNITREACTION, 1, abilityID);
  }

  /**
   * Sets the Support Ability of a unit.
   * @param abilityID - The level to set
   */
  setSupport(abilityID: number) {
    this.setProperty(OFFSET.UNITSUPPORT, 1, abilityID);
  }
}
