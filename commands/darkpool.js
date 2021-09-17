const { MessageEmbed } = require("discord.js");
const { getPage, isReady } = require('../flowalgo');

module.exports = {
    command: 'd',
    dm: false,
    permissions: (member) => {
        return true;
    },
	async execute(bot, msg, args) {
        if(!isReady()) return msg.channel.send('Please wait until the bot is fully set up.');

        await getPage(4).goto(`https://app.flowalgo.com/historical-flow/?tickers=${args[0]}&start=&end=&minsize=&show=50`)

        if((await getPage(4).$$('.dark-flow')).length == 0) return msg.channel.send('No darkpools found for this ticker.').then(m => m.delete({ timeout: 15000 }));

        await getPage(4).screenshot({
            path: 'screenshot.png',
            clip: {
                x: 1300,
                y: 260,
                width: 330,
                height: 1395
            }
        });

        const embed = new MessageEmbed()
        .setTitle(args[0])
        .setFooter(new Date().toLocaleDateString())
        .attachFiles(['./screenshot.png'])
        .setImage('attachment://screenshot.png');

        await msg.channel.send(embed);
	},
} 