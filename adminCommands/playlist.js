module.exports = {
    name: "playlist",
    execute(message, botManager) {
        botManager.SongRequestQueue.playlist.forEach(function(current) {
            message.channel.send(current);
        })
    }
}
