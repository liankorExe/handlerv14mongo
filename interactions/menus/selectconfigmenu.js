const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Discord } = require("discord.js")
const serverModel = require("../../schemas/timeArrayTable")
module.exports = {
    id: 'configselectmenu',
    permissions: [],
    run: async (client, interaction) => {
        let serverSettings = await serverModel.findOne({ serverID: interaction.guild.id })
        if (!serverSettings) {
            await serverModel.create({
                serverID: interaction.guild.id,
                description: "null",
                salonpub: "null"
            })
        }
        serverSettings = await serverModel.findOne({ serverID: interaction.guild.id })
        const val = interaction.values[0]
        await interaction.deferUpdate()
        if (val === "salon") {
            console.log("Commande 'salon' détectée.");
            const question = await interaction.channel.send(`Quel est le salon d'affichage des pubs ?`);
            const filterquestion = reponse => reponse.mentions.channel.first();
            interaction.message.channel.awaitMessages({ filter: filterquestion, max: 1, time: 60000 }).then(async collected => {
                console.log("Promesse 'awaitMessages' résolue.");
                const channelid = collected.first().content.replace("<", "").replace("#", "").replace(">", "");
                console.log("ID du channel : ", channelid);
                await serverModel.findOneAndUpdate(
                    {
                        serverID: interaction.guild.id,
                    },
                    {
                        salonpub: channelid,
                    },
                );
                question.delete();
                collected.first().delete();

                serverSettings = await serverModel.findOne({ serverID: interaction.guild.id });

                interaction.message.embeds[0].fields[0].value = serverSettings.salonpub === "null" ? "Non défini" : `<#${serverSettings.salonpub}>`;
                console.log("Message édité.");
                interaction.message.edit({ embeds: interaction.message.embeds });
            })
        }

    }
};
