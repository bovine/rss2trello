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

// If true is returned, then the card is rejected.
function checkCardExistsForArticle(article) {
    var rejected = false;

    // Any other logic to filter/reject new RSS articles.
    if (config.feed_filter != null) {
	rejected = config.feed_filter(article);
    }

    // Search through the current Trello cards to see if it already exists.
    // You can compare card.{name|desc} with article.{title|link|description}
    if (!rejected && config.card_article_comparator != null) {
	existingCards.forEach(function (card) {
	    if (config.card_article_comparator(card, article)) {
		rejected = true;
	    }
	});
    }

    return rejected;
}

function createCardFromArticle(listId, article) {
    // do some final transformations on the details of the card.
    var finalCard = {};
    if (config.article_formatter != null) {
	finalCard = config.article_formatter(article);
    } else {
	finalCard = { 'name': article.title, 'desc': article.description };
    }

    // actually create the card on Trello in the correct list.
    util.puts("Creating card for " + finalCard.name);
    tr.post("/1/lists/"+listId+"/cards", finalCard, function(err, data) {
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
    tr.get("/1/boards/"+config.boardid+"/lists/open", function(err, data) {
	if(err) throw err;
	data.forEach(function(tlist) {
	    //console.log(tlist);

	    // If this is the list we're looking for, remember its id.
	    if (tlist.name == config.target_list_name) {
		targetListId = tlist.id;
	    }

	    // Save the identities of all cards we find, to avoid duplicates.
	    if (tlist.cards != null) {
		tlist.cards.forEach(function(card) {
		    rememberExistingCard(card);
		});
	    }
	});
	processCompletion();
    });

}


main();

