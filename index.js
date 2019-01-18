const fs = require('fs');
if (process.platform == 'win32') {
    const ffmpeg = require('ffmpeg');
}
else if (process.platform == 'linux') {
    const ffmpeg = require('avconv');
}

const ytdl = require('ytdl-core');
const classes = require('./classes.js');
const helpers = require('./helpers.js');
const config = require('./config.json');
Discord = require('discord.js');


const botManager = new classes.BotManager();

botManager.client.on('message', message => {
    if (`${config.voicetest}` === "1") {
        botManager.client.guilds.every(function(current) {
            current.channels.every(function(current) {
                if (current.type === "voice") {
                    current.join()
                        .then(connection => console.log('Connected!'))
                        .catch(console.error);
                }
                return true;
            });
            return true;
        });
    }


    // So it doesn't respond to itself infinitely
    if(message.author.username != `${config.name}`) {
        // If DMs are turned off in config.json and checks if the message is a DM
        if(config.dmson !== "1") {
            if(message.channel.type === "dm") {
                console.log(`[${message.createdAt}] ${message.author.username}: ${message.content}`);
                message.channel.send(`Hey\, what do you think you\'re doing? This is a DM`);
            }
            else {
                result = helpers.parseCommands(message, botManager);
            }
        }
        else {
            result = helpers.parseCommands(message, botManager);
        }

        if (result != null) {
            result(message, botManager);
        }
    }
});

botManager.client.on('guildCreate', guild => {
    botManager.newGuild(guild);
});
