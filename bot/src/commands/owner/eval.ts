import { FarmBotClient } from '../../lib/FarmBotClient.js';

import { inspect } from 'util';
import CONSTANTS from '../../data/CONSTANTS.js';
import { Embed } from '../../lib/Embed.js';

export function run(bot: FarmBotClient): void {
  bot.addCommand('eval', (message, args) => {
    const toEval = args.join(' ');
    try {
      const evaluated = inspect(eval(toEval), { depth: 0 });
      if (toEval) {
        const hrStart = process.hrtime();
        const hrDiff = process.hrtime(hrStart);
        const evalEmbed = new Embed()
          .setTitle('Evaluation')
          .setColor(bot.color.lightgreen)
          .addField(':scroll: Script', `\`\`\`javascript\n${toEval}\n\`\`\``)
          .addField(':white_check_mark: Result', `\`\`\`javascript\n${evaluated}\n\`\`\``)
          .addField(':alarm_clock: Evaluation Time', `${0 < hrDiff[0] ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.`);

        message.send(evalEmbed);
      } else {
        message.send('Error while evaluating: `cannot evaluate nothing`'); // its a hard word ik FCKN LISTEN OK ITS 4AM 4AM!!!!!LOL     - leave that there for production lmao - agreed
      }
    } catch (e) {
      message.send(`Error while evaluating: \`${e.message}\``);
    }
  }, {
    description: 'no',
    usage: '​no',
    examples: '​no',
    permissionLevel: CONSTANTS.PERMISSIONS.OWNERS,
    category: CONSTANTS.CATEGORIES.OWNER,
    cooldown: 0
  });
}

/** @type {Error} */
