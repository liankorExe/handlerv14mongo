const cron = require("node-cron");
const { sendServers } = require('../functions')

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        console.info(`[INFO] Bot online - ${client.user.tag} (${client.user.id})`)
        client.user.setStatus('online');
        //cron.schedule("0 */4 * * *", function() {
        cron.schedule("* */4 * * *", async function() {
            console.info(`[RUNNER] Started sending servers`);
            await sendServers(client)
            console.info(`[RUNNER] Finished sending servers`);
        });
    }
}
