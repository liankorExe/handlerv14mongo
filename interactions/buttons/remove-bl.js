const { Discord, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const blModel = require("../../schemas/blacklist");

module.exports = {
    id: 'remove-bl',
    permissions: [],
    run: async (client, interaction) => {
        let blackliste = await blModel.findOne({ adshare: "adshare" });
        if (!blackliste) await blModel.create({
            adshare: "adshare",
            servers: [],
        });

        blackliste = await blModel.findOne({ adshare: "adshare" });
        const serveurIdModal = new ModalBuilder()
            .setCustomId('modalserveuridremove')
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
        const filter = (inter) => inter.customId === 'modalserveuridremove';
        interaction.awaitModalSubmit({ filter, time: 60000 * 9999 })
            .then(async inter => {
                await inter.deferUpdate()
                const servid = await inter.fields.getTextInputValue('serveurId');
                const server = client.guilds.cache.get(servid);
                if (!blackliste.servers.includes(servid)) {
                    interaction.followUp({ content: `${servid} n'est pas dans la blackliste !`, ephemeral: true });
                    return;
                } else {
                    interaction.followUp({ content: `Le serveur ${servid} a été enlevé de la blackliste !`, ephemeral: true })
                    const pos = blackliste.servers.indexOf(servid)
                    blackliste.servers.splice(pos, 1)
                    blackliste.save()
                }
            }).catch(() => {
                return;
            })
    }
};
