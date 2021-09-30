const file = new (require('../util/file'))('guilds.json');
const bot = require('./../index');
const { MessageEmbed } = require('discord.js');
module.exports.newAlphaaiResponse = function newAlphaaiResponse(alphaSig) {
  const guilds = file.read();

  const embed = new MessageEmbed()
    .setColor('#2A466E')
    .setTitle(`AI Alert ${alphaSig.symbol}`)
    .addFields(
      { name: 'Symbol', value: alphaSig.symbol, inline: true },
      { name: 'Signal', value: alphaSig.sentiment, inline: true },
      { name: 'Ref', value: alphaSig.ref, inline: true },
      { name: 'Date', value: alphaSig.date, inline: true }
    )
    .setFooter(
      guild.footer_text ??
        '© R2R Analytics, 2021 ✦ For educational purposes only',
      guild.footer_icon ??
        'https://media.discordapp.net/attachments/891831484770570250/892101960017260564/Hand_only1_2.png'
    );

  guilds.forEach((guild) => {
    const channel = bot.channels.cache.get(guild.alphaai);
    if (!channel) return;
    channel
      .send(
        guild.alphaai_ping,
        guild.alphaai_chart
          ? embed.setImage(
              require('../flowalgo').getChart(
                alphaSig.symbol,
                guild.alphaai_chart_duration ?? 'i5'
              )
            )
          : embed
      )
      .catch(() => {});
  });
};
