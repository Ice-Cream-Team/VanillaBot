//VanillaBot's Game Command, various gaming implementations here.

module.exports = {
	name: 'gameSelect',
	description: 'Searches game list links',
    execute(msg, args){
        if (args[0] === 'pictionary') {
            msg.channel.send(
                {
                embed: {
                    color: 3447003,
                    title: 'Pictionary (Skribbl.io Link)',
                    url: 'https://skribbl.io/',
                }
            })
        }
        if (args[0] === 'jackbox') {
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