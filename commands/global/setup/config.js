const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, PermissionsBitField, ChannelType, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
		.setDescription('Configurer le bot')
        .setDefaultMemberPermissions(0x8),
    async execute(interaction, client){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [noPermEMBED], ephemeral: true });
        if(interaction.guild.memberCount<=200) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Erreur !")
                    .setDescription(`Désolé !\nMon système est uniquement disponible sur les serveurs de plus de 200 membres !\nIl s'agit principalement d'une sécurité destinée à éviter le spam de serveurs. Désolé du désagrément !`)
                    .setColor("#85ca62")
            ],
            ephemeral: true
        });

        const found = await client.database.server.findOne({
            where: { name: interaction.guild.id },
        });
        if(!found || found==0) return interaction.reply({
            content: "Pour modifier la configuration du bot, vous devez d'abord le mettre en place sur [mon serveur support](https://discord.gg/4wcNDQvnxc)",
            components: [
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Serveur support')
                    .setEmoji("1063222940042281050")
                    .setURL('https://discord.gg/4wcNDQvnxc')
            ],
            ephemeral: true
        });

        const editFORM = new ModalBuilder()
            .setCustomId('support_editdescription')
            .setTitle('Avery - Modifier la configuration')
            .addComponents([
                new ActionRowBuilder()
                    .setComponents([
                        new TextInputBuilder()
                            .setCustomId('description')
                            .setLabel('Description')
                            .setMinLength(70)
                            .setMaxLength(400)
                            .setPlaceholder('La nouvelle description sera validée ou non par l\'équipe du bot.\nTout troll sera sanctionné.')
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                            .setValue(found.description)
                    ]),
            ])

        await interaction.showModal(editFORM);
    }
}

const noPermEMBED = new EmbedBuilder()
    .setTitle("Erreur !")
    .setDescription("Désolé, mais vous ne possédez pas la permission `Administrateur`, requise pour effectuer cette action.")
    .setColor("#85ca62")