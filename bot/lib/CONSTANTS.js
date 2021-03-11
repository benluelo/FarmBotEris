"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONSTANTS = {
    PERMISSIONS: Object.freeze({
        /** Commands that everyone has access to. */
        EVERYONE: 0,
        /** Commands that only bot moderators have access to. */
        MODERATORS: 1,
        /** Commands that only bot admins have access to. */
        OWNERS: 2,
        /** Commands that are only to be used by the developers, during development (i.e. only Ben & Tyler). */
        DEVELOPMENT: 3
    }),
    CATEGORIES: Object.freeze({
        /** Commands related to farming. */
        FARMING: Symbol("🌱 Farming"),
        /** Useful commands for information about the bot. */
        UTILITY: Symbol("⚙️ Utility"),
        /** Commands that are only to be used by the owners (i.e. only Ben & Tyler). */
        OWNER: Symbol("🥑 Owner"),
        /** Commands used for bot development. */
        DEVELOPMENT: Symbol("📜 Development")
    })
};
exports.default = CONSTANTS;
