const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const serverModel = require("../../../schemas/serverSettings");
const timeModel = require("../../../schemas/timeArrayTable");

module.exports = {
    name: "config",
    description: "Choisis le délai d'envoi de votre pub",
    options: [],
    default_member_permissions: "Administrator",
    run: async (client, interaction) => {
        let serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });
        if (!serverSettings) await serverModel.create({
            serverID: interaction.guild.id,
            description: "null",
            salonpub: "null",
            salongeneral: "null"
        });

        serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });
        const selectconfigmenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('configselectmenu')
                    .setPlaceholder('Choisis ce que tu veux modifier')
                    .addOptions(
                        {
                            label: 'Salon',
                            emoji: '🏷',
                            value: 'salon',
                        },
                        {
                            label: 'Délai',
                            emoji: `🕐`,
                            value: 'delai',
                        },
                        {
                            label: 'Description',
                            emoji: `📌`,
                            value: 'description',
                        },
                    ),
            );

        const buttonsOptions = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('desc-copier')
                    .setLabel('Copier')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('desc-apercu')
                    .setLabel('Aperçu')
                    .setStyle(ButtonStyle.Secondary),
            )
        const timeData = await timeModel.findOne({ searchInDb: "adshare" });
        const hoursMap = {
            "2H": timeData.deux,
            "4H": timeData.quatre,
            "6H": timeData.six,
            "8H": timeData.huit,
            "12H": timeData.douze,
            "24H": timeData.vingtquatre
        };
        const findGuildHour = (guildId) => {
            for (const [hour, guildIds] of Object.entries(hoursMap)) {
                if (guildIds.includes(guildId)) {
                    return hour;
                }
            }
            return null;
        };

        const guildHour = findGuildHour(interaction.guild.id);
        const embedConfig = new EmbedBuilder()
            .setTitle(`⚙ Configuration`)
            .setDescription(`\`\`\` \`\`\`\n\n> *Voici la configuration du serveur **${interaction.guild.name}** *`)
            .addFields(
                { name: `🏷 Salon`, value: serverSettings.salonpub === "null" ? "Non défini" : `<#${serverSettings.salonpub}>` },
                { name: `🕐 Délai`, value: guildHour ?? "Non défini" },
                { name: `📌 Description`, value: serverSettings.description === "null" ? "Aucune description" : `${serverSettings.description}` },
            )
            .setColor(process.env.COLOR);

        interaction.reply({ embeds: [embedConfig], components: [selectconfigmenu, buttonsOptions], allowedMentions: { parse: [] } });
    }
};
