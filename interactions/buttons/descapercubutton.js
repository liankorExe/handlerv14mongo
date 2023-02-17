const { Discord, EmbedBuilder } = require("discord.js")
const serverModel = require("../../schemas/serverSettings")

module.exports = {
    id: 'desc-apercu',
    permissions: [],
    run: async (client, interaction) => {
        await interaction.deferUpdate()
        let serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });
        if (!serverSettings) await serverModel.create({
            serverID: interaction.guild.id,
            description: "null",
            salonpub: "null"
        });

        serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });

        const embedApercu = new EmbedBuilder()
            .setTitle(`Aperçu`)
            .setColor(process.env.COLOR)
            .setDescription(serverSettings.description === "null" ? "Non défini" : serverSettings.description)

        interaction.channel.send({ embeds: [embedApercu] })
    }
};
