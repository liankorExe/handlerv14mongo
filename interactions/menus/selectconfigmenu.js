const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Discord, ModalBuilder, ChannelSelectMenuBuilder, ChannelType, TextInputBuilder, TextInputStyle, time } = require("discord.js")
const serverModel = require("../../schemas/serverSettings");
const timeModel = require("../../schemas/timeArrayTable");

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
            await interaction.message.edit();
            await interaction.followUp({ content: "Choisissez un salon", components: [channelMENU], ephemeral: true });
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
            await interaction.deferReply({ ephemeral: true });
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
            await interaction.message.edit();
            interaction.awaitModalSubmit({ filter, time: 60_000 })
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

                    interaction.message.embeds[0].fields[2].value = serverSettings.description === "null" ? "Non défini" : `${desc}`;
                    interaction.message.edit({ embeds: interaction.message.embeds });
                })
                .catch(console.error);
        } else if(val=='delai'){
            await interaction.deferUpdate();
            await interaction.message.edit();
            await interaction.followUp({ content: "Choisissez un délai", components: [selectheuresMENU], ephemeral: true });
            const filter = (inter) => inter.customId === 'configselectmenudelay' && inter.user.id === interaction.user.id;
            interaction.channel.awaitMessageComponent({ filter, time: 60_000 })
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
                    checkAndAddId(hoursMap[value], inter.guild.id, timeData)

                    await inter.update({ content: `Le délai a bien été défini sur ${value}`, components: [] });

                    interaction.message.embeds[0].fields[1].value = await findGuildHour(interaction.guild.id);
                    interaction.editReply({ embeds: interaction.message.embeds });

                    
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
        newArr.push(guildId)
        timeData.save()
    }
}

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
        }
    }
    return null;
}

const textHoursMap = {
    "deux": "2H",
    "quatre": "4H",
    "six": "6H",
    "huit": "8H",
    "douze": "12H",
    "vingtquatre": "24H",
}