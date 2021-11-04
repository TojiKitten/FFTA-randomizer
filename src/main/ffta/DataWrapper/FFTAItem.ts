import { FFTAObject, ROMProperty } from "./FFTAObject";

const enum OFFSET {
  NAME = 0x0,
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

export const enum ITEMTYPES {
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

export interface ItemLite {
  displayName: string;
  buyPrice: number;
  sellPrice: number;
  itemAbilities: Array<ItemAbility>;
  memory: number;
}

interface ItemAbility {
  jobID: number;
  abilityID: number;
}

/**
 * An {@link FFTAObject} representing an item that is able to appear in the shop.
 */
export class FFTAItem extends FFTAObject {
  readonly ITEMIDOFFSET: number = 1;
  itemID: number = -1;
  itemAbilities: Array<ItemAbility>;

  /**
   * Constructor for an Item
   * @param memory - The address of the ROM
   * @param itemName - The name of the ability
   * @param properties - A buffer starting from the address in the ROM
   */
  constructor(
    memory: number,
    itemName: string,
    itemID: number,
    properties?: Uint8Array
  ) {
    super(memory, itemName);
    this.itemID = itemID;
    if (properties) this.load(properties);
  }

  /**
   * Returns lightweight information for the item
   */
  getItemInfo(): ItemLite {
    return {
      displayName: this.displayName!,
      buyPrice: this.buyPrice,
      sellPrice: this.sellPrice,
      itemAbilities: this.itemAbilities,
      memory: this.memory,
    };
  }

  /**
   * Creates a new array of {@link ItemAbility} for an item.
   * @param abilitySetData The Uint8Array holding the memory block where the item abilities are stored
   */
  updateItemAbilities(abilitySetData: Uint8Array) {
    let abilitySet = new Array<ItemAbility>();
    for (var i = 0; i < abilitySetData[0]; i++) {
      abilitySet.push({
        jobID: abilitySetData[i * 2 + 2],
        abilityID: abilitySetData[i * 2 + 3],
      });
    }

    this.itemAbilities = abilitySet;
  }

  /**
   * Changes the item buy and sell price to be proportionate to its primary Offensive and Defensive stat.
   */
  balanceItemPrice() {
    /* 
    // Make item's price based on its 
    // highest Offsensive Stat and Defensive Stat
    // Increases exponentially
    */
    let newBuy =
      Math.pow(Math.log10(Math.exp(Math.max(this.attack, this.power))), 3) +
      Math.pow(
        Math.log10(Math.exp(Math.max(this.defense, this.resistance))),
        3
      );
    newBuy = Math.max(300, Math.round(newBuy / 100) * 100);
    this.buyPrice = newBuy;
    this.sellPrice = newBuy * 0.5;
  }

  private _buyPrice: ROMProperty = {
    byteOffset: OFFSET.BUY,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get buyPrice() {
    return this._buyPrice.value;
  }
  set buyPrice(price: number) {
    this._buyPrice.value = price;
  }

  private _sellPrice: ROMProperty = {
    byteOffset: OFFSET.SELL,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get sellPrice() {
    return this._sellPrice.value;
  }
  set sellPrice(price: number) {
    this._sellPrice.value = price;
  }

  private _itemType: ROMProperty = {
    byteOffset: OFFSET.TYPE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get itemType() {
    return this._itemType.value;
  }
  set itemType(id: number) {
    this._itemType.value = id;
  }

  private _element: ROMProperty = {
    byteOffset: OFFSET.ELEMENT,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get element() {
    return this._element.value;
  }
  set element(id: number) {
    this._element.value = id;
  }

  private _range: ROMProperty = {
    byteOffset: OFFSET.RANGE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get range() {
    return this._range.value;
  }
  set range(value: number) {
    this._range.value = value;
  }

  private _worn: ROMProperty = {
    byteOffset: OFFSET.WORN,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get worn() {
    return this._worn.value;
  }
  set worn(id: number) {
    this._worn.value = id;
  }

  private _itemFlags: ROMProperty = {
    byteOffset: OFFSET.FLAGS,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };

  get doubleSword() {
    return ((this._itemFlags.value >> ITEMFLAG.DOUBLESWORD) & 0x1) === 0x1
      ? true
      : false;
  }
  set doubleSword(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._itemFlags.value =
      (this._itemFlags.value & ~(1 << ITEMFLAG.DOUBLESWORD)) |
      (value << ITEMFLAG.DOUBLESWORD);
  }

  get doubleHand() {
    return ((this._itemFlags.value >> ITEMFLAG.DOUBLEHAND) & 0x1) === 0x1
      ? true
      : false;
  }
  set doubleHand(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._itemFlags.value =
      (this._itemFlags.value & ~(1 << ITEMFLAG.DOUBLEHAND)) |
      (value << ITEMFLAG.DOUBLEHAND);
  }

  get monkeyGrip() {
    return ((this._itemFlags.value >> ITEMFLAG.MONKEYGRIP) & 0x1) === 0x1
      ? true
      : false;
  }
  set monkeyGrip(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._itemFlags.value =
      (this._itemFlags.value & ~(1 << ITEMFLAG.MONKEYGRIP)) |
      (value << ITEMFLAG.DOUBLEHAND);
  }

  get discount() {
    return ((this._itemFlags.value >> ITEMFLAG.DISCOUNT) & 0x1) === 0x1
      ? true
      : false;
  }
  set discount(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._itemFlags.value =
      (this._itemFlags.value & ~(1 << ITEMFLAG.DISCOUNT)) |
      (value << ITEMFLAG.DISCOUNT);
  }

  get tier1() {
    return ((this._itemFlags.value >> ITEMFLAG.TIER1) & 0x1) === 0x1
      ? true
      : false;
  }
  set tier1(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._itemFlags.value =
      (this._itemFlags.value & ~(1 << ITEMFLAG.TIER1)) |
      (value << ITEMFLAG.TIER1);
  }

  get tier2() {
    return ((this._itemFlags.value >> ITEMFLAG.TIER2) & 0x1) === 0x1
      ? true
      : false;
  }
  set tier2(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._itemFlags.value =
      (this._itemFlags.value & ~(1 << ITEMFLAG.TIER2)) |
      (value << ITEMFLAG.TIER2);
  }

  get tier3() {
    return ((this._itemFlags.value >> ITEMFLAG.TIER3) & 0x1) === 0x1
      ? true
      : false;
  }
  set tier3(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._itemFlags.value =
      (this._itemFlags.value & ~(1 << ITEMFLAG.TIER3)) |
      (value << ITEMFLAG.TIER3);
  }

  get mythrilOrConsumable() {
    return ((this._itemFlags.value >> ITEMFLAG.MYTHRILORCONSUMABLE) & 0x1) ===
      0x1
      ? true
      : false;
  }
  set mythrilOrConsumable(allowed: boolean) {
    const value = allowed ? 1 : 0;
    this._itemFlags.value =
      (this._itemFlags.value & ~(1 << ITEMFLAG.MYTHRILORCONSUMABLE)) |
      (value << ITEMFLAG.MYTHRILORCONSUMABLE);
  }

  private _nonoType: ROMProperty = {
    byteOffset: OFFSET.NONO,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get nonoType() {
    return this._nonoType.value;
  }
  set nonoType(id: number) {
    this._nonoType.value = id;
  }

  private _attack: ROMProperty = {
    byteOffset: OFFSET.ATTACK,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get attack() {
    return this._attack.value;
  }
  set attack(value: number) {
    this._attack.value = value;
  }

  private _defense: ROMProperty = {
    byteOffset: OFFSET.DEFENSE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get defense() {
    return this._defense.value;
  }
  set defense(value: number) {
    this._defense.value = value;
  }

  private _power: ROMProperty = {
    byteOffset: OFFSET.POWER,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get power() {
    return this._power.value;
  }
  set power(value: number) {
    this._power.value = value;
  }

  private _resistance: ROMProperty = {
    byteOffset: OFFSET.RESISTANCE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get resistance() {
    return this._resistance.value;
  }
  set resistance(value: number) {
    this._resistance.value = value;
  }

  private _speed: ROMProperty = {
    byteOffset: OFFSET.SPEED,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get speed() {
    return this._speed.value;
  }
  set speed(value: number) {
    this._speed.value = value;
  }

  private _evade: ROMProperty = {
    byteOffset: OFFSET.EVADE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get evade() {
    return this._evade.value;
  }
  set evade(value: number) {
    this._evade.value = value;
  }

  private _move: ROMProperty = {
    byteOffset: OFFSET.MOVE,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get move() {
    return this._move.value;
  }
  set move(value: number) {
    this._move.value = value;
  }

  private _jump: ROMProperty = {
    byteOffset: OFFSET.JUMP,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get jump() {
    return this._jump.value;
  }
  set jump(value: number) {
    this._jump.value = value;
  }

  private _effect1: ROMProperty = {
    byteOffset: OFFSET.EFFECT1,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get effect1() {
    return this._effect1.value;
  }
  set effect1(value: number) {
    this._effect1.value = value;
  }

  private _effect2: ROMProperty = {
    byteOffset: OFFSET.EFFECT2,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get effect2() {
    return this._effect2.value;
  }
  set effect2(value: number) {
    this._effect2.value = value;
  }

  private _effect3: ROMProperty = {
    byteOffset: OFFSET.EFFECT3,
    byteLength: 1,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get effect3() {
    return this._effect3.value;
  }
  set effect3(value: number) {
    this._effect3.value = value;
  }

  private _abilitySet: ROMProperty = {
    byteOffset: OFFSET.ABILITYSET,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  get abilitySet() {
    return this._abilitySet.value;
  }
  set abilitySet(id: number) {
    this._abilitySet.value = id;
  }
}

/**
 * An {@link FFTAObject} representing a set of {@link FFTAItem} that is used as a mission reward.
 */
export class FFTARewardItemSet extends FFTAObject {
  /**
   * Constructor for a Reward Item Set
   * @param memory - The address of the ROM
   * @param properties - A buffer starting from the address in the ROM
   */
  constructor(memory: number, properties: Uint8Array) {
    super(memory, undefined);
    this.load(properties);
  }

  setItem(itemID: number, offset: number) {
    this.getROMProperties().find(
      (itemProperty) => itemProperty.byteOffset === offset * 2
    ).value = itemID;
  }
  getItem(offset: number) {
    return this.getROMProperties().find(
      (itemProperty) => itemProperty.byteOffset === offset * 2
    ).value;
  }
  private _item1: ROMProperty = {
    byteOffset: 0,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item2: ROMProperty = {
    byteOffset: 2,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item3: ROMProperty = {
    byteOffset: 4,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item4: ROMProperty = {
    byteOffset: 6,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item5: ROMProperty = {
    byteOffset: 8,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item6: ROMProperty = {
    byteOffset: 10,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item7: ROMProperty = {
    byteOffset: 12,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item8: ROMProperty = {
    byteOffset: 14,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item9: ROMProperty = {
    byteOffset: 16,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item10: ROMProperty = {
    byteOffset: 18,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item11: ROMProperty = {
    byteOffset: 20,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item12: ROMProperty = {
    byteOffset: 22,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item13: ROMProperty = {
    byteOffset: 24,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item14: ROMProperty = {
    byteOffset: 26,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item15: ROMProperty = {
    byteOffset: 28,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item16: ROMProperty = {
    byteOffset: 30,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item17: ROMProperty = {
    byteOffset: 32,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item18: ROMProperty = {
    byteOffset: 34,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item19: ROMProperty = {
    byteOffset: 36,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
  private _item20: ROMProperty = {
    byteOffset: 38,
    byteLength: 2,
    displayName: "Could not retrieve.",
    value: 0,
  };
}
