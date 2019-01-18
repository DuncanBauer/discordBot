module.exports = {
    name: "enablesr",
    execute(message, botManager) {
        botManager.SongRequestQueues.enable(message.guild.id);
        console.log("Song requests enabled");
    }
}
