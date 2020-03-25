function BotCmd(cmd, desc) {
    this.cmd  = cmd;
    this.desc = desc;
}
var c = {
    cmdPrefix       : new BotCmd('!vb',            'Prefix needed for interacting with the bot.'),
    cmdServer       :   new BotCmd('server',       'Get information on one of Will\'s servers.'),
    cmdSvrMinecraft :     new BotCmd('mc',         'Specifies the minecraft server.'),
    cmdSvr7D2D      :     new BotCmd('7days',      'Specifies the 7 Days 2 Die.'),
    cmdSvrList      :     new BotCmd('list',       'Displays list of all of the availible servers'),
    cmdGame         :   new BotCmd('game',         'Returns the link to the game specified.'),
    cmdGamePict     :     new BotCmd('pictionary', 'Returns the link to pictionary.'),
    cmdGameJack     :     new BotCmd('jackbox',    'Returns the link to jackbox.'),
    cmdMal          :   new BotCmd('mal',          'Get information from MyAnimeList.'),
    cmdMalAnime     :     new BotCmd('anime',      'Find information on an anime. The next argument is the anime.'),
    cmdMalUser      :     new BotCmd('user',       'Find information on an user. The next argument is the user.'),
    cmdPoll         :   new BotCmd('poll',         'Perform operations related to the management of polls.'),
    cmdPollCreate   :     new BotCmd('create',     'Creates a new poll. Next argument is the name of the poll. Must be single word.'),
    cmdPollAdd      :     new BotCmd('add',        'Adds a new option to the specified poll. Next argument is poll, and the one after is the option. Both must be single words.'),
    cmdPollVote     :     new BotCmd('vote',       'Performs either a vote (or over-writes a vote). Next argument is the poll, and the one after is the option. Both must be single words.'),
    cmdPollRetract  :     new BotCmd('retract',    'Removes ones vote. Next argument is the poll.'),
    cmdPollView     :     new BotCmd('view',       'View the results of a specified poll or list all the polls. Next argument is the poll. If no poll is specified, the available polls are shown.'),
    cmdPollRemove   :     new BotCmd('remove',     'Remove specified poll. Next argument is the poll.'),
    cmdPollReset    :     new BotCmd('reset',      'Clears all the polls.'),    
    cmdHelp         :   new BotCmd('help',         'Display information on how to utilize bot.'),
    cmdKill          :   new BotCmd('kill',         'Shuts down the VanillaBot.')
};
const cl = {
    cmd: c.cmdPrefix,
    next: [
        {
            cmd: c.cmdServer,
            next: [
                {cmd: c.cmdSvrMinecraft, next: undefined},
                {cmd: c.cmdSvr7D2D,      next: undefined},
                {cmd: c.cmdSvrList,      next: undefined}
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
          cmd: c.cmdPoll,
          next: [
            {cmd: c.cmdPollCreate,  next: undefined},
            {cmd: c.cmdPollAdd,     next: undefined},
            {cmd: c.cmdPollVote,    next: undefined},
            {cmd: c.cmdPollRetract, next: undefined},
            {cmd: c.cmdPollView,    next: undefined},
            {cmd: c.cmdPollRemove,  next: undefined},
            {cmd: c.cmdPollReset,   next: undefined}
          ]
        },        
        {
            cmd: c.cmdHelp,
            next: undefined
        },
        {
            cmd: c.cmdKill,
            next: undefined
        }
    ]
};


module.exports = {c:c, cl:cl};