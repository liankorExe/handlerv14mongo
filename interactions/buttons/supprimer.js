const { Discord, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const timeModel = require("../../schemas/timeArrayTable");

module.exports = {
    id: 'supprimer',
    permissions: [],
    run: async (client, interaction) => {
        let timeData = await timeModel.findOne({ searchInDb: "adshare" });
        if (!timeData) {
            await timeModel.create({
                searchInDb: "adshare",
                deux: [],
                quatre: [],
                six: [],
                huit: [],
                douze: [],
                vingtquatre: [],
                general: []
            });
            timeData = await timeModel.findOne({ searchInDb: "adshare" });
        }
        const serverId = interaction.customId.split('_')[1];
        const messages = removeFromArrays(serverId, timeData);
        await interaction.reply({ content: messages, ephemeral: true });
    }
};

function removeFromArrays(serverId, timeData) {
    const arrayOfArrays = [
        timeData.deux,
        timeData.quatre,
        timeData.six,
        timeData.huit,
        timeData.douze,
        timeData.vingtquatre,
        timeData.general
    ];
    const arrayNames = ["2H", "4H", "6H", "8H", "12H", "14H", "general"]
    const presentIn = [];

    arrayOfArrays.forEach((array, index) => {
        console.log(array.includes(serverId))
        if (array.includes(serverId)) {
            array.splice(array.indexOf(serverId), 1);
            const horaire = arrayNames[index];
            switch (horaire) {
                case 'deux':
                    presentIn.push('2H');
                    break;
                case 'quatre':
                    presentIn.push('4H');
                    break;
                case 'six':
                    presentIn.push('6H');
                    break;
                case 'huit':
                    presentIn.push('8H');
                    break;
                case 'douze':
                    presentIn.push('12H');
                    break;
                case 'vingtquatre':
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
        return `Le serveur était présent dans les tableaux suivants : ${presentIn.join(', ')}. et a été supprimé de ces tableaux !`;
    }
}