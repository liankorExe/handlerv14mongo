const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, PermissionsBitField, ChannelType } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
		.setDescription('Configurer le bot')
        .addSubcommand(subcommand => subcommand
            .setName("salon")
            .setDescription("Choisir le salon où je dois envoyer les serveurs")
            .addChannelOption(option => option
                .setName("salon")
                .setDescription("Le salon où envoyer")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .setDefaultMemberPermissions(0x8),
    async execute(interaction, client){
        await interaction.deferReply({ ephemeral: true });
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.editReply({ embeds: [noPermEMBED] });
        if(interaction.guild.memberCount<=200) return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Erreur !")
                    .setDescription(`Désolé !\nMon système est uniquement disponible sur les serveurs de plus de 200 membres !\nIl s'agit principalement d'une sécurité destinée à éviter le spam de serveurs. Désolé du désagrément !`)
                    .setColor("#85ca62")
            ]
        });
        switch(interaction.options.getSubcommand()){
            case 'salon':
                channel = interaction.options.getChannel('salon');
                if(!channel.permissionsFor(await interaction.guild.members.fetchMe(), checkAdmin = true).has(PermissionsBitField.Flags.SendMessages)) return interaction.editReply({ content: "Je n'ai pas la permission d'écrire dans le salon indiqué !" });
                if(!channel.permissionsFor(await interaction.guild.members.fetchMe(), checkAdmin = true).has(PermissionsBitField.Flags.CreateInstantInvite)) return interaction.editReply({ content: "Je n'ai pas la permission de créer une invitation dans le salon indiqué !" });
                if(!channel.members.size >= 150) return interaction.editReply({ content: "Il faut que la majorité de vos utilisateurs aient la permission de voir ce salon !" });
                found = await client.database.server.findOne({
                    where: { name: interaction.guild.id },
                });
                console.log(found);
                if(found && !found==0) return interaction.editReply({ content: "Ce serveur est déjà présent dans la base de données" });
                const invite = await interaction.guild.invites.create(channel);
                await client.database.server.create({
                    name: interaction.guild.id,
                    guildName: interaction.guild.name,
                    channel: channel.id,
                    invite: invite.url,
                    description: interaction.options.getString('description'),
                    timestamp: Math.floor(new Date().getTime()/1000),
                });
                await channel.send({ embeds: [setupEMBED] });
                await interaction.editReply({ content: "AdShare a bien été configuré !" })
        }

    }
}

const noPermEMBED = new EmbedBuilder()
    .setTitle("Erreur !")
    .setDescription("Désolé, mais vous ne possédez pas la permission `Administrateur`, requise pour effectuer cette action.")
    .setColor("#85ca62")

const setupEMBED = new EmbedBuilder()
    .setTitle("AdShare")
    .setDescription("AdShare a été configuré pour envoyer les serveurs dans ce salon !\n[Inviter AdShare](https://discord.com/oauth2/authorize?client_id=1061744784886206536&scope=bot&permissions=0)")