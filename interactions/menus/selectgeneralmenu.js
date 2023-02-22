const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, Discord, ModalBuilder, ChannelSelectMenuBuilder, ChannelType, TextInputBuilder, TextInputStyle, time } = require("discord.js")
const serverModel = require("../../schemas/serverSettings");
const timeModel = require("../../schemas/timeArrayTable");
const salonModel = require("../../schemas/salonWaiting")
const checkPerms = require("../../functions")

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
            const perms = checkPerms(client, interaction)
            if (!perms) {
                return interaction.reply({ content: `Le bot a besoin de permissions suivante :\n\n- Voir les salons\n- Envoyer des messages\n- Creer des invitations`, ephemeral: true })
            }
            const channelBeforeId = serverSettings.salongeneral == "null" ? "Aucun" : await client.channels.fetch(serverSettings.salongeneral).id;
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
                    const channelserversettings = await client.channels.fetch(serverSettings.salongeneral)
                    const embedLogs = new EmbedBuilder()
                        .setTitle(`Changement du salon general du serveur : ${interaction.guild.name}`)
                        .setDescription(`\`\`\` \`\`\`\n${channelBeforeId ? `<#${channelBeforeId}> (${channelBeforeId.id})` : "Aucun"} -> ${channelserversettings} (${channelserversettings.id})`)
                        .setColor("#2B2D31")

                    const invite = await interaction.guild.invites.create(serverSettings.salongeneral, {
                        unique: true,
                        maxUses: 1
                    })
                    const buttonChoix = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Aller voir`)
                                .setURL(`${invite}`)
                                .setStyle(ButtonStyle.Link),
                            new ButtonBuilder()
                                .setCustomId(`salon-valider`)
                                .setLabel(`Valider`)
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId(`salon-refuser`)
                                .setLabel(`Refuser`)
                                .setStyle(ButtonStyle.Danger),
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
            const perms = checkPerms(client, interaction)
            if (!perms) {
                return interaction.reply({ content: `Le bot a besoin de permissions suivante :\n\n- Voir les salons\n- Envoyer des messages\n- Creer des invitations`, ephemeral: true })
            }
            if (timeData.general.includes(interaction.guild.id)) {
                return interaction.reply({ content: `Vous avez déjà activé le system de général !`, ephemeral: true })
            }
            timeData.general.push(interaction.guild.id)
            timeData.save()
            interaction.reply({ content: `Vous venez de rejoindre le system de général !`, ephemeral: true })
        }
        if (val === "off") {
            const perms = checkPerms(client, interaction)
            if (!perms) {
                return interaction.reply({ content: `Le bot a besoin de permissions suivante :\n\n- Voir les salons\n- Envoyer des messages\n- Creer des invitations`, ephemeral: true })
            }
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
