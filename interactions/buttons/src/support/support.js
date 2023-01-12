const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    async execute(interaction, client){
        switch(interaction.customId.split('_')[1]){
            case 'form':
                await interaction.showModal(formMODAL)
                break;
            case 'editform':
                if(!interaction.message.embeds[0]) return interaction.showModal(formMODAL)
                const editformMODAL = new ModalBuilder()
                    .setCustomId("support_editform")
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
                                    .setValue(interaction.message.embeds[0].data.url||"")
                                    .setPlaceholder(`Format: https://discord.gg/invite`)
                                    .setRequired(true)
                            ]),
                        new ActionRowBuilder()
                            .addComponents([
                                new TextInputBuilder()
                                    .setCustomId('presentation')
                                    .setLabel('Présentation du serveur')
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setMinLength(70)
                                    .setMaxLength(400)
                                    .setValue(interaction.message.embeds[0].data.description)
                                    .setPlaceholder(`Une description de votre serveur pour donner envie ! Changeable plus tard !`)
                                    .setRequired(true),
                            ]),
                    ])
                await interaction.showModal(editformMODAL)
                break;
            case 'submitform':
                await interaction.deferUpdate()
                const invite = interaction.message.embeds[0].data.url
                await interaction.guild.channels.create({
                    name: `admission-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: '1062761382669467758',
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
        
                    ],
                    reason: `AdShare - Admission - ${interaction.user.username} (${interaction.user.id})'`,
                    topic: `Demande d'admission de <@${interaction.user.id}>\nLien: ${invite}\nID: ${interaction.user.id}\nDate de la demande: <t:${Math.floor(Date.now() / 1000)}:f>`
                }).then(async channel => {
                    const commandEmbed = new EmbedBuilder()
                        .setColor(`#7961fd`)
                        .setTitle("Formulaire d'admission de " + interaction.user.tag)
                        .setDescription("Un membre du staff viendra étudier votre admission sous peu.");
                    await channel.send({
                        embeds: [commandEmbed, new EmbedBuilder(interaction.message.embeds[0].data)],
                        components: [admissionROW],
                    });
                    await interaction.editReply({
                        content: `Votre demande d'admission a bien été envoyée !\nRendez-vous dans le salon <#${channel.id}> `,
                        embeds: [],
                        components: []
                    });
                })
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
                    .setRequired(true)
            ]),
        new ActionRowBuilder()
            .addComponents([
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

const admissionROW = new ActionRowBuilder()
    .addComponents([
        new ButtonBuilder()
            .setCustomId('support_admission-confirm')
            .setLabel('Valider la demande')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('support_admission-reject')
            .setLabel('Rejeter la demande')
            .setStyle(ButtonStyle.Danger)
    ])