const fs = require('fs');
const chalk = require('chalk');
const AsciiTable = require('ascii-table');
const table = new AsciiTable();
table.setHeading('Buttons', 'Stats').setBorder('|', '=', "0", "0");

module.exports = (client) => {
    fs.readdirSync('./interactions/commands/').filter((file) => file.endsWith('.js')).forEach((file) => {
        const command = require(`../interactions/commands/${file}`);
        client.interactionManager.commands.set(command.data.name, command);
        table.addRow(command.name, '✅');
    })
    console.log(chalk.redBright(table.toString()));
};