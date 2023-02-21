const { Discord, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const blModel = require("../../schemas/blacklist");

module.exports = {
    id: 'add-bl',
    permissions: [],
    run: async (client, interaction) => {
        let blackliste = await blModel.findOne({ adshare: "adshare" });
        if (!blackliste) await blModel.create({
            adshare: "adshare",
            servers: [],
        });

        blackliste = await blModel.findOne({ adshare: "adshare" });
        const serveurIdModal = new ModalBuilder()
            .setCustomId('modalserveurid')
            .setTitle(`Blackliste`)
            .setComponents([
                new ActionRowBuilder()
                    .setComponents([
                        new TextInputBuilder()
                            .setCustomId('serveurId')
                            .setLabel('Serveur id')
                            .setMinLength(1)
                            .setMaxLength(100)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph),
                    ]),
            ]);
        await interaction.showModal(serveurIdModal)
        const filter = (inter) => inter.customId === 'modalserveurid';
        interaction.awaitModalSubmit({ filter, time: 60000 * 10 })
            .then(async inter => {
                await inter.deferUpdate()
                const servid = await inter.fields.getTextInputValue('serveurId');
                const server = client.guilds.cache.get(servid);
                if (!server) {
                    interaction.followUp({ content: `Le bot n'est pas présent sur le serveur ${servid}.`, ephemeral: true });
                    return;
                } else {
                    interaction.followUp({ content: `Le serveur ${server.name} a été blacklisté !`, ephemeral: true })
                    blackliste.servers.push({ name: server.name, id: server.id })
                    blackliste.save()
                    server.leave()
                }
            }).catch(() => {
                return;
            })
    }
};
