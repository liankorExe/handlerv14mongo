const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const channel = interaction.options.getChannel('channel');

        const ticketEmbed = new EmbedBuilder()
            .setColor(`#85ca62`)
            .setTitle("Ajouter le bot")
            .setDescription("Pour ajouter le bot, [invitez-le sur votre serveur](https://discord.com/oauth2/authorize?client_id=1061744784886206536&scope=bot&permissions=0)\n"
                            +"Ensuite, remplissez le formulaire via le bouton ci-dessous")
        channel.send({
            embeds: [ticketEmbed],
            components: [ticketsupportRow],
        });

        await interaction.editReply({ content: "Panel envoyé avec succès !" })
    }
}

    
const ticketsupportRow = new ActionRowBuilder()
    .addComponents([
        new ButtonBuilder()
            .setLabel("Inviter le bot")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/oauth2/authorize?client_id=1061744784886206536&scope=bot&permissions=0"),
        new ButtonBuilder()
            .setLabel("Formulaire")
            .setStyle(ButtonStyle.Success)
            .setCustomId("support_form"),
    ]);