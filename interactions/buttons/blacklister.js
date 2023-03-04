const { Discord, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const blModel = require("../../schemas/blacklist");
module.exports = {
    id: 'blacklister',
    permissions: [],
    run: async (client, interaction) => {
        let blackliste = await blModel.findOne({ adshare: "adshare" });
        if (!blackliste) await blModel.create({
            adshare: "adshare",
            servers: [],
        });

        blackliste = await blModel.findOne({ adshare: "adshare" });
        const serverId = interaction.customId.split('_')[1]
        if (blackliste.servers.includes(serverId)) return interaction.reply({ content: `Ce serveur est déjà blacklisté !`, ephemeral: true })
        blackliste.servers.push(serverId);
        blackliste.save();
        interaction.reply({ content: `Le serveur viens d'etre blacklisté !`, ephemeral: true })
    }
};
