import { FFTAItem, ITEMTYPES } from "../ffta/item/FFTAItem";
import NoiseGenerator from "../ffta/NoiseGenerator";

export function toggleAllShopItems(items: Array<FFTAItem>, allowed: boolean) {
  // Set all items to the value of allowed
  let newItems: Array<FFTAItem> = createNewItemArray(items);
  newItems.forEach((item) => {
    item.setTier1(allowed ? 1 : 0);
    item.setTier2(allowed ? 1 : 0);
    item.setTier3(allowed ? 1 : 0);
  });
  return newItems;
}

export function toggleRandomShopItems(
  items: Array<FFTAItem>,
  rng: NoiseGenerator
) {
  // Randomly set all items to be available in shop, or not
  let newItems: Array<FFTAItem> = createNewItemArray(items);
  newItems.forEach((item) => {
    let allowed = rng.randomBit();
    item.setTier1(allowed ? 1 : 0);
    item.setTier2(allowed ? 1 : 0);
    item.setTier3(allowed ? 1 : 0);
    item.balanceItemPrice();
  });

  return newItems;
}

export function toggleLimitedShopItems(
  items: Array<FFTAItem>,
  rng: NoiseGenerator
) {
  let newItems: Array<FFTAItem> = createNewItemArray(items);
  let numberPerType = 4;

  // For every item type that isn't consumables
  for (var iter = ITEMTYPES.Sword; iter <= ITEMTYPES.Accessory; iter++) {
    // Filter by type
    let itemsForType: Array<FFTAItem> = [];
    newItems.forEach((item) => {
      if (item.getType() === iter) {
        itemsForType.push(item);
      }
    });

    // Get the names of randomly selected items to allow in shop
    let randomizedItems: Set<number> = new Set();
    for (var count = 0; count < numberPerType; count++) {
      let possibleItems = itemsForType.filter((item) => {
        return !randomizedItems.has(item.memory);
      });
      randomizedItems.add(
        possibleItems[rng.randomIntMax(possibleItems.length - 1)].memory
      );
    }

    // For every item, enable the randomly selected items, and disable all other items
    itemsForType.forEach((item) => {
      // If the name of the current item is in the random name list, allowed = true, else false
      let allowed = randomizedItems.has(item.memory) ? 1 : 0;

      item.setTier1(allowed ? 1 : 0);
      item.setTier2(allowed ? 1 : 0);
      item.setTier3(allowed ? 1 : 0);
      item.balanceItemPrice();
    });
  }
  return newItems;
}

function createNewItemArray(items: Array<FFTAItem>) {
  let newItems: Array<FFTAItem> = [];

  // Create new items to return
  items.forEach((item) => {
    newItems.push(
      new FFTAItem(item.memory, item.displayName!, item.properties)
    );
  });

  return newItems;
}
