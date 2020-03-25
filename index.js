const Discord = require('discord.js');
const commander = require('commander');
var fs = require('fs')
var readline = require('readline');
var cl = require('./cmds/cmd_cmds.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

//cmd files
const cmdIndex = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of cmdIndex) {
    const command = require(`./cmds/${file}`);
    client.commands.set(command.name, command);
}
//for displaying the accessable commands in the folder
console.log(client.commands);
var token;

// Parse the application's switches.
commander
    .version('0.0.0', '-v --version')
    .usage('[OPTIONS]...')
    .option('-t, --token <token>',              'Specify the token directly.')
    .option('-tf, --tokenfile <tokenfile>',     'Filename of the file that contains the token.',                'tokenfile')
    .option('-pdbf, --polldbfile <polldbfile>', 'Filename of the file that contains the poll sqlite database.', 'poll.db')
    .option('-pf, --prefix <prefix>',           'Specify the prefix of the bot.',                               '!vb')        
    .parse(process.argv);

// Acquire token.
{
    token = commander.token
    if (token === undefined)
        token = fs.readFileSync(commander.tokenfile, 'utf8');
    console.log(token);
}

// Create or load databases.
{
    let cmd_poll = require('./cmds/cmd_poll.js');
    cmd_poll.initPollDb(commander.polldbfile);
}

// Configure bot prefix.
{
    let cmd_cmds = require('./cmds/cmd_cmds.js');
    cmd_cmds.setPrefix(commander.prefix);
}

//unless the login step is done, do not try and connect to the discord client using an invalid token
client.login(token);
client.on('message', (msg) => {
    let vanillaPrefix = cl.c.cmdPrefix.cmd+' ';
    //if the msg doesnt have the prefix starting it, or is written by a bot, RETURN to once thou came
    if (!msg.content.startsWith(vanillaPrefix) || msg.author.bot) 
        return;
    const args = msg.content.slice(vanillaPrefix.length).split(' ');
    const command = args.shift().toLowerCase();
    
    if (client.commands.has(command)){
        client.commands.get(command).execute(msg, args);
    }
    else {
        if (command === cl.c.cmdKill.cmd) 
        {
            msg.channel.send(':skull_crossbones: ...VanillaBot now shutting down... :skull_crossbones:').then(m => { 
                cmd_poll = require('./cmds/cmd_poll.js');
                cmd_poll.closePollDb();
                client.destroy();
            });
        }
        else
        {
            msg.channel.send(" :icecream: The command you used is incorrect, try using **!vb help** for info about the commands! :icecream: ");
        }
    }

});
//tells us if bot is connected after client is ready
client.on('ready', () => {
    console.log('Bot is now connected');
    client.user.setActivity('in TEST', { type: 'LISTENING' });
});
