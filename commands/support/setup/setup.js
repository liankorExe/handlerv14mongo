const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, SelectMenuBuilder, ChannelType } = require('discord.js');
const SetupTickets = require('./setupcommands/tickets.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Effectuer une mise en place.')
        .setDefaultMemberPermissions(0x8)
        .addSubcommand(
            subcommand =>
                subcommand
                    .setName('invite')
                    .setDescription('Mise en place du système d\'invitation.')
                    .addChannelOption(option =>
                        option
                            .setName('channel')
                            .setDescription('Choisissez le salon où l\'embed sera envoyé !')
                            .addChannelTypes(ChannelType.GuildText)
                            .setRequired(true))
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case 'invite':
                SetupTickets.execute(interaction);
                break;
        }
    }
};
