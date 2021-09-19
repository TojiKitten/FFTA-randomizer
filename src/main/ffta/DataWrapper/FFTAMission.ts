import { FFTAObject } from "./FFTAObject";

const enum OFFSET {
  ID = 0x00,
  TYPE = 0x01, // 0B is regular encounter, 02 is dispatch maybe uses flags
  RANK = 0x03,
  UNLOCKFLAG1 = 0x05, // 3 Bytes (Bit Offset, Row Offset * 0x20, Value)
  UNLOCKFLAG2 = 0x08, // 3 Bytes (Bit Offset, Row Offset * 0x20, Value)
  UNLOCKFLAG3 = 0x0b, // 3 Bytes (Bit Offset, Row Offset * 0x20, Value)
  PICKUPINFO = 0x0e,
  DISPATCHTIME = 0x10,
  ITEMREWARD1 = 0x22, // 0x178 = Magic Trophy as reward
  ITEMREWARD2 = 0x24,
  AP = 0x34,
  RECRUIT = 0x35,
  REQITEM1 = 0x36, // 0x01 = Magic Trophy as required
  REQITEM2 = 0x37,
  REQSKILL = 0x38, // 0x01 = Combat
  REQSKILLAMOUNT = 0x39, //0x01 = level 8? maybe tied to "difficulty"
  HIDDENREWARDFLAGS = 0x41,
  MOREFLAGS = 0x42,
  MISSIONLOCATION = 0x45, // Used for encounters and loading cut scenes
}

const enum MISSIONTYPE {
  CLANSTORY = 0x09,
  NORMALENCOUNTER = 0x0a,
  STORYENCOUNTER = 0x0b,
  WALKONSTORY = 0x0d,
  DISPATCH = 0x20,
}

/**
 * An {@link FFTAObject} representing a mission.
 */
export class FFTAMission extends FFTAObject {
  get encounterMission() {
    return this.getFlag(OFFSET.TYPE, 2, 0xb);
  }

  get linkMission() {
    return this.getFlag(OFFSET.TYPE, 2, 0xc);
  }

  get specialMission() {
    return this.getFlag(OFFSET.TYPE, 2, 0x0);
  }

  get storyMission() {
    return this.getFlag(OFFSET.TYPE, 2, 0x08);
  }

  get missionType() {
    return this.getProperty(OFFSET.TYPE, 2);
  }
  set missionType(type: number) {
    this.setProperty(OFFSET.TYPE, 2, type);
  }

  get missionLocation() {
    return this.getProperty(OFFSET.MISSIONLOCATION, 1);
  }

  get missionRank() {
    return this.getProperty(OFFSET.RANK, 2);
  }

  /**
   * Constructor for a mission
   * @param memory - The memory address of an object
   * @param properties - The buffer holding the information of an object
   * @param displayName - The name of an object
   */
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
  }

  /**
   * @return The ID of the mission.
   */
  getMissionID() {
    return this.getProperty(OFFSET.ID, 2);
  }

  /**
   * Sets the information for the first flag to check if a mission is in rotation for the pub.
   * @param bitOffset - The offset 0-255 of the bit to check
   * @param blockOffset - The block of the bit to set (3 and 4 are common for missions and cutscenes)
   * @param value - The bit value to match at runtime to be considered unlocked
   */
  setUnlockFlag1(bitOffset: number, blockOffset: number, value: 0 | 1) {
    this.setProperty(OFFSET.UNLOCKFLAG1, 1, bitOffset);
    this.setProperty(OFFSET.UNLOCKFLAG1 + 1, 1, blockOffset);
    this.setProperty(OFFSET.UNLOCKFLAG1 + 2, 1, value);
  }

  /**
   * Sets the information for the second flag to check if a mission is in rotation for the pub.
   * @param bitOffset - The offset 0-255 of the bit to check
   * @param blockOffset - The block of the bit to set (3 and 4 are common for missions and cutscenes)
   * @param value - The bit value to match at runtime to be considered unlocked
   */
  setUnlockFlag2(bitOffset: number, blockOffset: number, value: 0 | 1) {
    this.setProperty(OFFSET.UNLOCKFLAG2, 1, bitOffset);
    this.setProperty(OFFSET.UNLOCKFLAG2 + 1, 1, blockOffset);
    this.setProperty(OFFSET.UNLOCKFLAG2 + 2, 1, value);
  }

  /**
   * Sets the information for the third flag to check if a mission is in rotation for the pub.
   * @param bitOffset - The offset 0-255 of the bit to check
   * @param blockOffset - The block of the bit to set (3 and 4 are common for missions and cutscenes)
   * @param value - The bit value to match at runtime to be considered unlocked
   */
  setUnlockFlag3(bitOffset: number, blockOffset: number, value: 0 | 1) {
    this.setProperty(OFFSET.UNLOCKFLAG3, 1, bitOffset);
    this.setProperty(OFFSET.UNLOCKFLAG3 + 1, 1, blockOffset);
    this.setProperty(OFFSET.UNLOCKFLAG3 + 2, 1, value);
  }

  /**
   * Sets the AP to be earned for a mission.
   * @param ap - The amout of AP to set
   */
  setAPReward(ap: number) {
    this.setProperty(OFFSET.AP, 1, ap / 10);
  }

  /**
   * Sets item reward 1 to the specified itemID.
   * @param itemID - The ID to set
   */
  setItemReward1(itemID: number) {
    this.setProperty(OFFSET.ITEMREWARD1, 2, itemID);
  }

  /**
   * @return itemID - The ID of item reward 1
   */
  getItemReward1() {
    return this.getProperty(OFFSET.ITEMREWARD1, 2);
  }

  /**
   * Sets item reward 2 to the specified itemID.
   * @param itemID - The ID to set
   */
  setItemReward2(itemID: number) {
    this.setProperty(OFFSET.ITEMREWARD2, 2, itemID);
  }

  /**
   * @return itemID - The ID of item reward 2
   */
  getItemReward2() {
    return this.getProperty(OFFSET.ITEMREWARD2, 2);
  }

  /**
   * Sets the Recruiting Type to be used
   * @param recruitType The type to be set
   */
  setRecruit(type: number) {
    this.setProperty(OFFSET.RECRUIT, 1, type);
  }

  /**
   * Sets reward item 1 to show the ??? bag symbol in the pub
   * @param value - The bit value to which the flag is set; 1 for hidden
   */
  setHiddenItem1(value: 0 | 1) {
    this.setFlag(OFFSET.HIDDENREWARDFLAGS, 0x06, value);
  }

  /**
   * Sets reward item 2 to show the ??? bag symbol in the pub
   * @param value - The bit value to which the flag is set; 1 for hidden
   */
  setHiddenItem2(value: 0 | 1) {
    this.setFlag(OFFSET.HIDDENREWARDFLAGS, 0x07, value);
  }

  /**
   * Sets More Flags
   * @param value - The value to set, unsure what flags live here
   */
  setMoreFlags(value: number) {
    this.setProperty(OFFSET.MOREFLAGS, 1, value);
  }
}
