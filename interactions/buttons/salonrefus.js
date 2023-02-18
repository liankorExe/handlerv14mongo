const { Discord, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const salonModel = require("../../schemas/salonWaiting")
const serverModel = require("../../schemas/serverSettings")

module.exports = {
    id: 'salon-refuser',
    permissions: [],
    run: async (client, interaction) => {
        const msgData = await salonModel.findOne({ messageID: interaction.message.id })
        const serverSettings = await serverModel.findOne({ serverID: msgData.serverID })
        const salonModal = new ModalBuilder()
            .setCustomId('salonrejetmodal')
            .setTitle('Raison du refus du salon')
            .setComponents([
                new ActionRowBuilder()
                    .setComponents([
                        new TextInputBuilder()
                            .setCustomId("raison")
                            .setLabel("Raison : ")
                            .setMinLength(10)
                            .setMaxLength(300)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                    ])
            ])
        await interaction.showModal(salonModal)
        const filter = (inter) => inter.customId === 'salonrejetmodal';
        interaction.awaitModalSubmit({ filter, time: 60000 * 10 })
            .then(async inter => {
                await inter.deferUpdate()
                const raison = await inter.fields.getTextInputValue('raison');
                inter.message.delete()
                const channelFetched = await client.channels.fetch(serverSettings.salongeneral)
                if (channelFetched) {
                    const embedRefus = new EmbedBuilder()
                        .setTitle(`Description refusé`)
                        .setDescription(`> Votre demande de modification de salon a été refusé pour la raison suivante : \n\`${raison}\`\n\n⚠️ *Vous n'avez pas respecté les conditions d'utilisations de Adshare Bot par conséquence votre salon a été supprimée !*`)
                        .setColor(process.env.COLOR)
                    channelFetched.send({ embeds: [embedRefus] })
                }
                await serverModel.findOneAndUpdate(
                    { serverID: msgData.serverID },
                    { salongeneral: 'null' }
                )
                await salonModel.findOneAndDelete({ messageID: interaction.message.id });
            }).catch()
    }
};
