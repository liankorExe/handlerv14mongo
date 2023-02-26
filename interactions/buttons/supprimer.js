const { Discord, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const timeModel = require("../../schemas/timeArrayTable");
module.exports = {
    id: 'supprimer',
    permissions: [],
    run: async (client, interaction) => {
        let timeData = await timeModel.findOne({ searchInDb: "adshare" });
        if (!timeData) await timeModel.create({
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
        const serverId = interaction.customId.split('_')[1]
        if (timeData.servers.includes(serverId)) return interaction.reply({ content: `Ce serveur est dans aucune listes de pubs !`, ephemeral: true })

        const arrayOfArrays = [
            timeData.deux,
            timeData.quatre,
            timeData.six,
            timeData.huit,
            timeData.douze,
            timeData.vingtquatre,
            timeData.general
        ];
        function removeFromArrays(serverId, timeData) {
            const presentIn = [];

            for (const array of arrayOfArrays) {
                if (array.includes(serverId)) {
                    const index = array.indexOf(serverId);
                    array.splice(index, 1);
                    presentIn.push(Object.keys(timeData).find(key => timeData[key] === array));
                }
            }

            if (presentIn.length === 0) {
                return 'Le serveur n\'est pas présent dans les tableaux.';
            } else {
                return `Le serveur était présent dans les tableaux suivants : ${presentIn.join(', ')}. et a été supprimé de ces tableaux !`;
            }
        }
        const messages = removeFromArrays(serverId, timeData)
        interaction.reply({ content: messages, ephemeral: true })
    }
};
