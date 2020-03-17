//VanillaBot Help Command List

var cl = require('./cmd_cmds.js');

const botTitle        = "VanillaBot";
const botAuthor       = "The Ice Cream Team";
const botDesc         = "Welcome to the Ice Cream Team's **Official** bot service!";
const botColor        = 16776656;
const botIconUrl      = "https://cdn.discordapp.com/app-icons/686039981260931095/8757d287833ef19147c73844535691dd.png";

function spaceStr(str, spacesBefore, spacesTotal) {
    var   i;
    var   newStr   = "";
    const endIndex = spacesBefore+str.length;
    for (i=0; i<spacesTotal; i++) {
        if (i>=spacesBefore && i<endIndex) {
            newStr += str[i-spacesBefore];
        } else {
            newStr += " ";
        }
    }
    return newStr;
}
function generateHelp(cmds, title, author, desc, color, iconUrl, prevEmb=undefined, prevCmd="", depth=0) {
    var   i;
    var   emb;
    const fullCmd   = prevCmd + ' ' + cmds.cmd['cmd'];
    const newDepth  = depth+1;

    // If at beginning, configure header information in the
    // embed object, else use the prevEmb.
    if (depth==0) {
        emb = {
            color:       color,
            title:       title,
            author:      { name: author, },
            description: desc,
            thumbnail:   { url:  iconUrl, },
            fields:      [ { name: "**[Level 1] Command:**", value: "** **" }],
        };
    } else {
        emb = prevEmb;
    }

    // Add command and description.
    emb.fields.push( {
        name:  prevCmd + "**" + cmds.cmd['cmd'] + "** " + ((depth==0 || depth==1) && cmds.next !== undefined ? "{command} ": ""),
        value: cmds.cmd['desc'],
    } );

    // Add second header.
    if (depth==0) {
        emb.fields.push( {
            name:  "**[Level 2] Commands:**",
            value: "** **",
        } );
    }

    // Add next level of commands.
    if (cmds.next !== undefined)
        for (i = 0; i<cmds.next.length; i++)
            generateHelp(cmds.next[i], undefined, undefined, undefined, undefined, undefined, emb, prevCmd + ' ' + cmds.cmd['cmd'] + ' ', newDepth);

    return emb;
}

module.exports = {
	name: 'helpMenu',
	description: cl.c.cmdHelp.desc,
  execute(msg, args){
      msg.channel.send({
          embed: generateHelp(cl.cl, botTitle, botAuthor, botDesc, botColor, botIconUrl)
      });
  }
};