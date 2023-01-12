const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId } = require('./config.json');
const { Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const rest = new REST({ version: '10' }).setToken(token);



function deploy_commands_global_and_guild(client, loadcommands, guildId) {
    if (!typeof loadcommands === Boolean) throw "type of loadcommands argument needs to be boolean";

    console.info('[INFO] Slash commands loading started');

    const commands = [];
    client.commands = new Collection();
    client.help = ""
    const commandCategories = fs.readdirSync('./commands/global').filter(file => !file.includes('.'));
    for (const category of commandCategories) {
        const commandFiles = fs.readdirSync(`./commands/global/${category}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/global/${category}/${file}`);
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


    const guildCommandCategories = fs.readdirSync('./commands/support').filter(file => !file.includes('.'));
    for (const category of guildCommandCategories) {
        const commandFiles = fs.readdirSync(`./commands/support/${category}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/support/${category}/${file}`);
            commands.push(command.data);
            client.commands.set(command.data.name, command);
            client.help = client.help + `\`${command.data.name}\`: ${command.data.description}\n`

            console.log(`[LOADER] ${category}/${command.data.name} loaded`);
        }
    }
    if (loadcommands){
        slashCommandLoadGuild(client, commands, guildId);
    }
    else{//Deletes slash commands
        slashCommandLoadGuild(client, [], guildId)
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


async function slashCommandLoadGuild(client, commands, guildId) {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );    
    } catch (error) {
        console.error(error);
    }
    return client.commands;
};

async function sendServers(client) {
    const senderServerList = await client.database.server.findAll();
    if (!senderServerList || senderServerList==0) return console.warn("[WARN] No server found in the database, skipping server sending");

    const receiverServerList = await client.database.server.findAll();

    for (i = receiverServerList.length - 1; i > 0; i--) {
        console.log(i)
        j = Math.floor(Math.random() * (i + 1));
        x = receiverServerList[i];
        receiverServerList[i] = receiverServerList[j];
        receiverServerList[j] = x;
    }

    for (let index = 0; index < senderServerList.length; index++) {
        console.log(index)
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
    console.log("Sent servers")
    return "Sent servers"
}

module.exports = { deploy_commands_global_and_guild, sendServers }