This is a Node.JS application that checks your favorite RSS feed for
new items, and posts any new articles as new cards in Trello.

To periodically check for new items, simply use a crontab entry to
re-run the rss2trello script.


## Getting your Trello access token

Trello is a free website from FogCreek that allows you to manage tasks
by using a "Kanban" system involving cards, lists, and boards.

To get a read/write token, visit this page while logged in:
https://trello.com/1/appKey/generate

Copy and paste the key into the config.js file as config.trello_key.
Also paste the key into the "..." portion of the following URL and click the button:
https://trello.com/1/connect?key=...&name=rss2trello&response_type=token&scope=read,write

Copy and paste the resulting token into the config.js file as config.trello_token.
