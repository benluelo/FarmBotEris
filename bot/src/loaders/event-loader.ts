import { FarmBotClient } from '../lib/FarmBotClient.js';
import fs from 'fs';
import { join } from 'path';
import Log from '../logger.js';

export function loadEvents(bot: FarmBotClient): void {
  const eventsDir = join(process.cwd(), 'bot/src/events/');

  fs.readdir(eventsDir, (err, files) => {
    if (err) {
      return Log.error(err);
    }
    files.forEach(async (file) => {
      if (file.endsWith('.ts')) {
        const eventFunction = await import(join(process.cwd(), `bot/src/events/${file}`));
        const eventName = file.split('.')[0];
        bot.on(eventName, (...args: unknown[]) => eventFunction.run(bot, ...args));
      }
    });
  });
}
