import { FFTAData, FFTAObject } from "../data";
import * as FFTAUtils from "../FFTAUtils";

const enum ITEMOFFSET {
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
export class FFTAItem implements FFTAObject {
  itemID = -1;
  properties: Uint8Array;
  memory = -1;
  displayName = "";
  allowed = false;

  constructor(
    memory: number,
    id: number,
    itemName: string,
    properties: Uint8Array
  ) {
    // Save FFTAObject Properties
    this.memory = memory;
    this.itemID = id;
    this.displayName = itemName;
    this.properties = properties;
    this.allowed = true;
  }

  setBuyPrice(value: number) {
    this.setProperty(ITEMOFFSET.BUY, value);
  }

  setSellPrice(value: number) {
    this.setProperty(ITEMOFFSET.SELL, value);
  }

  setType(value: number) {
    this.setProperty(ITEMOFFSET.TYPE, value);
  }

  setElement(value: number) {
    this.setProperty(ITEMOFFSET.ELEMENT, value);
  }

  setRange(value: number) {
    this.setProperty(ITEMOFFSET.RANGE, value);
  }

  setWorn(value: number) {
    this.setProperty(ITEMOFFSET.WORN, value);
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
    this.setProperty(ITEMOFFSET.NONO, value);
  }

  setAttack(value: number) {
    this.setProperty(ITEMOFFSET.ATTACK, value);
  }

  setDefense(value: number) {
    this.setProperty(ITEMOFFSET.DEFENSE, value);
  }

  setPower(value: number) {
    this.setProperty(ITEMOFFSET.POWER, value);
  }

  setResistance(value: number) {
    this.setProperty(ITEMOFFSET.RESISTANCE, value);
  }

  setSpeed(value: number) {
    this.setProperty(ITEMOFFSET.SPEED, value);
  }

  setEvade(value: number) {
    this.setProperty(ITEMOFFSET.EVADE, value);
  }

  setMove(value: number) {
    this.setProperty(ITEMOFFSET.MOVE, value);
  }

  setJump(value: number) {
    this.setProperty(ITEMOFFSET.JUMP, value);
  }

  setEffect1(value: number) {
    this.setProperty(ITEMOFFSET.EFFECT1, value);
  }

  setEffect2(value: number) {
    this.setProperty(ITEMOFFSET.EFFECT2, value);
  }

  setEffect3(value: number) {
    this.setProperty(ITEMOFFSET.EFFECT3, value);
  }

  setAbilitySet(value: number) {
    this.setProperty(ITEMOFFSET.ABILITYSET, value);
  }

  private setFlag(flag: ITEMFLAG, value: 0 | 1): void {
    let mask = 0x1 << flag;
    let newFlags = new Uint8Array([
      (this.properties[ITEMOFFSET.FLAGS] & ~mask) | (value << flag),
    ]);
    this.properties.set(newFlags, ITEMOFFSET.FLAGS);
  }

  private setProperty(offset: ITEMOFFSET, value: number): void {
    // Should be using setFlag()
    if (offset != ITEMOFFSET.FLAGS) {
      let newValue;
      // These are Shorts, need to conver the number to a Uint8Array with correct endianness
      if (offset === ITEMOFFSET.BUY || offset === ITEMOFFSET.SELL) {
        this.properties.set(FFTAUtils.getShortUint8Array(value, true), offset);
      } else {
        this.properties.set(new Uint8Array([value]), offset);
      }
    }
  }
}

export default FFTAItem;
