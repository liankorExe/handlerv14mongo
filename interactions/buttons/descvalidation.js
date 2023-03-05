const { Discord, EmbedBuilder } = require("discord.js")
const descModel = require("../../schemas/descWaiting")
const serverModel = require("../../schemas/serverSettings")

module.exports = {
    id: 'desc-valider',
    permissions: [],
    run: async (client, interaction) => {
        await interaction.deferUpdate();
        const msgData = await descModel.findOne({ messageID: interaction.message.id });
        interaction.editReply({ components: [] })
        await descModel.findOneAndDelete({ messageID: interaction.message.id });
    }
};
