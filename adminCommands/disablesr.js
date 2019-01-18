module.exports = {
    name: "disablesr",
    execute(message, botManager) {
        botManager.disablesr(message.guild.id);
        console.log(`${message.guild.id}: Song requests disabled`);
    }
}
