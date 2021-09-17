const { MessageEmbed } = require("discord.js");
const { getPage, isReady } = require('../flowalgo');

module.exports = {
    command: 'sf',
    dm: false,
    permissions: (member) => {
        return true;
    },
	async execute(bot, msg, args) {
        if(!isReady()) return msg.channel.send('Please wait until the bot is fully set up.');
        await getPage(2).reload({ waitUntil: 'networkidle0' });
        await getPage(2).waitForTimeout(1000);
        await getPage(2).screenshot({
            path: 'screenshot.png',
            clip:{
                x: 180,
                y: 150,
                width: 1400,
                height: 4800
            }
        });

        const embed = new MessageEmbed()
        .setFooter(new Date().toLocaleDateString())
        .attachFiles(['./screenshot.png'])
        .setImage('attachment://screenshot.png');

        await msg.channel.send(embed);
	},
}