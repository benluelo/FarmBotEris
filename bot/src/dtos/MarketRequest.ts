import { CropName } from './Crop';

// /\*\*\n\s*\*\s@typedef \{[a-zA-Z]*\} [a-zA-Z]*\n

export type MarketRequest = {
  /** The name of the farmer who's request this is. */
  name: string;
  /** What the farmer wants. */
  want: {
    /** The crop they want. */
    crop: CropName;
    /** The amount of the crop they want. */
    amount: number;
  }[];
  /** How much they are willing to pay. */
  value: number;
  /** How much reputation filling the request gives. */
  reputation: number;
};
