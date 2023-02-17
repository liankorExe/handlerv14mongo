const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Discord, ModalBuilder, ChannelSelectMenuBuilder, ChannelType, TextInputBuilder, TextInputStyle } = require("discord.js")
const serverModel = require("../../schemas/serverSettings")
module.exports = {
    id: 'configselectmenu',
    permissions: [],
    run: async (client, interaction) => {
        let serverSettings = await serverModel.findOne({ serverID: interaction.guild.id })
        if (!serverSettings) {
            await serverModel.create({
                serverID: interaction.guild.id,
                description: "null",
                salonpub: "null"
            })
        }
        serverSettings = await serverModel.findOne({ serverID: interaction.guild.id })
        const val = interaction.values[0]
        if (val === "salon") {
            await interaction.deferUpdate();
            await interaction.channel.send({ content: "Choisissez un salon", components: [channelMENU] });
            const filter = (inter) => inter.customId === 'configselectmenuchannel' && inter.user.id === interaction.user.id;
            interaction.channel.awaitMessageComponent({ filter, time: 60_000 })
                .then(async inter => {
                    const id = inter.channels.first().id
                    inter.update({ content: `Vous avez sélectionné le salon <#${id}>`, components: [] });
                    await serverModel.findOneAndUpdate(
                        {
                            serverID: interaction.guild.id,
                        },
                        {
                            salonpub: id,
                        },
                    );
                    serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });

                    interaction.message.embeds[0].fields[0].value = serverSettings.salonpub === "null" ? "Non défini" : `<#${id}>`;
                    interaction.message.edit({ embeds: interaction.message.embeds });
                })
                .catch(console.error);
        } else if (val == "description") {
            let serverSettings = await serverModel.findOne({ serverID: interaction.guild.id })
            const descriptionMODAL = new ModalBuilder()
                .setCustomId('configmodal_description')
                .setTitle('Description du serveur')
                .setComponents([
                    new ActionRowBuilder()
                        .setComponents([
                            new TextInputBuilder()
                                .setCustomId("description")
                                .setLabel("Description")
                                .setMinLength(100)
                                .setMaxLength(4000)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                        ])
                ])
            if (serverSettings.description != "null") descriptionMODAL.components[0].components[0].setValue(serverSettings.description)

            await interaction.showModal(descriptionMODAL)
            const filter = (inter) => inter.customId === 'configmodal_description';
            interaction.awaitModalSubmit({ filter, time: 60_000 })
                .then(async inter => {
                    const desc = await inter.fields.getTextInputValue('description');
                    await inter.reply({ content: `Description définie: \n\n${desc}` });
                    await serverModel.findOneAndUpdate(
                        {
                            serverID: interaction.guild.id,
                        },
                        {
                            description: desc,
                        },
                    );
                    serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });

                    interaction.message.embeds[0].fields[1].value = serverSettings.description === "null" ? "Non défini" : `${desc}`;
                    interaction.message.edit({ embeds: interaction.message.embeds });
                })
                .catch(console.error);
        }
    }
};

const channelMENU = new ActionRowBuilder()
    .setComponents([
        new ChannelSelectMenuBuilder()
            .setCustomId('configselectmenuchannel')
            .setChannelTypes(ChannelType.GuildText)
            .setPlaceholder("Choisissez un salon")
    ])