const { staffIdList } = require('../config.json')

module.exports = {
    async execute(interaction, client){
        if(!staffIdList.includes(interaction.user.id)) return interaction.reply({ ephemeral: true, content: "Cette commande ne vous est pas destinée" });
        const isGuildId = (element) => element == interaction.guild.id;
        if(client.database.awaitingServers.findIndex(isGuildId)==-1) return interaction.reply({ content: "Ce serveur n'est pas présent dans ma liste de serveurs à vérifier !", ephemeral: true });
        client.database.awaitingServers.splice(client.database.awaitingServers.findIndex(isGuildId), 1);
        await interaction.reply({ content: `${interaction.guild.name} a bien été ajouté à ma base de données` })
        await interaction.guild.commands.delete(interaction.commandId, interaction.guild.id);
    }
}