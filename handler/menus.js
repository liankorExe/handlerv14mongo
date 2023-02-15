const fs = require('fs');
const chalk = require('chalk')
var AsciiTable = require('ascii-table')
var table = new AsciiTable()
table.setHeading('Menus', 'Stats').setBorder('|', '=', "0", "0")

module.exports = (client) => {
    fs.readdirSync('./menus/').filter((file) => file.endsWith('.js')).forEach((file) => {
        const menus = require(`../menus/${file}`)
        client.interactionManager.menus.set(menus.id, menus)
        table.addRow(menus.id, '✅')
    })
    console.log(chalk.cyanBright(table.toString()))
};
