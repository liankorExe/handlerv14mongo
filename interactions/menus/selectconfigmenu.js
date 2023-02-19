const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, Discord, ButtonBuilder, ModalBuilder, ChannelSelectMenuBuilder, ChannelType, TextInputBuilder, TextInputStyle, time } = require("discord.js")
const serverModel = require("../../schemas/serverSettings");
const timeModel = require("../../schemas/timeArrayTable");
const descModel = require("../../schemas/descWaiting");
const salonModel = require("../../schemas/salonWaiting");

module.exports = {
    id: 'configselectmenu',
    permissions: [],
    run: async (client, interaction) => {
        let serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });
        if (!serverSettings) {
            await serverModel.create({
                serverID: interaction.guild.id,
                description: "null",
                salonpub: "null",
                salongeneral: "null",
                lastMessageUrl: "null",
                status: false
            });
        };
        serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });
        const val = interaction.values[0];
        if (val === "on") {
            await serverModel.findOneAndUpdate(
                { serverID: interaction.guild.id },
                { status: true }
            );
            interaction.reply({ content: `Vous venez d'activer le système de pub`, ephemeral: true });
        }
        if (val === "off") {
            await serverModel.findOneAndUpdate(
                { serverID: interaction.guild.id },
                { status: false }
            );
            interaction.reply({ content: `Vous venez de desactiver le système de pub`, ephemeral: true });
        }
        if (val === "salon") {
            const channelBeforeId = serverSettings.salonpub == "null" ? "Aucun" : await client.channels.fetch(serverSettings.salonpub).id;
            await interaction.update({});
            await interaction.followUp({ content: "Choisissez un salon", components: [channelMENU], ephemeral: true });
            const filter = (inter) => inter.customId === 'configselectmenuchannel' && inter.user.id === interaction.user.id;
            interaction.channel.awaitMessageComponent({ filter, time: 60_000 })
                .then(async inter => {
                    const id = inter.channels.first().id;
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

                    interaction.message.embeds[0].fields[1].value = serverSettings.salonpub === "null" ? "Non défini" : `<#${id}>`;
                    interaction.editReply({ embeds: interaction.message.embeds });
                    const logschannel = await client.channels.fetch(process.env.LOGCHANNEL)
                    const channelserversettings = await client.channels.fetch(serverSettings.salonpub)
                    const embedLogs = new EmbedBuilder()
                        .setTitle(`Changement du salon publicitaire du serveur : ${interaction.guild.name}`)
                        .setDescription(`\`\`\` \`\`\`\n${channelBeforeId ? `<#${channelBeforeId}> (${channelBeforeId.id})` : "Aucun"} -> ${channelserversettings} (${channelserversettings.id})`)
                        .setColor("#2B2D31")

                    const invite = await interaction.guild.invites.create(serverSettings.salonpub, {
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
                .catch();
        } else if (val == "description") {
            let serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });
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
                                .setMaxLength(500)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                        ])
                ]);
            if (serverSettings.description != "null") descriptionMODAL.components[0].components[0].setValue(serverSettings.description);

            await interaction.showModal(descriptionMODAL);
            await interaction?.message?.edit({});
            const filter = (inter) => inter.customId === 'configmodal_description';
            interaction.awaitModalSubmit({ filter, time: 60000 * 10 })
                .then(async inter => {
                    const desc = await inter.fields.getTextInputValue('description');
                    await inter.reply({ content: `Description définie: \n\n${desc}`, ephemeral: true });
                    await serverModel.findOneAndUpdate(
                        {
                            serverID: interaction.guild.id,
                        },
                        {
                            description: desc,
                        },
                    );
                    serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });

                    interaction.message.embeds[0].fields[7].value = serverSettings.description === "null" ? "Non défini" : `${desc}`;
                    interaction.editReply({ embeds: interaction.message.embeds });

                    const logschannel = await client.channels.fetch(process.env.LOGCHANNEL);
                    const embedLogs = new EmbedBuilder()
                        .setTitle(`Pub du serveur : ${interaction.guild.name}`)
                        .setDescription(`\`\`\` \`\`\`\n${serverSettings.description}`)
                        .setColor("#2B2D31");

                    const msgLogs = await logschannel.send({ embeds: [embedLogs], components: [buttonChoix] });
                    await descModel.create({
                        messageID: msgLogs.id,
                        serverID: interaction.guild.id
                    });

                })
                .catch();
        } else if (val == 'delai') {
            await interaction.update({});
            await interaction.followUp({ content: "Choisissez un délai", components: [selectheuresMENU], ephemeral: true });
            const filter = (inter) => inter.customId === 'configselectmenudelay' && inter.user.id === interaction.user.id;
            interaction.channel.awaitMessageComponent({ filter, time: 60000 })
                .then(async inter => {
                    const timeData = await timeModel.findOne({ searchInDb: "adshare" });
                    const value = textHoursMap[inter.values[0]];
                    const hoursMap = {
                        "2H": timeData.deux,
                        "4H": timeData.quatre,
                        "6H": timeData.six,
                        "8H": timeData.huit,
                        "12H": timeData.douze,
                        "24H": timeData.vingtquatre
                    };
                    checkAndAddId(hoursMap[value], inter.guild.id, timeData);

                    await inter.update({ content: `Le délai a bien été défini sur ${value}`, components: [] });

                    interaction.message.embeds[0].fields[2].value = await findGuildHour(interaction.guild.id);
                    interaction.editReply({ embeds: interaction.message.embeds });

                })
                .catch();
        }
    }
};

