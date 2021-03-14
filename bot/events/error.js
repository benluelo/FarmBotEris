import Log from "../src/logger";
export default async (bot, err, id) => {
    Log.error(err.stack + "\nShard ID: " + id);
};
