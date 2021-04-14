const { Telegraf } = require("telegraf");
require("dotenv").config();
const axios = require("axios");
const app = require('express');
const http = require('http');
const server = http.Server(app);
const PORT = process.env.PORT || 5000



server.listen(PORT, () => console.log(`Listening on port ${ PORT }`));

const kelvinToCelsius = require('kelvin-to-celsius');
const schedule = require('node-schedule');


const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `Bienvenido al ClimaBot, bot encargado de informar diariamente el tiempo de la ciudad.
    Escriba "tiempo" para obtener informacion sobre el tiempo de su ciudad.`
  )
);

//We get the weather information and send it when the bot hears "tiempo"

bot.hears("tiempo", async (ctx) => {
  const tiempo = await axios
    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${process.env.LAT}&lon=${process.env.LONG}&appid=${process.env.API_KEY}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log("Error de API", error));

  return ctx.reply(`La temperatura hoy en ${tiempo.name} es de ${kelvinToCelsius(tiempo.main.temp)}°`);
});

bot.launch();



