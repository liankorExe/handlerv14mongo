const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, PermissionsBitField, ChannelType, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
		.setDescription('Configurer le bot')
        .addSubcommand(subcommand => subcommand
            .setName("description")
            .setDescription("Demander la modification de la description de votre serveur")
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

                const found = await client.database.server.findOne({
                    where: { name: Sinvite.guild.id },
                });
                if(!found || found==0) return interaction.editReply({
                    content: "Pour modifier la configuration du bot, vous devez d'abord le mettre en place sur [mon serveur support](https://discord.gg/4wcNDQvnxc)",
                    components: [
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Serveur support')
                            .setEmoji("1063222940042281050")
                            .setURL('https://discord.gg/4wcNDQvnxc')
                    ]
                });
                await interaction.showModal(editdescFORM);
                break;
        }

    }
}

const noPermEMBED = new EmbedBuilder()
    .setTitle("Erreur !")
    .setDescription("Désolé, mais vous ne possédez pas la permission `Administrateur`, requise pour effectuer cette action.")
    .setColor("#85ca62")

const editdescFORM = new ModalBuilder()
    .setCustomId('support_editdescription')
    .setTitle('Avery - Modifier la description')
    .addComponents([
        new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                    .setCustomId('description')
                    .setLabel('Nouvelle description')
                    .setMinLength(70)
                    .setMaxLength(400)
                    .setPlaceholder('La nouvelle description sera validée ou non par l\'équipe du bot.\nTout troll sera sanctionné.')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue()
            )
    ])