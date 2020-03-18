module.exports = {
  PERMISSIONS: Object.freeze({
    /** @type {0} Commands that everyone has access to. */
    EVERYONE: 0,
    /** @type {1} Commands that only bot moderators have access to. */
    MODERATORS: 1,
    /** @type {2} Commands that only bot admins have access to. */
    OWNERS: 2,
    /** @type {3} Commands that are only to be used by the developers, during development (i.e. only Ben & Tyler). */
    DEVELOPMENT: 3
  }),
  CATEGORIES: Object.freeze({
    /** @type {Symbol} Commands related to farming. */
    FARMING: Symbol("🌱 Farming"),
    /** @type {Symbol} Useful commands for information about the bot. */
    UTILITY: Symbol("⚙️ Utility"),
    /** @type {Symbol} Commands that are only to be used by the owners (i.e. only Ben & Tyler). */
    OWNER: Symbol("🥑 Owner"),
    /** @type {Symbol} Commands used for bot development. */
    DEVELOPMENT: Symbol("📜 Development")
  })
}