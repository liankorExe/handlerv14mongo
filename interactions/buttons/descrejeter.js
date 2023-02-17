const { Discord, EmbedBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder, TextInputBuilder } = require("discord.js")
const descModel = require("../../schemas/descWaiting")
const serverModel = require("../../schemas/serverSettings")

module.exports = {
    id: 'desc-rejeter',
    permissions: [],
    run: async (client, interaction) => {
        const descriptionMODAL = new ModalBuilder()
            .setCustomId('descrejetmodal')
            .setTitle('Raison du refus de la description')
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
        const msgData = await descModel.findOne({ messageID: interaction.message.id });
        const serverSettings = await serverModel.findOne({ serverID: msgData.serverID })
        await interaction.showModal(descriptionMODAL)
        const filter = (inter) => inter.customId === 'descrejetmodal';
        await interaction.message.edit();
        interaction.awaitModalSubmit({ filter, time: 60000 * 10 })
            .then(async inter => {
                await inter.deferUpdate()
                const raison = await inter.fields.getTextInputValue('raison');
                interaction.message.delete()
                const channelFetched = await client.channels.fetch(serverSettings.salonpub)
                if (channelFetched) {
                    const embedRefus = new EmbedBuilder()
                        .setTitle(`Description refusé`)
                        .setDescription(`> Votre demande de description a été refusé pour la raison suivante : \n\`${raison}\`\n\n⚠️ *Vous n'avez pas respecté les conditions d'utilisations de Adshare Bot par conséquence votre description a été supprimée !*`)
                        .setColor(process.env.COLOR)
                    channelFetched.send({ embeds: [embedRefus] })
                }
                await serverModel.findOneAndUpdate(
                    { serverID: msgData.serverID },
                    {
                        description: "null"
                    }
                )
                interaction.message.edit({ components: [] })
            }).catch()
        await descModel.findOneAndDelete({ messageID: interaction.message.id });
    }
};
