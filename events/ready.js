const client = require('..');
const chalk = require('chalk');
const mongoose = require('mongoose');
const cron = require('node-cron');


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

    cron.schedule("0 */2 * * *", async () => {//Schedule des délais 2H

    });

    cron.schedule("0 */4 * * *", async () => {//Schedule des délais 4H

    });

    cron.schedule("0 */6 * * *", async () => {//Schedule des délais 6H

    });

    cron.schedule("0 */8 * * *", async () => {//Schedule des délais 8H

    });

    cron.schedule("0 */12 * * *", async () => {//Schedule des délais 12H (minuit et midi)

    });

    cron.schedule("0 12 * * *", async () => {//Schedule des délais 24H (envoi à midi)

    });

});