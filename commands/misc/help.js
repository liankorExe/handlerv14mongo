const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

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
            ]
        })
    }
}