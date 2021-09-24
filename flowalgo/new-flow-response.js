const file = new (require('../util/file'))('guilds.json');
const bot = require('./../index');
const { MessageEmbed } = require('discord.js');
module.exports.newFlowResponse = function newFlowResponse(flow){
    function getProgressBar(num) {
        const fill = '█';
        const unfill = ' ';
        let out = '';
  
        for (let i = 5; i <= 100; i += 5) {
          if (i < num) out += fill;
          else out += unfill;
        }
  
        return `\`${out}\``;
      }
  
      const guilds = file.read();
  
      const embed = new MessageEmbed()
        .setColor(
          flow.isUnusual
            ? '#950FF5'
            : flow.isGolden
            ? '#F5CB0F'
            : flow.isCall
            ? '#33CC6B'
            : '#CC4A33'
        )
        .setTitle(
          `${flow.ticker} ${flow.isCall ? 'CALLS' : 'PUTS'} ${
            flow.isUnusual ? '(UNUSUAL)' : flow.isGolden ? '(GOLDEN SIGNAL)' : ''
          }`
        )
        .setDescription(
          `Score: **[${getProgressBar(flow.algoScore)}]** *(${
            flow.algoScore
          }/100)*`
        )
        .addFields(
          { name: 'Ticker', value: flow.ticker, inline: true },
          { name: 'Type', value: flow.type, inline: true },
          { name: 'C/P', value: flow.isCall ? 'CALLS' : 'PUTS', inline: true },
          { name: 'Strike', value: flow.strike, inline: true },
          { name: 'Spot price', value: flow.spot, inline: true },
          { name: 'Premium', value: flow.premium, inline: true },
          { name: 'Details', value: flow.details, inline: true },
          { name: 'Date', value: flow.date, inline: true },
          { name: 'Expiry Date', value: flow.expiry, inline: true }
        );
  
      guilds.forEach((guild) => {
        const channel = bot.channels.cache.get(
          flow.isUnusual
            ? guild.unusual
            : flow.isGolden
            ? guild.golden
            : guild.flow
        );
        if (!channel) return;
        channel
          .send(
            flow.isUnusual
              ? guild.unusual_ping
              : flow.isGolden
              ? guild.golden_ping
              : guild.flow_ping,
            (
              flow.isUnusual
                ? guild.unusual_chart
                : flow.isGolden
                ? guild.golden_chart
                : guild.flow_chart
            )
              ? embed.setImage(
                  require('../flowalgo').getChart(
                    flow.ticker,
                    (flow.isUnusual
                      ? guild.unusual_chart_duration
                      : flow.isGolden
                      ? guild.golden_chart_duration
                      : guild.flow_chart_duration) ?? 'i5'
                  )
                )
              : embed
          )
          .catch(() => {});
      });
}