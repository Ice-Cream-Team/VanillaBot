//VanillaBot Server Command, lists game servers supported along with information correlating to them.

const Gamedig = require('gamedig');

var cl = require('./cmd_cmds.js');

module.exports = {
	name: 'serverSearch',
	description: 'Searches for game servers provided',
    execute(msg, args){
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
                        }]
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
                        }]
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
                    }]
                }
            });
        }
    }
};