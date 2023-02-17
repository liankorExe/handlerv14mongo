const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const timeModel = require("../../../schemas/timeArrayTable")

module.exports = {
    name: "general",
    description: "Choisis le salon pour le system de general",
    options: [],
    default_member_permissions: "Administrator",
    run: async (client, interaction) => {
        const timeData = await timeModel.findOne({ searchInDb: "adshare" });
        if (interaction.guild.memberCount < 200) {
            return interaction.reply({ content: `Votre serveur a besoin d'avoir minimum 200 membres !`, ephemeral: true })
        }
        const selectGeneralmenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('selectgeneralmenu')
                    .setPlaceholder('Choisis ton option')
                    .addOptions(
                        {
                            label: 'Salon',
                            emoji: `🏷`,
                            value: 'salon',
                        },
                    ),
            );
        const embeGeneral = new EmbedBuilder()
            .setTitle(`Général`)
            .setColor(porcess.env.COLOR)
            .setDescription(`> Il y a actuellement **${timeData.general.length}** serveur inscrit dans la catégorie général.`)

        interaction.channel.send({ embeds: [embeGeneral], components: [selectGeneralmenu] })
    }
};
