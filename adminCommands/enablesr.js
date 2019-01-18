module.exports = {
    name: "enablesr",
    execute(message, botManager) {
        botManager.enablesr(message.guild.id);
        console.log(`${message.guild.id}: Song requests enabled.`);
    }
}
