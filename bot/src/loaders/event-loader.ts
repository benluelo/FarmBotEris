import { FarmBotClient } from '../lib/FarmBotClient.js';
import fs from 'fs';
import { join } from 'path';
import Log from '../logger.js';

export function loadEvents(bot: FarmBotClient) {
  fs.readdir(join(process.cwd(), 'bot/events/'), (err, files) => {
    if (err) {
      return Log.error(err);
    }
    files.forEach(async (file) => {
      if (file.endsWith('.js')) {
        const eventFunction = await import(join(process.cwd(), `bot/events/${file}`));
        const eventName = file.split('.')[0];
        bot.on(eventName, (...args: any[]) => eventFunction.run(bot, ...args));
      }
    });
  });
}
