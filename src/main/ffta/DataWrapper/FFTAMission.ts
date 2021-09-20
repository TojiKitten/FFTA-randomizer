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
  GILREWARD = 0x33,
  AP = 0x34,
  RECRUIT = 0x35,
  REQITEM1 = 0x36, // 0x01 = Magic Trophy as required
  REQITEM2 = 0x37,
  REQSKILL = 0x38, // 0x01 = Combat
  REQSKILLAMOUNT = 0x39, //0x01 = level 8? maybe tied to "difficulty"
  PRICE = 0x3e,
  MISSIONDISPLAY = 0x41,
  MOREFLAGS = 0x42, // ???, Hide from OW Menu, ??? Law 2, ??? Law 1
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
  /**
   * Constructor for a mission
   * @param memory - The memory address of an object
   * @param properties - The buffer holding the information of an object
   * @param displayName - The name of an object
   */
  constructor(memory: number, name: string, properties: Uint8Array) {
    super(memory, properties, name);
  }

  get missionID(): number {
    return this.getProperty(OFFSET.ID, 2);
  }

  get specialMission(): 0 | 1 {
    return this.getFlag(OFFSET.TYPE, 2, 0x0) as 0 | 1;
  }

  get storyMission(): 0 | 1 {
    return this.getFlag(OFFSET.TYPE, 2, 0x08) as 0 | 1;
  }

  set encounterMission(bit: 0 | 1) {
    this.setFlag(OFFSET.TYPE, 2, 0xb, bit);
  }
  get encounterMission(): 0 | 1 {
    return this.getFlag(OFFSET.TYPE, 2, 0xb) as 0 | 1;
  }

  get linkMission(): number {
    return this.getFlag(OFFSET.TYPE, 2, 0xc);
  }

  get missionRank(): number {
    return this.getProperty(OFFSET.RANK, 2);
  }

  set missionType(type: number) {
    this.setProperty(OFFSET.TYPE, 2, type);
  }
  get missionType(): number {
    return this.getProperty(OFFSET.TYPE, 2);
  }

  set pickUpInfo(value: number) {
    this.setProperty(OFFSET.PICKUPINFO, 2, value);
  }
  get pickUpInfo(): number {
    return this.getProperty(OFFSET.PICKUPINFO, 2);
  }

  set itemReward1(itemID: number) {
    this.setProperty(OFFSET.ITEMREWARD1, 2, itemID);
  }
  get itemReward1(): number {
    return this.getProperty(OFFSET.ITEMREWARD1, 2);
  }

  set itemReward2(itemID: number) {
    this.setProperty(OFFSET.ITEMREWARD2, 2, itemID);
  }
  get itemReward2(): number {
    return this.getProperty(OFFSET.ITEMREWARD2, 2);
  }

  set gilReward(amount: number) {
    this.setProperty(OFFSET.GILREWARD, 1, amount);
  }
  get gilReward(): number {
    return this.getProperty(OFFSET.GILREWARD, 1);
  }

  set apReward(ap: number) {
    this.setProperty(OFFSET.AP, 1, ap);
  }
  get apReward(): number {
    return this.getProperty(OFFSET.AP, 1);
  }

  set recruit(id: number) {
    this.setProperty(OFFSET.RECRUIT, 1, id);
  }
  get recruit(): number {
    return this.getProperty(OFFSET.RECRUIT, 1);
  }

  set requiredItem1(id: number) {
    this.setProperty(OFFSET.REQITEM1, 2, id);
  }
  get reqiredItem1(): number {
    return this.getProperty(OFFSET.REQITEM1, 1);
  }

  set requiredItem2(id: number) {
    this.setProperty(OFFSET.REQITEM2, 2, id);
  }
  get reqiredItem2(): number {
    return this.getProperty(OFFSET.REQITEM2, 1);
  }

  set requiredJob(id: number) {
    this.setProperty(OFFSET.REQITEM2, 2, id);
  }
  get reqiredJob(): number {
    return this.getProperty(OFFSET.REQITEM2, 1);
  }

  set price(amount: number) {
    this.setProperty(OFFSET.PRICE, 1, Math.min(0xff, amount / 300));
  }
  get price(): number {
    return this.getProperty(OFFSET.PRICE, 1) * 300;
  }

  set itemReward1Hidden(bit: 0 | 1) {
    this.setFlag(OFFSET.MISSIONDISPLAY, 2, 0x06, bit);
  }
  get itemReward1Hidden(): 0 | 1 {
    return this.getFlag(OFFSET.MISSIONDISPLAY, 2, 0x06) as 0 | 1;
  }

  set itemReward2Hidden(bit: 0 | 1) {
    this.setFlag(OFFSET.MISSIONDISPLAY, 2, 0x07, bit);
  }
  get itemReward2Hidden(): 0 | 1 {
    return this.getFlag(OFFSET.MISSIONDISPLAY, 2, 0x07) as 0 | 1;
  }

  set lawCard1Hidden(bit: 0 | 1) {
    this.setFlag(OFFSET.MISSIONDISPLAY, 2, 0x08, bit);
  }
  get lawCard1Hidden(): 0 | 1 {
    return this.getFlag(OFFSET.MISSIONDISPLAY, 2, 0x08) as 0 | 1;
  }

  set lawCard2Hidden(bit: 0 | 1) {
    this.setFlag(OFFSET.MISSIONDISPLAY, 2, 0x09, bit);
  }
  get lawCard2Hidden(): 0 | 1 {
    return this.getFlag(OFFSET.MISSIONDISPLAY, 2, 0x09) as 0 | 1;
  }

  set hideOnLocationMenu(bit: 0 | 1) {
    this.setFlag(OFFSET.MISSIONDISPLAY, 2, 0x0a, bit);
  }
  get hideOnLocationMenu(): 0 | 1 {
    return this.getFlag(OFFSET.MISSIONDISPLAY, 2, 0x0a) as 0 | 1;
  }

  get missionLocation(): number {
    return this.getProperty(OFFSET.MISSIONLOCATION, 1);
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
   * Sets More Flags
   * @param value - The value to set, unsure what flags live here
   */
  setMoreFlags(value: number) {
    this.setProperty(OFFSET.MOREFLAGS, 1, value);
  }
}
