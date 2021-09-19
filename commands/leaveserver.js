module.exports = {
  command: 'leaveserver',
  dm: false,
  permissions: (member) => {
    return member.id === '780481685975990313';
  },
  async execute(bot, msg, args) {
    if (msg.author.id !== '780481685975990313') return;
    let servers = bot.guilds.cache.array();
    let strings = [
      '      Name'.padEnd(30, ' ') + '      Owner'.padEnd(20, ' ') + '\n'
    ];
    let index = 0;
    for (let guild of servers) {
      index++;
      let newString = `${(index + '').padEnd(4, ' ')}  ${guild.name.padEnd(
        30,
        ' '
      )}${(await bot.users.fetch(guild.ownerID)).tag}\n`;
      if (strings[strings.length - 1].length + newString.length >= 2000)
        strings.push('');
      strings[strings.length - 1] += newString;
    }
    strings.forEach((s) => msg.channel.send(`\`\`\`${s}\`\`\``));
    msg.channel
      .awaitMessages((m) => m.author.id == msg.author.id, {
        time: 30000,
        max: 1
      })
      .then((collected) => {
        const chosenIndex = parseInt(collected.first().content);
        if (!servers[chosenIndex - 1])
          return msg.reply('no server with that index.');
        msg.reply(`Left server \`${servers[chosenIndex - 1].name}\``);
        servers[chosenIndex - 1].leave();
      });
  }
};
