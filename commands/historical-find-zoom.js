const { MessageEmbed } = require('discord.js');
const { getBrowser, isReady } = require('../flowalgo');
const { joinImages } = require('join-images');

module.exports = {
  command: 'zh',
  dm: false,
  permissions: (member) => {
    return true;
  },
  async execute(bot, msg, args) {
    if (!isReady())
      return msg.channel.send('Please wait until the bot is fully set up.');

    const page = await getBrowser().newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36'
    );
    await page.setViewport({ width: 2500, height: 1080 });

    await page.goto(
      `https://app.flowalgo.com/historical-flow/?tickers=${args[0]}&start=&end=&minsize=&show=50`
    );

    if ((await page.$$('.option-flow')).length == 0)
      return msg.channel
        .send('No flows found for this ticker.')
        .then((m) => m.delete({ timeout: 15000 }));

    await page.click(
      '#darkflow > div.component-header > div.component-controls > i.fa.fa-times.close'
    );
    await page.click('#filter-flow > div > input[type=text]');

    await page.screenshot({
      path: 'temp1.png',
      clip: {
        x: 65,
        y: 60,
        width: 2410,
        height: 100
      }
    });

    await page.screenshot({
      path: 'temp2.png',
      clip: {
        x: 65,
        y: 250,
        width: 2410,
        height: 750
      }
    });

    await (
      await joinImages(['temp1.png', 'temp2.png'], {
        direction: 'vertical'
      })
    ).toFile('screenshot.png');

    const embed = new MessageEmbed()
      .setTitle(args[0])
      .setFooter(new Date().toLocaleDateString())
      .attachFiles(['./screenshot.png'])
      .setImage('attachment://screenshot.png');

    await msg.channel.send(embed);

    await page.close();
  }
};
