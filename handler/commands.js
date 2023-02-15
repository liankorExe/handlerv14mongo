const { REST, Routes } = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const AsciiTable = require('ascii-table');
const table = new AsciiTable();
table.setHeading('Slash Commands', 'Stats').setBorder('|', '=', "0", "0");

module.exports = (client) => {
    fs.readdirSync('./interactions/commands/').filter((file) => file.endsWith('.js')).forEach((file) => {
        const command = require(`../interactions/commands/${file}`);
        client.interactionManager.commands.set(command.data.name, command);
        table.addRow(command.data.name, '✅');
    })
    console.log(chalk.redBright(table.toString()));

    const commands = [];
    const commandFiles = fs.readdirSync('./interactions/commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../interactions/commands/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    (async () => {
        try {
            await rest.put(Routes.applicationCommands(process.env.APPID), {
                body: commands
            });

            console.log(chalk.magenta(`SlashCommads Enregistrés`));
        } catch (error) {
            console.error(error);
        }
    })();
};