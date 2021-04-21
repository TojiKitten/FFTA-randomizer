import { FFTAItem, ITEMTYPES } from "../ffta/item/FFTAItem";
import NoiseGenerator from "../ffta/NoiseGenerator";

export function toggleAllShopItems(items: Array<FFTAItem>, allowed: boolean) {
  // Set all items to the value of allowed
  let newItems: Map<number, FFTAItem> = createNewItemArray(items);
  newItems.forEach((item) => {
    item.setTier1(allowed ? 1 : 0);
    item.setTier2(allowed ? 1 : 0);
    item.setTier3(allowed ? 1 : 0);
  });
  return Array.from(newItems.values());
}

export function toggleRandomShopItems(
  items: Array<FFTAItem>,
  rng: NoiseGenerator
) {
  // Randomly set all items to be available in shop, or not
  let newItems: Map<number, FFTAItem> = createNewItemArray(items);
  newItems.forEach((item) => {
    let allowed = rng.randomBit();
    item.setTier1(allowed ? 1 : 0);
    item.setTier2(allowed ? 1 : 0);
    item.setTier3(allowed ? 1 : 0);
    item.balanceItemPrice();
  });

  return Array.from(newItems.values());
}

export function toggleLimitedShopItems(
  items: Array<FFTAItem>,
  rng: NoiseGenerator
) {
  let newItems: Map<number, FFTAItem> = createNewItemArray(items);
  let numberPerType = 4;

  // For every item type that isn't consumables
  for (var iter = ITEMTYPES.Sword; iter <= ITEMTYPES.Accessory; iter++) {
    // Filter by type
    let itemsForType: Map<number, FFTAItem> = new Map();
    for (let [displayName, item] of newItems) {
      if (item.getType() === iter) {
        itemsForType.set(displayName, item);
      }
    }

    // Get the names of randomly selected items to allow in shop
    let randomizedNames: Set<number> = new Set();
    for (var count = 0; count < numberPerType; count++) {
      let possibleItems = Array.from(itemsForType.keys()).filter(
        (keyNameID) => {
          return !randomizedNames.has(keyNameID);
        }
      );
      randomizedNames.add(
        possibleItems[rng.randomIntMax(possibleItems.length - 1)]
      );
    }

    // For every item, enable the randomly selected items, and disable all other items
    for (let [displayNameID, item] of itemsForType) {
      // If the name of the current item is in the random name list, allowed = true, else false
      let allowed = randomizedNames.has(displayNameID) ? 1 : 0;

      item.setTier1(allowed ? 1 : 0);
      item.setTier2(allowed ? 1 : 0);
      item.setTier3(allowed ? 1 : 0);
      item.balanceItemPrice();
    }
  }
  return Array.from(newItems.values());
}

function createNewItemArray(items: Array<FFTAItem>) {
  let newItems: Map<number, FFTAItem> = new Map();

  // Create new items to return
  items.forEach((item) => {
    newItems.set(
      item.getNameID(),
      new FFTAItem(item.memory, item.displayName!, item.properties)
    );
  });

  return newItems;
}
