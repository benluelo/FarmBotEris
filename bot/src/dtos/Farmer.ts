import { CropName, CropColors, CropFlavours } from './Crop';


export type Farmer = {
  /** The name of the Farmer. */
  name: string;
  /** The gender of the Farmer. */
  gender: 'male' | 'female';
  /** The crop that this user will unlock when they hit their unlock level. */
  unlockableCrop: CropName;
  /** The wealth of the Farmer. */
  wealth: number;
  /** The preferences of the Farmer. */
  preferences: { color: CropColors; taste: CropFlavours[]; };
  /** The level of the Farmer (i.e. their experience points). */
  level: number;
  /** The level that the farmer will unlock their crop at  (between `5` and `10`). */
  unlockLevel: number;
  /** The emoji of the Farmer. */
  emoji: string;
};
