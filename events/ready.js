const client = require('..');
const chalk = require('chalk');

client.on('ready', async () => {
    console.log(chalk.red(`${client.user.tag} prêt a pub ! 📌`));
});
