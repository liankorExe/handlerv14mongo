const { GatewayIntentBits, Client, Collection } = require("discord.js");
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
    ],
});

const fs = require("fs")
client.interactionManager = {
    buttons: new Collection(),
    selectMenus: new Collection(),
    modals: new Collection(),
    commands: new Collection(),
};

module.exports = client;

fs.readdirSync('./handler').forEach((handler) => {
    require(`./handler/${handler}`)(client);
});

// ERROR LOG MANAGEMENT
// =====================================================================
let errorLogStream = fs.createWriteStream(__dirname + '/logs/error.log', {
    flags: 'a'
});
// ERROR HANDLING
// =====================================================================
process.on('uncaughtException', (err, next) => {
    var date = new Date();
    console.error(`+++++++ ${date} error found, logging event +++++++`);
    console.error(err.stack);
    errorLogStream.write(`Date: ${date}. Err: ${err.stack}`);
    return;
});

client.login(process.env.TOKEN);
