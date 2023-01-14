const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { token, clientId } = require('./config.json');
const { Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const rest = new REST({ version: '10' }).setToken(token);



function deploy_commands_global_and_guild(client, loadcommands, guildId) {
    if (!typeof loadcommands === Boolean) throw "type of loadcommands argument needs to be boolean";

    console.info('[INFO] Slash commands loading started');

    const commands = [];
    client.globalCommands = new Collection();
    client.help = ""
    const commandCategories = fs.readdirSync('./commands/global').filter(file => !file.includes('.'));
    for (const category of commandCategories) {
        const commandFiles = fs.readdirSync(`./commands/global/${category}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/global/${category}/${file}`);
            commands.push(command.data);
            client.globalCommands.set(command.data.name, command);
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



    guildCommands = [];
    client.guildCommands = new Collection();

    const guildCommandCategories = fs.readdirSync('./commands/support').filter(file => !file.includes('.'));
    for (const category of guildCommandCategories) {
        const commandFiles = fs.readdirSync(`./commands/support/${category}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/support/${category}/${file}`);
            guildCommands.push(command.data);
            client.guildCommands.set(command.data.name, command);

            console.log(`[LOADER] ${category}/${command.data.name} loaded`);
        }
    }
    if (loadcommands){
        slashCommandLoadGuild(client, guildCommands, guildId);
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


function shuffle(items) {
    for(var i = items.length; i-- > 1; ) {
      var j = Math.floor(Math.random() * i);
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    return items
}

async function sendServers(client) {
    const senderServerList = await client.database.server.findAll();
    if (!senderServerList || senderServerList==0) return console.warn("[WARN] No server found in the database, skipping server sending");

    const receiverServerList = shuffle([...senderServerList]);

    
    senderServerList.forEach(async (senderServer, index) => {
        const receiverServerGuild = await client.guilds.cache.get(receiverServerList[index].name);
        if(!receiverServerGuild) {
            return console.client.logs.send(`[SENDER] Receiver server ${receiverServerGuild.name} not found, skipping`);
        }
        const receiverChannel = await receiverServerGuild.channels.cache.get(receiverServerList[index].channel);
        if(!receiverChannel) {
            return client.logs.send(`[SENDER] Receiver channel ${receiverServerList[index].name} (from server ${receiverServerGuild.name}) not found, skipping`);
        }
        const sender = await client.guilds.cache.get(senderServer.name);

        if(!receiverChannel.permissionsFor(await receiverServerGuild.members.fetchMe(), checkAdmin = true).has(PermissionsBitField.Flags.SendMessages)) return client.logs.send({ content: `[WARN] [SENDER] I didn't have permission to write in <#${receiverChannel.id}> on ${receiverServerList[index].invite} !` });
        try{
            await receiverChannel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(sender.name)
                    .setURL(senderServer.invite)
                    .setDescription(senderServer.description)
                    .setThumbnail(sender.iconURL({ size: 1024 }))
                ]
            })
        } catch(error) {
            console.log(error)
            return client.logs.send(`[WARN] [SENDER] Was unable to send to channel ${receiverChannel.id} on ${receiverServerList[index].invite}`)
        }
    });
}

module.exports = { deploy_commands_global_and_guild, sendServers }