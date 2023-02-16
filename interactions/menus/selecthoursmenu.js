const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Discord } = require("discord.js")
const timeModel = require("../../schemas/timeArrayTable")
module.exports = {
    id: 'selecthours',
    permissions: [],
    run: async (client, interaction) => {
        let timeData = await timeModel.findOne({ searchInDb: "adshare" })
        if (!timeData) {
            await timeModel.create({
                searchInDb: "adshare",
                deux: [],
                quatre: [],
                six: [],
                huit: [],
                douze: [],
                vingtquatre: []
            })
        }

        timeData = await timeModel.findOne({ searchInDb: "adshare" })
        const checkAndAddId = (newArr, guildId) => {
            const indexDeux = timeData.deux.indexOf(interaction.guild.id);
            if (indexDeux > -1) timeData.deux.splice(indexDeux, 1);
            const indexQuatre = timeData.quatre.indexOf(interaction.guild.id);
            if (indexQuatre > -1) timeData.quatre.splice(indexQuatre, 1);
            const indexSix = timeData.six.indexOf(interaction.guild.id);
            if (indexSix > -1) timeData.six.splice(indexSix, 1);
            const indexHuit = timeData.huit.indexOf(interaction.guild.id);
            if (indexHuit > -1) timeData.huit.splice(indexHuit, 1);
            const indexDouze = timeData.douze.indexOf(interaction.guild.id);
            if (indexDouze > -1) timeData.douze.splice(indexDouze, 1);
            const indexVingtquatre = timeData.vingtquatre.indexOf(interaction.guild.id);
            if (indexVingtquatre > -1) timeData.vingtquatre.splice(indexVingtquatre, 1);
            if (!newArr.includes(guildId)) {
                newArr.push(guildId)
                timeData.save()
            }
        }
        async function updateInte() {
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
            }

            const guildHour = findGuildHour(interaction.guild.id);
            const embedTime = new EmbedBuilder()
                .setTitle(`⌛ Set Time`)
                .setDescription(`\`\`\` \`\`\`\n\n> Voici la liste des heures de pub\nVous êtes actuellement dans la liste des **${guildHour}**\n\n**Pour choisir une heure il vous suffit de choisir votre heure à l'aide du menu déroulant**`)
                .setColor(process.env.COLOR)
            interaction.message.edit({ embeds: [embedTime] })
        }
        const timeOption = interaction.values[0];
        switch (timeOption) {
            case 'deux':
                checkAndAddId(timeData.deux, interaction.guild.id)
                const msgdeux = await interaction.reply({ content: `Vous venez de choisir de recevoir les pubs toutes les 2H !`, fetchReply: true })
                setTimeout(() => {
                    msgdeux.delete()
                }, 2000);
                updateInte()
                break;
            case 'quatre':
                checkAndAddId(timeData.quatre, interaction.guild.id)
                const msgquatre = await interaction.reply({ content: `Vous venez de choisir de recevoir les pubs toutes les 4H !`, fetchReply: true })
                setTimeout(() => {
                    msgquatre.delete()
                }, 2000);
                updateInte()
                break;
            case 'six':
                checkAndAddId(timeData.six, interaction.guild.id)
                const msgsix = await interaction.reply({ content: `Vous venez de choisir de recevoir les pubs toutes les 6H !`, fetchReply: true })
                setTimeout(() => {
                    msgsix.delete()
                }, 2000);
                updateInte()
                break;
            case 'huit':
                checkAndAddId(timeData.huit, interaction.guild.id)
                const msghuit = await interaction.reply({ content: `Vous venez de choisir de recevoir les pubs toutes les 8H !`, fetchReply: true })
                setTimeout(() => {
                    msghuit.delete()
                }, 2000);
                updateInte()
                break;
            case 'douze':
                checkAndAddId(timeData.douze, interaction.guild.id)
                const msgdouze = await interaction.reply({ content: `Vous venez de choisir de recevoir les pubs toutes les 12H !`, fetchReply: true })
                setTimeout(() => {
                    msgdouze.delete()
                }, 2000);
                updateInte()
                break;
            case 'vingtquatre':
                checkAndAddId(timeData.vingtquatre, interaction.guild.id)
                const msgvingtquatre = await interaction.reply({ content: `Vous venez de choisir de recevoir les pubs toutes les 24H !`, fetchReply: true })
                setTimeout(() => {
                    msgvingtquatre.delete()
                }, 2000);
                updateInte()
                break;
            default:
                console.log(`Option inconnue : ${timeOption}`);
        }

    }
};
