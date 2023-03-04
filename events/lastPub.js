const client = require('..');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Discord } = require("discord.js");
const serverModel = require("../schemas/serverSettings");
const chalk = require('chalk');

client.on('messageDelete', async (message) => {
    const receiverBoutonsOptions = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`blacklister_${message?.guild?.id}`)
                .setLabel(`Blacklister`)
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`supprimer_${message?.guild?.id}`)
                .setLabel(`Supprimer`)
                .setStyle(ButtonStyle.Danger),
        );
    if(message?.components[0]?.components[0]?.label=='Rejoindre le serveur'){
        const logchannel = await client.channels.cache.get(process.env.RUNCHANNEL);
        console.log(chalk.red(`[WATCHER] Dernier message dans **${message?.guild?.name}** \`(${message?.guild?.id})\` a été supprimé !`));
        return logchannel.send({ content: `[WATCHER] Dernier message dans **${message?.guild?.name}** \`(${message?.guild?.id})\` a été supprimé !`, components: [receiverBoutonsOptions] });
    };
});
