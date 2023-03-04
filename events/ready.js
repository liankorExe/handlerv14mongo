const client = require('..');
const chalk = require('chalk');
const mongoose = require('mongoose');
const cron = require('node-cron');
const timeModel = require('../schemas/timeArrayTable');
const serverModel = require('../schemas/serverSettings');
const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');


client.on('ready', async () => {
    console.log(chalk.red(`${client.user.tag} prêt a pub ! 📌`));
    let server = await client.guilds.cache.size
    let servercount = await client.guilds.cache.reduce((a,b) => a+b.memberCount, 0  )
    client.user.setStatus('online');
    client.user.setActivity(`/config - ${servercount}`)
    
    

    const mongo = process.env.MONGO;

    if (!mongo) {
        console.log(chalk.red("[WARN] L'url de mongodb n'est pas bon !"));
    } else {
        mongoose.connect(mongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).catch((e) => console.log(e));

        mongoose.connection.once("open", () => {
            console.log(chalk.green("[DATABASE] Connected to MongoDB!"));
        });
    };

    // await sendServers("2H") // Use to trigger manual send

    cron.schedule("0 */2 * * *", async () => {//Schedule des délais 2H
        await sendServers("2H");
    });

    cron.schedule("0 */4 * * *", async () => {//Schedule des délais 4H
        await sendServers("4H");
    });

    cron.schedule("0 */6 * * *", async () => {//Schedule des délais 6H
        await sendServers("6H");
    });

    cron.schedule("0 */8 * * *", async () => {//Schedule des délais 8H
        await sendServers("8H");
    });

    cron.schedule("0 */12 * * *", async () => {//Schedule des délais 12H (minuit et midi)
        await sendServers("12H");
        await sendServers("general");
    });

    cron.schedule("0 12 * * *", async () => {//Schedule des délais 24H (envoi à midi)
        await sendServers("24H");
    });

});


/**
 * 
 * @param {String} delay 
 */
async function sendServers(delay) {
    console.log(chalk.blue(`[SENDER] Started sending ${delay} delay servers`))
    const timeData = await timeModel.findOne({ searchInDb: "adshare" });
    const sendingServersIds = {
        "2H": timeData.deux,
        "4H": timeData.quatre,
        "6H": timeData.six,
        "8H": timeData.huit,
        "12H": timeData.douze,
        "24H": timeData.vingtquatre,
        "general": timeData.general,
    }[delay];
    const logchannel = await client.channels.cache.get(process.env.RUNCHANNEL);

    if (sendingServersIds.length == 0) return console.log(chalk.yellow(`[SENDER] No server in ${delay} servers, skipping`));

    await sendingServersIds.forEach(async(senderServerId) => {
        const serverSettings = await serverModel.findOne({ serverID: senderServerId });
        if(serverSettings.status==false){
            sendingServersIds.splice(sendingServersIds.indexOf(senderServerId), 1)
        };
    });

    let receivingServersIds = [...sendingServersIds];
    shuffleNoDuplicates(receivingServersIds);
    
    await sendingServersIds.forEach(async (senderServerId, index) => {
        const receiverServerSettings = await serverModel.findOne({ serverID: receivingServersIds[index] });
        const receiverChannelId = delay == "general" ? receiverServerSettings.salongeneral : receiverServerSettings.salonpub;
        const receiverBoutonsOptions = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`blacklister_${receivingServersIds[index]}`)
                    .setLabel(`Blacklister`)
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`supprimer_${receivingServersIds[index]}`)
                    .setLabel(`Supprimer`)
                    .setStyle(ButtonStyle.Danger),
            );

        const receiverServerGuild = await client.guilds.cache.get(receivingServersIds[index]);
        if (!receiverServerGuild) {
            console.log(chalk.red(`[SENDER] Receiver server ${receivingServersIds[index]} not found, skipping`));
            return logchannel.send({ content: `[SENDER] Receiver server ${receivingServersIds[index]} not found, skipping`, components: [receiverBoutonsOptions] });
        };


        const receiverChannel = await receiverServerGuild.channels.cache.get(receiverChannelId);
        if (!receiverChannel) {
            console.log(chalk.red(`[SENDER] Receiver channel ${receiverChannelId} (from server ${receiverServerGuild.name} - ${receiverServerGuild.id}) not found, skipping`));
            return logchannel.send({ content: `[SENDER] Receiver channel ${receiverChannelId} (from server ${receiverServerGuild.name} - ${receiverServerGuild.id}) not found, skipping`, components: [receiverBoutonsOptions] });
        };
        if (!receiverChannel.permissionsFor(await receiverServerGuild.members.fetchMe(), checkAdmin = true).has(PermissionsBitField.Flags.SendMessages)) {
            console.log(chalk.red(`[WARN] [SENDER] I didn't have permission to write in <#${receiverChannel.id}> on ${receiverServerGuild.name} (${receiverServerGuild.id}) !`));
            return logchannel.send({ content: `[WARN] [SENDER] I didn't have permission to write in <#${receiverChannel.id}> on ${receiverServerGuild.name} (${receiverServerGuild.id}) !`, components: [receiverBoutonsOptions] });
        };

        const senderServer = await client.guilds.cache.get(senderServerId);
        if (!senderServer) {
            console.log(chalk.red(`[SENDER] Sender server ${senderServerId} not found, skipping`));
            return logchannel.send({ content: `[SENDER] Sender server ${senderServerId} not found, skipping`, components: [receiverBoutonsOptions] });
        };

        const senderServerSettings = await serverModel.findOne({ serverID: senderServer.id });
        const senderChannelId = delay == "general" ? senderServerSettings.salongeneral : senderServerSettings.salonpub;
        const inviteLink = await senderServer.channels.cache.get(senderChannelId).createInvite({ maxAge: 7 * 24 * 60 * 60 })
            .catch((error) => {
                console.log(error)
                return logchannel.send({ content: error.substring(0, 1000) })
            });
        try {
            await receiverChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(senderServer.name)
                        .setURL(inviteLink.url)
                        .setDescription(senderServerSettings.description.replace(/\${back}/g, "\n"))
                        .setThumbnail(senderServer.iconURL({ size: 1024 }))
                ],
                components: [
                    new ActionRowBuilder()
                        .setComponents([
                            new ButtonBuilder()
                                .setLabel('Rejoindre le serveur')
                                .setStyle(ButtonStyle.Link)
                                .setURL(inviteLink.url)
                                .setEmoji('1063501870540275782')
                        ])
                ]
            });
            
        } catch (error) {
            console.log(error)
            return logchannel.send({ content: error.substring(0, 1000) });
        }
    });
    console.log(chalk.blue(`[SENDER] Finished sending ${delay} delay servers`));


};

/**
 * 
 * @param {Array} array 
 * @returns {Array} (shuffled, with no element in the samme place it previously was)
 */
function shuffleNoDuplicates(items) {
  for(var i = items.length; i-- > 1; ) {
    var j = Math.floor(Math.random() * i);
    var tmp = items[i];
    items[i] = items[j];
    items[j] = tmp;
  }
}