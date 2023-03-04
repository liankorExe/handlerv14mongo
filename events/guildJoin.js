const client = require('..');
const { EmbedBuilder, Discord } = require("discord.js")
const timeModel = require('../schemas/timeArrayTable');


client.on('guildCreate', async (guild) => {
    const embedJoin = new EmbedBuilder()
        .setTitle(`Join`)
        .setDescription(`Le bot a rejoin le serveur **${guild.name}** \n 
        ID du serveur\`\(${guild.id})\`\ \n\`${guild.memberCount}\`\  **Membres** 
        \n ID du fondateurs \`\(${guild.ownerId})\`\ - <@${guild.ownerId}> `)
        .setThumbnail(guild.iconURL())
        .setColor(`Green`)
    const channel = await client.channels.fetch('1077673611185356821')
    if (channel) return channel.send({ embeds: [embedJoin] })
});

client.on('guildDelete', async (guild) => {
    const embedJoin = new EmbedBuilder()
        .setTitle(`Leave`)
        .setDescription(`Le bot a rejoin le serveur **${guild.name}** \n 
        ID du serveur\`\(${guild.id})\`\ \n\`${guild.memberCount}\`\  **Membres** 
        \n ID du fondateurs \`\(${guild.ownerId})\`\ - <@${guild.ownerId}> `)
        .setThumbnail(guild.iconURL())
        .setColor(`Red`)
    const channel = await client.channels.fetch('1077673611185356821')
    if (channel) return channel.send({ embeds: [embedJoin] })

    const timeData = await timeModel.findOne({ searchInDb: "adshare" });
    await removeFromArrays(guild.id, timeData)
});

async function removeFromArrays(serverId, timeData) {
    const arrayOfArrays = [
        timeData.deux,
        timeData.quatre,
        timeData.six,
        timeData.huit,
        timeData.douze,
        timeData.vingtquatre,
        timeData.general
    ];
    const arrayNames = ["2H", "4H", "6H", "8H", "12H", "24H", "general"]
    const presentIn = [];

    arrayOfArrays.forEach((array, index) => {
        if (array.includes(serverId)) {
            array.splice(array.indexOf(serverId), 1);
            const horaire = arrayNames[index];
            switch (horaire) {
                case '2H':
                    presentIn.push('2H');
                    break;
                case '4H':
                    presentIn.push('4H');
                    break;
                case '6H':
                    presentIn.push('6H');
                    break;
                case '8H':
                    presentIn.push('8H');
                    break;
                case '12H':
                    presentIn.push('12H');
                    break;
                case '24H':
                    presentIn.push('24H');
                    break;
                case 'general':
                    presentIn.push('général');
                    break;
                default:
                    break;
            }
        }
    })
    if (presentIn.length === 0) {
        return 'Le serveur n\'est pas présent dans les tableaux.';
    } else {
        await timeData.save();
        return `Le serveur était présent dans les tableaux suivants : ${presentIn.join(', ')}. et a été supprimé de ces tableaux !`;
    }
}

