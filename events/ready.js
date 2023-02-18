const client = require('..');
const chalk = require('chalk');
const mongoose = require('mongoose');


client.on('ready', async () => {
    console.log(chalk.red(`${client.user.tag} prêt a pub ! 📌`));

    const mongo = process.env.MONGO;

    if (!mongo) {
        console.log("[WARN] L'url de mongodb n'est pas bon !");
    } else {
        mongoose.connect(mongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).catch((e) => console.log(e));

        mongoose.connection.once("open", () => {
            console.log("[DATABASE] Connected to MongoDB!");
        });
    };
});