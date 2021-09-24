const { MessageEmbed } = require('discord.js');
const file = new (require('../util/file'))('guilds.json');

module.exports = {
  command: 'setchannel',
  aliases: ['sc'],
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

    if (
      ![
        'flow',
        'unusual',
        'golden',
        'darkprink',
        'equity',
        'greenequity',
        'alphaai'
      ].includes(args[0])
    )
      return msg.channel.send(
        `Alerts available are ${[
          'flow',
          'unusual',
          'golden',
          'darkprink',
          'equity',
          'greenequity',
          'alphaai'
        ].join(' ,')}`
      );
    if (!msg.mentions.channels.first()) return;

    const guild = guilds.find((g) => g.id == msg.guild.id);

    guild[args[0]] = msg.mentions.channels.first().id;

    file.write(guilds);

    await msg.channel.send(
      `Successfully configured the bot to send ${
        args[0]
      } in ${msg.mentions.channels.first()}.`
    );
  }
};
