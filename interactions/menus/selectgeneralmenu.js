const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Discord, ModalBuilder, ChannelSelectMenuBuilder, ChannelType, TextInputBuilder, TextInputStyle, time } = require("discord.js")
const serverModel = require("../../schemas/serverSettings");
const timeModel = require("../../schemas/timeArrayTable");

module.exports = {
    id: 'selectgeneralmenu',
    permissions: [],
    run: async (client, interaction) => {
        let serverSettings = await serverModel.findOne({ serverID: interaction.guild.id })
        if (!serverSettings) {
            await serverModel.create({
                serverID: interaction.guild.id,
                description: "null",
                salonpub: "null",
                salongeneral: "null"
            })
        }
        serverSettings = await serverModel.findOne({ serverID: interaction.guild.id })

        const timeData = await timeModel.findOne({ searchInDb: "adshare" });
        const val = interaction.values[0]

        if (val === "salon") {
            const channelMENU = new ActionRowBuilder()
                .setComponents([
                    new ChannelSelectMenuBuilder()
                        .setCustomId('configselectmenuchannel')
                        .setChannelTypes(ChannelType.GuildText)
                        .setPlaceholder("Choisissez un salon")
                ])
            await interaction.reply({ content: "Choisissez un salon", components: [channelMENU], ephemeral: true });
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
                            salongeneral: id,
                        },
                    );
                    serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });
                })
                .catch(console.error);
        }
        if (val === "on") {
            if (timeData.general.includes(interaction.guild.id)) {
                return interaction.reply({ content: `Vous avez déjà activer le system de général !` })
            }
            timeData.general.push(interaction.guild.id)
            timeData.save()
            interaction.reply({ content: `Vous venez de rejoindre le system de général !` })
        }
        if (val === "off") {
            if (!timeData.general.includes(interaction.guild.id)) {
                return interaction.reply({ content: `Vous avez déjà désactiver le system de général !` })
            }
            const pos = timeData.general.indexOf(interaction.guild.id)
            timeData.general.splice(pos, 1)
            timeData.save()
            interaction.reply({ content: `Vous venez de quitter le system de général !` })
        }
    }
}