const client = require('..');
const chalk = require('chalk');
const mongoose = require('mongoose');
const { app, port } = require("../dashboard/app")
const cron = require('node-cron');
const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');


client.on('ready', async () => {
    console.log(chalk.red(`${client.user.tag} Eureka ! 📌`));
    client.user.setStatus('online');

    setInterval(async () => {
        const servercount = await client.guilds.cache.size;
        client.user.setActivity(`/config - ${servercount} serveurs`)
    }, 60000);

    setTimeout(async () => {
        setInterval(async () => {
            const usercount = await client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
            client.user.setActivity(`/config - ${usercount} utilisateurs`);
        }, 60000)
    }, 30000);
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

    app.listen(port, () => {
        console.log(chalk.green("[DASHBOARD] Site en ligne"))
    })

});