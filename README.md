This is a persistent Node.JS application that periodically polls an
RSS feed for new items, and posting them as new tasks in Trello.


To get a read/write token, visit this page while logged in:
https://trello.com/1/appKey/generate

Copy and paste the key into the config.js file as config.trello_key.
Also paste the key into the "..." portion of the following URL and click the button:
https://trello.com/1/connect?key=...&name=rss2trello&response_type=token&scope=read,write

Copy and paste the resulting token into the config.js file as config.trello_token.
