const { Discord } = require("discord.js")
const serverModel = require("../../schemas/serverSettings")

module.exports = {
    id: 'desc-copier',
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

        interaction.channel.send({ content: `\`\`\`\n${serverSettings.description}\`\`\`` })
    }
};
