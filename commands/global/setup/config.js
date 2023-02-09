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

        await interaction.reply({
            embeds: [configEMBED],
            components: [
                found.activated ? deactivateBTN : reactivateBTN,
                configROW2,
            ],
            ephemeral: true
        });
    }
}

const noPermEMBED = new EmbedBuilder()
    .setTitle("Erreur !")
    .setDescription("Désolé, mais vous ne possédez pas la permission `Administrateur`, requise pour effectuer cette action.")
    .setColor("#85ca62")

const configEMBED = new EmbedBuilder()
    .setTitle('Configuration')
    .setColor("#85ca62")

const deactivateBTN = new ButtonBuilder()
    .setCustomId('config_deactivate')
    .setLabel('Désactiver le bot')
    .setStyle(ButtonStyle.Danger)
const reactivateBTN = new ButtonBuilder()
    .setCustomId('config_reactivate')
    .setLabel('Réactiver le bot')
    .setStyle(ButtonStyle.Success)


const editformBTN = new ButtonBuilder()
    .setCustomId('config_editform')
    .setLabel('Modifier la publicité')
const configROW2 = new ActionRowBuilder()
    .setComponents([
        editformBTN
    ])
