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
        flow_chart: false,
        unusual_chart: false,
        golden_chart: false,
        alphaai_chart: false,
        flow_chart_duration: 'i5',
        unusual_chart_duration: 'i5',
        golden_chart_duration: 'i5',
        alphaai_chart_duration: 'i5'
      });
    }

    if (!['flow', 'unusual', 'golden', 'alphaai'].includes(args[0])) {
      return msg.channel.send(
        `Only alerts with charts are ${[
          'flow',
          'unusual',
          'golden',
          'alphaai'
        ].join('/')}`
      );
    }

    const guild = guilds.find((g) => g.id == msg.guild.id);

    guild[`${args[0]}_chart`] = true;

    file.write(guilds);

    await msg.channel.send(`Chart enabled for ${args[0]} alerts.`);
  }
};
