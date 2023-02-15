const client = require('..');

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.interactionManager.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.run(client, interaction);
    } catch (error) {
        console.log(error);
    }
});
