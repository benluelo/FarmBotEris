import { FarmBotClient } from '../lib/FarmBotClient.js';
import Log from '../logger.js';

export function run(bot: FarmBotClient, err: Error, id: number) {
  Log.error(err.stack + '\nShard ID: ' + id);
}
