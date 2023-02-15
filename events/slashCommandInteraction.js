const client = require('..');

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const modal = client.interactionManager.commands.get(interaction.commandName);
    if (!modal) return;

    try {
        await command.run(client, interaction);
    } catch (error) {
        console.log(error);
    }
});
