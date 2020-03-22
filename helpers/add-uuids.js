// const uuid = require("uuid").v4

// /** @private @param {import("../bot/lib/FarmBotClient.js")} bot */
// module.exports.run = (bot) => {
//   setTimeout(() => {
//     bot.database.Userdata.find({}).forEach(async (document) => {
//       await bot.database.Userdata.findOneAndUpdate({ userID: document.userID }, {
//         $set: {
//           uuid: uuid()
//         }
//       })
//       console.log(document.uuid, document.userID)
//     })
//   }, 2000)
// }