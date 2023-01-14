const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
		.setDescription('Afficher l\'aide du bot'),
    async execute(interaction, client){
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('AdShare')
                    .setColor('#85ca62')
                    .setDescription(
                        'AdShare est un bot destiné à faire gagner des membres à votre serveur !\n'
                        + 'Son fonctionnement est simple: Toute les 4h, votre serveur sera envoyé dans un autre serveur, et vous recevrez vous-même un serveur.\n'
                    ),
                new EmbedBuilder()
                    .setTitle('Commandes')
                    .setColor('#53a05d')
                    .setDescription(client.help),
            ],
            components: [helpROW],
        })
    }
}

const helpROW = new ActionRowBuilder()
    .addComponents([
        new ButtonBuilder()
            .setLabel("Inviter le bot")
            .setStyle(ButtonStyle.Link)
            .setEmoji("1063222105543557170")
            .setURL("https://discord.com/oauth2/authorize?client_id=1061744784886206536&scope=bot&permissions=313345"),
        new ButtonBuilder()
            .setLabel("Rejoindre le support")
            .setStyle(ButtonStyle.Link)
            .setEmoji("1063222940042281050")
            .setURL("https://discord.gg/4wcNDQvnxc"),
    ]);