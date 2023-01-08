module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        console.log("[INFO] Bot online")
        client.user.setStatus('online');
    }
}