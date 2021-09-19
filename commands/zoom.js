const { MessageEmbed } = require('discord.js');
const { getPage, isReady } = require('../flowalgo');

module.exports = {
  command: 'z',
  dm: false,
  permissions: (member) => {
    return true;
  },
  async execute(bot, msg, args) {
    if (!isReady())
      return msg.channel.send('Please wait until the bot is fully set up.');

    await getPage(3).click('input', { clickCount: 3 });
    await getPage(3).type('input', args[0]);

    await new Promise((_) => setInterval(_, 500));

    if (
      await getPage(3).evaluate(() => {
        return (
          document.querySelector('#filter-results-count').innerText.trim() ==
          '0 Results'
        );
      })
    )
      return msg.channel
        .send('No flows found for this ticker.')
        .then((m) => m.delete({ timeout: 15000 }));
    await getPage(3).screenshot({
      path: 'screenshot.png',
      clip: {
        x: 50,
        y: 50,
        width: 1870,
        height: 950
      }
    });

    const embed = new MessageEmbed()
      .setTitle(args[0])
      .setFooter(new Date().toLocaleDateString())
      .attachFiles(['./screenshot.png'])
      .setImage('attachment://screenshot.png');

    await msg.channel.send(embed);
  }
};
