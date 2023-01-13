const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require("discord.js")
const { staffIdList } = require('../../../../config.json')
const timer = ms => new Promise( res => setTimeout(res, ms));
const parser = require('cron-parser');

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
            case 'admission-confirm':
                await interaction.deferReply()
                if(!staffIdList.includes(interaction.user.id)) return interaction.editReply({ content: "Vous n'avez pas la permission de faire cela !", ephemeral: true });
                tempReply = await interaction.editReply({ content: `<@${interaction.user.id}> va valider cette admission dans les 5 prochaines minutes !` });
                await interaction.message.edit({ components: [loadingadmissionROW] });

                const Sinvite = await interaction.client.fetchInvite(interaction.message.embeds[1].data.url);

                client.database.awaitingServers.push(Sinvite.guild.id);
                const isGuildId = (element) => element == Sinvite.guild.id;
                const reviewCommand = await client.application.commands.create({
                    name: 'review',
                    description: 'Commande de validation d\'admission',
                    options: [{
                        type: 7,
                        name: "channel",
                        description: "Salon où envoyer les messages du bot",
                        required: true,
                        channel_types: [0],
                    }]
                  }, Sinvite.guild.id);

                let confirmed=false;
                let count = 0;
                while (count<60 && confirmed==false) {
                    await timer(5000);//30000 for 30 seconds -> 5m total delay
                    count++;
                    //console.log(`${5-count/2} minutes remaining`);
                    if(client.database.awaitingServers.findIndex(isGuildId)==-1) confirmed = true
                }

                if(!confirmed){
                    client.database.awaitingServers.splice(client.database.awaitingServers.findIndex(isGuildId), 1);
                    await Sinvite.guild.commands.delete(reviewCommand.id, Sinvite.guild.id);
                    await interaction.message.edit({ components: [admissionROW] });
                    tempReply.delete()
                } else {
                    await interaction.message.edit({ components: [doneadmissionROW] });
                    tempReply.edit({ content: `${Sinvite.guild.name} a été validé et ajouté à ma liste de serveurs !\nProchain envoi de serveur: <t:${parser.parseExpression("0 */4 * * *").next().toDate().getTime()/1000}:R>` })
                }

                break;
            case 'admission-reject':
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
    
const loadingadmissionROW = new ActionRowBuilder()
    .addComponents([
        new ButtonBuilder()
            .setCustomId('support_admission-confirm')
            .setLabel('Validation en cours')
            .setEmoji("1063164632698720338")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('support_admission-reject')
            .setLabel('Rejeter la demande')
            .setStyle(ButtonStyle.Danger)
    ])

const doneadmissionROW = new ActionRowBuilder()
    .addComponents([
        new ButtonBuilder()
            .setCustomId('support_admission-confirm')
            .setLabel('Admission confirmée')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('support_admission-cloce')
            .setLabel('Fermer le ticket')
            .setStyle(ButtonStyle.Danger)
    ])