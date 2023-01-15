const fs = require('fs');
const Sequelize = require('sequelize');
const { Client, GatewayIntentBits, WebhookClient } = require("discord.js");
const { token, sequelizeCredentials, guildId, logWebhook } = require('./config.json');
const { deploy_commands_global_and_guild } = require('./functions.js');

const client = new Client({
    intents: [
		GatewayIntentBits.Guilds,
	]
});

const sequelize = new Sequelize('database', sequelizeCredentials.username, sequelizeCredentials.password, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const serverdb = sequelize.define('server', {
	name: {//id
		type: Sequelize.STRING,
		unique: true,
	},
	channel: Sequelize.STRING,
	invite: Sequelize.STRING,
	locale: Sequelize.STRING,
	description: Sequelize.STRING,
});

serverdb.sync()

client.database = {
    server: serverdb,
	awaitingServers: []
}

client.logs = new WebhookClient({ url: logWebhook });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

deploy_commands_global_and_guild(client, true, guildId);//true: will refresh slash commands


process.on("unhandledRejection", (reason, p) => {
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log(err, origin);
});


client.login(token);