/** @private @param {import("./FarmBotClient.js")} bot */
module.exports.run = (bot) => {

  // console.log(bot.Commands)

  // remove development commands if in production
  if ((bot.ENV.DEVELOPMENT != "true")) {
    console.log("Removing development commands...")
    for (const cmd in bot.Commands) {
      if (bot.Commands.get(cmd).info.permissionLevel == bot.PERMISSIONS.DEVELOPMENT) {
        bot.Commands.delete(cmd)
      }
    }
  }

  // const Embed = require("./classes").Embed

  /** @type {Object<string, import("./classes.js").Embed>} */
  const commandHelpEmbeds = {}

  /** @type {Object<number, String[]>} */
  const fullHelp = {}

  for (const perm in bot.PERMISSIONS) {
    fullHelp[bot.PERMISSIONS[perm]] = []
  }

  /**
   * @description Maps permission levels to their respective allowed commands, per category.
   * @type {Object<number, {
      CATEGORY_FARMING: String[],
      CATEGORY_UTILITY: String[],
      CATEGORY_OWNER: String[],
      CATEGORY_DEVELOPMENT: String[]
    }>}
  */
  const fullHelpEmbeds = Object.fromEntries(Object
    .values(bot.PERMISSIONS)
    .map((val) => {
      return [
        val,
        Object.fromEntries(Object
          .values(bot.CATEGORIES)
          .map((cat) => {
            return [
              cat,
              []
            ]
          })
        )
      ]
    })
  )

  for (const [commandName, commandObject] of bot.Commands.entries()) {
    const current = commandObject
    fullHelp[current.info.permissionLevel].push(commandName)

    ;(/**
       * @description Ye.
       * @param {String} cmdName - The name of the command.
       * @param {import("./FarmBotCommandHandler.js").FarmBotCommand} cmdObject - The command object.
       */
      function getCMDs(cmdName, cmdObject) {
        const e = new bot.Embed()
          .setTitle(`Help for \`${cmdName}\``)
          .setDescription(cmdObject.info.description)
          .setColor(0x00b3b3)
          .setFooter("<> - required  |  [] - optional")
          .addField("**__Usage__:**", `\`\`\`${cmdObject.info.usage}\`\`\``)
        if (cmdObject.info.examples) { e.addField("**__Examples__:**", `\`\`\`${cmdObject.info.examples}\`\`\``) }
        if (cmdObject.info.aliases) { e.addField("**__Aliases__:**", `\`\`\`${cmdObject.info.aliases.join(", ")}\`\`\``) }
        e.addField("**__Cooldown__:**", `\`\`\`${cmdObject.info.cooldown / 1000} seconds\`\`\``)
        if (cmdObject.subcommands.size > 0) {
          /** @type {String[]} */
          const subs = Array.from(cmdObject.subcommands.keys())
          e.addField("**__Subcommands__:**", `\`\`\`${subs.join(", ")}\`\`\``)
          subs.forEach((sc) => {
            getCMDs(cmdName + " " + sc, cmdObject.subcommands.get(sc))
          })
        }
        commandHelpEmbeds[cmdName] = e
      }
    )(commandName, current)
  }

  // make a different embed for each permission level. each successive level has all the permissions of the previous level.
  for (const i in fullHelp) {
    for (const cmd in fullHelp[i]) {
      for (const permlvl in fullHelpEmbeds) {
        if (i <= permlvl) {
          fullHelpEmbeds[permlvl][bot.Commands.get(fullHelp[i][cmd]).info.category].push(fullHelp[i][cmd])
        }
      }
    }
  }

  // create the actual embeds now lol
  for (const i in fullHelpEmbeds) {
    const PERM_LEVEL = Object.keys(bot.PERMISSIONS).find((key) => {
      return bot.PERMISSIONS[key] == i
    })
    const tempEmbed = new bot.Embed()
      .setTitle("FarmBot Help")
      .setDescription("This is the full list of commands for FarmBot. Send `farm help <command>` for detailed information about a specific command.")
      .setColor(0x00b3b3)
      .setFooter(bot.ENV.DEVELOPMENT ? PERM_LEVEL : null)
    Object.getOwnPropertySymbols(fullHelpEmbeds[i]).forEach((cat) => {
      if (fullHelpEmbeds[i][cat].length != 0) {
        tempEmbed.addField(`**${cat.description}**`, fullHelpEmbeds[i][cat].map((e) => { return `\`${e}\`` }).join(", "))
      }
    })
    fullHelpEmbeds[i] = tempEmbed
  }

  module.exports.embeds = {
    /** @type {Object<number, import("./classes.js").Embed>} */
    fullHelpEmbeds,
    commandHelpEmbeds
  }

  console.log({
    fullHelpEmbeds
  })

  // console.log(Object.keys(commandHelpEmbeds))
}