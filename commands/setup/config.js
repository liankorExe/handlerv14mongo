const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, PermissionsBitField } = require('discord.js');
const missingPermissionError = require('../../functions');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
		.setDescription('Configurer le bot')
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
        })

    }
}

const formMODAL = new ModalBuilder()
    .setTitle("AdShare - Formulaire d'admission")
    .setCustomId("config_admissionform")

const noPermEMBED = new EmbedBuilder()
    .setTitle("Erreur !")
    .setDescription("Désolé, mais vous ne possédez pas la permission `Administrateur`, requise pour effectuer cette action.")
    .setColor("#85ca62")