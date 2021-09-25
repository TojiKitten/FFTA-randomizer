import { FFTAObject, ROMProperty } from "./FFTAObject";

const byteLength = 0x1c;
const enum OFFSET {
  NAME = 0x00,
  DESCRIPTION = 0x02,
}

/**
 * An {@link FFTAObject} that represents an ability in the game that is referenced by one or many races.
 */
export class FFTAAbility extends FFTAObject {
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
  /**
   * The constructor for an Ability
   * @param memory - The address of the ROM
   * @param name - The name of the ability
   * @param properties - A buffer starting from the address in the ROM
   */
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
  }
}
