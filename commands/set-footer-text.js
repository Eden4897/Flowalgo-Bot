const { MessageEmbed } = require('discord.js');
const file = new (require('../util/file'))('guilds.json');

module.exports = {
    command: 'setfootertext',
    aliases: ['sft'],
    dm: false,
    permissions: (member) => {
        return member.hasPermission('MANAGE_GUILD');
    },
    async execute(bot, msg, args) {
        const guilds = file.read();

        if (!guilds.some((g) => g.id == msg.guild.id)) {
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
                flow_chart: false,
                unusual_chart: false,
                golden_chart: false,
                alphaai_chart: false,
                flow_chart_duration: 'i5',
                unusual_chart_duration: 'i5',
                golden_chart_duration: 'i5',
                alphaai_chart_duration: 'i5',
                footer_text: '© R2R Analytics, 2021 ✦ For educational purposes only',
                footer_icon: 'https://media.discordapp.net/attachments/891831484770570250/892101960017260564/Hand_only1_2.png',
            });
        }

        const guild = guilds.find((g) => g.id == msg.guild.id);

        guild.footer_text = args.join(' ');

        file.write(guilds);

        await msg.channel.send(
            `Successfully configured the footer text for alerts in this server`
        );
    }
};
