var   cl      = require('./cmd_cmds.js');
var   sqlite3 = require('sqlite3');
var   ownerDb;
const timeOut = 4000; // in milliseconds
const maxCmds = cl.getCmdMaxDepth(cl.cl)+1;
function createOwnerCreatePrivTable(maxCmds) {
    let sqlCmd = `CREATE TABLE IF NOT EXISTS privTable(
                  ID   INTEGER PRIMARY KEY AUTOINCREMENT,                            
                  PRIV INTEGER NOT NULL,
                  CMD0 TEXT    NOT NULL`;
    for (let i=1; i<maxCmds; i++)
        sqlCmd += `, CMD${i} TEXT` + ((i==(maxCmds-1))?")":"");
    return sqlCmd;
}
const ownerCreatePrivTable = createOwnerCreatePrivTable(maxCmds);
const PrivState  = {
    owner: 8,
    admin: 4,
    user:  0
};

var privStateMapStr2Int = new Map()
var privStateMapInt2Str = new Map()
privStateMapStr2Int.set("owner", PrivState.owner);
privStateMapStr2Int.set("admin", PrivState.admin);
privStateMapStr2Int.set("user",  PrivState.user);
privStateMapInt2Str.set(PrivState.owner, "owner");
privStateMapInt2Str.set(PrivState.admin, "admin");
privStateMapInt2Str.set(PrivState.user,  "user");

/**
 * Initializes the database that stores the commands and their
 * associated privilege levels.
 * @param db - The reference to the sqlite3 database where the configurations will reside.
 * @param cmdTree - The command tree (CmdNode) that defines command structure.
 * @param cmdOwner - The command object (BotCmd) that contains the prefix for the owner command.
 */
function ownerPrivInit(db, cmdTree, cmdOwner) {
    let cmdList = cl.getCmdList(cmdTree);
    db.serialize(()=>{
        let currentPromise = new Promise((resolve, reject)=>{
            db
            .run(ownerCreatePrivTable)
            .run(`BEGIN TRANSACTION;`,(err)=>{ resolve(); });
        });
        for (let fullCmd of cmdList) {
            currentPromise = currentPromise.then(()=>{
                return new Promise((resolve, reject)=>{
                    let fullCmdList = fullCmd.split(' ').filter(arg=>arg!="");
                    let sqlCmd      = "SELECT COUNT (*) FROM privTable WHERE ";
                    for (let i=0; i<fullCmdList.length; i++) {
                        sqlCmd += (i==0?"":"AND ") + `CMD${i}="${fullCmdList[i]}"`;
                    }                    
                    db.get(sqlCmd, 
                    (err, row)=>{
                        let exists = row['COUNT (*)']!=0;
                        if (exists) {
                            resolve();
                        } else {
                            let sqlCmd0 = "INSERT INTO privTable (PRIV";
                            let sqlCmd1 = `VALUES (${(fullCmdList.length>=2 && fullCmdList[1]==cmdOwner.cmd)?PrivState.owner:PrivState.user}`;
                            for (let i=0; i<fullCmdList.length; i++) {
                                sqlCmd0 += `, CMD${i}`;
                                sqlCmd1 += `, "${fullCmdList[i]}"`;
                            }
                            sqlCmd0 += ")";
                            sqlCmd1 += ")";
                            let sqlCmd = sqlCmd0+" "+sqlCmd1;                            
                            db.run(sqlCmd);
                            resolve();
                        }
                    });
                });
            });
        }
        currentPromise.then(()=>{
            db.run(`END TRANSACTION;`);
        });        
    });
}

/**
 * Sets the privilege levels of the specified fullCmd.
 * @param db - The reference to the sqlite3 database.
 * @param fullCmd - The full command as string.
 * @param cmdTree - The command tree (CmdNode) that defines command structure.
 * @param cmdOwner - The command object (BotCmd) that contains the prefix for the owner command.
 * @param msg - Discord.Message object that represents a discord message.
 */
function ownerPrivSet(db, priv, fullCmd, cmdTree, cmdOwner, msg) {
    msg.channel.send(`Setting privilege level ${priv} for "${fullCmd}"...`);
    let cmdNode = cl.getCmdNode(fullCmd, cmdTree);
    if (cmdNode===undefined) {
        msg.channel.send(`Could not find full command "${fullCmd}"...`);
        return
    }
    let cmdList = cl.getCmdList(cmdNode);    
    db.serialize(()=>{
        let currentPromise = new Promise((resolve, reject)=>{
            let fullCmdArray = [];
            db.run(`BEGIN TRANSACTION;`,(err)=>{ resolve(fullCmdArray); });
        });           
        for (let fullCmd0 of cmdList) {
            currentPromise = currentPromise.then((fullCmdArray)=>{
                return new Promise((resolve, reject)=>{
                    let fullCmdList0  = fullCmd.split(' ').filter(arg=>arg!="");
                    fullCmdList0.splice(fullCmdList0.length-1, 1);                    
                    fullCmdList0 = fullCmdList0.concat(fullCmd0.split(' ').filter(arg=>arg!=""));                    
                    if (fullCmdList0[1]==cmdOwner.cmd) {
                        resolve();
                        return;
                    }
                    fullCmdArray.push(fullCmdList0.join(' '));
                    let sqlCmd = `UPDATE privTable SET PRIV=${priv} WHERE `; 
                    for (let i=0; i<maxCmds; i++) {
                        sqlCmd += (i==0?"":"AND ") + `CMD${i}`;
                        if (i<fullCmdList0.length) {
                            sqlCmd += `="${fullCmdList0[i]}" `;
                        } else {
                            sqlCmd += ` IS NULL `;
                        }
                    }                    
                    db.run(sqlCmd,(err)=>{ resolve(fullCmdArray); });
                });
            });
        }
        currentPromise.then((fullCmdArray)=>{
            db.run(`END TRANSACTION;`, (err)=>{
                let fullStr = "";
                for (let fullCmd of fullCmdArray)
                    fullStr += `Setting privilege for "${fullCmd}" command...\n`;
                msg.channel.send(fullStr);
            });            
        });         
    });
}

