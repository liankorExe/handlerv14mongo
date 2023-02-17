const { Discord, EmbedBuilder } = require("discord.js")
const serverModel = require("../../schemas/serverSettings")

module.exports = {
    id: 'desc-apercu',
    permissions: [],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        let serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });
        if (!serverSettings) await serverModel.create({
            serverID: interaction.guild.id,
            description: "null",
            salonpub: "null",
            salongeneral: "null",
            lastMessageUrl: "null",
            status: false
        });

        serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });

        const embedApercu = new EmbedBuilder()
            .setTitle(`${interaction.guild.name}`)
            .setThumbnail(interaction.guild.iconURL())
            .setColor("#19D103")
            .setDescription(serverSettings.description === "null" ? "Non définie" : serverSettings.description);

        interaction.editReply({ embeds: [embedApercu] });
    }
};
