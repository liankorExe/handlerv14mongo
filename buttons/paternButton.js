const config = require("../config.json");
const { Discord } = require("discord.js")
module.exports = {
    id: 'paternButton', // customId du bouton
    permissions: [],
    run: async (client, interaction) => {
        console.log("patern")
    }
};
