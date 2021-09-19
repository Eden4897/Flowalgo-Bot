const { MessageEmbed } = require('discord.js');
const file = new (require('../util/file'))('guilds.json');

module.exports = {
  command: 'set_duration',
  aliases: ['sd'],
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

    if (!['m', 'w', 'd', 'i15', 'i5', 'i3'].includes(args[0])) {
      return msg.channel.send(
        'Only m/w/d/i15/i5/i3 is accepted as the duration.'
      );
    }

    const guild = guilds.find((g) => g.id == msg.guild.id);

    guild.chart_duration = args[0];

    file.write(guilds);

    await msg.channel.send(
      `Duration for chart in this server set to ${args[0]}.`
    );
  }
};