const buttonChoix = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('desc-valider')
            .setLabel('Valider')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('desc-rejeter')
            .setLabel('Rejeter')
            .setStyle(ButtonStyle.Danger),
    );

const channelMENU = new ActionRowBuilder()
    .setComponents([
        new ChannelSelectMenuBuilder()
            .setCustomId('configselectmenuchannel')
            .setChannelTypes(ChannelType.GuildText)
            .setPlaceholder("Choisissez un salon")
    ]);


const selectheuresMENU = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('configselectmenudelay')
            .setPlaceholder('Choisis le délai')
            .addOptions(
                {
                    label: '2H',
                    value: 'deux',
                },
                {
                    label: '4H',
                    value: 'quatre',
                },
                {
                    label: '6H',
                    value: 'six',
                },
                {
                    label: '8H',
                    value: 'huit',
                },
                {
                    label: '12H',
                    value: 'douze',
                },
                {
                    label: '24H',
                    value: 'vingtquatre',
                },
            ),
    );


const checkAndAddId = (newArr, guildId, timeData) => {
    const indexDeux = timeData.deux.indexOf(guildId);
    if (indexDeux > -1) timeData.deux.splice(indexDeux, 1);
    const indexQuatre = timeData.quatre.indexOf(guildId);
    if (indexQuatre > -1) timeData.quatre.splice(indexQuatre, 1);
    const indexSix = timeData.six.indexOf(guildId);
    if (indexSix > -1) timeData.six.splice(indexSix, 1);
    const indexHuit = timeData.huit.indexOf(guildId);
    if (indexHuit > -1) timeData.huit.splice(indexHuit, 1);
    const indexDouze = timeData.douze.indexOf(guildId);
    if (indexDouze > -1) timeData.douze.splice(indexDouze, 1);
    const indexVingtquatre = timeData.vingtquatre.indexOf(guildId);
    if (indexVingtquatre > -1) timeData.vingtquatre.splice(indexVingtquatre, 1);
    if (!newArr.includes(guildId)) {
        newArr.push(guildId);
        timeData.save();
    };
};

const findGuildHour = async (guildId) => {
    const timeData = await timeModel.findOne({ searchInDb: "adshare" });
    const hoursMap = {
        "2H": timeData.deux,
        "4H": timeData.quatre,
        "6H": timeData.six,
        "8H": timeData.huit,
        "12H": timeData.douze,
        "24H": timeData.vingtquatre
    };
    for (const [hour, guildIds] of Object.entries(hoursMap)) {
        if (guildIds.includes(guildId)) {
            return hour;
        };
    };
    return null;
};

const textHoursMap = {
    "deux": "2H",
    "quatre": "4H",
    "six": "6H",
    "huit": "8H",
    "douze": "12H",
    "vingtquatre": "24H",
};