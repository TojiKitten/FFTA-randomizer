import { FFTAObject, ROMProperty } from "./FFTAObject";

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
    super(memory, undefined);
    this.load(properties);
  }

  /**
   * Sets an item slot to a specified item id.
   * @param itemID - The id of the item to set
   * @param slot - The item slot to set
   */
  setItem(itemID: number, slot: number) {
    switch (slot) {
      case 0:
        this._item1.value = itemID;
        break;
      case 1:
        this._item2.value = itemID;
        break;
      case 2:
        this._item3.value = itemID;
        break;
      case 3:
        this._item4.value = itemID;
        break;
      case 4:
        this._item5.value = itemID;
        break;
    }
  }
  /**
   * Gets the item id of the slot to a specified.
   * @param slot - The item slot to set
   * @returns itemID - The id of the item
   */
  getItem(slot: number) {
    switch (slot) {
      case 0:
        return this._item1.value;
      case 1:
        return this._item2.value;
      case 2:
        return this._item3.value;
      case 3:
        return this._item4.value;
      case 4:
        return this._item5.value;
    }
  }

  /**
   * Sets the bit of a mastered ability at an offset to a given value.
   * @param offset - The offset of the ability
   * @param mastered - The bit to set
   */
  setMasterAbility(offset: number, mastered: boolean) {
    const masteredBit = mastered ? 1 : 0;
    const abilityByte = OFFSET.UNITABILITIES + Math.floor(offset / 8);
    const abilityBit = offset % 8;
    const mask = 0x1 << abilityBit;
    const set: ROMProperty = this.getROMProperties().find(
      (itemProperty) => itemProperty.byteOffset === abilityByte
    );
    set.value = (set.value & ~mask) | (masteredBit << abilityBit);
  }

  private _type: ROMProperty = {
    byteOffset: OFFSET.TYPE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get type() {
    return this._type.value;
  }
  set type(id: number) {
    this._type.value = id;
  }

  private _jobID: ROMProperty = {
    byteOffset: OFFSET.UNITJOB,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get jobID() {
    return this._jobID.value;
  }
  set jobID(id: number) {
    this._jobID.value = id;
  }

  private _AAbilityID: ROMProperty = {
    byteOffset: OFFSET.UNITABILITY,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get AAbilityID() {
    return this._AAbilityID.value;
  }
  set AAbilityID(id: number) {
    this._AAbilityID.value = id;
  }

  private _level: ROMProperty = {
    byteOffset: OFFSET.UNITLEVEL,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get level() {
    return this._level.value;
  }
  set level(id: number) {
    this._level.value = id;
  }

  private _item1: ROMProperty = {
    byteOffset: OFFSET.UNITITEM1,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };

  private _item2: ROMProperty = {
    byteOffset: OFFSET.UNITITEM2,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };

  private _item3: ROMProperty = {
    byteOffset: OFFSET.UNITITEM3,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };

  private _item4: ROMProperty = {
    byteOffset: OFFSET.UNITITEM4,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };

  private _item5: ROMProperty = {
    byteOffset: OFFSET.UNITITEM5,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };

  private _reaction: ROMProperty = {
    byteOffset: OFFSET.UNITREACTION,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get reaction() {
    return this._reaction.value;
  }
  set reaction(id: number) {
    this._reaction.value = id;
  }

  private _support: ROMProperty = {
    byteOffset: OFFSET.UNITSUPPORT,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get support() {
    return this._support.value;
  }
  set support(id: number) {
    this._support.value = id;
  }

  private _masteredSet1: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet2: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 1,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet3: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 2,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet4: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 3,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet5: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 4,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet6: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 5,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet7: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 6,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet8: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 7,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet9: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 8,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet10: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 9,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet11: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 10,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet12: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 11,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet13: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 12,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet14: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 13,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet15: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 14,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet16: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 15,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet17: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 16,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet18: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 17,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet19: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 18,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _masteredSet20: ROMProperty = {
    byteOffset: OFFSET.UNITABILITIES + 19,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
}
