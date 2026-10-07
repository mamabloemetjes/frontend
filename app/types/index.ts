import { Props } from "./props";

export type { Props };



export type FlowerTypes = keyof typeof FlowerTypesList;


export const FlowerTypesList = {
  "funeral-flowers": "flowerTypes.funeral-flowers",
  "wedding-bouquets": "flowerTypes.wedding-bouquets",
  "birth-pieces": "flowerTypes.birth-pieces",
  "decoflowers": "flowerTypes.decoflowers",
  "flowers": "flowerTypes.flowers",
}
