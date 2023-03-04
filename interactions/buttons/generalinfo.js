const { Discord, EmbedBuilder } = require("discord.js")
const serverModel = require("../../schemas/serverSettings")

module.exports = {
    id: 'infogeneralbutton',
    permissions: [],
    run: async (client, interaction) => {
        const embedInfos = new EmbedBuilder()
            .setTitle(`Infos`)
            .setColor("#2f3136")
            .setDescription(`La catégorie générale est un système plus performant, permettant une meilleur visibilité à votre serveur. Votre serveur sera envoyé dans un salon général d'un autre serveur de minimum 200 membres et respectant les TOS, toutes les 12H automatiquement. En retour, un serveur remplissant ces mêmes conditions sera envoyé dans votre général.`);

        interaction.reply({ embeds: [embedInfos], ephemeral: true });
    }
};
