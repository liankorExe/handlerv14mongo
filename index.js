const fs = require('fs');
const Sequelize = require('sequelize');
const { Client, GatewayIntentBits } = require("discord.js");
const { token, sequelizeCredentials } = require('./config.json');
const { deploy_commands } = require('./functions.js');

const client = new Client({
    intents: []
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
	description: Sequelize.STRING,
	timestamp: Sequelize.STRING,
});

serverdb.sync()

client.database = {
    server: serverdb
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

deploy_commands(client, true);//true: will refresh slash commands


client.login(token);