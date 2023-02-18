const { Discord, EmbedBuilder } = require("discord.js")
const salonModel = require("../../schemas/salonWaiting")

module.exports = {
    id: 'salon-valider',
    permissions: [],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        interaction.message.delete()
        await salonModel.findOneAndDelete({ messageID: interaction.message.id });
    }
};
