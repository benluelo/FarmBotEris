import CONSTANTS from '../data/CONSTANTS.js';
import regions from '../json/names.json';
import flags from '../json/flags.json';
import { Plot } from './Plot.js';
import { Seed } from './Seed.js';
import { MarketRequest } from './MarketRequest.js';
import { Farmer } from './Farmer.js';
import { CropName } from './Crop.js';

export interface UserData {
  /** The ID of the user. */
  userID: string
  /** The region that the user is in. */
  region: {
    /** The name of the region. */
    name: keyof typeof regions;
    /** The flag of the region. */
    flag: typeof flags[keyof typeof regions];
  }
  messagesUserSent: number
  botCommandsUsed: number
  /** The amount of money the user has. */
  money: number
  /** The user's farm. */
  farm: Plot[]
  /** The user's seeds. */
  // 🍎🍊🍋🍐🍒🍑🥭🍈🍇🍓🍌🍍
  seeds: { common: { [s in CropName]: Seed } }
  /** The user's current requests. */
  requests: { [s: string]: MarketRequest }
  /** The farmers in the user's village. */
  farmers: Farmer[]
  /** The farmers in the user's village. */
  permissions: typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS]
  /** When the user's last market refresh was. */
  requestTimeOut: number
  /** How many new requests the user has left for the hour. */
  requestAmount: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  /**
     * @deprecated This will be removed very soon, all users should be updated by now.
     */
  updated: boolean
  uuid: string
}
