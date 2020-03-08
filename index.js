const Discord = require('discord.js');
const client = new Discord.Client();
var readline = require('readline');
const Gamedig = require('gamedig');
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

        //get server info for fireless's server
        client.on('message', (msg) => {
            if (msg.content === '!mc'){
                msg.channel.send("Getting fireless's server info....");
                Gamedig.query({
                    type: 'minecraft',
                    host: 'mc.datafire.dev', //or whatever server link it is..
                }).then((state) => {
                    msg.channel.send('Name: ' + state.name);
                    msg.channel.send('TotalPlayers: ' + state.players.length);
                    msg.channel.send('Max Players: ' + state.maxplayers);
                }).catch((error) => {
                    msg.channel.send("Server is offline");
                });
            }
        })


        //search an anime on MAL
        client.on('message', (msg) => {
            let searchPrefix = '!malanime';
            if (msg.content.startsWith(searchPrefix)){
                let animeName;
                msg.channel.send("Searching MAL. . .  ");
                animeName = msg.content.slice(searchPrefix.length).split(' ');
                var nameo = animeName.join("+")
                console.log(animeName);
                msg.channel.send('https://myanimelist.net/anime.php?q=' + nameo);
            }
        })

        //search a user on MAL
        client.on('message', (msg) => {
            let searchPrefix = '!maluser';
            if (msg.content.startsWith(searchPrefix)){
                let userName;
                msg.channel.send("Searching MAL. . .  ");
                userName = msg.content.slice(searchPrefix.length).split(' ');
                var nameo = userName.join("")
                console.log(userName);
                msg.channel.send('https://myanimelist.net/profile/' + nameo);
            }
        })

        //tells us if bot is connected after client is ready
        client.on('ready', () => {
            console.log('Bot is now connected');
            client.user.setActivity('!help for commandlist', { type: 'LISTENING' });
        });
    };
});
