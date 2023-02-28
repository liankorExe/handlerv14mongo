const client = require('..');
const { EmbedBuilder, Discord } = require("discord.js")
const serverModel = require("../schemas/serverSettings")

client.on('messageDelete', async (message) => {
    const receiverServerSettings = await serverModel.findOne({ serverID: receivingServersIds[index] });
    if (!receiverServerSettings.lastMessageUrl == "null") {
        try {
            const discordLinkReg = /https?:(?:www\.)?\/\/discord(?:app)?\.com\/channels\/(\d{18})\/(\d{18})\/(\d{18})/g;
            const [, guildId, channelId, messageId] = discordLinkReg.exec(receiverServerSettings.lastMessageUrl);
            const oldMsg = await client.channels.cache.get(channelId)?.messages?.fetch(messageId);
            if (!oldMsg) {
                console.log(chalk.red(`[SENDER] Last message in ${receiverServerGuild.name} (${receiverServerGuild.id}) was deleted !`));
                return logchannel.send({ content: `[SENDER] Last message in ${receiverServerGuild.name} (${receiverServerGuild.id}) was deleted !`, components: [receiverBoutonsOptions] });
            }
        } catch (error) {
            console.log(chalk.red(`[SENDER] Last message in ${receiverServerGuild.name} (${receiverServerGuild.id}) was deleted !`));
            return logchannel.send({ content: `[SENDER] Last message in ${receiverServerGuild.name} (${receiverServerGuild.id}) was deleted !`, components: [receiverBoutonsOptions] });
        }
    }
});