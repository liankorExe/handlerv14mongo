const { PermissionsBitField } = require('discord.js');
const { staffIdList, logChannel } = require('../config.json')

module.exports = {
    async execute(interaction, client){
        await interaction.deferReply({ ephemeral: true })
        if(!staffIdList.includes(interaction.user.id)) return interaction.editReply({ ephemeral: true, content: "Cette commande ne vous est pas destinée" });
        const isGuildId = (element) => element[0] == interaction.guild.id;
        if(client.database.awaitingServers.findIndex(isGuildId)==-1){
            await interaction.guild.commands.delete(interaction.commandId, interaction.guild.id);
            return interaction.editReply({ content: "Ce serveur n'est pas présent dans ma liste de serveurs à vérifier !", ephemeral: true });
        }
        channel = interaction.options.getChannel('channel');
        if(!channel.permissionsFor(await interaction.guild.members.fetchMe(), checkAdmin = true).has(PermissionsBitField.Flags.SendMessages)) return interaction.editReply({ content: "Je n'ai pas la permission d'écrire dans le salon indiqué !" });
        if(!channel.permissionsFor(await interaction.guild.members.fetchMe(), checkAdmin = true).has(PermissionsBitField.Flags.CreateInstantInvite)) return interaction.editReply({ content: "Je n'ai pas la permission de créer une invitation dans le salon indiqué !" });

        const servINDEX = client.database.awaitingServers.findIndex(isGuildId);
        const invite = await interaction.guild.invites.create(channel, {maxAge: 0});

        await client.database.server.create({
            name: interaction.guild.id,
            channel: channel.id,
            invite: invite.url,
            description: client.database.awaitingServers[servINDEX][1],
        });

        client.database.awaitingServers.splice(servINDEX, 1);
        await interaction.editReply({ content: `${interaction.guild.name} a bien été ajouté à ma base de données` });
        await client.channels.cache.get(logChannel).send(`<:plus_no_background:1063222105543557170> ${interaction.guild.name} - ${invite.url} a été ajouté à la base de données par <@${interaction.user.id}>\n> Salon des pubs: <#${channel.id}>\n> Date de l'ajout: <t:${Math.floor(new Date().getTime()/1000)}:D>`);

        await interaction.guild.commands.delete(interaction.commandId, interaction.guild.id);
    }
}