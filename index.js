const { Telegraf } = require("telegraf");
require("dotenv").config();
const axios = require("axios");

const kelvinToCelsius = require('kelvin-to-celsius');
const schedule = require('node-schedule');


const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `Bienvenido al ClimaBot, bot encargado de informar diariamente el clima de la ciudad.`
  )
);

bot.hears("clima", async (ctx) => {
  const clima = await axios
    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${process.env.LAT}&lon=${process.env.LONG}&appid=${process.env.API_KEY}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log("Error de API", error));

  return ctx.reply(`La temperatura hoy en ${clima.name} es de ${kelvinToCelsius(clima.main.temp)}`);
});


const job = schedule.scheduleJob('00 00 08 * * *', async () => {

  const clima = await axios
    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${process.env.LAT}&lon=${process.env.LONG}&appid=${process.env.API_KEY}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log("Error de API", error));

  bot.telegram.sendMessage(`${process.env.CHAT_ID}`, `La temperatura hoy en ${clima.name} es de ${kelvinToCelsius(clima.main.temp)}`);
});
bot.launch();



