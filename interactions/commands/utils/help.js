const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    name: "help",
    description: "Affiche toutes les commandes du bot",
    options: [],
    run: async (client, interaction) => {
        const buttonSupport = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Support')
                    .setURL(`https://discord.gg/qwMFFtnx9M`)
                    .setStyle(ButtonStyle.Link),
            );
        const selectCommand = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('selectcommandmenu')
                    .setPlaceholder('Choisissez votre commande')
                    .addOptions(
                        {
                            label: 'general',
                            value: 'general',
                        },
                        {
                            label: 'config',
                            value: 'config',
                        },
                    ),
            );
        const embedHelp = new EmbedBuilder()
            .setTitle(`Help`)
            .setColor(process.env.COLOR)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`> ⚠️ **Le bot a besoin d'avoir la permission de voir les salons sinon il ne marchera pas !**\n\n</general:1076113465141370960>\n</config:1075904385013514381>\n</help:1077247060153221231>\n\n*Pour plus d'informations veuillez choisir votre commande grâce au menu ci-dessous*`)
        interaction.reply({ embeds: [embedHelp], components: [selectCommand, buttonSupport] });
    }
};
