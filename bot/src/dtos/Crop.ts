export type CropEmoji = '🍎' | '🍊' | '🍋' | '🍐' | '🍒' | '🍑' | '🥭' | '🍈' | '🍇' | '🍓' | '🍌' | '🍍';
export type CropName = 'apple' | 'orange' | 'lemon' | 'pear' | 'cherry' | 'peach' | 'mango' | 'melon' | 'grapes' | 'strawberry' | 'banana' | 'pineapple';
export type CropColors = 'red' | 'orange' | 'yellow' | 'green' | 'pink' | 'purple';
export type CropFlavours = 'sweet' | 'sour' | 'tart';
export type CropInformation = {
  /** The emoji of the crop. */
  emoji: CropEmoji;
  /** The color of the crop. */
  color: CropColors;
  /** The flavors of the crop. */
  flavour: CropFlavours[];
};

export type CropInformationMap = {
  [K in CropName]: CropInformation;
};
