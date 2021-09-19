const { MessageEmbed } = require('discord.js');
const { getPage, isReady } = require('../flowalgo');

module.exports = {
  command: 'e',
  permissions: (member) => {
    return true;
  },
  async execute(bot, msg, args) {
    if (!isReady())
      return msg.channel.send('Please wait until the bot is fully set up.');
    await getPage(4).reload();
    await new Promise((_) => setTimeout(_, 1500));

    await getPage(4).screenshot({
      path: 'screenshot.png',
      clip: {
        x: 440,
        y: 170,
        width: 850,
        height: 2800
      }
    });

    const embed = new MessageEmbed()
      .setFooter(new Date().toLocaleDateString())
      .attachFiles(['./screenshot.png'])
      .setImage('attachment://screenshot.png');

    await msg.channel.send(embed);
  }
};
