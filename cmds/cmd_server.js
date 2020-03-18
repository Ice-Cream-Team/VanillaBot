//VanillaBot Server Command, lists game servers supported along with information correlating to them.

module.exports = {
	name: 'serverSearch',
	description: 'Searches for game servers provided',
    execute(msg, args){
        msg.channel.send('~SEARCHING SERVER~');
    }
};