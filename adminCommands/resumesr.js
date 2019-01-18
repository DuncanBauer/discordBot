module.exports = {
    name: "resumesr",
    execute(message, botManager) {
        let dispatcher = botManager.dispatchers.get(message.guild.id);
        if(dispatcher && dispatcher.paused) {
            dispatcher.resume();
            console.log(`${message.guild.id}: Song Request queue has resumed playing`);
        }
    }
}
