const { MessageEmbed } = require('discord.js');
const { test } = require('../flowalgo');

module.exports = {
  command: 't',
  aliases: ['t'],
  dm: false,
  permissions: (member) => {
    return true;
  },
  async execute(bot, msg, args) {
    test();
  }
};
