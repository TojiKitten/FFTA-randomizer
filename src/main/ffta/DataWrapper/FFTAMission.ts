import { FFTAObject, ROMProperty } from "./FFTAObject";

const enum OFFSET {
  ID = 0x00,
  TYPE = 0x02, // 0B is regular encounter, 02 is dispatch maybe uses flags
  RANK = 0x03, // 2 Bytes of combined info, bottom 3 bits are rank, next 3 are where city appears, next 1 is cancellations allowed
  // 0 anywhere, 1 Cyril, 2 Muscadet, 3 Baguba, 4 Nowhere, 5 Sprohm, 6 Cadoan, 7 nowhere
  UNLOCKFLAG1 = 0x05, // 3 Bytes (Bit Offset, Row Offset * 0x20, Value)
  UNLOCKFLAG2 = 0x08, // 3 Bytes (Bit Offset, Row Offset * 0x20, Value)
  UNLOCKFLAG3 = 0x0b, // 3 Bytes (Bit Offset, Row Offset * 0x20, Value)
  PUBVISIBILITY = 0x0e, // first 5 bits are actives days on pub list, last 3 bits are month available
  DAYSAVAILABLE = 0x0f, // 0-2 ??, 3 - 10 days on map, 11 - 15 unknown
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
  TIMEOUTDAYS = 0x40,
  MISSIONDISPLAY = 0x41, // Hide Item 1, Hide Item 2, ?? ?? // Repeatable, ??, ??, No Cancel
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

type FFTAMonth = "Kingmoon" | "Madmoon" | "Sagemoon" | "Huntmoon" | "Bardmoon";

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

  set missionType(type: number) {
    this.setProperty(OFFSET.TYPE, 1, type);
  }
  get missionType(): number {
    return this.getProperty(OFFSET.TYPE, 1);
  }

  get storyMission(): 0 | 1 {
    return this.getFlag(OFFSET.RANK, 2, 0x00) as 0 | 1;
  }

  get specialMission(): 0 | 1 {
    return this.getFlag(OFFSET.TYPE, 1, 0x0) as 0 | 1;
  }

  set encounterMission(bit: 0 | 1) {
    this.setFlag(OFFSET.TYPE, 1, 0x3, bit);
  }
  get encounterMission(): 0 | 1 {
    return this.getFlag(OFFSET.TYPE, 1, 0x3) as 0 | 1;
  }

  get linkMission(): number {
    return this.getFlag(OFFSET.TYPE, 1, 0x4);
  }

  get missionRank(): number {
    return (this.getProperty(OFFSET.RANK, 2) & (7 << 5)) >> 5;
  }

  get cityAppearance(): number {
    return (this.getProperty(OFFSET.RANK, 2) & (7 << 2)) >> 2;
  }
  set cityAppearance(cityID: number) {
    const proposedValue = cityID << 2;
    const currentValue = this.cityAppearance << 2;
    const newValue =
      this.getProperty(OFFSET.TYPE, 2) - currentValue + proposedValue;

    this.setProperty(OFFSET.TYPE, 2, newValue);
  }

  private _pubVisibility: ROMProperty = {
    byteOffset: OFFSET.PUBVISIBILITY,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set daysVisible(days: number) {
    days = Math.min(0xf8 >> 3, Math.max(0, days));
    this._pubVisibility.value = (this._pubVisibility.value & 0x7) + (days << 3);
  }
  get daysVisible(): number {
    return this._pubVisibility.value >> 3;
  }
  set monthVisibile(month: FFTAMonth | "Any") {
    let monthValue = 0;
    switch (month) {
      case "Any":
        monthValue = 0;
        break;
      case "Kingmoon":
        monthValue = 1;
        break;
      case "Madmoon":
        monthValue = 2;
        break;
      case "Sagemoon":
        monthValue = 3;
        break;
      case "Huntmoon":
        monthValue = 4;
        break;
      case "Bardmoon":
        monthValue = 5;
        break;
    }
    this._pubVisibility.value = (this._pubVisibility.value & 0xf1) + monthValue;
  }
  get monthVisibile(): FFTAMonth | "Any" {
    const monthValue = this._pubVisibility.value & 0x7;
    switch (monthValue) {
      case 0:
        return "Any";
      case 1:
        return "Kingmoon";
      case 2:
        return "Madmoon";
      case 3:
        return "Sagemoon";
      case 4:
        return "Huntmoon";
      case 5:
        return "Bardmoon";
      default:
        throw new Error("Visbile Month Not Supported");
    }
  }

  private _daysAvailable: ROMProperty = {
    byteOffset: OFFSET.DAYSAVAILABLE,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set daysAvaiblable(days: number) {
    days = Math.min((1 << 8) - 1, Math.max(0, days));
    this._daysAvailable.value =
      (this._daysAvailable.value & 0xf807) + (days << 3);
  }
  get daysAvaiblable(): number {
    return (this._daysAvailable.value >> 3) & ((1 << 8) - 1);
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
  get requiredItem1(): number {
    return this.getProperty(OFFSET.REQITEM1, 2);
  }

  set requiredItem2(id: number) {
    this.setProperty(OFFSET.REQITEM2, 2, id);
  }
  get requiredItem2(): number {
    return this.getProperty(OFFSET.REQITEM2, 2);
  }

  set requiredJob(id: number) {
    this.setProperty(OFFSET.REQITEM2, 2, id);
  }
  get requiredJob(): number {
    return this.getProperty(OFFSET.REQITEM2, 1);
  }

  set price(amount: number) {
    this.setProperty(OFFSET.PRICE, 1, Math.min(0xff, amount / 300));
  }
  get price(): number {
    return this.getProperty(OFFSET.PRICE, 1) * 300;
  }

  private _timeoutDays: ROMProperty = {
    byteOffset: OFFSET.TIMEOUTDAYS,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set timeoutDays(days: number) {
    days = Math.min(0xff, days);
    this._timeoutDays.value = days;
  }
  get timeoutDays(): number {
    return this._timeoutDays.value;
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
  set missionLocation(locationID: number) {
    this.setProperty(OFFSET.MISSIONLOCATION, 1, locationID);
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

  write(rom: Uint8Array) {
    const properties: Array<ROMProperty> = [
      this._pubVisibility,
      this._daysAvailable,
      this._timeoutDays,
    ];

    properties.forEach((property) => {
      this.writeProperty(property, rom);
    });
  }

  toString = (): string => {
    return `Mission Name: ${this.displayName} (#${this.missionID})
    Memory: ${this.memory.toString(16)}
    Item Reward 1: ${this.itemReward1.toString(16)}
    Item Reward 2: ${this.itemReward2.toString(16)}
    `;
  };
}
