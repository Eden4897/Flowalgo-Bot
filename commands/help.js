const { MessageEmbed } = require("discord.js");

module.exports = {
    command: 'help',
    dm: false,
    permissions: (member) => {
        return true;
    },
	async execute(bot, msg, args) {
        const embed = new MessageEmbed()
        .setDescription(`Tip(To get the best quality click on image, and open orginal) 
.s For snapshot of bullish/bearish flow for the trading day
.sf Will pull up a full list of .s (open orignal to see clearly)
.z (Stock) For a zoomed in real time flow (to make it easier to see)
.f (Stock) For real time flow of searched stock
.h (Stock) For the historical flow of a stock (use if .z or .f do not pull up flow)
.d (Stock) For darkpool of searched stock
.m for flowalgo home page (for users to see the darkpools, flow, and alpha ai in one go)
.l (Stock) for levels of searched stock
.r (stock) for radar of searched stock
.e will pull up a screenshot of all equity and darkpools for that day 
.oi will open a list of Top open interest change (Use open orginal to see clearly)`);

        await msg.channel.send(embed);
	},
}