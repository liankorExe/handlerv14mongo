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
            .setTitle(`Help !`)
            .setColor('#2f3136')
            .setThumbnail('https://cdn.discordapp.com/attachments/1063127154235293777/1063128211401232414/Violet_Casque_Degrades_Technologie_et_Jeu_Logo__8_-removebg-preview.png')
            .setDescription(`Le bot aura besoin de certaines **permissions** pour être utilisé **correctement**.
            \n Si cela n'est pas respecté, votre serveur recevra une sanction. 
            \n__Configuration dans le salon:__
            \n<:valide:1063496508529459240> Créer une invitation \n<:valide:1063496508529459240> Envoyer des messages\n<:valide:1063496508529459240> Intégrer des liens\n<:valide:1063496508529459240> Joindre des fichiers \n<:valide:1063496508529459240> Utiliser des émojis externes.
            \nLe bot n'a pas besoin de permissions pouvant nuire à votre serveur comme par exemple.
            \n<:non:1063496556159971449>Administrative\n<:non:1063496556159971449>Ban/kick\n<:non:1063496556159971449>Gérer les salons\net bien d'autres... 
            \n\n</help:1077247060153221231>・</config:1075904385013514381>・</general:1076113465141370960>
            \nSi vous rencontrez un soucis pendant l'utilisation du bot, ou bien que votre serveur ait été timeout temporairement, cliquez sur le bouton support ci-dessous pour y remédier. 
            \n\n*Pour plus d'informations veuillez choisir votre commande grâce au menu ci-dessous*`)
        interaction.reply({ embeds: [embedHelp], components: [selectCommand, buttonSupport] });
    }
};
