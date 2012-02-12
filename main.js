var util = require('util');
var rss = require('./node-rss/node-rss');
var Trello = require('./node-trello');
var config = require('./config');


var tr = new Trello(config.trello_key, config.trello_token);
var targetListId = null;
var existingCards = null;
var foundArticles = null;


function rememberExistingCard(card) {
    if (existingCards == null) existingCards = new Array();

    existingCards.push(card);
}

function checkCardExistsForArticle(article) {

    var found = false;
    existingCards.forEach(function (card) {
	// compare card.{name|desc} with article.{title|link|description}
	// TODO: this might need to be customized based on your RSS feed format.
	if (card.desc.indexOf(article.link) >= 0) {
	    found = true;
	}
    });

    return found;
}

function createCardFromArticle(listId, article) {
    // do some final transformations on the details of the card.
    // TODO: this might need to be customized based on your RSS feed format.
    var finalName = article.title.split(',', 1);
    var finalDesc = article.title + "\n" + article.link + "\n" + article.description;

    // actually create the card on Trello in the correct list.
    util.puts("Creating card for " + finalName);
    tr.post("/1/lists/"+listId+"/cards", { "name": finalName, "desc": finalDesc}, function(err, data) {
	if(err) throw err;
	//console.log(data);
	util.puts("Successfully created card id " + data.id);
    });
}


function processCompletion() {

    if (targetListId != null && existingCards != null && foundArticles != null) {
	// Both of the asynchronous requests have finished, so do the actual insertion work.

	util.puts("Found targetListId = " + targetListId);
	util.puts("Found " + existingCards.length + " existing Trello cards");
	util.puts("Found " + foundArticles.length + " possible RSS articles");

	foundArticles.forEach(function(article) {
	    //console.log(article);
	    
	    if (!checkCardExistsForArticle(article)) {
		createCardFromArticle(targetListId, article);
	    }
	});
    }
}


function main() {

    //
    // Fetch all of the RSS items asynchronously.
    //
    rss.parseURL(config.feed_url, function(articles) {
	// Save the articles and process them when the Trello query is finished.
	foundArticles = articles;
	processCompletion();
    });
    

    //
    // Fetch all of the lists and cards in this Trello board asynchronously.
    //
    tr.get("/1/boards/"+config.board_id+"/lists/open", function(err, data) {
	if(err) throw err;
	data.forEach(function(tlist) {
	    //console.log(val);

	    // If this is the list we're looking for, remember its id.
	    if (tlist.name == config.target_list_name) {
		targetListId = tlist.id;
	    }

	    // Save the identities of all cards we find, to avoid duplicates.
	    tlist.cards.forEach(function(card) {
		rememberExistingCard(card);
	    });
	});
	processCompletion();
    });

}


main();

