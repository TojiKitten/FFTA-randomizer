import { ITEMTYPES } from "./FFTAItem";
import { FFTAObject, ROMProperty } from "./FFTAObject";

const enum OFFSET {
  NAME = 0x00,
  RACEID = 0x04,
  ANIMATIONTYPE = 0x06, // ?? Might have to do with offsets available
  ANIMATIONS = 0x07,
  HPBASE = 0x17,
  MPBASE = 0x18,
  SPEEDBASE = 0x19,
  ATTACKBASE = 0x1a,
  DEFENSEBASE = 0x1b, // 2 Bytes, (val << 4)
  POWERBASE = 0x1d,
  RESISTBASE = 0x1e, // 2 Bytes, (val << 4)
  HPGROWTH = 0x20,
  MPGROWTH = 0x21,
  SPEEDGROWTH = 0x22,
  ATTACKGROWTH = 0x23,
  DEFENSEGROWTH = 0x24,
  POWERGROWTH = 0x25,
  RESISTGROWTH = 0x26,
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

  private _hpGrowth: ROMProperty = {
    byteOffset: OFFSET.HPGROWTH,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get hpGrowth() {
    return this._hpGrowth.value * 0.1;
  }
  set hpGrowth(growth: number) {
    this._hpGrowth.value = Math.min(growth * 10, 255);
  }
  private _hpBase: ROMProperty = {
    byteOffset: OFFSET.HPBASE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get hpBase() {
    return this._hpBase.value;
  }
  set hpBase(base: number) {
    this._hpBase.value = Math.min(base, 255);
  }

  private _mpGrowth: ROMProperty = {
    byteOffset: OFFSET.MPGROWTH,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get mpGrowth() {
    return this._mpGrowth.value * 0.1;
  }
  set mpGrowth(growth: number) {
    this._mpGrowth.value = Math.min(growth * 10, 255);
  }
  private _mpBase: ROMProperty = {
    byteOffset: OFFSET.MPBASE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get mpBase() {
    return this._mpBase.value;
  }
  set mpBase(base: number) {
    this._mpBase.value = Math.min(base, 255);
  }

  private _speedGrowth: ROMProperty = {
    byteOffset: OFFSET.SPEEDGROWTH,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get speedGrowth() {
    return this._speedGrowth.value * 0.1;
  }
  set speedGrowth(growth: number) {
    this._speedGrowth.value = Math.min(growth * 10, 255);
  }
  private _speedBase: ROMProperty = {
    byteOffset: OFFSET.SPEEDBASE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get speedBase() {
    return this._speedBase.value;
  }
  set speedBase(base: number) {
    this._speedBase.value = Math.min(base, 255);
  }

  private _attackGrowth: ROMProperty = {
    byteOffset: OFFSET.ATTACKGROWTH,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get attackGrowth() {
    return this._attackGrowth.value * 0.1;
  }
  set attackGrowth(growth: number) {
    this._attackGrowth.value = Math.min(growth * 10, 255);
  }
  private _attackBase: ROMProperty = {
    byteOffset: OFFSET.ATTACKBASE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get attackBase() {
    return this._attackBase.value;
  }
  set attackBase(base: number) {
    this._attackBase.value = Math.min(base, 255);
  }

  private _defenseGrowth: ROMProperty = {
    byteOffset: OFFSET.DEFENSEGROWTH,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get defenseGrowth() {
    return this._defenseGrowth.value * 0.1;
  }
  set defenseGrowth(growth: number) {
    this._defenseGrowth.value = Math.min(growth * 10, 255);
  }
  private _defenseBase: ROMProperty = {
    byteOffset: OFFSET.DEFENSEBASE,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get defenseBase() {
    return (this._defenseBase.value >> 4) & 0xff;
  }
  set defenseBase(base: number) {
    this._defenseBase.value = Math.min(base, 255) << 4;
  }

  private _powerGrowth: ROMProperty = {
    byteOffset: OFFSET.POWERGROWTH,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get powerGrowth() {
    return this._powerGrowth.value * 0.1;
  }
  set powerGrowth(growth: number) {
    this._powerGrowth.value = Math.min(growth * 10, 255);
  }
  private _powerBase: ROMProperty = {
    byteOffset: OFFSET.POWERBASE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get powerBase() {
    return this._powerBase.value;
  }
  set powerBase(base: number) {
    this._powerBase.value = Math.min(base, 255);
  }

  private _resistanceGrowth: ROMProperty = {
    byteOffset: OFFSET.RESISTGROWTH,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get resistanceGrowth() {
    return this._resistanceGrowth.value * 0.1;
  }
  set resistanceGrowth(growth: number) {
    this._resistanceGrowth.value = Math.min(growth * 10, 255);
  }
  private _resistanceBase: ROMProperty = {
    byteOffset: OFFSET.RESISTBASE,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get resistanceBase() {
    return (this._resistanceBase.value >> 4) & 0xff;
  }
  set resistanceBase(base: number) {
    this._resistanceBase.value = Math.min(base, 255) << 4;
  }

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
    this.loadProperty(this._hpBase, properties);
    this.loadProperty(this._hpGrowth, properties);
    this.loadProperty(this._mpBase, properties);
    this.loadProperty(this._mpGrowth, properties);
    this.loadProperty(this._speedBase, properties);
    this.loadProperty(this._speedGrowth, properties);
    this.loadProperty(this._attackBase, properties);
    this.loadProperty(this._attackGrowth, properties);
    this.loadProperty(this._defenseBase, properties);
    this.loadProperty(this._defenseGrowth, properties);
    this.loadProperty(this._powerBase, properties);
    this.loadProperty(this._powerGrowth, properties);
    this.loadProperty(this._resistanceBase, properties);
    this.loadProperty(this._resistanceGrowth, properties);
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

  write(rom: Uint8Array) {
    const properties: Array<ROMProperty> = [
      this._hpGrowth,
      this._hpBase,
      this._mpGrowth,
      this._mpBase,
      this._speedBase,
      this._speedGrowth,
      this._attackGrowth,
      this._attackBase,
      this._defenseGrowth,
      this._defenseBase,
      this._powerBase,
      this._powerGrowth,
      this._resistanceBase,
      this._resistanceGrowth,
    ];

    properties.forEach((property) => {
      this.writeProperty(property, rom);
    });
  }
}
