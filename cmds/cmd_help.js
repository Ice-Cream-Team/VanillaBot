//VanillaBot Help Command List

module.exports = {
	name: 'helpMenu',
	description: 'Provides a command help menu for the user',
    execute(msg, args){
        msg.channel.send('~HELP~');
    }
};