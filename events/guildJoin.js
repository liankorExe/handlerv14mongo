const client = require('..');
const { EmbedBuilder, Discord } = require("discord.js")


client.on('guildCreate', async (guild) => {
    const embedJoin = new EmbedBuilder()
        .setTitle(`Join`)
        .setDescription(`Le bot a rejoin le serveur **${guild.name}** (${guild.id})`)
        .setColor(`Green`)
    const channel = await client.channels.fetch(process.env.NEWGUILDCHANNEL)
    channel.send({ embeds: [embedJoin] })
});

client.on('guildDelete', async (guild) => {
    const embedJoin = new EmbedBuilder()
        .setTitle(`Join`)
        .setDescription(`Le bot a quitté le serveur **${guild.name}** (${guild.id})`)
        .setColor(`Red`)
    const channel = await client.channels.fetch(process.env.NEWGUILDCHANNEL)
    channel.send({ embeds: [embedJoin] })
});

