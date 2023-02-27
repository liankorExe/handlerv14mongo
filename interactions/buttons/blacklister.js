const { Discord, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const blModel = require("../../schemas/blacklist");
module.exports = {
    id: 'blacklister',
    permissions: [],
    run: async (client, interaction) => {
        let blacklist = await blModel.findOne({ adshare: "adshare" });
        if (!blacklist) await blModel.create({
            adshare: "adshare",
            servers: [],
        });

        blacklist = await blModel.findOne({ adshare: "adshare" });
        const serverId = interaction.customId.split('_')[1]
        if (blacklist.servers.includes(serverId)) return interaction.reply({ content: `Ce serveur est déjà blacklisté !`, ephemeral: true })
        blacklist.servers.push(serverId);
        blacklist.save();
        interaction.reply({ content: `Le serveur viens d'etre blacklisté !`, ephemeral: true })
    }
};
