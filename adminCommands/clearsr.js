module.exports = {
    name: "clearsr",
    execute(message, botManager) {
        botManager.SongRequestQueues.playlists.set(message.guild.id, []);
        console.log(`${message.guild.id}: Playlist cleared`);
    }
}
