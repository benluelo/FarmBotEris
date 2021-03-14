import Log from "../src/logger.js";
export function run(bot, err, id) {
    Log.error(err.stack + "\nShard ID: " + id);
}
