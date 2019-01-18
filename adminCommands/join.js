module.exports = {
    name: "join",
    execute(message, botManager) {
        var list = message.content.split(" ");

        var channel = message.guild.channels.find(channel => channel.name === list[1]);
        if (channel != undefined) {
            if (channel.type === "text" || channel.type === "dm"
             || channel.type === "group" || channel.type === "category") {
                message.reply(`@${message.author.username}, I can not join ${channel.type} channel\'s`)
            }
            else {
                let resume = false;
                if (botManager.dispatchers.get(message.guild.id)) {
                    //botManager.streamOptions = { seek: botManager.dispatchers.get(message.guild.id).time,
                    //                             volume: 1 };
                    botManager.dispatchers.get(message.guild.id).end();
                    botManager.dispatchers.delete(message.guild.id);
                    resume = true;
                }

                channel.join()
                .then(connection => {
                    console.log(`${message.guild.id}: Connected to ${channel.name}`);
                    botManager.VoiceConnectionHandler.addVoiceConnection(message.guild.id, connection);
                })
                .catch(console.error);

                if (resume) {
                    botManager.newDispatcher(message.guild.id, botManager.getPlaylist(message.guild.id)[0]);
                }
                //botManager.streamOptions = { seek: 0, volume: 1 };
            }
        }
    }
}
