import { FarmBotClient } from '../lib/FarmBotClient.js';
import Log from '../logger.js';

export function run(bot: FarmBotClient, message: string, _id: number): void {
  if (bot.ENV.DEBUG === 'true') {
    Log.default('Debug message:', message);
  }
}
