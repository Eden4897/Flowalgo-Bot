const { MessageEmbed } = require("discord.js");
const { getPage, isReady } = require('../flowalgo');

module.exports = {
    command: 'm',
    dm: false,
    permissions: (member) => {
        return true;
    },
	async execute(bot, msg, args) {
        if(!isReady()) return msg.channel.send('Please wait until the bot is fully set up.');
        await getPage(0).screenshot({
            path: 'screenshot.png',
            clip: {
                x: 50,
                y: 50,
                width: 1350,
                height: 1950
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