# VanillaBot
A discord bot for the Ice Cream Team Discord Server, created by Andrewandre, Fireless, and Johnvinder
For new feature requests, add them on the "Issues" tab, and try to make them with the correct labeling.

# Getting Started:

Useful documentation:
https://discord.js.org/#/docs/main/stable/general/welcome
https://nodejs.org/en/about/


**Getting your Enviroment Set-Up**

Install the latest version of Node.js:
https://nodejs.org/en/

Clone the repo to your appropriate directory folder:
$ git clone https://github.com/Ice-Cream-Team/VanillaBot.git

**CURRENT COMMANDS**

**To boot up the bot for hosting** (note: you'll need the bot's private token to run this):
```
# By default, it will look for the token from a file called "tokenfile". There should be no extra whiteline characters (e.g. newlines, tabs, spaces, etc.) in the file!
$ npm start 

# You can also specify the tokenfile.
$ npm start -- --tokenfile <different token file>

# Finally, you can directly use the token.
$ npm start -- --token <token>
```

**To boot up the bot for hosting** (note: you can check your enviroment on the Bot's user's Listening To: tab):
```
# To be able to perform automative regression tests of the entire command list:
# To run the command is !vb regression
$ npm start -- --regression
```

**To boot up the bot for regression testing** (note: you can check your enviroment on the Bot's user's Listening To: tab):
```
# To be able to perform automative regression tests of the entire command list:
# To run the command is !vb regression
$ npm start -- --regression
```

**To ignore permission levels (admin commands)**
```
# If you start the bot with the following switch, it will ignore the privilege levels.
$ npm start -- --ignoreowner
```

**To show a help menu of all the available switches**
```
$ npm start -- --help
```

**To exit your hosting** of the bot press: Use the command `!vb kill` in your discord session. You can also issue a SIGINT (CTRL+C) on Linux to close the application (on Windows, however, the Node.js process will still execute in the background).
