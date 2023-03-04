const client = require('..');
client.on('interactionCreate', async interaction => {
    if(!interaction.inGuild()) return interaction.reply({ content: "Vous ne pouvez pas executer cette commande en mp !", ephemeral: true });
    const command = client.interactionManager.commands.get(interaction.commandName);
    if (!command) return client.interactionManager.commands.delete(interaction.commandName);
    try {
        await command.run(client, interaction);
    } catch (error) {
        console.log(error);
    };
});
