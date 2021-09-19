const { MessageEmbed } = require('discord.js');
const file = new (require('../util/file'))('guilds.json');

module.exports = {
  command: 'enablechart',
  aliases: ['ec'],
  dm: false,
  permissions: (member) => {
    return member.hasPermission('MANAGE_GUILD');
  },
  async execute(bot, msg, args) {
    const guilds = file.read();

    if (!guilds.some((g) => g.id == msg.guild.id)) {
      guilds.push({
        id: msg.guild.id,
        flow: null,
        unusual: null,
        golden: null,
        darkprint: null,
        equity: null,
        greenequity: null,
        alphaai: null,
        flow_ping: '',
        unusual_ping: '',
        golden_ping: '',
        darkprint_ping: '',
        equity_ping: '',
        greenequity_ping: '',
        alphaai_ping: '',
        chart: false,
        chart_duration: 'i5'
      });
    }

    const guild = guilds.find((g) => g.id == msg.guild.id);

    guild.chart = true;

    file.write(guilds);

    await msg.channel.send(`Chart enabled for this server.`);
  }
};
