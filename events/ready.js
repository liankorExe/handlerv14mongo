const { Discord } = require('discord.js');
const client = require('..');
const chalk = require('chalk')

client.on('interactionCreate', async interaction => {
    console.log(chalk.red(`${client.user.tag} prêt a pub ! 📌`))
});
