const Discord = require('discord.js');
//const token = 'Njg2MDM5OTgxMjYwOTMxMDk1.XmRjdg.faMRgyKA6uIno3DAzjBwVSmKt_E'
const client = new Discord.Client();
var readline = require('readline');
var token;

//so we can take in inputs using readline()
var tokenInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//unless the login step is done, do not try and connect to the discord client using an invalid token
let login;

tokenInput.question("Please provide us with a valid token value:", function(token) {
    client.login(token);
    login = true;
    if (login == true){

        //ask to tell a johnvinder joke
        client.on('message', (msg) => {
            if (msg.content === '!jokevinder'){
                msg.channel.send('my name is jeff');
            }
        })

        //tells us if bot is connected after client is ready
        client.on('ready', () => {
            console.log('Bot is now connected');
        });
    };
});
