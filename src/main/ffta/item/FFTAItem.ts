import { FFTAObject } from "../FFTAObject";
import * as FFTAUtils from "../FFTAUtils";

const enum OFFSET {
  BUY = 0x04,
  SELL = 0x06,
  // See Item enum for order, Sword = 1
  TYPE = 0x08,
  ELEMENT = 0x09,
  RANGE = 0x0a,
  // One Hand or Two Hands
  WORN = 0x0b,
  // See ITEMFLAG Enum
  FLAGS = 0x0c,
  // Type of item that this appears under in Nono's Link Shop
  NONO = 0x0e,
  ATTACK = 0x10,
  DEFENSE = 0x11,
  POWER = 0x12,
  RESISTANCE = 0x13,
  SPEED = 0x14,
  EVADE = 0x15,
  MOVE = 0x16,
  JUMP = 0x17,
  // ID of the effect
  EFFECT1 = 0x1a,
  EFFECT2 = 0x1b,
  EFFECT3 = 0x1c,
  // ID of the ability set
  ABILITYSET = 0x1d,
}

export const enum ITEMTYPES{
  Null = 0,
  Sword = 1,
  Blade = 2,
  Saber = 3,
  KnightSword,
  GreatSword,
  BroadSword,
  Knife,
  Rapier,
  Katana,
  Staff,
  Rod,
  Mace,
  Bow,
  GreatBow,
  Spear,
  Instrument,
  Knuckle,
  Soul,
  Gun,
  Shield,
  Helmet,
  Ribbon,
  Hat,
  Armor,
  Cloth,
  Robe,
  Shoes,
  Armlet,
  Accessory,
  Consumable,
}
const enum ITEMFLAG {
  DOUBLESWORD = 0x0,
  DOUBLEHAND = 0x1,
  MONKEYGRIP = 0x2,
  DISCOUNT = 0x3,
  TIER1 = 0x4,
  TIER2 = 0x5,
  TIER3 = 0x6,
  MYTHRILORCONSUMABLE = 0x7,
}

// ==== Class ====
export class FFTAItem extends FFTAObject {
  constructor(
    memory: number,
    itemName: string,
    properties: Uint8Array
  ) {
    super(memory, properties, itemName);
  }

  setBuyPrice(value: number) {
    this.setProperty(OFFSET.BUY, 2, value);
  }

  setSellPrice(value: number) {
    this.setProperty(OFFSET.SELL, 2, value);
  }

  setType(value: number) {
    this.setProperty(OFFSET.TYPE, 1, value);
  }

  getType(): number {
    return this.properties[OFFSET.TYPE];
  }

  setElement(value: number) {
    this.setProperty(OFFSET.ELEMENT, 1, value);
  }

  setRange(value: number) {
    this.setProperty(OFFSET.RANGE, 1, value);
  }

  setWorn(value: number) {
    this.setProperty(OFFSET.WORN, 1, value);
  }

  getWorn(): number {
    return this.properties[OFFSET.WORN];
  }

  setDoubleSword(value: 0 | 1) {
    this.setFlag(ITEMFLAG.DOUBLESWORD, value);
  }

  setDoubleHand(value: 0 | 1) {
    this.setFlag(ITEMFLAG.DOUBLEHAND, value);
  }

  setMonkeyGrip(value: 0 | 1) {
    this.setFlag(ITEMFLAG.MONKEYGRIP, value);
  }

  setDiscount(value: 0 | 1) {
    this.setFlag(ITEMFLAG.DISCOUNT, value);
  }

  setTier1(value: 0 | 1) {
    this.setFlag(ITEMFLAG.TIER1, value);
  }

  setTier2(value: 0 | 1) {
    this.setFlag(ITEMFLAG.TIER2, value);
  }

  setTier3(value: 0 | 1) {
    this.setFlag(ITEMFLAG.TIER3, value);
  }

  setMythrilOrConsumable(value: 0 | 1) {
    this.setFlag(ITEMFLAG.MYTHRILORCONSUMABLE, value);
  }

  setNono(value: number) {
    this.setProperty(OFFSET.NONO, 1, value);
  }

  setAttack(value: number) {
    this.setProperty(OFFSET.ATTACK, 1, value);
  }

  setDefense(value: number) {
    this.setProperty(OFFSET.DEFENSE, 1, value);
  }

  setPower(value: number) {
    this.setProperty(OFFSET.POWER, 1, value);
  }

  setResistance(value: number) {
    this.setProperty(OFFSET.RESISTANCE, 1, value);
  }

  setSpeed(value: number) {
    this.setProperty(OFFSET.SPEED, 1, value);
  }

  setEvade(value: number) {
    this.setProperty(OFFSET.EVADE, 1, value);
  }

  setMove(value: number) {
    this.setProperty(OFFSET.MOVE, 1, value);
  }

  setJump(value: number) {
    this.setProperty(OFFSET.JUMP, 1, value);
  }

  setEffect1(value: number) {
    this.setProperty(OFFSET.EFFECT1, 1, value);
  }

  setEffect2(value: number) {
    this.setProperty(OFFSET.EFFECT2, 1, value);
  }

  setEffect3(value: number) {
    this.setProperty(OFFSET.EFFECT3, 1, value);
  }

  setAbilitySet(value: number) {
    this.setProperty(OFFSET.ABILITYSET, 1, value);
  }

  private setFlag(flag: ITEMFLAG, value: 0 | 1): void {
    let mask = 0x1 << flag;
    let newFlags = new Uint8Array([
      (this.properties[OFFSET.FLAGS] & ~mask) | (value << flag),
    ]);
    this.properties.set(newFlags, OFFSET.FLAGS);
  }

  balanceItemPrice() {
    let attack = this.properties[OFFSET.ATTACK];
    let power = this.properties[OFFSET.POWER];
    let defense = this.properties[OFFSET.DEFENSE];
    let resistance = this.properties[OFFSET.RESISTANCE];

    /* 
    // Make item's price based on its 
    // highest Offsensive Stat and Defensive Stat
    // Increases exponentially
    */
    let newBuy =
      Math.pow(Math.log10(Math.exp(Math.max(attack, power))), 3) +
      Math.pow(Math.log10(Math.exp(Math.max(defense, resistance))), 3);
    newBuy = Math.max(300, Math.round(newBuy / 100) * 100);
    this.setBuyPrice(newBuy);
    this.setSellPrice(newBuy * 0.5);
  }
}

export class FFTARewardItemSet extends FFTAObject {
  constructor(memory: number, properties: Uint8Array) {
    super(memory, properties, undefined);
  }
}

export default FFTAItem;
