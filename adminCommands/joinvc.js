module.exports = {
    name: "joinvc",
    execute(message, botManager) {
        var list = message.content.split(" ");

        var channel = message.guild.channels.find(channel => channel.name === list[1]);
        if (channel != undefined) {
            if (channel.type === "text" || channel.type === "dm"
             || channel.type === "group" || channel.type === "category") {
                message.reply(`@${message.author.username}, I can not join ${channel.type} channel\'s`)
            }
            else {
                channel.join()
                .then(connection => {
                    console.log(`Connected to ${channel.name}: ${channel.id}!`);
                    botManager.VoiceConnectionHandler.addVoiceConnection(message.guild.id, connection);
                })
                .catch(console.error);
            }
        }
    }
        //let channel = botManager.client.channels.find(item => item.name === list[1] && item.type === "voice");
        //message.reply(`${channel.name}`);
}
