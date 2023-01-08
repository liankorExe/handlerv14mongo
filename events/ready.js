const cron = require("node-cron");

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        console.info(`[INFO] Bot online - ${client.user.tag} (${client.user.id})`)
        client.user.setStatus('online');
        cron.schedule("0 */4 * * *", function() {
            console.info(`[RUNNER] Started sending servers`);
            
            console.info(`[RUNNER] Finished sending servers`);
        });
    }
}