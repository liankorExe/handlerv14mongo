const fs = require('fs');
const chalk = require('chalk');
const AsciiTable = require('ascii-table');
const table = new AsciiTable();
table.setHeading('Buttons', 'Stats').setBorder('|', '=', "0", "0");

module.exports = (client) => {
    fs.readdirSync('./interactions/buttons/').filter((file) => file.endsWith('.js')).forEach((file) => {
        const button = require(`../interactions/buttons/${file}`);
        client.interactionManager.buttons.set(button.id, button);
        table.addRow(button.id, '✅');
    })
    console.log(chalk.cyanBright(table.toString()));
};