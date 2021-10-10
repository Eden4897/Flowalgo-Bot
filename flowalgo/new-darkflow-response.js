const file = new (require('../util/file'))('guilds.json');
const bot = require('./../index');
const { MessageEmbed } = require('discord.js');
module.exports.newDarkflowResponse = function newDarkflowResponse(darkflow) {
  const guilds = file.read();

  const embed = new MessageEmbed()
    .setColor(
      darkflow.isSell ? '#FF0000' :
        darkflow.isBuy ? '#006400' :
          darkflow.greenEquity ? '#4be352' :
            darkflow.darkprint ? '#000000' :
              '#9ea2a8'
    )
    .setTitle(
      `${darkflow.isBuy ? 'Buy-sig' : darkflow.isSell ? 'Sell-sig' : ''} ${darkflow.ticker} ${darkflow.greenEquity
        ? 'Green Equity'
        : darkflow.darkprint
          ? 'Darkpool Prints'
          : 'Equity Blocks'
      }`
    )
    .addFields(
      { name: 'Ticker', value: darkflow.ticker, inline: true },
      { name: 'Quantity', value: darkflow.quantity, inline: true },
      { name: '$MM', value: darkflow.mm, inline: true },
      { name: 'Spot Price', value: darkflow.spot, inline: true },
      { name: 'Date', value: darkflow.time, inline: true }
    );

  guilds.forEach((guild) => {
    const guildSpecificEmbed = new MessageEmbed(embed).setFooter(
      guild.footer_text ?? '',
      guild.footer_icon
    );
    const channel = bot.channels.cache.get(
      darkflow.greenEquity
        ? guild.greenequity
        : darkflow.darkprint
          ? guild.darkprint
          : guild.equity
    );
    if (!channel) return;
    channel
      .send(
        darkflow.greenEquity
          ? guild.greenequity_ping
          : darkflow.darkprint
            ? guild.darkprint_ping
            : guild.equity_ping,
        guildSpecificEmbed
      )
      .catch(() => { });
  });
}