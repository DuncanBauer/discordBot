const ytdl = require('ytdl-core');

module.exports = {
    name: "ytsr",
    execute(message, botManager) {
        if (botManager.VoiceConnectionHandler.count() == 0) {
            message.reply(`${config.name} is not currently in a voice channel. Please ask a mod to add it to a channel.`);
        }
        else {
            var list = message.content.split(" ");
            var test = list[1].split("=");
            if (ytdl.validateID(test[0])) {
                console.log(ytdl.getInfo(list[1]));
                botManager.SongRequestQueue.addSong(list[1]);
            }
            else {
                message.reply(`Invalid youtube link.`);
            }
        }
    }
}
