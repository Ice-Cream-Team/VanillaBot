//VanillaBot's Game Command, various gaming implementations here.

var cl = require('./cmd_cmds.js');

module.exports = {
	name: 'gameSelect',
	description: cl.c.cmdGame.desc,
    execute(msg, args){
        if (args[0] === cl.c.cmdGamePict.cmd) {
            msg.channel.send(
                {
                embed: {
                    color: 3447003,
                    title: 'Pictionary (Skribbl.io Link)',
                    url: 'https://skribbl.io/',
                }
            })
        }
        if (args[0] === cl.c.cmdGameJack.cmd) {
            msg.channel.send(
                {
                embed: {
                    color: 3447003,
                    title: 'Jackbox.tv',
                    url: 'https://jackbox.tv/',
                }
            })
        }
    }
};