const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = require('..');

client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;

    const menus = client.interactionManager.menus.get(interaction.customId);
    if (!menus) return;

    try {
        if (menus.permissions) {
            if (!interaction.memberPermissions.has(PermissionsBitField.resolve(menus.permissions || []))) {
                const perms = new EmbedBuilder()
                    .setDescription(`🚫 ${interaction.user}, Vous n'avez pas la permission \`${menus.permissions}\` pour utiliser ce selectMenu !`)
                    .setColor('Red')
                return interaction.reply({ embeds: [perms], ephemeral: true })
            }
        }
        await menus.run(client, interaction);
    } catch (error) {
        console.log(error);
    }
});
