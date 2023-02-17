const { Discord, EmbedBuilder } = require("discord.js")
const serverModel = require("../../schemas/serverSettings")

module.exports = {
    id: 'infogeneralbutton',
    permissions: [],
    run: async (client, interaction) => {
        const embedInfos = new EmbedBuilder()
            .setTitle(`Infos`)
            .setColor("#2B2D31")
            .setDescription(`La catégorie général est un système plus performant permettant une meilleur visibilité à votre serveur, votre serveur sera envoyé dans 1 Général de minimum 200 membres et respectant les TOS, toutes les 12H automatiquement. En revanche vous allez recevoir un serveur dans votre général toutes les 12H, cette méthode est du donnant donnant, pour facilité la visibilité pour tous, en effet il comprend des risques pour vous, mais si on ne prend pas de risque on évoluera pas vite .`);

        interaction.reply({ embeds: [embedInfos], ephemeral: true });
    }
};
