const { MessageEmbed } = require("discord.js");
const { getBrowser, isReady } = require('../flowalgo');

module.exports = {
    command: 'l',
    permissions: (member) => {
        return true;
    },
	async execute(bot, msg, args) {
        //if(!isReady()) return msg.channel.send('Please wait until the bot is fully set up.');

        const page = await getBrowser().newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');
        await page.setViewport({ width: 1700, height: 2000 });

        await page.goto(`https://app.flowalgo.com/levels/?symbol=${args[0]}&min_strength=20`, { waitUntil: 'networkidle0' })
        
        if(!await page.$('#faLevels_body>.level')) return msg.channel.send('No flows found for this ticker.').then(m => m.delete({ timeout: 15000 }));

        await new Promise(_ => setTimeout(_, 1000));

        await page.screenshot({
            path: 'screenshot.png',
            clip: {
                x: 490,
                y: 260,
                width: 760,
                height: 1500
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