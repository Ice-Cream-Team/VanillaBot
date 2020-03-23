var   cl      = require('./cmd_cmds.js');
var   sqlite3 = require('sqlite3');
const timeOut = 4000; // in milliseconds
var   pollDb;

const pollCreateTable = `CREATE TABLE IF NOT EXISTS pollTable(
                            ID   INTEGER PRIMARY KEY AUTOINCREMENT,
                            NAME TEXT    NOT NULL,
                            TYPE TEXT    NOT NULL,
                            ARG0 TEXT,
                            ARG1 TEXT)`;
                            
function pollCreate(pollDb, pollName, msg) {
    if (pollName === undefined) {
        msg.channel.send("Invalid use of command: Cannot create a poll with an undefined name");
        return;
    };
    msg.channel.send('Creating '+pollName+' poll...');
    pollDb.serialize(()=>{
        pollDb
        .run(pollCreateTable)
        .run(`BEGIN EXCLUSIVE TRANSACTION;`)
        .each(`SELECT NAME, TYPE FROM pollTable WHERE NAME=="${pollName}" AND TYPE=="poll"`,
        (err, row)=>{
            msg.channel.send(pollName+' poll already exists...');
        },
        (err, completed)=>{
            if (completed==0) {
                pollDb.run(`INSERT INTO pollTable (NAME, TYPE)
                            VALUES ("${pollName}", "poll")`);
            }
        })
        .run(`END TRANSACTION;`);
    });  
}  

function pollAdd(pollDb, pollName, optionName, msg) {
    if (optionName === undefined) {
        msg.channel.send('Invalid use of command: Cannot create undefined poll option');
        return;
    };
    msg.channel.send('Creating '+optionName+' option for '+pollName+' poll...');
    pollDb.serialize(()=>{
        pollDb
        .run(pollCreateTable)
        .run(`BEGIN EXCLUSIVE TRANSACTION;`)
        .each(`SELECT NAME, TYPE FROM pollTable WHERE NAME=="${pollName}" AND TYPE=="poll"`,
        (err, row)=>{
            msg.channel.send('Adding option...');
            pollDb
            .each(`SELECT NAME, TYPE FROM pollTable WHERE NAME=="${optionName}" AND TYPE=="option" AND ARG0=="${pollName}"`,
            (err, row)=>{
                msg.channel.send(optionName+' already exists as an option for '+pollName+' poll...');
            },
            (err, completed)=>{
                if (completed==0) {
                    pollDb.run(`INSERT INTO pollTable (NAME, TYPE, ARG0)
                                VALUES ("${optionName}", "option", "${pollName}")`);
                }
            });
        },
        (err, completed)=>{
            if (completed==0) {
                msg.channel.send('Could not find '+pollName+' poll...');
            }
        })
        .run(`END TRANSACTION;`);
    });  
}

function pollVote(pollDb, pollName, optionName, msg) {
    let userName    = msg.author.tag;
    msg.channel.send(userName+' user is voting for '+optionName+ ' option in '+pollName+'...');
    pollDb.serialize(()=>{
        pollDb
        .run(pollCreateTable)
        .run(`BEGIN EXCLUSIVE TRANSACTION;`)
        .run(`DELETE FROM pollTable WHERE NAME=="${msg.author.id}" AND TYPE=="vote" AND ARG0=="${pollName}"`)
        .get(`SELECT COUNT (*) FROM pollTable WHERE (NAME=="${pollName}" AND TYPE=="poll") OR (NAME=="${optionName}" AND TYPE=="option")`,
        (err, row)=> {
            rowsCounted = row['COUNT (*)'];
            switch (rowsCounted) {
                case 0:
                    msg.channel.send('Could not find '+pollName+' poll...');
                    break;
                case 1:
                    msg.channel.send('Could not find '+optionName+' option for '+pollName+' poll...');
                    break;
                case 2:
                    pollDb.run(`INSERT INTO pollTable (NAME, TYPE, ARG0, ARG1)
                                VALUES ("${msg.author.id}", "vote", "${pollName}", "${optionName}")`);
                    break;
                default:
                    throw new Error('Should never reach this point!');
                    break;
            }
        })
        .run(`END TRANSACTION;`);
    });  
}

function pollRetract(pollDb, pollName, optionName, msg) {
    let userName    = msg.author.tag;
    msg.channel.send(userName+' user is retracting vote on '+pollName+' poll...');
    pollDb.serialize(()=>{
        pollDb
        .run(pollCreateTable)
        .run(`BEGIN EXCLUSIVE TRANSACTION;`)
        .run(`DELETE FROM pollTable WHERE NAME=="${msg.author.id}" AND TYPE=="vote" AND ARG0=="${pollName}"`)
        .run(`END TRANSACTION;`);
    });  
}

function pollShow(pollDb, msg) {
    msg.channel.send('Getting list of all the polls...');
    pollDb.serialize(()=>{
        let pollArray = [];
        pollDb
        .run(pollCreateTable)
        .run(`BEGIN EXCLUSIVE TRANSACTION;`)   
        .each(`SELECT NAME FROM pollTable WHERE TYPE=="poll"`,
        (err, row)=>{
            pollArray.push(row.NAME);
        },
        (err, completed)=>{
            currentPromise = new Promise((resolve, reject)=>{
                let embedObject = {
                    color:  3447003,
                    title:  'Poll List',
                    fields: []
                };
                resolve(embedObject);
            });
            for (let pollName of pollArray) {                
                currentPromise = currentPromise.then(embedObject=>{
                    return new Promise((resolve, reject)=>{
                        let pollOptions = [];
                        pollDb.each(`SELECT NAME FROM pollTable WHERE TYPE=="option" AND ARG0=="${pollName}"`,
                        (err, row)=>{
                            pollOptions.push(row.NAME);
                        },
                        (err, completed)=>{
                            if (pollOptions.length==0)
                                pollOptions = "none";                            
                            embedObject.fields.push({name: pollName, value: pollOptions});
                            resolve(embedObject);
                        });
                    });
                });
            }
            currentPromise.then(embedObject=>{
                msg.channel.send({embed: embedObject});
            });
        })
        .run(`END TRANSACTION;`);        
    });
}

