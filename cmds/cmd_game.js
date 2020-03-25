//VanillaBot's Game Command, various gaming implementations here.

var cl = require('./cmd_cmds.js');

module.exports = {
	name: 'gameSelect',
	description: cl.c.cmdGame.desc,
    execute(msg, args){
        switch(args[0])
        {
            case cl.c.cmdGamePict.cmd:
                msg.channel.send(
                    {
                    embed: {
                        color: 3447003,
                        title: 'Pictionary (Skribbl.io Link)',
                        url: 'https://skribbl.io/',
                    }
                })
                break;
            case cl.c.cmdGameJack.cmd:
                msg.channel.send(
                    {
                    embed: {
                        color: 3447003,
                        title: 'Jackbox.tv',
                        url: 'https://jackbox.tv/',
                    }
                })
                break;
            default:
                msg.channel.send(" :icecream: The **game** command you used was incorrect, try using **!vb help** for info about the commands! :icecream: ")
                break;
        }
    }
};