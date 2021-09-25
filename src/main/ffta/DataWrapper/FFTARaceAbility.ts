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
  readonly nameID: ROMProperty = {
    byteOffset: OFFSET.NAME,
    byteLength: 2,
    displayName: "",
    value: 0,
  };

  readonly descriptionID: ROMProperty = {
    byteOffset: OFFSET.DESCRIPTION,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };

  readonly abilityID: ROMProperty = {
    byteOffset: OFFSET.ABILITYID,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };

  readonly type: ROMProperty = {
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

  readonly apCost: ROMProperty = {
    byteOffset: OFFSET.APCOST,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };

  /**
   * Constructor for an ability learned by a race
   * @param memory - The memory address of an object
   * @param name - The name of an object
   * @param rom - The buffer holding the information of an object
   */
  constructor(memory: number, name: string, rom: Uint8Array) {
    super(memory, rom, name);

    const { nameID, descriptionID, abilityID, type, apCost } = this;

    this.loadProperty(nameID, rom);
    this.loadProperty(descriptionID, rom);
    this.loadProperty(abilityID, rom);
    this.loadProperty(type, rom);
    this.loadProperty(apCost, rom);
  }

  write(rom: Uint8Array) {
    const properties: Array<ROMProperty> = [
      this.nameID,
      this.descriptionID,
      this.abilityID,
      this.type,
      this.apCost,
    ];

    properties.forEach((property) => {
      this.writeProperty(property, rom);
    });
  }
}
