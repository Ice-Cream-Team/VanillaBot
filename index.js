const Discord = require('discord.js');
const client = new Discord.Client();
const commander = require('commander');
var fs = require('fs')
var readline = require('readline');
const Gamedig = require('gamedig');
var token;

// Parse the application's switches.
commander
  .version('0.0.0', '-v --version')
  .usage('[OPTIONS]...')
  .option('-t, --token <token>',          'Specify the token directly.')
  .option('-tf, --tokenfile <tokenfile>', 'Filename of the file that contains the token.', 'tokenfile')
  .parse(process.argv);
  
// Acquire token.
{
    token = commander.token
    if (token===undefined)
        token = fs.readFileSync(commander.tokenfile, 'utf8'); 
        console.log(token);
}

//unless the login step is done, do not try and connect to the discord client using an invalid token
let login;
client.login(token);
login = true;
if (login == true){
    client.on('message', (msg) => {
        let vanillaPrefix = '!vb ';
        //if the msg doesnt have the prefix starting it, or is written by a bot, RETURN to once thou came
        if (!msg.content.startsWith(vanillaPrefix) || msg.author.bot) return;
            const args = msg.content.slice(vanillaPrefix.length).split(' ');
            const command = args.shift().toLowerCase();
            if (command === 'server'){
                if (args[0] === 'mc'){
                    msg.channel.send("Getting fireless's server info....");
                    Gamedig.query({
                    type: 'minecraft',
                    host: 'mc.datafire.dev', //or whatever server link it is..
                    }).then((state) => {
                        msg.channel.send('Name: ' + state.name);
                        msg.channel.send('Total Players: ' + state.players.length);
                        msg.channel.send('Max Players: ' + state.maxplayers);
                    }).catch((error) => {
                        msg.channel.send("Server is offline");
                    });
                }
                else if (args[0] === '7days'){
                msg.channel.send("Getting fireless's server info....");
                Gamedig.query({
                        type: '7d2d',
                        host: '7days.datafire.dev',
                        }).then((state) => {
                        msg.channel.send('Name: ' + state.name);
                        msg.channel.send('Total Players: ' + state.players.length);
                        msg.channel.send('Max Players: ' + state.maxplayers);
                        }).catch((error) => {
                        msg.channel.send("Server is offline");
                        });
                    }
                else {
                    msg.channel.send(`You didn't provide a valid argument, check this list below!`);
                    msg.channel.send(`Serverhoster: Game; command`);
                    msg.channel.send(`fireless#0161: Minecraft; mc`);
                    msg.channel.send(`fireless#0161: 7 Days 2 Die; 7days`);
                }
            }
            //for pictionary sessions, quick link
            else if (command === 'pictionary'){
                msg.channel.send('https://skribbl.io/');
            }
            //search MyAnimeList for a user profile, or a general anime search
            else if (command === 'mal'){{
                    if (args[0] === 'anime'){
                        let animeName;
                        msg.channel.send("Searching MAL. . .  ");
                        animeName = msg.content.slice(14).split(' ');
                        let nameo = animeName.join("+")
                        msg.channel.send('https://myanimelist.net/anime.php?q=' + nameo);
                    }
                    if (args[0] === 'user'){
                        let userName;
                        msg.channel.send("Searching MAL. . .  ");
                        userName = msg.content.slice(13).split(' ');
                        var nameo = userName.join("");
                        msg.channel.send('https://myanimelist.net/profile/' + nameo);
                    }
                }
            }
    });
        //tells us if bot is connected after client is ready
    client.on('ready', () => {
        console.log('Bot is now connected');
        client.user.setActivity('in TEST', { type: 'LISTENING' });
    });

};