rss2trello
==========
This is a Node.JS application that checks your favorite RSS feed for
new items, and posts any new articles as new cards in Trello.

Trello is a free project management website from Fog Creek Software
that allows you to track tasks by using a "Kanban" system involving
cards, lists, and boards.

Possible uses of rss2trello include:

* recruiters could monitor job candidates by using a Craigslist.org
  RSS feed for new applicants and allow hiring staff to make comments
  and move cards into lists for "to interview", "to make offer",
  "rejected", etc. http://houston.craigslist.org/sof/index.rss

* realtors, home buyers, or business partners could monitor new house
  listings using a custom RSS feed from Trulia.com and move cards into
  lists for "to visit", "to research further", "to make offer",
  "rejected", etc. http://www.trulia.com/tools/rss/

* software managers could automatically add new bugs that appear in
  their defect tracking system and use Trello as a higher-level
  workflow organization tool to prioritize tasks.


## Using rss2trello

Copy the config.js.sample to config.js and make your customizations
to your copy.  You will need to follow the instructions in the section
below to get your Trello access token.

To run the rss2trello application once, just run:

    nodejs main.js

To periodically check for new items, simply use a crontab entry to
re-run the rss2trello script, with something like this:

    0 */4 * * * cd ~/rss2trello && nodejs main.js


## Getting your Trello access token

To get a read/write token, visit this page while logged in:
https://trello.com/1/appKey/generate

Copy and paste the key into the config.js file as `config.trello_key`.
Also paste the key into the "..." portion of the following URL and click the button:
https://trello.com/1/connect?key=...&name=rss2trello&response_type=token&scope=read,write

Copy and paste the resulting token into the config.js file as `config.trello_token`.

The config file also needs the identifier of the Trello board provided
as `config.board_id`, which is the hexadecimal portion of the trello.com URL
after you have clicked on the board to view it on their website.

The value `config.target_list_name` in the config file is the exact name
of the list that you have already created within the board.
