const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const timeModel = require("../../../schemas/timeArrayTable")

module.exports = {
    name: "settime",
    description: "Choisis le délai d'envoi de votre pub",
    options: [],
    default_member_permissions: 0x8,
    run: async (client, interaction) => {
        let timeData = await timeModel.findOne({ searchInDb: "adshare" })
        if (!timeData) await timeModel.create({
            searchInDb: "adshare",
            deux: [],
            quatre: [],
            six: [],
            huit: [],
            douze: [],
            vingtquatre: []
        });

        timeData = await timeModel.findOne({ searchInDb: "adshare" });

        const findGuildHour = (guildId) => {
            for (const [hour, guildIds] of Object.entries(hoursMap)) {
                if (guildIds.includes(guildId)) {
                    return hour;
                }
            }
            return null;
        };

        const guildHour = findGuildHour(interaction.guild.id);
        const embedTime = new EmbedBuilder()
            .setTitle(`⌛ Set Time`)
            .setDescription(`\`\`\` \`\`\`\n\n> Voici la liste des heures de pub\nVous êtes actuellement dans la liste des **${guildHour}**\n\n**Pour choisir une heure il vous suffit de choisir votre heure à l'aide du menu déroulant**`)
            .setColor(process.env.COLOR);

        interaction.reply({ embeds: [embedTime], components: [selectheuresmenu], allowedMentions: { parse: [] } });
    }
};

const hoursMap = {
    "2H": timeData.deux,
    "4H": timeData.quatre,
    "6H": timeData.six,
    "8H": timeData.huit,
    "12H": timeData.douze,
    "24H": timeData.vingtquatre
};

const selectheuresmenu = new ActionRowBuilder()
.addComponents(
    new StringSelectMenuBuilder()
        .setCustomId('selecthours')
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