/**
 * Views all the commands and their respective privileges.
 * @param db - The reference to the sqlite3 database.
 * @param cmdTree - The command tree (CmdNode) that defines command structure.
 * @param msg - Discord.Message object that represents a discord message.
 */
function ownerPrivView(db, cmdTree, msg) {
    let cmdList = cl.getCmdList(cmdTree);   
    msg.channel.send(`Viewing privilege list...`);
    db.serialize(()=>{    
        let currentPromise = new Promise((resolve, reject)=>{
            let embedObject = {
                color:  3447003,
                title:  'Privilege Command List',
                fields: []
            };            
            db.run(`BEGIN TRANSACTION;`,(err)=>{ resolve(embedObject); });
        });       
        for (let fullCmd of cmdList) {
            currentPromise = currentPromise.then((embedObject)=>{
                return new Promise((resolve, reject)=>{
                    let fullCmdList = fullCmd.split(' ').filter(arg=>arg!="");
                    let sqlCmd      = `SELECT PRIV FROM privTable WHERE `;
                    for (let i=0; i<maxCmds; i++) {
                        sqlCmd += (i==0?"":"AND ") + `CMD${i}`;
                        if (i<fullCmdList.length) {
                            sqlCmd += `="${fullCmdList[i]}" `;
                        } else {
                            sqlCmd += ` IS NULL `;
                        }                        
                    }                      
                    db.get(sqlCmd, (err, row)=>{                        
                        let priv = row['PRIV'];
                        if (privStateMapInt2Str.has(priv)) 
                            priv = privStateMapInt2Str.get(priv);                        
                        embedObject.fields.push({name:`"${fullCmd}" privilege level`, value:priv});
                        resolve(embedObject);
                    });
                });
            });
        }
        currentPromise.then((embedObject)=>{
            return new Promise((resolve, reject)=>{
                db.run(`END TRANSACTION;`, (err)=>{ resolve(embedObject) });
            })
        }).then((embedObject)=>{
            msg.channel.send({embed: embedObject});
        });
    });
}

/**
 * Gets the privilege level of the specified full command.
 * @param db - The reference to the sqlite3 database.
 * @param fullCmd - The full command as string.
 */
function ownerPrivCmdGet(db, fullCmd) {   
    return new Promise((resolve, reject)=>{
        db.serialize(()=>{    
            let fullCmdList = fullCmd.split(' ').filter(arg=>arg!="");
            let sqlCmd      = `SELECT PRIV FROM privTable WHERE `;
            for (let i=0; i<maxCmds; i++) {
                sqlCmd += (i==0?"":"AND ") + `CMD${i}`;
                if (i<fullCmdList.length) {
                    sqlCmd += `="${fullCmdList[i]}" `;
                } else {
                    sqlCmd += ` IS NULL `;
                }                        
            }    
            db.get(sqlCmd, (err, row)=>{
                if (row===undefined) {
                    resolve();
                } else {
                    let priv = row['PRIV'];
                    resolve(priv);
                }
            });            
        });
    });      
}

module.exports = {
    name:        cl.c.cmdOwner.cmd,
    description: cl.c.cmdOwner.desc,
    PrivState:   PrivState,
    execute(msg, args) {  
        subCmd     = args[0];
        switch (subCmd) {
            case cl.c.cmdOwnerSet.cmd:
                {
                    let priv;
                    let fullCmd;

                    // Acquire privilege level of command.
                    priv = parseInt(args[1]);
                    if (isNaN(priv) && privStateMapStr2Int.has(args[1])) {
                        priv = privStateMapStr2Int.get(args[1]);                         
                    } else {
                        msg.channel.send(args[1] + ' is not-a-number...');
                        break;                      
                    }                        
                    
                    // Acquire full command.
                    fullCmd = cl.c.cmdPrefix.cmd;
                    for (let i=2; i<args.length; i++) {
                        fullCmd += " " + args[i];
                    }                    
                    
                    // Run command.                                        
                    ownerPrivSet(ownerDb, priv, fullCmd, cl.cl, cl.c.cmdOwner, msg);
                }
                break;
            case cl.c.cmdOwnerView.cmd:
                ownerPrivView(ownerDb, cl.cl, msg);
                break;
            default:
                msg.channel.send(subCmd+' is not a valid sub-command for owner...');
                break;
        }
    },
    initDb(ownerDbFile) { 
        ownerDb = new sqlite3.Database('./'+ownerDbFile, sqlite3.OPEN_CREATE|sqlite3.OPEN_READWRITE);
        ownerDb.configure('busyTimeout', timeOut);    
        ownerPrivInit(ownerDb, cl.cl, cl.c.cmdOwner);
    },
    closeDb() { ownerDb.close(); },
    ownerPrivCmdGet(fullCmd){ return ownerPrivCmdGet(ownerDb, fullCmd); }
}