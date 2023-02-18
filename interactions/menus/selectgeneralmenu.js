const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, Discord, ModalBuilder, ChannelSelectMenuBuilder, ChannelType, TextInputBuilder, TextInputStyle, time } = require("discord.js")
const serverModel = require("../../schemas/serverSettings");
const timeModel = require("../../schemas/timeArrayTable");
const salonModel = require("../../schemas/salonWaiting")

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
                salongeneral: "null",
                lastMessageUrl: "null",
                status: false
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
                    const logschannel = await client.channels.fetch(process.env.LOGCHANNEL)
                    const embedLogs = new EmbedBuilder()
                        .setTitle(`Pub du serveur : ${interaction.guild.name}`)
                        .setDescription(`\`\`\` \`\`\`\n${serverSettings.salongeneral}`)
                        .setColor("#2B2D31")

                    const invite = interaction.guild.createInvite({
                        maxAge: 86400,
                        maxUses: 10
                    })
                    const buttonChoix = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('invite')
                                .setLabel(`Aller voir`)
                                .setURL(invite)
                                .setStyle(ButtonStyle.Link),
                        )
                    const msgLogs = await logschannel.send({ embeds: [embedLogs], components: [buttonChoix] })
                    await salonModel.create({
                        messageID: msgLogs.id,
                        serverID: interaction.guild.id,
                        inviteServer: invite
                    })
                })
                .catch(console.error);
        }
        if (val === "on") {
            if (timeData.general.includes(interaction.guild.id)) {
                return interaction.reply({ content: `Vous avez déjà activé le system de général !`, ephemeral: true })
            }
            timeData.general.push(interaction.guild.id)
            timeData.save()
            interaction.reply({ content: `Vous venez de rejoindre le system de général !`, ephemeral: true })
        }
        if (val === "off") {
            if (!timeData.general.includes(interaction.guild.id)) {
                return interaction.reply({ content: `Vous avez déjà désactivé le system de général !`, ephemeral: true })
            }
            const pos = timeData.general.indexOf(interaction.guild.id)
            timeData.general.splice(pos, 1)
            timeData.save()
            interaction.reply({ content: `Vous venez de quitter le system de général !`, ephemeral: true })
        }
    }
}
