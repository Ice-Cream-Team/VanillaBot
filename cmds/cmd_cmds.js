function BotCmd(cmd, desc) {
    this.cmd  = cmd;
    this.desc = desc;
}
var c = {
    cmdPrefix       : new BotCmd('!vb',            'Prefix needed for interacting with the bot.'),
    cmdServer       :   new BotCmd('server',       'Get information on one of Will\'s servers.'),
    cmdSvrMinecraft :     new BotCmd('mc',         'Specifies the minecraft server.'),
    cmdSvr7D2D      :     new BotCmd('7days',      'Specifies the 7 Days 2 Die.'),
    cmdGame         :   new BotCmd('game',         'Returns the link to the game specified.'),
    cmdGamePict     :     new BotCmd('pictionary', 'Returns the link to pictionary.'),
    cmdGameJack     :     new BotCmd('jackbox',    'Returns the link to jackbox.'),
    cmdMal          :   new BotCmd('mal',          'Get information from MyAnimeList.'),
    cmdMalAnime     :     new BotCmd('anime',      'Find information on an anime. The next argument is the anime.'),
    cmdMalUser      :     new BotCmd('user',       'Find information on an user. The next argument is the user.'),
    cmdHelp         :   new BotCmd('help',         'Display information on how to utilize bot.'),
    cmdKys          :   new BotCmd('kill',         'Shuts down the VanillaBot.')
};
const cl = {
    cmd: c.cmdPrefix,
    next: [
        {
            cmd: c.cmdServer,
            next: [
                {cmd: c.cmdSvrMinecraft, next: undefined},
                {cmd: c.cmdSvr7D2D,      next: undefined}
            ]
        },
        {
            cmd: c.cmdGame,
            next: [
                {cmd: c.cmdGamePict,     next: undefined},
                {cmd: c.cmdGameJack,     next: undefined}
            ]
        },
        {
            cmd: c.cmdMal,
            next: [
                {cmd: c.cmdMalAnime,     next: undefined},
                {cmd: c.cmdMalUser,      next: undefined}
            ]
        },
        {
            cmd: c.cmdHelp,
            next: undefined
        },
        {
            cmd: c.cmdKys,
            next: undefined
        }
    ]
};


module.exports = {c:c, cl:cl};