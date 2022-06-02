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
  // ???, Hide from OW Menu, ??? Law 2, ??? Law 1
  MISSIONLOCATION = 0x45, // Used for encounters and loading cut scenes
}

const enum TYPEFLAG {
  STORY = 0x0,
  ENCOUNTERTYPE = 0x1,
  ENCOUNTER = 0x3,
  LINK = 0x4,
}

const enum ENCOUNTERTYPE {
  CLAN = 0x0,
  NORMAL = 0x1,
  WALKON = 0x2,
}

const enum RANKOFFSET {
  RANK = 0x4,
  ELITE = 0x07,
  CITYPICKUP = 0x8,
}

const enum DISPLAYFLAG {
  CANCEL = 0x0,
  REPEATABLE = 0x3,
  ITEM1HIDDEN = 0x6,
  ITEM2HIDDEN = 0x7,
  LAWCARD1HIDDEN = 0x8,
  LAWCARD2HIDDEN = 0x9,
  HIDEONMENU = 0xa,
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
    super(memory, name);
    this.load(properties);
  }

  toString = (): string => {
    return `
    Mission Name: ${this.displayName} (#${this.missionID})
    Type: ${this.missionType.toString(16)}
    Rank: ${this.missionRank}
    Memory: ${this.memory.toString(16)}
    Unlock 1: ${
      this._unlockFlag1Offset.value.toString(16) +
      " " +
      this._unlockFlag1Block.value.toString(16) +
      " " +
      this._unlockFlag1Value.value.toString(16)
    }
    Item Reward 1: ${this.itemReward1.toString(16)}
    Item Reward 2: ${this.itemReward2.toString(16)}
    `;
  };

  private _missionID: ROMProperty = {
    byteOffset: OFFSET.ID,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get missionID() {
    return this._missionID.value;
  }
  set missionID(id: number) {
    this._missionID.value = id;
  }

  private _missionType: ROMProperty = {
    byteOffset: OFFSET.TYPE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get missionType() {
    return this._missionType.value;
  }
  set missionType(value: number) {
    this._missionType.value = value;
  }

  get storyMission(): boolean {
    return ((this._missionType.value >> TYPEFLAG.STORY) & 0x1) === 0x1
      ? true
      : false;
  }
  set storyMission(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._missionType.value =
      (this._missionType.value & ~(1 << TYPEFLAG.STORY)) |
      (value << TYPEFLAG.STORY);
  }

  get encounterMission(): boolean {
    return ((this._missionType.value >> TYPEFLAG.ENCOUNTER) & 0x1) === 0x1
      ? true
      : false;
  }
  set encounterMission(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._missionType.value =
      (this._missionType.value & ~(1 << TYPEFLAG.ENCOUNTER)) |
      (value << TYPEFLAG.ENCOUNTER);
  }

  get encounterType(): number {
    return (this._missionType.value >> TYPEFLAG.ENCOUNTERTYPE) & 0x2;
  }
  set encounterType(type: number) {
    this._missionType.value =
      (this._missionType.value & ~(2 << TYPEFLAG.ENCOUNTERTYPE)) |
      (type << TYPEFLAG.ENCOUNTERTYPE);
  }

  get linkMission(): boolean {
    return ((this._missionType.value >> TYPEFLAG.LINK) & 0x1) === 0x1
      ? true
      : false;
  }
  set linkMission(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._missionType.value =
      (this._missionType.value & ~(1 << TYPEFLAG.LINK)) |
      (value << TYPEFLAG.LINK);
  }

  private _rank: ROMProperty = {
    byteOffset: OFFSET.RANK,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get eliteMission(): boolean {
    return ((this._rank.value >> RANKOFFSET.ELITE) & 0x1) === 0x1
      ? true
      : false;
  }
  set eliteMission(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._rank.value =
      (this._rank.value & ~(1 << RANKOFFSET.ELITE)) |
      (value << RANKOFFSET.ELITE);
  }
  get missionRank(): number {
    return (this._rank.value >> RANKOFFSET.RANK) & 0x7;
  }
  set missionRank(rank: number) {
    this._rank.value =
      (this._rank.value & ~(0x7 << RANKOFFSET.RANK)) |
      (rank << RANKOFFSET.RANK);
  }
  get cityAppearance(): number {
    return (this._rank.value >> RANKOFFSET.CITYPICKUP) & 0x7;
  }
  set cityAppearance(rank: number) {
    this._rank.value =
      (this._rank.value & ~(0x7 << RANKOFFSET.CITYPICKUP)) |
      (rank << RANKOFFSET.CITYPICKUP);
  }

  private _pubVisibility: ROMProperty = {
    byteOffset: OFFSET.PUBVISIBILITY,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set daysVisible(days: number) {
    days = Math.min(0x1f, Math.max(0, days));
    this._pubVisibility.value =
      (this._pubVisibility.value & ~(0x1f << 3)) | (days << 3);
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
    this._pubVisibility.value = (this._pubVisibility.value & ~0x7) | monthValue;
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

  private _itemReward1: ROMProperty = {
    byteOffset: OFFSET.ITEMREWARD1,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set itemReward1(id: number) {
    this._itemReward1.value = id;
  }
  get itemReward1(): number {
    return this._itemReward1.value;
  }

  private _itemReward2: ROMProperty = {
    byteOffset: OFFSET.ITEMREWARD2,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set itemReward2(id: number) {
    this._itemReward2.value = id;
  }
  get itemReward2(): number {
    return this._itemReward2.value;
  }

  private _gilReward: ROMProperty = {
    byteOffset: OFFSET.GILREWARD,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set gilReward(amount: number) {
    this._gilReward.value = amount;
  }
  get gilReward(): number {
    return this._gilReward.value;
  }

  private _apReward: ROMProperty = {
    byteOffset: OFFSET.AP,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set apReward(amount: number) {
    this._apReward.value = amount;
  }
  get apReward(): number {
    return this._apReward.value;
  }

  private _recruit: ROMProperty = {
    byteOffset: OFFSET.RECRUIT,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set recruit(id: number) {
    this._recruit.value = id;
  }
  get recruit(): number {
    return this._recruit.value;
  }

  private _requiredItem1: ROMProperty = {
    byteOffset: OFFSET.REQITEM1,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set requiredItem1(id: number) {
    this._requiredItem1.value = id;
  }
  get requiredItem1(): number {
    return this._requiredItem1.value;
  }

  private _requiredItem2: ROMProperty = {
    byteOffset: OFFSET.REQITEM2,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set requiredItem2(id: number) {
    this._requiredItem2.value = id;
  }
  get requiredItem2(): number {
    return this._requiredItem2.value;
  }

  private _requiredSkill: ROMProperty = {
    byteOffset: OFFSET.REQSKILL,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set requiredSkill(id: number) {
    this._requiredSkill.value = id;
  }
  get requiredSkill(): number {
    return this._requiredSkill.value;
  }

  private _requiredSkillAmount: ROMProperty = {
    byteOffset: OFFSET.REQSKILLAMOUNT,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set requiredSkillAmount(id: number) {
    this._requiredSkillAmount.value = id;
  }
  get requiredSkillAmount(): number {
    return this._requiredSkillAmount.value;
  }

  /*
  private _requiredJob: ROMProperty = {
    byteOffset: ??,
    byteLength: ??,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set requiredItem2(id: number) {
    this._requiredJob.value = id;
  }
  get requiredItem2(): number {
    return this._requiredJob.value;
  }*/

  private _price: ROMProperty = {
    byteOffset: OFFSET.PRICE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  set price(amount: number) {
    this._price.value = Math.floor(Math.min(0xff, amount / 300));
  }
  get price(): number {
    return this._price.value * 300;
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

  private _missionDisplay: ROMProperty = {
    byteOffset: OFFSET.MISSIONDISPLAY,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get cancelable(): boolean {
    return ((this._missionDisplay.value >> DISPLAYFLAG.CANCEL) & 0x1) === 0x1
      ? true
      : false;
  }
  set cancelable(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._missionDisplay.value =
      (this._missionDisplay.value & ~(1 << DISPLAYFLAG.CANCEL)) |
      (value << DISPLAYFLAG.CANCEL);
  }
  get repeatable(): boolean {
    return ((this._missionDisplay.value >> DISPLAYFLAG.REPEATABLE) & 0x1) ===
      0x1
      ? true
      : false;
  }
  set repeatable(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._missionDisplay.value =
      (this._missionDisplay.value & ~(1 << DISPLAYFLAG.REPEATABLE)) |
      (value << DISPLAYFLAG.REPEATABLE);
  }

  get itemReward1Hidden(): boolean {
    return ((this._missionDisplay.value >> DISPLAYFLAG.ITEM1HIDDEN) & 0x1) ===
      0x1
      ? true
      : false;
  }
  set itemReward1Hidden(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._missionDisplay.value =
      (this._missionDisplay.value & ~(1 << DISPLAYFLAG.ITEM1HIDDEN)) |
      (value << DISPLAYFLAG.ITEM1HIDDEN);
  }
  get itemReward2Hidden(): boolean {
    return ((this._missionDisplay.value >> DISPLAYFLAG.ITEM2HIDDEN) & 0x1) ===
      0x1
      ? true
      : false;
  }
  set itemReward2Hidden(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._missionDisplay.value =
      (this._missionDisplay.value & ~(1 << DISPLAYFLAG.ITEM2HIDDEN)) |
      (value << DISPLAYFLAG.ITEM2HIDDEN);
  }
  get lawCard1Hidden(): boolean {
    return ((this._missionDisplay.value >> DISPLAYFLAG.LAWCARD1HIDDEN) &
      0x1) ===
      0x1
      ? true
      : false;
  }
  set lawCard1Hidden(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._missionDisplay.value =
      (this._missionDisplay.value & ~(1 << DISPLAYFLAG.LAWCARD1HIDDEN)) |
      (value << DISPLAYFLAG.LAWCARD1HIDDEN);
  }
  get lawCard2Hidden(): boolean {
    return ((this._missionDisplay.value >> DISPLAYFLAG.LAWCARD2HIDDEN) &
      0x1) ===
      0x1
      ? true
      : false;
  }
  set lawCard2Hidden(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._missionDisplay.value =
      (this._missionDisplay.value & ~(1 << DISPLAYFLAG.LAWCARD2HIDDEN)) |
      (value << DISPLAYFLAG.LAWCARD2HIDDEN);
  }
  get hideOnLocationMenu(): boolean {
    return ((this._missionDisplay.value >> DISPLAYFLAG.HIDEONMENU) & 0x1) ===
      0x1
      ? true
      : false;
  }
  set hideOnLocationMenu(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._missionDisplay.value =
      (this._missionDisplay.value & ~(1 << DISPLAYFLAG.HIDEONMENU)) |
      (value << DISPLAYFLAG.HIDEONMENU);
  }

  private _missionLocation: ROMProperty = {
    byteOffset: OFFSET.MISSIONLOCATION,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get missionLocation(): number {
    return this._missionLocation.value;
  }
  set missionLocation(locationID: number) {
    this._missionLocation.value = locationID;
  }

  private _unlockFlag1Offset: ROMProperty = {
    byteOffset: OFFSET.UNLOCKFLAG1,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _unlockFlag1Block: ROMProperty = {
    byteOffset: OFFSET.UNLOCKFLAG1 + 1,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _unlockFlag1Value: ROMProperty = {
    byteOffset: OFFSET.UNLOCKFLAG1 + 2,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  /**
   * Sets the information for the first flag to check if a mission is in rotation for the pub.
   * @param bitOffset - The offset 0-255 of the bit to check
   * @param blockOffset - The block of the bit to set (3 and 4 are common for missions and cutscenes)
   * @param value - The bit value to match at runtime to be considered unlocked
   */
  setUnlockFlag1(bitOffset: number, blockOffset: number, value: 0 | 1) {
    this._unlockFlag1Offset.value = bitOffset;
    this._unlockFlag1Block.value = blockOffset;
    this._unlockFlag1Value.value = value;
  }

  private _unlockFlag2Offset: ROMProperty = {
    byteOffset: OFFSET.UNLOCKFLAG2,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _unlockFlag2Block: ROMProperty = {
    byteOffset: OFFSET.UNLOCKFLAG2 + 1,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _unlockFlag2Value: ROMProperty = {
    byteOffset: OFFSET.UNLOCKFLAG2 + 2,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  /**
   * Sets the information for the second flag to check if a mission is in rotation for the pub.
   * @param bitOffset - The offset 0-255 of the bit to check
   * @param blockOffset - The block of the bit to set (3 and 4 are common for missions and cutscenes)
   * @param value - The bit value to match at runtime to be considered unlocked
   */
  setUnlockFlag2(bitOffset: number, blockOffset: number, value: 0 | 1) {
    this._unlockFlag2Offset.value = bitOffset;
    this._unlockFlag2Block.value = blockOffset;
    this._unlockFlag2Value.value = value;
  }

  private _unlockFlag3Offset: ROMProperty = {
    byteOffset: OFFSET.UNLOCKFLAG3,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _unlockFlag3Block: ROMProperty = {
    byteOffset: OFFSET.UNLOCKFLAG3 + 1,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _unlockFlag3Value: ROMProperty = {
    byteOffset: OFFSET.UNLOCKFLAG3 + 2,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  /**
   * Sets the information for the third flag to check if a mission is in rotation for the pub.
   * @param bitOffset - The offset 0-255 of the bit to check
   * @param blockOffset - The block of the bit to set (3 and 4 are common for missions and cutscenes)
   * @param value - The bit value to match at runtime to be considered unlocked
   */
  setUnlockFlag3(bitOffset: number, blockOffset: number, value: 0 | 1) {
    this._unlockFlag3Offset.value = bitOffset;
    this._unlockFlag3Block.value = blockOffset;
    this._unlockFlag3Value.value = value;
  }
}
