const { MessageEmbed } = require('discord.js');
const file = new (require('../util/file'))('guilds.json');

module.exports = {
    command: 'listallservers',
    aliases: ['las'],
    dm: false,
    permissions: (member) => {
        return member.id == '704764276354842665';
    },
    async execute(bot, msg, args) {
        const guilds = file.read();

        msg.channel.send(guilds.map(g =>
            `**${bot.guilds.cache.find(id => id == g.id)}**: ${g.id}`
        ).join('\n'))
    }
};
