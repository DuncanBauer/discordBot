const config = require('./config.json');


module.exports = {
    parseCommands: function(message, botManager) {
        if (message.content.startsWith(`${config.prefixes[0]}`)) {
            var list = message.content.split(" ");

            if (botManager.commands.has(list[0].substring(1))) {
                return botManager.commands.get(list[0].substring(1)).execute;
            }
        }
        else if (message.content.startsWith(`${config.prefixes[1]}`)) {
            var list = message.content.split(" ");
            if (botManager.adminCommands.has(list[0].substring(1))) {
                return botManager.adminCommands.get(list[0].substring(1)).execute;
            }
        }
        return null;
    }
};
