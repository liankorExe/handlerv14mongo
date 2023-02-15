const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("settime")
        .setDescription("Choisis l'heure à la quelle le bot envoie votre pub"),
    run: async (client, interaction) => {
        console.log("test")
    }
};
