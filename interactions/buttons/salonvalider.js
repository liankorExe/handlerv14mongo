const { Discord, EmbedBuilder } = require("discord.js")
const salonModel = require("../../schemas/salonWaiting")

module.exports = {
    id: 'salon-valider',
    permissions: [],
    run: async (client, interaction) => {
        await salonModel.findOneAndDelete({ messageID: interaction.message.id });
        await interaction.message.delete()
    }
};
