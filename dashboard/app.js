const path = require("path")
const client = require("../index")
const express = require('express')
const { request } = require('undici');
const expressapi = require("@borane/expressapi");
const app = express()
const port = 3000
const botToken = process.env.TOKEN;

app.use(express.static(path.join(__dirname, "views")))
app.use(express.static(path.join(__dirname, "public")))
app.get('/', async ({ query }, response) => {
	return response.sendFile('dashboard/views/index.html', { root: '.' });
});

app.get('/auth/discord', (request, response) => {
	return response.sendFile('dashboard/views/index.html', { root: '.' });
})

app.get('/embed/manageembed', (req, res) => {
	return res.sendFile('dashboard/views/manageembed.html', { root: '.' });
})

app.get('/guilds/:id/roles', async (req, res) => {
	console.log(await (await client.guilds.fetch(req.params.id)).roles.fetch())
	return res.send('ok')
});

app.post('/getUsersGuilds/:authToken', async (req, res) => {

	const response = JSON.parse(await expressapi.request(`https://discord.com/api/v10/users/@me/guilds`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${req.params.authToken}`,
			"Content-Type": "application/json",
		}
	}));

	console.log(response)

	const filteredGuilds = response.filter(guild => {
		return (guild.permissions & 8) === 8 && guild.bot;
	});
	console.log(filteredGuilds)

	res.send("ok")
});


module.exports = { app, port };

