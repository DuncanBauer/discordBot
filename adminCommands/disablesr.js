module.exports = {
    name: "disablesr",
    execute(message, botManager) {
        botManager.SongRequestQueues.disable(message.guild.id);
        console.log("Song requests disabled");
    }
}
