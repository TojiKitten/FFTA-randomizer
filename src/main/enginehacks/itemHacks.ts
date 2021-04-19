import FFTAItem from "../ffta/item/FFTAItem";
import NoiseGenerator from "../ffta/NoiseGenerator";

export function toggleAllShopItems(items: Array<FFTAItem>, allowed: boolean) {
  items.forEach((item) => {
    item.setTier1(allowed ? 1 : 0);
    item.setTier2(allowed ? 1 : 0);
    item.setTier3(allowed ? 1 : 0);
  });
}

export function toggleRandomShopItems(
  items: Array<FFTAItem>,
  rng: NoiseGenerator
) {
  items.forEach((item) => {
    let allowed = rng.randomBit();
    item.setTier1(allowed ? 1 : 0);
    item.setTier2(allowed ? 1 : 0);
    item.setTier3(allowed ? 1 : 0);
  });
}

export function toggleLimitedShopItems(
  items: Array<FFTAItem>,
  rng: NoiseGenerator
) {
  let numberPerType = 4;

  let itemsByType: Array<Array<FFTAItem>> = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ];

  // Sort items by type
  items.forEach((item) => {
    itemsByType[item.getType()].push(item);
  });

  // For all item types, except consumables
  for (var i = 0; i < itemsByType.length - 1; i++) {
    // Shuffle sorted items
    itemsByType[i].sort((a, b) => {
      return rng.randomBit() == 1 ? 1 : -1;
    });
    // Set first number per type as available
    itemsByType[i].forEach((item, j) => {
      let allowed = j < numberPerType;
      item.setTier1(allowed ? 1 : 0);
      item.setTier2(allowed ? 1 : 0);
      item.setTier3(allowed ? 1 : 0);
      item.balanceItemPrice();
    });
  }
}
