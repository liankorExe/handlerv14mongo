const fs = require('fs');
const chalk = require('chalk')
const AsciiTable = require('ascii-table');
const table = new AsciiTable();
table.setHeading('Menus', 'Stats').setBorder('|', '=', "0", "0");

module.exports = (client) => {
    fs.readdirSync('./menus/').filter((file) => file.endsWith('.js')).forEach((file) => {
        const menu = require(`../menus/${file}`);
        client.interactionManager.selectMenus.set(menu.id, menu);
        table.addRow(menu.id, '✅');
    });
    console.log(chalk.yellow(table.toString()));
};
