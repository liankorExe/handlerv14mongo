const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")

module.exports = {
    async execute(interaction, client){
        switch(interaction.customId.split('_')[1]){
            case 'form':
                await interaction.showModal(formMODAL)
                break;
            case 'editform':
                await interaction.showModal(editformMODAL)
                break;
        }
    }
}

const formMODAL = new ModalBuilder()
    .setCustomId("support_form")
    .setTitle("AdShare - Formulaire de validation")
    .addComponents([
        new ActionRowBuilder()
            .addComponents([
                new TextInputBuilder()
                    .setCustomId('invite')
                    .setLabel('Invitation vers le serveur')
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(22)
                    .setMaxLength(40)
                    .setPlaceholder(`Format: https://discord.gg/invite`)
                    .setRequired(true),
                new TextInputBuilder()
                    .setCustomId('presentation')
                    .setLabel('Présentation du serveur')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(70)
                    .setMaxLength(400)
                    .setPlaceholder(`Une description de votre serveur pour donner envie ! Changeable plus tard !`)
                    .setRequired(true),
            ]),
    ])

const editformMODAL = formMODAL.setCustomId("support_form");