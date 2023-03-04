const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle } = require("discord.js")
const timeModel = require("../../../schemas/timeArrayTable")
const checkPerms = require("../../../functions")
const blModel = require("../../../schemas/blacklist")

module.exports = {
    name: "general",
    description: "Choisis le salon pour le system de general",
    options: [],
    default_member_permissions: "Administrator",
    run: async (client, interaction) => {
        let blackliste = await blModel.findOne({ adshare: "adshare" });
        if (!blackliste) await blModel.create({
            adshare: "adshare",
            servers: [],
        });

        blackliste = await blModel.findOne({ adshare: "adshare" });
        if (blackliste.servers.includes(interaction.guild.id)) {
            return interaction.reply({ content: `Votre serveur à reçu une sanction, rendez-vous sur le support pour connaître la raison de cela, faites /help puis cliquez sur le bouton support pour y accéder.`, ephemeral: true });
        }
        const perms = checkPerms(client, interaction)
        if (!perms) {
            return interaction.reply({ content: `Le bot a besoin de permissions suivante :\n\n   \n- Créer une invitation \n- Envoyer des messages\n- Intégrer des liens\n- Joindre des fichiers \n- Utiliser des émojis externes.`, ephemeral: true })
        }
        const timeData = await timeModel.findOne({ searchInDb: "adshare" });
        if (interaction.guild.memberCount < 200) {
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
            .setColor('#2f3136')
            .setDescription(`> Il y a actuellement **${timeData.general.length}** serveur(s) inscrit dans la catégorie général.`)

        interaction.reply({ embeds: [embeGeneral], components: [selectGeneralmenu, buttonInfo] })
    }
};
