export default (bot) => {
    const main = bot.addCommand("cmdtest", (message, args) => {
        console.log("message: ", typeof message);
        console.log("args: ", args);
    }, {});
    main.subcommand("cmdtest2", (message, args) => {
        console.log("message: ", typeof message);
        console.log("args: ", args);
    });
    main.subcommand("cmdtest3", (message, args) => {
        console.log("message: ", typeof message);
        console.log("args: ", args);
    });
};
