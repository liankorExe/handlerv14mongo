const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: [],
});

const fs = require("fs")
client.interactionManager = {
    buttons: new Collection(),
    selectMenus: new Collection(),
    modals: new Collection(),
};

module.exports = client;

fs.readdirSync('./handler').forEach((handler) => {
    require(`./handler/${handler}`)(client);
});

client.login(process.env.TOKEN);