export namespace CropInfo {
  export type CropEmoji = "🍎" | "🍊" | "🍋" | "🍐" | "🍒" | "🍑" | "🥭" | "🍈" | "🍇" | "🍓" | "🍌" | "🍍"
  export type CropName = "apple" | "orange" | "lemon" | "pear" | "cherry" | "peach" | "mango" | "melon" | "grapes" | "strawberry" | "banana" | "pineapple"
  export type CropColors = "red" | "orange" | "yellow" | "green" | "pink" | "purple"
  export type CropFlavours = "sweet" | "sour" | "tart"
  export interface CropData {
    /** The emoji of the crop. */
    emoji: CropEmoji;
    /** The color of the crop. */
    color: CropColors;
    /** The flavors of the crop. */
    flavour: [
      CropFlavours,
      CropFlavours
    ]
  }
  export type CropDatas = {
    [name in CropName]: CropData
  }
}

export const CropDatas: CropInfo.CropDatas = {
  apple: {
    emoji: "🍎",
    flavour: [
      "sweet",
      "sweet"
    ],
    color: "red"
  },
  orange: {
    emoji: "🍊",
    flavour: [
      "sweet",
      "tart"
    ],
    color: "orange"
  },
  lemon: {
    emoji: "🍋",
    flavour: [
      "sweet",
      "sour"
    ],
    color: "yellow"
  },
  pear: {
    emoji: "🍐",
    flavour: [
      "sweet",
      "sweet"
    ],
    color: "green"
  },
  cherry: {
    emoji: "🍒",
    flavour: [
      "sweet",
      "sour"
    ],
    color: "red"
  },
  peach: {
    emoji: "🍑",
    flavour: [
      "sweet",
      "sweet"
    ],
    color: "pink"
  },
  mango: {
    emoji: "🥭",
    flavour: [
      "sour",
      "sweet"
    ],
    color: "pink"
  },
  melon: {
    emoji: "🍈",
    flavour: [
      "sweet",
      "sweet"
    ],
    color: "green"
  },
  grapes: {
    emoji: "🍇",
    flavour: [
      "sweet",
      "tart"
    ],
    color: "purple"
  },
  strawberry: {
    emoji: "🍓",
    flavour: [
      "sweet",
      "tart"
    ],
    color: "red"
  },
  banana: {
    emoji: "🍌",
    flavour: [
      "sweet",
      "sweet"
    ],
    color: "yellow"
  },
  pineapple: {
    emoji: "🍍",
    flavour: [
      "sweet",
      "tart"
    ],
    color: "yellow"
  }
}