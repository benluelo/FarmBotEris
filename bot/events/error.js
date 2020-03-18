exports.run = async (bot, err, id) => {
  // do this for now to see what `err` makes. I don't believe you can
  // `JSON.stringify(err, null, 4)` the error that is made
  // also `id` is the shard id not the error id
  // console.log(`error: ${err}, ${err.stack}`)
  // console.log(`shard id: ${id}`)
  bot.log.error(err.stack + "\nShard ID: " + id)
}