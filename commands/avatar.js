module.exports = {
    name: "avatar",
    execute(message, botManager) {
        message.reply(message.author.avatarURL);
    }
}
