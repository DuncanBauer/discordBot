module.exports = {
    name: "leavevc",
    execute(message, botManager) {
        var list = message.content.split(" ");
        if (botManager.VoiceConnectionHandler.voiceConnections.has(message.guild.id)) {
            console.log(`${message.guild.id}: Leaving voice channel
                ${botManager.VoiceConnectionHandler.voiceConnections.get(message.guild.id)})
                
            botManager.VoiceConnectionHandler.voiceConnections.get(message.guild.id).disconnect();
            botManager.VoiceConnectionHandler.voiceConnections.get(message.guild.id).channel.leave();
            botManager.VoiceConnectionHandler.removeVoiceConnection(message.guild.id);
        }
    }
}
