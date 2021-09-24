const file = new (require('../util/file'))('guilds.json');
const bot = require('./../index');
const { MessageEmbed } = require('discord.js');
module.exports.newAlphaaiResponse = function newAlphaaiResponse(alphaai){
    const guilds = file.read();

    const embed = new MessageEmbed()
      .setColor('#2A466E')
      .setTitle(`AI Alert ${alphaSig.symbol}`)
      .addFields(
        { name: 'Symbol', value: alphaSig.symbol, inline: true },
        { name: 'Signal', value: alphaSig.sentiment, inline: true },
        { name: 'Ref', value: alphaSig.ref, inline: true },
        { name: 'Date', value: alphaSig.date, inline: true }
      );

    guilds.forEach((guild) => {
      const channel = bot.channels.cache.get(guild.alphaai);
      if (!channel) return;
      channel
        .send(
          guild.alphaai_ping,
          guild.alphaai_chart
            ? embed.setImage(
                require('../flowalgo').getChart(alphaSig.symbol, guild.alphaai_chart_duration ?? 'i5')
              )
            : embed
        )
        .catch(() => {});
    });
}