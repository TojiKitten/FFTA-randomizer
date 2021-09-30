import { FFTAObject, ROMProperty } from "./FFTAObject";
import * as FFTAUtils from "../utils/FFTAUtils";
const byteLength = 0x08;

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
  constructor(memory: number, name: string, properties?: Uint8Array) {
    super(memory, name);
    if (properties) {
      this.load(properties);
    }
  }

  private _nameID: ROMProperty = {
    byteOffset: OFFSET.NAME,
    byteLength: 2,
    displayName: "",
    value: 0,
  };
  get nameID() {
    return this._nameID.value;
  }
  set nameID(id: number) {
    this._nameID.value = id;
  }

  private _descriptionID: ROMProperty = {
    byteOffset: OFFSET.DESCRIPTION,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get descriptionID() {
    return this._descriptionID.value;
  }
  set descriptionID(id: number) {
    this._descriptionID.value = id;
  }

  private _abilityID: ROMProperty = {
    byteOffset: OFFSET.ABILITYID,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get abilityID() {
    return this._abilityID.value;
  }
  set abilityID(id: number) {
    this._abilityID.value = id;
  }

  private _type: ROMProperty = {
    byteOffset: OFFSET.TYPE,
    byteLength: 1,
    get displayName() {
      switch (this.value) {
        case 0:
          return "Action";

        case 1:
          return "Action";

        case 2:
          return "Reaction";

        case 3:
          return "Support";

        case 4:
          return "Action";

        case 5:
          return "Combo";
        default:
          return "Could not retrieve.";
      }
    },
    value: 0,
  };
  get type() {
    return this._type.value;
  }
  set type(id: number) {
    this._type.value = id;
  }

  private _apCost: ROMProperty = {
    byteOffset: OFFSET.APCOST,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get apCost() {
    return this._apCost.value;
  }
  set apCost(id: number) {
    this._apCost.value = id;
  }
}
