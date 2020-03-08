const Discord = require('discord.js');
const token = 'Njg2MDM5OTgxMjYwOTMxMDk1.XmRjdg.faMRgyKA6uIno3DAzjBwVSmKt_E'

const client = new Discord.Client();

client.on('message', (msg) => {
    if (msg.content === 'Is johnvinder hot'){
        msg.channel.send('YES');
    }
})

client.on('ready', () => {
    console.log('Bot is now connected');

    //client.channels.find(y => y.name === "computers").send('yo');
});

client.login(token);