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
            const question = await interaction.channel.send(`Quel est le salon d'affichage des pubs ?`);
            const filterquestion = reponse => reponse.mentions.channel.first() && reponse.author.id == interaction.user.id;
            interaction.message.channel.awaitMessages({ filter: filterquestion, max: 1, time: 60000 }).then(async collected => {
                const channelid = collected.first().content.replace("<", "").replace("#", "").replace(">", "");
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
                interaction.message.edit({ embeds: interaction.message.embeds });
            })
        }

    }
};
