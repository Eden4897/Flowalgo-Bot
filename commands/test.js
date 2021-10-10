const { MessageEmbed } = require('discord.js');
const { newAlphaaiResponse } = require('../flowalgo/new-alphaai-response');
const file = new (require('../util/file'))('guilds.json');

module.exports = {
    command: 'test',
    aliases: ['t'],
    dm: false,
    permissions: (member) => {
        return member.hasPermission('MANAGE_GUILD');
    },
    async execute(bot, msg, args) {
        newAlphaaiResponse({
            symbol: '123',
            sentiment: 'test',
            ref: 'hi',
            date: 'today'
        })
    }
};
