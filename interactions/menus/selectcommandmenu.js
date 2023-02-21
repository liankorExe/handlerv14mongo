const { EmbedBuilder } = require("discord.js")

module.exports = {
    id: 'selectcommandmenu',
    permissions: [],
    run: async (client, interaction) => {
        const val = interaction.values[0]
        if (val === "general") {
            const embedGeneral = new EmbedBuilder()
                .setTitle(`Commande : /general`)
                .setDescription(`La commande </general:1076113465141370960> permet d'envoyer une description de votre serveur sur les salons de discussions de d'autres serveurs ayant ajouté le bot. En retour, vous recevrez une publicité d'un serveur également, dans votre salon principal.
                \nPrérequis : Il vous faudra disposer d'au moins 200 membres sur votre serveur et respecter les conditions d'utilisation de la plateforme. Auquel cas, vous n'aurez pas la possibilité d'accéder à cette fonction.`)
                .setColor(`#2B2D31`)
            interaction.reply({ embeds: [embedGeneral], ephemeral: true })
        }
        if (val === "config") {
            const embedConfig = new EmbedBuilder()
                .setTitle(`Commande : /config`)
                .setDescription(`La commande </config:1075904385013514381> permet de configurer votre serveur. Une fois cela fait, une publicité automatique sera envoyée selon le délai que vous aurez sélectionné.`)
                .setColor(`#2B2D31`)
            interaction.reply({ embeds: [embedConfig], ephemeral: true })
        }
    }
}
