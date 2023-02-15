const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = require('..');

client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;

    const modal = client.interactionManager.modals.get(interaction.customId);
    if (!modal) return;

    try {
        if (modal.permissions) {
            if (!interaction.memberPermissions.has(PermissionsBitField.resolve(modal.permissions || []))) {
                const perms = new EmbedBuilder()
                    .setDescription(`🚫 ${interaction.user}, Vous n'avez pas la permission \`${modal.permissions}\` pour utiliser ce modal !`)
                    .setColor('Red');
                return interaction.reply({ embeds: [perms], ephemeral: true });
            }
        }
        await modal.run(client, interaction);
    } catch (error) {
        console.log(error);
    }
});
