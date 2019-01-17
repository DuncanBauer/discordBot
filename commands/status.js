module.exports = {
    name: "status",
    execute(message, botManager) {
        message.reply(botManager.client.status);
    }
}
