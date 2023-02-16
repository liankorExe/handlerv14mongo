const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const timeModel = require("../../../schemas/timeArrayTable")

module.exports = {
    name: "settime",
    description: "Choisis l'heure à la quelle le bot envoie votre pub",
    options: [],
    run: async (client, interaction) => {
        console.log(interaction)
        let timeData = timeModel.findOne({ searchInDb: "adshare" })
        if (timeData) {
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
        timeData = timeModel.findOne({ searchInDb: "adshare" })

        const selectheuresmenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('selecthours')
                    .setPlaceholder('Choisis ton / tes heure(s)')
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
        const embedTime = new EmbedBuilder()
            .setTitle(`Set Time`)
            .setDescription(`\`\`\` \`\`\`\n\nVoici la liste des heures de pub\n\n**Pour choisir une heure il vous suffit de choisir votre heure à l'aide du menu déroulant**`)
            .setColor(process.env.COLOR)

        interaction.channel.send({ embeds: [embedTime], components: [selectheuresmenu] })
    }
};
