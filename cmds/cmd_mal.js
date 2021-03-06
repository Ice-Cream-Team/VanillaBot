//VanillaBot MyAnimeList Command, search MAL's data and retrieve it using a custom webscrapper.

var cl = require('./cmd_cmds.js');

const {getInfoFromName} = require('myanimelists');
module.exports = {
	name: cl.c.cmdMal.cmd,
	description: cl.c.cmdMal.desc,
    execute(msg, args){
        if (args[0] === cl.c.cmdMalAnime.cmd){
            let animeName;
            msg.channel.send("Searching MAL. . .  ");
            animeName = msg.content.slice(14).split(' ');
            let nameo = animeName.join(" ");
            console.log(nameo);
            getInfoFromName(nameo)
            .then(result => msg.channel.send(
                {
                embed: {
                    color: 3447003,
                    title: result.englishTitle + ' / ' + result.japaneseTitle,
                    url: result.url,
                    fields: [{
                        name: "Synopsis",
                        value: result.synopsis,
                    }, {
                        name: "Audience Rating:",
                        value: result.score,
                    }, {
                        name: "Episodes",
                        value: result.episodes,
                    }, {
                        name: "Rating",
                        value: result.rating,
                    }, {
                        name: "Aired",
                        value: result.aired,
                    }, {
                        name: "Popularity",
                        value: result.popularity,
                    }],
                }
            }))
            .catch(error => msg.channel.send({
                embed: {
                    color: 10038562,
                    description: "The anime you searched for doesn't exist, or MAL's backend is too slow."
                }
            }));
        }
        if (args[0] === cl.c.cmdMalUser.cmd){
            let userName = msg.content.slice(13).split(' ');
            let nameo = userName.join("");
            let discordMSG = 'https://myanimelist.net/profile/' + nameo;
            msg.channel.send(discordMSG);
        }
    }
};