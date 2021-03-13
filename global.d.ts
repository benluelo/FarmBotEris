import { Message } from "eris"

declare module "eris" {
  export interface Message {
    send(content: MessageContent, file?: MessageFile): Promise<Message>;
  }
}

declare class NPC {
  /** The name of the NPC. */
  name: string
  /** The gender of the NPC. Either "male" or "female". */
  gender: "male" | "female"
  /** The crop that this user will unlock when they hit their unlock level (between `5` and `10`). */
  unlockableCrop: CropName
  /** The wealth of the NPC. Must be `0 <= x <= 1`. */
  wealth: number
  /** The preferences of the NPC. */
  preferences: { color: CropColors; taste: Readonly<[CropFlavours, CropFlavours]> }
  /** The user's friendship level with the NPC. */
  level: number
  /** The level that the NPC unlocks their crop at. */
  unlockLevel: number
  /** The NPC's emoji. */
  emoji: string
  /** Creates a new NPC. */
  constructor(
    name: string,
    gender?: ("male" | "female"),
    unlockableCrop?: CropName,
    wealth?: number,
    preferences?: {
      color: CropColors
      taste: CropFlavours[]
    }
  )

  /** Creates a new request for the market. */
  newRequest(crops: CropInformationMap): { id: string; req: MarketRequest }

  private getRandomID(): string
}