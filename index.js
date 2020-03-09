const Discord = require('discord.js');
const commander = require('commander');
var fs = require('fs')
var readline = require('readline');
const Gamedig = require('gamedig');
const {searchResultsWhereNameAndType, getInfoFromName} = require('myanimelists');

const client = new Discord.Client();

var token;

// Define the commands.
function BotCmd(cmd, desc) {
    this.cmd  = cmd;
    this.desc = desc;
}
const cmdSpacesSkip   = 5;
const cmdHelpHeader   = "Hello world! This is VanillaBot! This is the The Ice Cream Team's first OFFICIAL SERVER (Get hyped BOOIIZZ) BOT! All interactions with this bot" +
                        " begin with !vb and are followed by one or more arguments separated by spaces. For instance, to get information on the Minecraft server you" +
                        " would type the following...\n\n!vb server mv\n\nBelow are the available arguments. Enjoy!\n";
const cmdPrefix       = new BotCmd('!vb',          'Prefix needed for interacting with the bot.');
const cmdServer       =   new BotCmd('server',     'Get information on one of Will\'s servers.');
const cmdSvrMinecraft =     new BotCmd('mc',       'Specifies the minecraft server.');
const cmdSvr7D2D      =     new BotCmd('7days',    'Specifies the 7 Days 2 Die.');
const cmdPict         =   new BotCmd('pictionary', 'Returns the link to pictionary.');
const cmdMal          =   new BotCmd('mal',        'Get information from MyAnimeList.');
const cmdMalAnime     =     new BotCmd('anime',    'Find information on an anime. The next argument is the anime.');
const cmdMalUser      =     new BotCmd('user',     'Find information on an user. The next argument is the user.');
const cmdHelp         =   new BotCmd('help',       'Display information on how to utilize bot.');
const cmdList = {
  cmd: cmdPrefix,
  next: [
    { 
      cmd: cmdServer,
      next: [ 
        {cmd: cmdSvrMinecraft, next: undefined},
        {cmd: cmdSvr7D2D,      next: undefined}
      ]
    },
    {
      cmd: cmdPict, 
      next: undefined
    },
    {
      cmd: cmdMal,
      next: [ 
        {cmd: cmdMalAnime,     next: undefined},
        {cmd: cmdMalUser,      next: undefined}
      ]
    },
    {
      cmd: cmdHelp,
      next: undefined
    }
  ]
};
function spaceStr(str, spacesBefore, spacesTotal) {
    var   i;
    var   newStr   = "";
    const endIndex = spacesBefore+str.length;
    for (i=0; i<spacesTotal; i++) {
        if (i>=spacesBefore && i<endIndex) {
            newStr += str[i-spacesBefore];
        } else {
            newStr += " ";
        }
    }
    return newStr;
}
function generateHelp(cmds, header, depth=0) {
    var   i;
    var   str       = "";
    const newDepth  = depth+1;
    const spaceSkip = cmdSpacesSkip*depth;
    
    if (header !== undefined)
        str += header + '\n';   
    str += spaceStr(cmds.cmd['cmd'], spaceSkip, spaceSkip+cmds.cmd['cmd'].length) + " : " + cmds.cmd['desc'] + '\n';
    
    if (cmds.next !== undefined)
        for (i = 0; i<cmds.next.length; i++) 
            str += generateHelp(cmds.next[i], undefined, newDepth);
            
    return str;      
}

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
client.login(token);
client.on('message', (msg) => {
    let vanillaPrefix = cmdPrefix.cmd+' ';
    //if the msg doesnt have the prefix starting it, or is written by a bot, RETURN to once thou came
    if (!msg.content.startsWith(vanillaPrefix) || msg.author.bot) return;
        const args = msg.content.slice(vanillaPrefix.length).split(' ');
        const command = args.shift().toLowerCase();
        if (command === cmdServer.cmd){
            if (args[0] === cmdSvrMinecraft.cmd){
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
            else if (args[0] === cmdSvr7D2D.cmd){
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
            else 
            {
                msg.channel.send(`You didn't provide a valid argument, check this list below!`);
                msg.channel.send(`Serverhoster: Game; command`);
                msg.channel.send(`fireless#0161: Minecraft; mc`);
                msg.channel.send(`fireless#0161: 7 Days 2 Die; 7days`);
            }            
        }
        //for pictionary sessions, quick link
        else if (command === cmdPict.cmd){
            msg.channel.send('https://skribbl.io/');
        }
        //search MyAnimeList for a user profile, or a general anime search
        else if (command === cmdMal.cmd){{
                if (args[0] === cmdMalAnime.cmd){
                    let animeName;
                    msg.channel.send("Searching MAL. . .  ");
                    animeName = msg.content.slice(14).split(' ');
                    let nameo = animeName.join(" ");
                    getInfoFromName(nameo)
                    .then(result => msg.channel.send( ">>> " + `**Title:** ` + result.japaneseTitle + ` / ` + result.englishTitle + `\n**Episodes:** ` + result.episodes + `\n**Aired:** ` + result.aired + `\n**Airing Status:** ` + result.status + `\n**Audience Score:** ` + result.score + result.episodes + `\n**Type:** ` + result.type + `\n**Synopsis:** ` + result.synopsis + `\n**Link:** ` + result.url))
                    .catch(error => console.log(error));
                }
                if (args[0] === cmdMalUser.cmd){
                    let userName;
                    msg.channel.send("Searching MAL. . .  ");
                    userName = msg.content.slice(13).split(' ');
                    let nameo = userName.join("");
                    msg.channel.send('https://myanimelist.net/profile/' + nameo);
                }
            }
        }
        // Print out the help information.
        else if (command === cmdHelp.cmd) {
            msg.channel.send(generateHelp(cmdList, cmdHelpHeader));
        }
});
//tells us if bot is connected after client is ready
client.on('ready', () => {
    console.log('Bot is now connected');
    client.user.setActivity('in TEST', { type: 'LISTENING' });
});