function pollView(pollDb, pollName, msg) {
    msg.channel.send('Getting poll results for '+pollName+' poll...');
    pollDb.serialize(()=>{
        pollDb
        .run(pollCreateTable)
        .run(`BEGIN EXCLUSIVE TRANSACTION;`)
        .get(`SELECT COUNT (*) FROM pollTable WHERE (NAME=="${pollName}" AND TYPE=="poll") OR (ARG0=="${pollName}" AND TYPE=="option")`,
        (err, row)=>{
            rowsCounted = row['COUNT (*)'];
            let pollOptions = []
            if (rowsCounted<=1) {
                msg.channel.send('Could not find '+pollName+' poll with sufficient options...');
            } else {
                pollDb.each(`SELECT NAME, TYPE FROM pollTable WHERE TYPE=="option" AND ARG0=="${pollName}"`,
                (err, row)=>{
                    pollOptions.push(row.NAME)
                },
                (err, completed)=>{
                    let embedObject = {
                        color: 3447003,
                        title: pollName+' poll',
                        fields: []
                    };
                    let currentPromise;
                    for (let i=0; i<pollOptions.length; i++) {
                        let optionName = pollOptions[i];
                        if (currentPromise===undefined) {
                            currentPromise = new Promise((resolve, reject)=>{
                                pollDb.get(`SELECT COUNT (*) FROM pollTable WHERE TYPE="vote" AND ARG0="${pollName}" AND ARG1="${optionName}"`,
                                (err, row)=>{
                                    let optionVotes = row['COUNT (*)'];
                                    embedObject.fields.push({
                                        name: optionName,
                                        value: optionVotes
                                    });
                                    resolve(embedObject);
                                });
                            });
                        } else {
                            currentPromise = currentPromise.then(embedRet=>{
                                return new Promise((resolve, reject)=>{
                                    pollDb.get(`SELECT COUNT (*) FROM pollTable WHERE TYPE="vote" AND ARG0="${pollName}" AND ARG1="${optionName}"`,
                                    (err, row)=>{
                                        let optionVotes = row['COUNT (*)'];
                                        embedRet.fields.push({
                                            name: optionName,
                                            value: optionVotes
                                        });
                                        resolve(embedRet);
                                    });
                                });
                            });
                        }
                    }
                    currentPromise.then((embedRet)=>{
                        msg.channel.send({embed:embedRet});
                    });
                });
            }
        })
        .run(`END TRANSACTION;`);
    });  
}

function pollRemove(pollDb, pollName, msg) {
    if (pollName === undefined) {
        msg.channel.send('Invalid use of command: Cannot remove undefined poll');
        return;
    };
    msg.channel.send('Removing '+pollName+' poll...');
    pollDb.serialize(()=>{
        pollDb
        .run(pollCreateTable)
        .run(`BEGIN EXCLUSIVE TRANSACTION;`)
        .run(`DELETE FROM pollTable WHERE (NAME=="${pollName}" AND TYPE=="poll") OR ((TYPE=="option" OR TYPE=="vote") AND ARG0=="${pollName}")`)
        .run(`END TRANSACTION;`);
    });  
}

function pollReset(pollDb, msg) {
    msg.channel.send('Reseting poll database...');
    pollDb.serialize(()=>{
        pollDb
        .run(pollCreateTable)
        .run(`BEGIN EXCLUSIVE TRANSACTION;`)
        .run(`DELETE FROM pollTable`)
        .run(`END TRANSACTION;`);
    });  
}
                         
module.exports = {
    name:        cl.c.cmdPoll.cmd,
    description: cl.c.cmdPoll.desc,
    execute(msg, args) {  
        subCmd     = args[0];
        pollName   = args[1];
        optionName = args[2];
        switch (subCmd) {
            case cl.c.cmdPollCreate.cmd:
                pollCreate(pollDb, pollName, msg);
                break;
            case cl.c.cmdPollAdd.cmd:
                pollAdd(pollDb, pollName, optionName, msg);
                break;
            case cl.c.cmdPollVote.cmd:
                pollVote(pollDb, pollName, optionName, msg);
                break;
            case cl.c.cmdPollRetract.cmd:
                pollRetract(pollDb, pollName, optionName, msg);
                break;
            case cl.c.cmdPollView.cmd:
                if (pollName===undefined) {
                    pollShow(pollDb, msg);
                } else {
                    pollView(pollDb, pollName, msg);
                }
                break;
            case cl.c.cmdPollRemove.cmd:
                pollRemove(pollDb, pollName, msg);
                break;
            case cl.c.cmdPollReset.cmd:
                pollReset(pollDb, msg);
                break;
            default:
                msg.channel.send(subCmd+' is not a valid sub-command for poll...');
                break;
        }
    },
    initPollDb(polldbfile) {             
        pollDb = new sqlite3.Database('./'+polldbfile, sqlite3.OPEN_CREATE|sqlite3.OPEN_READWRITE);
        pollDb.configure('busyTimeout', timeOut);         
    },
    closePollDb() {
        pollDb.close();
    }
};                            