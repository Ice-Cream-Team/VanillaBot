const Discord = require('discord.js');
const commander = require('commander');
var fs = require('fs')
var readline = require('readline');
const Gamedig = require('gamedig');
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
    .option('-t, --token <token>', 'Specify the token directly.')
    .option('-tf, --tokenfile <tokenfile>', 'Filename of the file that contains the token.', 'tokenfile')
    .parse(process.argv);

// Acquire token.
{
    token = commander.token
    if (token === undefined)
        token = fs.readFileSync(commander.tokenfile, 'utf8');
    console.log(token);
}

//unless the login step is done, do not try and connect to the discord client using an invalid token
client.login(token);
client.on('message', (msg) => {
    let vanillaPrefix = cl.c.cmdPrefix.cmd+' ';
    //if the msg doesnt have the prefix starting it, or is written by a bot, RETURN to once thou came
    if (!msg.content.startsWith(vanillaPrefix) || msg.author.bot) return;
        const args = msg.content.slice(vanillaPrefix.length).split(' ');
        const command = args.shift().toLowerCase();
        if (command === cl.c.cmdServer.cmd){
            if (args[0] === cl.c.cmdSvrMinecraft.cmd){
                msg.channel.send("Getting fireless's server info....");
                Gamedig.query({
                    type: 'minecraft',
                    host: 'mc.datafire.dev', //or whatever server link it is..
                }).then((state) => {
                    msg.channel.send({
                        embed: {
                            color: 3066993,
                            author: {
                                name: "Minecraft",
                                icon_url: "http://www.rw-designer.com/icon-image/5547-64x64x4.png",
                            },
                            title: state.name,
                            description: "Hosted by the Ice Cream Team.",
                            fields: [{
                                name: "Server Info",
                                value: (`**${state.connect}**`),
                            }, {
                                name: "Players",
                                value: (`**${state.players.length}**`),
                            }, {
                                name: "Max Players",
                                value: (`**${state.maxplayers}**`),
                            }],
                            footer: {
                                icon_url: client.user.avatarURL,
                            }
                        }
                    });
                    }).catch((error) => {
                        msg.channel.send({
                            embed: {
                                color: 10038562,
                                description: "Server is **offline**."}
                            });
                    });
            } else if (args[0] === cl.c.cmdSvr7D2D.cmd) {
               msg.channel.send("Getting fireless's server info....");
                Gamedig.query({
                    type: '7d2d',
                    host: '7days.datafire.dev',
                    port: '26900',
                }).then((state) => {
                    msg.channel.send({
                        embed: {
                            color: 3066993,
                            author: {
                                name: "7days",
                                icon_url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/46b63d3c-ae67-464c-9a37-670829b2a157/d9yftdm-7deaf276-864d-4017-a3d8-ab45d39ce8f6.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzQ2YjYzZDNjLWFlNjctNDY0Yy05YTM3LTY3MDgyOWIyYTE1N1wvZDl5ZnRkbS03ZGVhZjI3Ni04NjRkLTQwMTctYTNkOC1hYjQ1ZDM5Y2U4ZjYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.RBMbE0FZR08HwHjBNZmf2kHJSu5f01UZmsmf3C0P6P0",
                            },
                            title: "Strawberry Ice Cream",
                            description: "Hosted by the Ice Cream Team.",
                            fields: [{
                                name: "Server Info",
                                value: (`**${state.connect}**`),
                            }, {
                                name: "Players",
                                value: (`**${state.players.length}**`),
                            }, {
                                name: "Max Players",
                                value: (`**${state.maxplayers}**`),
                            }],
                            footer: {
                                icon_url: client.user.avatarURL,
                            }
                        }
                    });
                }).catch((error) => {
                    msg.channel.send({
                        embed: {
                            color: 10038562,
                            description: "Server is **offline**."
                        }
                    });
                });
            } else {
                msg.channel.send({
                    embed: {
                        color: 3447003,
                        author: {
                            name: "Ice Cream Servers",
                            icon_url: "https://www.siriusdecisions.com/-/media/siriusdecisions/images/blog-images/2014/july/multiple-flavors.ashx?h=267&w=400&hash=4F34EB7E696FE7B84C5762AB30DDF636",
                        },
                        title: "Server Help",
                        description: "View server info with **!vb** server command",
                        fields: [{
                            name: "Servers",
                            value: "Minecraft\n7Days to die",
                        }, {
                            name: "Commands",
                            value: "mc\n7days",
                        }],
                        footer: {
                            icon_url: client.user.avatarURL,
                        }
                    }
                });
            }
        }
        //for pictionary sessions, quick link
        else if (command === cl.c.cmdGame.cmd){
            client.commands.get('gameSelect').execute(msg, args);
            //search MyAnimeList for a user profile, or a general anime search
        } else if (command === cl.c.cmdMal.cmd){
            client.commands.get('searchMAL').execute(msg, args);
        // Print out the help information.
        } else if (command === cl.c.cmdHelp.cmd) {
            client.commands.get('helpMenu').execute(msg, args);
        // Kill the bot.
        } else if (command === cl.c.cmdKys.cmd) {
            msg.channel.send(':skull_crossbones: ...VanillaBot now shutting down... :skull_crossbones:').then(m => {
                client.destroy();
            });
        }
});
//tells us if bot is connected after client is ready
client.on('ready', () => {
    console.log('Bot is now connected');
    client.user.setActivity('in TEST', { type: 'LISTENING' });
});
