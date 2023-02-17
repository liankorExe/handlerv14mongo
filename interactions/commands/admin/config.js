const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const serverModel = require("../../../schemas/serverSettings")

module.exports = {
    name: "config",
    description: "Choisis le délai d'envoi de votre pub",
    options: [],
    default_member_permissions: 0x8,
    run: async (client, interaction) => {
        let serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });
        if (!serverSettings) await serverModel.create({
            serverID: interaction.guild.id,
            description: "null",
            salonpub: "null"
        });

        serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });
        const selectconfigmenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('configselectmenu')
                    .setPlaceholder('Choisis ce que tu veux modifier')
                    .addOptions(
                        {
                            label: 'Salon',
                            emoji: '🏷',
                            value: 'salon',
                        },
                        {
                            label: 'Description',
                            emoji: `📌`,
                            value: 'description',
                        },
                    ),
            );
        const embedConfig = new EmbedBuilder()
            .setTitle(`⚙ Configuration`)
            .setDescription(`\`\`\` \`\`\`\n\n> *Voici la configuration du serveur **${interaction.guild.name}** *`)
            .addFields(
                { name: `🏷 Salon`, value: serverSettings.salonpub === "null" ? "Non défini" : `<#${serverSettings.salonpub}>` },
                { name: `📌 Description`, value: serverSettings.description === "null" ? "Aucune description" : `${serverSettings.description}` }
            )
            .setColor(process.env.COLOR);

        interaction.reply({ embeds: [embedConfig], components: [selectconfigmenu], allowedMentions: { parse: [] } });
    }
};
