const client = require('..');
const { PermissionsBitField } = require("discord.js")

client.on('interactionCreate', async interaction => {

    const command = client.interactionManager.commands.get(interaction.commandName);
    if (!command) return client.interactionManager.commands.delete(interaction.commandName);
    try {
        if (command.botPerms) {
            if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                return interaction.reply({ content: `Je n'ai pas la permission de voir les salons ! (View_Channel)`, ephemeral: true })
            }
        }
        await command.run(client, interaction);
    } catch (error) {
        console.log(error);
    }
});
