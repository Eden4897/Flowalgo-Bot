const { MessageEmbed } = require("discord.js");
const file = new (require('../util/file'))('guilds.json');

module.exports = {
    command: 'setping',
    aliases: ['sp'],
    dm: false,
    permissions: (member) => {
        return member.hasPermission('MANAGE_GUILD');
    },
	async execute(bot, msg, args) {
        const guilds = file.read();

        if(!guilds.some(g => g.id == msg.guild.id)){
            guilds.push({
                id: msg.guild.id,
                flow: null,
                unusual: null,
                golden: null,
                darkprint: null,
                equity: null,
                greenequity: null,
                alphaai: null,
                flow_ping: '',
                unusual_ping: '',
                golden_ping: '',
                darkprint_ping: '',
                equity_ping: '',
                greenequity_ping: '',
                alphaai_ping: '',
            });
        }

        if(args[0] != 'flow' && args[0] != 'unusual' && args[0] != 'golden' && args[0] != 'darkprint' && args[0] != 'equity' && args[0] != 'greenequity' && args[0] != 'alphaai') return;
        if(!msg.mentions.roles.first() && !msg.mentions.everyone && args[1]) return;

        const guild = guilds.find(g => g.id == msg.guild.id);

        guild[`${args[0]}_ping`] = msg.mentions.roles.first() ? `${msg.mentions.roles.first()}` : msg.mentions.everyone ? '@everyone' : '';

        file.write(guilds);

        await msg.channel.send(`Successfully configured the bot to ping ${msg.mentions.roles.first() ? `${msg.mentions.roles.first()}` : msg.mentions.everyone ? '@everyone' : 'no one'} during ${args[0]} notifs.`);
	},
}