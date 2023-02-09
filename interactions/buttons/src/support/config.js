const { TextInputStyle, TextInputBuilder, ActionRowBuilder, ModalBuilder } = require("discord.js");

module.exports = {
    async execute(interaction, client){
        switch(interaction.customId.split('_')[1]){
            case 'editform':
                const found = await client.database.server.findOne({
                    where: { name: interaction.guild.id },
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
                break;
        }
    }
}