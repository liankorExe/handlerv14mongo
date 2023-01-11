const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    async execute(interaction, client){
        await interaction.deferReply({ ephemeral: true });
        const type = interaction.customId.replace("support_","");
		switch(type){
            case 'form':
                const invite = interaction.fields.getTextInputValue('invite');
                const presentation = interaction.fields.getTextInputValue('presentation');
                if (!invite.includes("discord.gg/")) return interaction.editReply({ content: "Lien non valide ! Merci de réessayer en fournissant une invitation conforme." });
                await interaction.client.fetchInvite(invite)
                .then(async Sinvite => {
                    if (!Sinvite) return interaction.editReply({ content: "Lien non valide ! Merci de réessayer en fournissant une invitation conforme." });
                    const servinfoEMBED = new EmbedBuilder()
                        .setTitle(Sinvite.guild.name)
                        .setDescription(presentation)
                        .setThumbnail(Sinvite.guild.iconURL({ size: 1024 }))
                    await interaction.editReply({
                        content: "Voici ce que les autres serveurs recevront :",
                        embeds: [servinfoEMBED],
                        components: [formROW],
                    });
                }).catch(error => {
                    console.error(error)
                })
                break;
            case 'editform':
                const editinvite = interaction.fields.getTextInputValue('invite');
                const editpresentation = interaction.fields.getTextInputValue('presentation');
                if (!editinvite.includes("discord.gg/")) return interaction.editReply({ content: "Lien non valide ! Merci de réessayer en fournissant une invitation conforme." });
                await interaction.client.fetchInvite(editinvite)
                .then(async Sinvite => {
                    if (!Sinvite) return interaction.update({ content: "Lien non valide ! Merci de réessayer en fournissant une invitation conforme." });
                    const servinfoEMBED = new EmbedBuilder()
                        .setTitle(Sinvite.guild.name)
                        .setDescription(editpresentation)
                        .setThumbnail(Sinvite.guild.iconURL({ size: 1024 }))
                    await interaction.editReply({
                        content: "Voici ce que les autres serveurs recevront :",
                        embeds: [servinfoEMBED],
                        components: [formROW],
                    });
                }).catch(error => {
                    console.error(error)
                })
                break;
        }
    }
}

const submitBUTTON = new ButtonBuilder()
    .setLabel("Confirmer")
    .setCustomId("support_submitform")
    .setStyle(ButtonStyle.Success)

const editBUTTON = new ButtonBuilder()
    .setLabel("Modifier")
    .setCustomId("support_editform")
    .setStyle(ButtonStyle.Secondary)

const formROW = new ActionRowBuilder()
    .addComponents([submitBUTTON, editBUTTON])