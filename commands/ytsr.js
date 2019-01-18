const ytdl = require('ytdl-core');
const config = require('../config.json');

module.exports = {
    name: "ytsr",
    execute(message, botManager) {
        let guildID = message.guild.id;
        if(botManager.SongRequestQueues.isEnabled(guildID)) {
            if (botManager.VoiceConnectionHandler.voiceConnections.has(guildID)) {
                var list = message.content.split(" ");

                botManager.SongRequestQueues.addSong(guildID, list[1]);
                message.reply(`@${message.author.username}, your song has been added.`);
                console.log(`${guildID}: New song added to playlist by ${message.author.username}`);
            }
            else {
                message.reply(`@${message.author.username}, ${config.name} is not currently in a voice channel. Please ask a mod to add it to a channel.`);
            }
        }
        else {
            message.reply("Song Requests are currently disabled.");
        }
    }
}


/*
// FOR PLAYING MUSIC MOFO
const streamOptions = { seek: 0, volume: 1 };
const stream = ytdl(list[1], { filter : 'audioonly' });
const dispatcher = connection.playStream(stream, streamOptions);
*/
