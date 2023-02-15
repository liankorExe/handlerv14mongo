const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = require('..');

client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu()) return;

    const menu = client.interactionManager.selectMenus.get(interaction.customId);
    if (!menu) return;

    try {
        if (menu.permissions) {
            if (!interaction.memberPermissions.has(PermissionsBitField.resolve(menu.permissions || []))) {
                const perms = new EmbedBuilder()
                    .setDescription(`🚫 ${interaction.user}, Vous n'avez pas la permission \`${menu.permissions}\` pour utiliser ce selectMenu !`)
                    .setColor('Red');
                return interaction.reply({ embeds: [perms], ephemeral: true });
            }
        }
        await menu.run(client, interaction);
    } catch (error) {
        console.log(error);
    }
});
