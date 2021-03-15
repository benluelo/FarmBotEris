import { FarmBotClient } from '../lib/FarmBotClient.js';
import Log from '../logger.js';

export function run(_bot: FarmBotClient, err: Error, id: number): void {
  Log.error(err.stack + '\nShard ID: ' + id);
}
