const { MessageEmbed } = require("discord.js");
const { getBrowser, isReady } = require('../flowalgo');

module.exports = {
    command: 'r',
    permissions: (member) => {
        return true;
    },
	async execute(bot, msg, args) {
        if(!isReady()) return msg.channel.send('Please wait until the bot is fully set up.');
        const page = await getBrowser().newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');
        await page.setViewport({ width: 1700, height: 2000 });
        await page.goto(`https://app.flowalgo.com/equity-radar/?ex_symbol=${args[0]}&ex_days_ago=30`);

        await new Promise(_ => setTimeout(_, 1500));

        if((await page.$$('.exp_day')).length == 0) return msg.channel.send('No flows found for this ticker.').then(m => m.delete({ timeout: 15000 }));

        await page.screenshot({
            path: 'screenshot.png',
            clip: {
                x: 190,
                y: 250,
                width: 1320,
                height: 1480
            }
        });

        const embed = new MessageEmbed()
        .setFooter(new Date().toLocaleDateString())
        .attachFiles(['./screenshot.png'])
        .setImage('attachment://screenshot.png');

        await msg.channel.send(embed);
	},
}