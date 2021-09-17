const { MessageEmbed } = require("discord.js");
const { getBrowser, isReady } = require('../flowalgo');

module.exports = {
    command: 'h',
    dm: false,
    permissions: (member) => {
        return true;
    },
	async execute(bot, msg, args) {
        if(!isReady()) return msg.channel.send('Please wait until the bot is fully set up.');

        const page = await getBrowser().newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');
        await page.setViewport({ width: 1700, height: 2000 });

        await page.goto(`https://app.flowalgo.com/historical-flow/?tickers=${args[0]}&start=&end=&minsize=&show=50`)

        if((await page.$$('.option-flow')).length == 0) return msg.channel.send('No flows found for this ticker.').then(m => m.delete({ timeout: 15000 }));

        await page.screenshot({
            path: 'screenshot.png',
            clip: {
                x: 70,
                y: 260,
                width: 990,
                height: 1395
            }
        });

        const embed = new MessageEmbed()
        .setTitle(args[0])
        .setFooter(new Date().toLocaleDateString())
        .attachFiles(['./screenshot.png'])
        .setImage('attachment://screenshot.png');

        await msg.channel.send(embed);

        await page.close();
	},
}