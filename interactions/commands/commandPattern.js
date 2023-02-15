const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pattern")
    .setDescription("Pattern command"),
    run: async (client, interaction) => {
        console.log("pattern")
    }
};
