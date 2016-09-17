S5 Telegram Bot Documentation

Upon receiving a /start command or any other input, the bot will send a menu of all non-admin commands.

Admin Commands:
The following are commands available only to whitelisted users. Whitelisted users are currently hard coded.

/setcommand [commandName] [text]
Sets a text to be displayed on the command commandName. For example:

	/setcommand Hello, World!
	>> Saved new command /hello
	/hello
	>> Hello, World!

To set a photo to be displayed on commandName, send a photo to the bot with the caption commandName.

/deletecommand [commandName]
Deletes commandName from the available commands.  Example:

	menu
	>Menu:
	>/dog
	>/ping
	>/hello
	/deletecommand hello
	>/hello deleted
	Hey there
	>Menu:
	>/dog
	>/ping

/getchatlog
Prints a log of all recorded chat messages to Telegram. Each message is shown with the user, the text of the message, and the time of the message. Does not work if the chat log is large: chatlog can only be downloaded. Example:

	/getchatlog
	>From: Frankendracula
	>/deletecommand hello
	>2016-09-16T22:03:50-04:00
	>=========
	>From: Frankendracula
	>/setcommand hello Hello, World!
	>2016-09-16T22:04:05-04:00
	>=========
	>From: Frankendracula
	>/hello
	>2016-09-16T22:04:44-04:00
	>=========
	>From: Frankendracula
	>menu
	>2016-09-16T22:07:07-04:00
	>=========
	>From: Tourney15K
	>hi
	>2016-09-16T19:29:18-04:00
	>=========

/downloadchatlog
Provides a downloadable version of the chat log.

/sendmessage [username] [message]
Sends message to username. Username Must be someone who has previously messaged the bot. Example:
	/sendmessage Tourney15K Hey there how’s it going
Tourney15K will see:
	[from BotName]: Hey there how’s it going

