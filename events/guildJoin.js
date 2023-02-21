const client = require('..');
const { EmbedBuilder, Discord } = require("discord.js")
const blModel = require("../schemas/blacklist")


client.on('guildCreate', async (guild) => {
    let blackliste = await blModel.findOne({ adshare: "adshare" });
    if (!blackliste) await blModel.create({
        adshare: "adshare",
        servers: [],
    });

    blackliste = await blModel.findOne({ adshare: "adshare" });
    if (blackliste.servers.includes(guild.id)) {
        return guild.leave();
    }
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

