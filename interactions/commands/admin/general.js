const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle } = require("discord.js")
const timeModel = require("../../../schemas/timeArrayTable")
const checkPerms = require("../../../functions")

module.exports = {
    name: "general",
    description: "Choisis le salon pour le system de general",
    options: [],
    default_member_permissions: "Administrator",
    run: async (client, interaction) => {
        const perms = checkPerms(client, interaction)
        if (!perms) {
            return interaction.reply({ content: `Le bot a besoin de permissions suivante :\n\n- Voir les salons\n- Envoyer des messages\n- Creer des invitations`, ephemeral: true })
        }
        const timeData = await timeModel.findOne({ searchInDb: "adshare" });
        if (interaction.guild.memberCount < 2) {
            return interaction.reply({ content: `Votre serveur a besoin d'avoir minimum 200 membres !`, ephemeral: true })
        }
        const buttonInfo = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('infogeneralbutton')
                    .setEmoji(`❔`)
                    .setStyle(ButtonStyle.Secondary),
            );
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
                        {
                            label: 'On',
                            emoji: `🟢`,
                            value: 'on',
                        },
                        {
                            label: 'Off',
                            emoji: `🔴`,
                            value: 'off',
                        },
                    ),
            );
        const embeGeneral = new EmbedBuilder()
            .setTitle(`Général`)
            .setColor(process.env.COLOR)
            .setDescription(`> Il y a actuellement **${timeData.general.length}** serveur(s) inscrit dans la catégorie général.`)

        interaction.reply({ embeds: [embeGeneral], components: [selectGeneralmenu, buttonInfo] })
    }
};
