const Discord = require('discord.js');
const Firebase = require('firebase');
const ytdl = require('ytdl-core');
const fs = require('fs');
const config = require('./config.json');


function VoiceConnectionHandler() {
    this.voiceConnections = new Discord.Collection();
    this.connectionCount = 0;

    this.playlists = new Discord.Collection();
    this.enabled = new Discord.Collection();
}

VoiceConnectionHandler.prototype.addVoiceConnection = function(id, connection) {
    this.voiceConnections.set(id, connection);
}

VoiceConnectionHandler.prototype.removeVoiceConnection = function(id) {
    this.voiceConnections.delete(id);
}

VoiceConnectionHandler.prototype.count = function() {
    return this.voiceConnections.length;
}

VoiceConnectionHandler.prototype.enable = function(guildID) {
    this.enabled.set(guildID, true);
}

VoiceConnectionHandler.prototype.disable = function(guildID) {
    this.enabled.set(guildID, false);
}

VoiceConnectionHandler.prototype.isEnabled = function(guildID) {
    if (this.enabled.has(guildID)) {
        return this.enabled.get(guildID);
    }
    return false;
}

VoiceConnectionHandler.prototype.enable = function(guildID) {
    this.enabled.set(guildID, true);
}

VoiceConnectionHandler.prototype.disable = function(guildID) {
    this.enabled.set(guildID, false);
}

VoiceConnectionHandler.prototype.addSong = function(guildID, link) {
    if (this.playlists.has(guildID)) {
        let playlist = this.playlists.get(guildID);
        playlist.push(link);

        this.playlists.set(guildID, playlist);
    }
    else {
        this.playlists.set(guildID, [link]);
    }
}

VoiceConnectionHandler.prototype.removeSong = function() {
}

VoiceConnectionHandler.prototype.checkSong = function() {
}

function FirebaseConnection() {
    this.config_options = {
        apiKey: `${config.firebase['apiKey']}`,
        authDomain: `${config.firebase['authDomain']}`,
        databaseURL: `${config.firebase['databaseURL']}`,
        storageBucket: `${config.firebase['storageBucket']}`
    };
    this.firebase = Firebase;
    this.firebase.initializeApp(this.config_options);

    this.firebase.auth().signInWithEmailAndPassword(`${config.firebase['username']}`, `${config.firebase['password']}` ).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
    });

    this.database = this.firebase.database();
}


function BotManager() {
    this.VoiceConnectionHandler = new VoiceConnectionHandler();
    this.FirebaseConnection = new FirebaseConnection();

    this.dispatchers = new Discord.Collection();
    this.streamOptions = { seek: 0, volume: 1 };
    this.stream = null;

    this.commands = new Discord.Collection();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        this.commands.set(command.name, command);
    }

    this.adminCommands = new Discord.Collection();
    const adminCommandFiles = fs.readdirSync('./adminCommands').filter(file => file.endsWith('.js'));
    for (const file of adminCommandFiles) {
        const command = require(`./adminCommands/${file}`);
        this.adminCommands.set(command.name, command);
    }

    this.client = new Discord.Client();
    this.client.once('ready', () => {
        console.log('Ready!');
    });
    this.client.login(config.token);
}

BotManager.prototype.getVoiceConnection = function(guildID) {
    return this.VoiceConnectionHandler.voiceConnections.get(guildID);
}

BotManager.prototype.hasVoiceConnection = function(guildID) {
    return this.VoiceConnectionHandler.voiceConnections.has(guildID);
}

BotManager.prototype.removeVoiceConnection = function(guildID) {
    this.getVoiceConnection(guildID).disconnect();
    this.getVoiceConnection(guildID).channel.leave();
    this.VoiceConnectionHandler.voiceConnections.delete(guildID);
}

BotManager.prototype.getPlaylist = function(guildID) {
    return this.VoiceConnectionHandler.playlists.get(guildID);
}

BotManager.prototype.newDispatcher = function(guildID, link) {
    let connection = this.getVoiceConnection(guildID);

    this.stream = ytdl(link, { filter : 'audioonly' });
    let playStream = connection.playStream(this.stream, this.streamOptions);
    this.dispatchers.set(guildID, playStream);

    playStream.on('end', reason => {
        if(reason !== 'user') {
            this.popSong(guildID);
            let playlist = this.getPlaylist(guildID);
            if(playlist.length > 0) {
                let nextLink = this.getNextSong(guildID);
                this.newDispatcher(guildID, nextLink);
            }
        }
    });
}

BotManager.prototype.addSong = function(guildID, link) {
    this.VoiceConnectionHandler.addSong(guildID, link);
    if(this.VoiceConnectionHandler.playlists.get(guildID).length === 1) {
        this.newDispatcher(guildID, link);
    }
}

BotManager.prototype.getNextSong = function(guildID) {
    let playlist = this.VoiceConnectionHandler.playlists.get(guildID);
    return playlist[0];
}

BotManager.prototype.popSong = function(guildID) {
    let playlist = this.VoiceConnectionHandler.playlists.get(guildID);
    playlist = playlist.slice(1);
    this.VoiceConnectionHandler.playlists.set(guildID, playlist);
}

BotManager.prototype.enablesr = function(guildID) {
    this.VoiceConnectionHandler.enabled.set(guildID, true);
}

BotManager.prototype.disablesr = function(guildID) {
    this.VoiceConnectionHandler.enabled.set(guildID, false);
}

BotManager.prototype.newGuild = function(guild) {
    this.FirebaseConnection.database.ref(`guilds/ ${guild.id}`).set({
        "name": guild.name,
        "id": guild.id
    });
}


module.exports = {BotManager, VoiceConnectionHandler}
