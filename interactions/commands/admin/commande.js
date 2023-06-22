const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: "ban",
    description: "Permet de bannir un membre",
    options: [
        {
            name: "user",
            description: "Choisis un utilisateur",
            type: 6,
            required: true
        },
        {
            name: "raison",
            description: "Raison du ban ",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) interaction.reply({ content: `Tu n'as pas la permission d'utiliser cette commande !` })
        const member = options.getUser('user')
        const raison = options.getString('raison') || "Aucune raison"
        const user = interaction.user

        let members = guild.members.cache.get(member.id)
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `Vous n'avez pas la perm d'utiliser cette commande !`, ephemeral: true })
        if (member.id === user.id) return await interaction.reply({ content: `Vous ne pouvez pas vous ban vous même !`, ephemeral: true })
        if (guild.ownerId === member.id) return await interaction.reply({ content: `Vous ne pouvez pas ban l'owner du serveur !`, ephemeral: true })
        if (guild.members.me.roles.highest.position <= members.roles.highest.position) return await interaction.reply({ content: `Je ne peux pas ban un utilisateur plus haut grader que moi !`, ephemeral: true })
        if (interaction.member.roles.highest.position <= members.roles.highest.position) return await interaction.reply({ content: `Vous ne pouvez pas ban un membre plus haut grader que vous !`, ephemeral: true })

        members.ban({ raison })
        interaction.reply({ content: `Le membre ${members.user.username} vient d'être banni !` })
    }
};
