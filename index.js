const fs = require('fs');
if (process.platform == 'win32') {
    const ffmpeg = require('ffmpeg');
}
else if (process.platform == 'linux') {
    const ffmpeg = require('avconv');
}

const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const classes = require('./classes.js');
const helpers = require('./helpers.js');
const config = require('./config.json');


const BotManager = new classes.BotManager();

BotManager.client.on('message', message => {
    if (`${config.voicetest}` === "1") {
        BotManager.client.guilds.every(function(current) {
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
                result = helpers.parseCommands(message, BotManager);
            }
        }
        else {
            result = helpers.parseCommands(message, BotManager);
        }

        result(message, BotManager);
    }
});


BotManager.client.on('guildCreate', guild => {
    BotManager.FirebaseConnection.database.ref(`guilds/ ${guild.id}`).set({
        "name": guild.name,
        "id": guild.id
    });
});
