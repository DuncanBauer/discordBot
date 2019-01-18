module.exports = {
    name: "playlist",
    execute(message, botManager) {
        let list = botManager.VoiceConnectionHandler.playlists.get(message.guild.id);

        list.forEach(function(current) {
            message.channel.send(current);
        })
        console.log(`${message.guild.id} playlist: ${list}`);
    }
}
