const ytdl = require('ytdl-core');
const config = require('../config.json');

module.exports = {
    name: "ytsr",
    execute(message, botManager) {
        let guildID = message.guild.id;
        if(botManager.VoiceConnectionHandler.isEnabled(guildID)) {
            if (botManager.hasVoiceConnection(guildID)) {
                var list = message.content.split(" ");

                botManager.addSong(guildID, list[1]);
                message.reply(`Your song has been added.`);
                console.log(`${guildID}: New song added to playlist by ${message.author.username}`);
            }
            else {
                message.reply(`${config.name} is not currently in a voice channel. Please ask a mod to add it to a channel.`);
            }
        }
        else {
            message.reply("Song Requests are currently disabled.");
        }
    }
}
