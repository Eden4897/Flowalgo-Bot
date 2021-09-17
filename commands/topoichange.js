const { MessageEmbed } = require("discord.js");
const { getPage, isReady } = require('../flowalgo');

module.exports = {
    command: 'oi',
    permissions: (member) => {
        return true;
    },
	async execute(bot, msg, args) {
        if(!isReady()) return msg.channel.send('Please wait until the bot is fully set up.');
        await getPage(5).reload();
        await new Promise(_ => setTimeout(_, 1500));

        await getPage(5).screenshot({
            path: 'screenshot.png',
            clip: {
                x: 70,
                y: 100,
                width: 800,
                height: 9800
            }
        });

        const embed = new MessageEmbed()
        .setFooter(new Date().toLocaleDateString())
        .attachFiles(['./screenshot.png'])
        .setImage('attachment://screenshot.png');

        await msg.channel.send(embed);
	},
}