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
        await sendServers("2H");
    });

    cron.schedule("0 */4 * * *", async () => {//Schedule des délais 4H
        await sendServers("4H");
    });

    cron.schedule("0 */6 * * *", async () => {//Schedule des délais 6H
        await sendServers("6H");
    });

    cron.schedule("0 */8 * * *", async () => {//Schedule des délais 8H
        await sendServers("8H");
    });

    cron.schedule("0 */12 * * *", async () => {//Schedule des délais 12H (minuit et midi)
        await sendServers("12H");
        await sendServers("general");
    });

    cron.schedule("0 12 * * *", async () => {//Schedule des délais 24H (envoi à midi)
        await sendServers("24H");
    });

});


/**
 * 
 * @param {String} delay 
 */
async function sendServers(delay) {
    const timeData = await timeModel.findOne({ searchInDb: "adshare" });
    const sendingServersIds = {
        "2H": timeData.deux,
        "4H": timeData.quatre,
        "6H": timeData.six,
        "8H": timeData.huit,
        "12H": timeData.douze,
        "24H": timeData.vingtquatre,
        "general": timeData.general,
    }[delay];

    const receivingServersIds = shuffleNoDuplicates(sendingServers);

};

/**
 * 
 * @param {Array} array 
 * @returns {Array}
 */
function shuffleNoDuplicates(array) {
    const originalArray = [...array];
    let m = array.length;
    while (m > 1) {
        let i;
        do {
            i = Math.floor(Math.random() * m);
        } while (array[i] === originalArray[m - 1]);
        m--;
        const t = array[m];
        array[m] = array[i];
        array[i] = t;

        if (array[0] === originalArray[0]) {
            [array[0], [array[1]]] = [array[1], [array[0]]];
        }
        return array;
    }
}