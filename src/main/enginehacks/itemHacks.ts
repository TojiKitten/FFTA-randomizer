import { FFTAItem, ITEMTYPES } from "../ffta/item/FFTAItem";
import NoiseGenerator from "../ffta/NoiseGenerator";

export function toggleAllShopItems(items: Array<FFTAItem>, allowed: boolean) {
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
    let randomizedNames: Array<string> = [];
    // Filter by type
    let itemsForType = items.filter((item) => {
      return item.getType() === iter;
    });

    // Get the names of randomly selected items to allow in shop
    for (var count = 0; count < numberPerType; count++) {
      let possibleItems = itemsForType.filter((item) => {
        return (
          randomizedNames.findIndex((name) => {
            item.displayName === name;
          }) === -1
        );
      });

      randomizedNames.push(
        possibleItems[rng.randomIntMax(possibleItems.length - 1)].displayName!
      );
    }

    // For every item, enable the randomly selected items, and disable all other items
    itemsForType.forEach((item) => {
      let allowed =
        randomizedNames.findIndex((name) => {
          return name === item.displayName;
        }) !== -1
          ? 1
          : 0;

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
