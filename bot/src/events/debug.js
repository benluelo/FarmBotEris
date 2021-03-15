import Log from "../logger.js";
export function run(bot, message, id) {
    if (bot.ENV.DEBUG === "true") {
        Log.default("Debug message:", message);
    }
}
