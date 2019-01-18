module.exports = {
    name: "leave",
    execute(message, botManager) {
        var list = message.content.split(" ");
        if (botManager.hasVoiceConnection(message.guild.id)) {
            console.log(`${message.guild.id}: Leaving voice channel`);

            if (botManager.dispatchers.get(message.guild.id)) {
                botManager.dispatchers.get(message.guild.id).end();
                botManager.dispatchers.delete(message.guild.id);
            }
            botManager.removeVoiceConnection(message.guild.id);
        }
    }
}
