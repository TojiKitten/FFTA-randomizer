import { FFTAItem, ITEMTYPES } from "../DataWrapper/FFTAItem";
import NoiseGenerator from "../utils/NoiseGenerator";

/**
 * Sets all items to appear or be removed from the shop
 * @param items - An array of all items
 * @param allowed - Value to set for items in shop
 * @returns A new array of items with updated information
 */
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

/**
 * Randomly sets items to appear in shop, while removing the rest.
 * @param items - An array of all items
 * @param rng - The {@link NoiseGenerator} for the randomizer
 * @returns A new array of items with updated information
 */
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

/**
 * Sets a minimum number of items per type to appear in shop, while removing the rest.
 * @param items - An array of all items
 * @param rng - The {@link NoiseGenerator} for the randomizer
 * @returns A new array of items with updated information
 */
export function toggleLimitedShopItems(
  items: Array<FFTAItem>,
  rng: NoiseGenerator
) {
  let newItems: Array<FFTAItem> = createNewItemArray(items);

  // For every item type that isn't consumables
  for (var iter = ITEMTYPES.Sword; iter <= ITEMTYPES.Accessory; iter++) {
    // Filter by type
    let itemsForType: Array<FFTAItem> = newItems.filter((item) => item.getType() === iter);
    
    // Declare min for cases where items in the type is small
    let numberPerType = Math.min(4, itemsForType.length);

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
