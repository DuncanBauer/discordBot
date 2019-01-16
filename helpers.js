const ytdl = require('ytdl-core');
const config = require('./config.json');


module.exports = {
    parseCommands: function(message) {
        if (message.content.startsWith(`${config.prefixes[0]}`)) {
            var list = message.content.split(" ");

            if (list[0].substring(1) in commands) {
                return commands[list[0].substring(1)];
            }
        }
        else if (message.content.startsWith(`${config.prefixes[1]}`)) {
            var list = message.content.split(" ");

            if (list[0].substring(1) in adminCommands) {
                return adminCommands[list[0].substring(1)];
            }
        }
        return commands[`default`];
    }
};


commands = {
    status: function(message, botManager) {
        message.reply(botManager.client.status);
    },

    avatar: function(message, botManager) {
        message.reply(message.author.avatarURL);
    },

    ytsr: function(message, botManager) {
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
    },

    //const streamOptions = { seek: 0, volume: 1 };
    //const stream = ytdl(list[1], { filter : 'audioonly' });
    //const dispatcher = connection.playStream(stream, streamOptions);

    default: function(message, botManager) {
        console.log("Not real command")
    }
};

adminCommands = {
    join: function(message, botManager) {
        if (botManager.VoiceConnectionHandler.count() >= 1) {
            adminCommands.leave();
        }

        var list = message.content.split(" ");
        message.guild.channels.every(function(current) {
            if (current.type === "voice") {
                current.join()
                    .then(connection => {
                        console.log(`Connected to ${current.name}: ${current.id}!`);
                        botManager.VoiceConnectionHandler.addVoiceConnection(connection);
                    })
                    .catch(console.error);
            }
            return true;
        });

        //let channel = botManager.client.channels.find(item => item.name === list[1] && item.type === "voice");
        //message.reply(`${channel.name}`);
    },

    leave: function(message, botManager) {
        if (botManager.VoiceConnectionHandler.count() >= 1) {
            botManager.VoiceConnectionHandler.voiceConnections[0].channel.leave();
        }
    },

    enablesr: function(message, botManager) {
        message.channel.send(`This doesn't do anything yet`);
    },

    disablesr: function(message, botManager) {
        message.channel.send(`This doesn't do anything yet`);
    },

    pausesr: function(message, botManager) {
        message.channel.send(`This doesn't do anything yet`);
    },

    clearsr: function(message, botManager) {
        message.channel.send(`This doesn't do anything yet`);
    },

    playlist: function(message, botManager) {
        botManager.SongRequestQueue.playlist.forEach(function(current) {
            message.channel.send(current);
        })
        console.log(botManager.SongRequestQueue.count());
    }
};
