import Log from "../logger.js";
export function run(bot, err, id) {
    Log.error(err.stack + "\nShard ID: " + id);
}
