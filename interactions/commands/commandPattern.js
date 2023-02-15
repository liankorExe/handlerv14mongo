const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set time")
    .setDescription("Choisis l'heure à la quelle le bot envoie votre pub"),
    run: async (client, interaction) => {
        
    }
};
