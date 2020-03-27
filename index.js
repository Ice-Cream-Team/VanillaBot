const Discord = require('discord.js');
const commander = require('commander');
var fs = require('fs')
var readline = require('readline');
var cl = require('./cmds/cmd_cmds.js');
var co = require('./cmds/cmd_owner.js');
var cp = require('./cmds/cmd_poll.js');

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
    .option('-t, --token <token>',                'Specify the token directly.')
    .option('-tf, --tokenfile <tokenfile>',       'Filename of the file that contains the token.',                 'tokenfile')
    .option('-pdbf, --polldbfile <polldbfile>',   'Filename of the file that contains the poll sqlite database.',  'poll.db')
    .option('-odbf, --ownerdbfile <ownerdbfile>', 'Filename of the file that contains the owner sqlite database.', 'owner.db')
    .option('-pf, --prefix <prefix>',             'Specify the prefix of the bot.',                                '!vb')
    .option('-ar, --adminrole <adminrole>',       'Specify the role associated with admins.',                      'dev')
    .option('-io, --ignoreowner',                 'Ignore owner-level permissions.')
    .parse(process.argv);

// Acquire token.
{
    token = commander.token
    if (token === undefined)
        token = fs.readFileSync(commander.tokenfile, 'utf8');
    console.log(token);
}

// Configure bot prefix.
{
    let cmd_cmds = require('./cmds/cmd_cmds.js');
    cmd_cmds.setPrefix(commander.prefix);
}

// Create or load databases.
{
    cp.initPollDb(commander.polldbfile);
    co.initDb(commander.ownerdbfile);
}

/**
 * Returns a list of the roles associated with the user who sent the specified message.
 * @param msg Discord.Message that represents a message received.
 * @return An array of strings, where each string is the associated role with user.
 */
function getRoles(msg) {
    let roleList = [];
    let iter     = msg.member.roles.cache.values();
    res = iter.next();
    while (!res.done) {
        roleList.push(res.value.name);
        res = iter.next();
    }
    return roleList;
}

//unless the login step is done, do not try and connect to the discord client using an invalid token
client.login(token);
client.on('message', (msg) => {    
    co.ownerPrivCmdGet(msg.content).then((priv)=>{     
        return {priv:priv, msg:msg};
    }).then((obj)=>{
        let msg           = obj.msg;
        let cmdPriv       = obj.priv;
        let userPriv      = (getRoles(msg).includes(commander.adminrole))?co.PrivState.admin:co.PrivState.user;
        let vanillaPrefix = cl.c.cmdPrefix.cmd+' ';
        
        // If the msg doesnt have the prefix starting it, or is written by a bot, RETURN to once thou came
        if (!msg.content.startsWith(vanillaPrefix) || msg.author.bot) 
            return;
          
        // Check for permissions.
        if ((userPriv<cmdPriv) && !msg.member.permissions.has("ADMINISTRATOR") && !commander.ignoreowner) {
            msg.channel.send("You don't have permissions...");
            return;
        }
        const args = msg.content.slice(vanillaPrefix.length).split(' ').filter(arg=>arg!="");    
        const command = args.shift().toLowerCase();
        
        if (client.commands.has(command)){
            client.commands.get(command).execute(msg, args);
        }
        else {
            if (command === cl.c.cmdKill.cmd) 
            {
                msg.channel.send(':skull_crossbones: ...VanillaBot now shutting down... :skull_crossbones:').then(m => { 
                    cp.closePollDb();
                    co.closeDb();
                    client.destroy();
                });
            }
            else
            {
                msg.channel.send(" :icecream: The command you used is incorrect, try using **!vb help** for info about the commands! :icecream: ");
            }
        }
    });
});
//tells us if bot is connected after client is ready
client.on('ready', () => {
    console.log('Bot is now connected');
    client.user.setActivity('in TEST', { type: 'LISTENING' });
});
