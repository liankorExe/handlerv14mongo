const { REST, Routes } = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const AsciiTable = require('ascii-table');
const table = new AsciiTable();
table.setHeading('Slash Commands', 'Stats').setBorder('|', '=', "0", "0");

module.exports = async (client) => {
    const slashCommands = [];

    for (const dir of fs.readdirSync("./interactions/commands/")) {
        const files = fs.readdirSync(`./interactions/commands/${dir}/`).filter(file => file.endsWith('.js'));

        for (const file of files) {
            const slashCommand = require(`../interactions/commands/${dir}/${file}`);
            slashCommands.push({
                name: slashCommand.name,
                description: slashCommand.description,
                options: slashCommand.options ? slashCommand.options : null,
            });
            if (slashCommand.name) {
                client.interactionManager.commands.set(slashCommand.name, slashCommand);
                table.addRow(file.split(".js")[0], "✅");
            } else {
                table.addRow(file.split(".js")[0], "⛔");
            }
        }
    }
    console.log(chalk.red(table.toString()));

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        await rest.put(Routes.applicationCommands(process.env.APPID), { body: slashCommands });
        console.log(chalk.magenta(`SlashCommands Enregistrés`));
    } catch (error) {
        console.error(error);
    }
};
