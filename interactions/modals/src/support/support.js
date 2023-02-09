const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction, client){
        const type = interaction.customId.replace("support_","");
		switch(type){
            case 'form':
                await interaction.deferReply({ ephemeral: true });
                const invite = interaction.fields.getTextInputValue('invite');
                const presentation = interaction.fields.getTextInputValue('presentation');
                if (!invite.includes("discord.gg/")) return interaction.editReply({ content: "Lien non valide ! Merci de réessayer en fournissant une invitation conforme." });
                await interaction.client.fetchInvite(invite)
                .then(async Sinvite => {
                    if (!Sinvite) return interaction.editReply({ content: "Lien non valide ! Merci de réessayer en fournissant une invitation conforme." });
                    if(Sinvite.guild.memberCount<=200) return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Erreur !")
                                .setDescription(`Désolé !\nMon système est uniquement disponible sur les serveurs de plus de 200 membres !\nIl s'agit principalement d'une sécurité destinée à éviter le spam de serveurs. Désolé du désagrément !`)
                                .setColor("#85ca62")
                        ]
                    });
                    if(!client.guilds.cache.has(Sinvite.guild.id)) return interaction.editReply({ content: `Merci de [m'ajouter](https://discord.com/oauth2/authorize?client_id=1061744784886206536&scope=bot&permissions=0) à ${Sinvite.guild.name} avant de remplir le formulaire !` });
                    const Gowner = await Sinvite.guild.fetchOwner();
                    if(interaction.user.id!=Gowner.id) return interaction.editReply({ content: `Vous n'êtes pas propriétaire de [${Sinvite.guild.name}](${Sinvite.url}) !` })
                    const servinfoEMBED = new EmbedBuilder()
                        .setTitle(Sinvite.guild.name)
                        .setURL(invite)
                        .setDescription(presentation)
                        .setThumbnail(Sinvite.guild.iconURL({ size: 1024 }))
                    await interaction.editReply({
                        content: "Voici ce que les autres serveurs recevront :",
                        embeds: [servinfoEMBED],
                        components: [formROW],
                    });
                }).catch(error => {
                    console.error(error)
                    return interaction.editReply({ content: "Lien non valide ! Merci de réessayer en fournissant une invitation conforme.", embeds: [], components: [formoffROW] });
                });
                break;
            case 'editform':
                await interaction.deferUpdate({ ephemeral: true });
                const editinvite = interaction.fields.getTextInputValue('invite');
                const editpresentation = interaction.fields.getTextInputValue('presentation');
                if (!editinvite.includes("discord.gg/")) return interaction.editReply({ content: "Lien non valide ! Merci de réessayer en fournissant une invitation conforme." });
                await interaction.client.fetchInvite(editinvite)
                .then(async Sinvite => {
                    if (!Sinvite) return interaction.update({ content: "Lien non valide ! Merci de réessayer en fournissant une invitation conforme." });
                    if(Sinvite.guild.memberCount<=200) return interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Erreur !")
                                .setDescription(`Désolé !\nMon système est uniquement disponible sur les serveurs de plus de 200 membres !\nIl s'agit principalement d'une sécurité destinée à éviter le spam de serveurs. Désolé du désagrément !`)
                                .setColor("#85ca62")
                        ]
                    });
                    const Gowner = await Sinvite.guild.fetchOwner();
                    if(interaction.user.id!=Gowner.id) return interaction.editReply({ content: `Vous n'êtes pas propriétaire de [${Sinvite.guild.name}](${Sinvite.url}) !` });
                    if(!client.guilds.cache.has(Sinvite.guild.id)) return interaction.editReply({ content: `Merci de [m'ajouter](https://discord.com/oauth2/authorize?client_id=1061744784886206536&scope=bot&permissions=0) à ${Sinvite.guild.name} avant de remplir le formulaire !` });
                    const servinfoEMBED = new EmbedBuilder()
                        .setTitle(Sinvite.guild.name)
                        .setURL(editinvite)
                        .setDescription(editpresentation)
                        .setThumbnail(Sinvite.guild.iconURL({ size: 1024 }))
                    await interaction.editReply({
                        content: "Voici ce que les autres serveurs recevront :",
                        embeds: [servinfoEMBED],
                        components: [formROW],
                    });
                }).catch(error => {
                    console.log(error)
                    return interaction.editReply({ content: "Lien non valide ! Merci de réessayer en fournissant une invitation conforme.", embeds: [], components: [formoffROW] });
                });
                break;

            case 'editdescription':
                const editorpresentation = interaction.fields.getTextInputValue('description');

                const found = await client.database.server.findOne({
                    where: { name: interaction.guild.id },
                });
                const askChannel = await client.channels.cache.get('1063765828098601003');
                await askChannel.send({
                    content: `${interaction.user.tag} (<@${interaction.user.id}>) demande une modification de la description de son serveur:`,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(interaction.guild.name + "(Précédent)")
                            .setDescription(found.description)
                            .setThumbnail(interaction.guild.iconURL({ size: 1024 })),
                        new EmbedBuilder()
                            .setTitle(interaction.guild.name)
                            .setDescription(editorpresentation)
                            .setThumbnail(interaction.guild.iconURL({ size: 1024 }))
                    ],
                    components: [
                        editROW
                    ]
                });
                await interaction.reply({ content: "Votre demande a bien été envoyée au support !", ephemeral: true })
                break;
        }
    }
}

const submitBUTTON = new ButtonBuilder()
    .setLabel("Confirmer")
    .setCustomId("support_submitform")
    .setStyle(ButtonStyle.Success)

const submitoffBUTTON = new ButtonBuilder()
    .setLabel("Confirmer")
    .setCustomId("support_submitform")
    .setStyle(ButtonStyle.Success)
    .setDisabled(true)

const editBUTTON = new ButtonBuilder()
    .setLabel("Modifier")
    .setCustomId("support_editform")
    .setStyle(ButtonStyle.Secondary)

const formROW = new ActionRowBuilder()
    .addComponents([submitBUTTON, editBUTTON])
const formoffROW = new ActionRowBuilder()
    .addComponents([submitoffBUTTON, editBUTTON])


const validateEditBUTTON = new ButtonBuilder()
    .setLabel("Confirmer")
    .setCustomId("support_validateEdit")
    .setStyle(ButtonStyle.Success)
const deleteBUTTON = new ButtonBuilder()
    .setLabel("Supprimer le serveur")
    .setCustomId("support_deleteserver")
    .setStyle(ButtonStyle.Danger)
const editROW = new ActionRowBuilder()
    .addComponents([validateEditBUTTON, deleteBUTTON])