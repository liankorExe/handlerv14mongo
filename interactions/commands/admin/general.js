const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const serverModel = require("../../../schemas/serverSettings")

module.exports = {
    name: "general",
    description: "Choisis le délai d'envoi de votre pub",
    options: [],
    default_member_permissions: "Administrator",
    run: async (client, interaction) => {
        let serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });
        if (!serverSettings) await serverModel.create({
            serverID: interaction.guild.id,
            description: "null",
            salonpub: "null"
        });

        serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });

    }
};
