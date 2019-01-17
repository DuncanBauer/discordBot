const Discord = require('discord.js');
const Firebase = require('firebase');
const fs = require('fs');
const config = require('./config.json');


function VoiceConnectionHandler() {
    this.voiceConnections = new Discord.Collection();
    this.connectionCount = 0;
}

VoiceConnectionHandler.prototype.addVoiceConnection = function(id, connection) {
    this.voiceConnections.set(id, connection);
}

VoiceConnectionHandler.prototype.removeVoiceConnection = function(id, connection) {
    this.voiceConnections.delete(id, connection);
}

VoiceConnectionHandler.prototype.count = function() {
    return this.voiceConnections.length;
}


function SongRequestQueue() {
    this.playlist = [];
    this.itemCount = 0;
}

SongRequestQueue.prototype.addSong = function(link) {
    this.playlist.push(link);
    this.itemCount++;
}

SongRequestQueue.prototype.removeSong = function(n) {
    this.playlist.splice(n-1)
}

SongRequestQueue.prototype.checkSong = function() {

}

SongRequestQueue.prototype.count = function() {
    return this.itemCount;
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
    this.SongRequestQueue = new SongRequestQueue();
    this.FirebaseConnection = new FirebaseConnection();

    this.commands = new Discord.Collection();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        this.commands.set(command.name, command);
    }

    this.adminCommands = new Discord.Collection();
    const commandFiles2 = fs.readdirSync('./adminCommands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles2) {
        const command = require(`./adminCommands/${file}`);
        this.adminCommands.set(command.name, command);
    }

    this.client = new Discord.Client();
    this.client.once('ready', () => {
        console.log('Ready!');
    });
    this.client.login(config.token);
}

BotManager.prototype.getSongRequestQueue = function() {
    return this.SongRequestQueue;
}


module.exports = {BotManager, VoiceConnectionHandler, SongRequestQueue}
