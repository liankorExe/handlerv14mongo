const client = require('..');
const chalk = require('chalk');
const mongoose = require('mongoose');
const cron = require('node-cron');
const timeModel = require('../schemas/timeArrayTable');
const serverModel = require('../schemas/serverSettings');
const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');


client.on('ready', async () => {
    console.log(chalk.red(`${client.user.tag} prêt a pub ! 📌`));

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

    if(sendingServersIds.length==0) return console.log(chalk.yellow(`[SENDER] No server in ${delay} servers, skipping`));
    const receivingServersIds = shuffleNoDuplicates([...sendingServersIds]);
    await sendingServersIds.forEach(async (senderServerId, index) => {
        const receiverServerGuild = await client.guilds.cache.get(receivingServersIds[index]);
        if(!receiverServerGuild) {
            return console.log(chalk.red(`[SENDER] Receiver server ${receivingServersIds[index]} not found, skipping`));
        };

        const receiverServerSettings = await serverModel.findOne({ serverID: receiverServerGuild.id });
        const receiverChannelId = delay=="general" ? receiverServerSettings.salongeneral : receiverServerSettings.salonpub;

        const receiverChannel = await receiverServerGuild.channels.cache.get(receiverChannelId);
        if(!receiverChannel) {
            return console.log(chalk.red(`[SENDER] Receiver channel ${receiverChannelId} (from server ${receiverServerGuild.name} - ${receiverServerGuild.id}) not found, skipping`));
        }
        if(!receiverChannel.permissionsFor(await receiverServerGuild.members.fetchMe(), checkAdmin = true).has(PermissionsBitField.Flags.SendMessages)) return console.log(chalk.red(`[WARN] [SENDER] I didn't have permission to write in <#${receiverChannel.id}> on ${receiverServerGuild.name} (${receiverServerGuild.id}) !`));

        const senderServer = await client.guilds.cache.get(senderServerId);
        if(!senderServer) {
            return console.log(chalk.red(`[SENDER] Receiver server ${senderServerId} not found, skipping`));
        };

        const senderServerSettings = await serverModel.findOne({ serverID: senderServer.id });
        const senderChannelId = delay=="general" ? senderServerSettings.salongeneral : senderServerSettings.salonpub;
        const inviteLink = await senderServer.channels.cache.get(senderChannelId).createInvite({ maxAge: 7 * 24 * 60 * 60 })
        .catch((error) => console.log(error, senderServer));
        try{
            await receiverChannel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(senderServer.name)
                    .setURL(inviteLink.url)
                    .setDescription(senderServerSettings.description)
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
            })
        } catch(error){
            console.log(error);
        }
    });
    console.log(chalk.blue(`[SENDER] Finished sending ${delay} delay servers`))
    

};

/**
 * 
 * @param {Array} array 
 * @returns {Array} (shuffled, with no element in the samme place it previously was)
 */
function shuffleNoDuplicates(array) {
    const originalArray = [...array];
    let m = array.length;
    while (m > 1) {
        let i;
        do {
            i = Math.floor(Math.random() * m);
        } while (array[i] === originalArray[m - 1]);
        m--;
        const t = array[m];
        array[m] = array[i];
        array[i] = t;

        if (array[0] === originalArray[0]) {
            [array[0], [array[1]]] = [array[1], [array[0]]];
        }
        return array;
    }
}