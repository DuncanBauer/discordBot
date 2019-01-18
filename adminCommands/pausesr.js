module.exports = {
    name: "pausesr",
    execute(message, botManager) {
        let dispatcher = botManager.dispatchers.get(message.guild.id);
        if(dispatcher && !dispatcher.paused) {
            dispatcher.pause();
            console.log(`${message.guild.id}: Song Request queue has paused playing`);
        }
    }
}
