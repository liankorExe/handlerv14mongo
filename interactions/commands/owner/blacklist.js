const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle } = require("discord.js");
const blModel = require("../../../schemas/blacklist");
const checkPerms = require("../../../functions")

module.exports = {
    name: "blackliste",
    description: "Ajoute ou retire un serveur de la blackliste",
    options: [],
    default_member_permissions: "Administrator",
    run: async (client, interaction) => {
        let owners = ["533306566229753878", "837034549434777702"]
        if (!owners.includes(interaction.user.id)) return interaction.reply({ content: `Tu n'es pas owner !` })
        const perms = checkPerms(client, interaction)
        if (!perms) {
            return interaction.reply({ content: `Le bot a besoin de permissions suivante :\n\n- Voir les salons\n- Envoyer des messages\n- Creer des invitations`, ephemeral: true })
        }
        let blackliste = await blModel.findOne({ adshare: "adshare" });
        if (!blackliste) await blModel.create({
            adshare: "adshare",
            servers: [],
        });

        blackliste = await blModel.findOne({ adshare: "adshare" });

        const buttonsOptions = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('add-bl')
                    .setEmoji(`➕`)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('remove-bl')
                    .setEmoji(`➖`)
                    .setStyle(ButtonStyle.Secondary),
            )
        const serverIds = blackliste.servers;
        const serverList = [];
        if (serverIds.length === 0) {
            serverList.push("Aucun serveur n'est actuellement blacklisté.");
        } else {
            for (const { name, id } of serverIds) {
                serverList.push(`${name} (${id})`);
            }
        }

        const embedBl = new EmbedBuilder()
            .setTitle(`BlackListe`)
            .setDescription(`\`\`\`\n${serverList.join("\n")}\`\`\``)
            .setColor(process.env.COLOR);

        interaction.reply({ embeds: [embedBl], components: [buttonsOptions], ephemeral: true });
    }
};
