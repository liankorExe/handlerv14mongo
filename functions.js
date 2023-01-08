const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId } = require('./config.json');
const { Collection, EmbedBuilder } = require('discord.js')
const { isBoolean } = require('util')
const fs = require('fs');
const rest = new REST({ version: '10' }).setToken(token);



function deploy_commands(client, loadcommands) {
    if (!typeof loadcommands === Boolean) throw "type of loadcommands argument needs to be boolean";

    console.info('[INFO] Slash commands loading started');

    const commands = [];
    client.commands = new Collection();
    client.help = ""
    const commandCategories = fs.readdirSync('./commands').filter(file => !file.includes('.'));
    for (const category of commandCategories) {
        const commandFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${category}/${file}`);
            commands.push(command.data);
            client.commands.set(command.data.name, command);
            client.help = client.help + `\`${command.data.name}\`: ${command.data.description}\n`

            console.log(`[LOADER] ${category}/${command.data.name} loaded`);
        }
    }
    if (loadcommands){
        slashCommandLoad(client, commands);
    }
    else{//Deletes slash commands
        slashCommandLoad(client, [])
    }
    console.info('[INFO] Slash commands loaded !');
}

async function slashCommandLoad(client, commands) {
    try {
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );    
    } catch (error) {
        console.error(error);
    }
    return client.commands;
};

function shuffledNoDuplicates(array){
    let rArray = array;
    var m = array.length, t, i;
    while(m){
        i = Math.floor(Math.random() * --m);
        t = array[m];
        rArray[m] = array[i];
        rArray[i] = t;
    }
    return rArray;
};

async function sendServers(client) {
    const senderServerList = await client.database.serverdb.findAll();
    if (!sanctionList || sanctionList==0) return console.warn("[WARN] No server found in the database, skipping server sending");

    const receiverServerList = shuffledNoDuplicates(senderServerList);

    for (let index = 0; index < senderServerList.length; index++) {
        const senderServer = senderServerList[index];
        const receiverServerGuild = await client.guilds.cache.get(receiverServerList[index].name);
        if(!receiverServerGuild) {
            console.warn(`[SENDER] Receiver server ${receiverServerGuild.name} not found, skipping`);
            continue;
        }
        const receiverChannel = await receiverServerGuild.channels.cache.get(receiverServerList[index].channel);
        if(!receiverServerGuild) {
            console.warn(`[SENDER] Receiver channel ${receiverServerList[index].name} (from server ${receiverServerGuild.name}) not found, skipping`);
            continue;
        }
        try{
            receiverChannel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(senderServer.guildName)
                    .setURL(senderServer.invite)
                    .setDescription(senderServer.description)
                ]
            })
        } catch {
            console.warn(`[WARN] [SENDER] Was unable to send to channel ${receiverChannel.id} (from server ${receiverServerGuild.name})`)
        }
    }
}


module.exports = { deploy_commands }