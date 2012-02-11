var util = require('util');
var rss = require('./node-rss/node-rss');
var Trello = require('./node-trello');
var config = require('./config');


var t = new Trello(config.trello_key, config.trello_token);

t.get("/1/boards/"+config.board_id+"/lists/open", function(err, data) {
    if(err) throw err;
    console.log(data);
    data.forEach(function(val) {
	if (val.name == config.target_list_name) {
	    console.log(val.id);
	    
	    t.post("/1/lists/"+val.id+"/cards", { "name": "moo", "desc": "cow"}, function(err, data) {
		if(err) throw err;
		console.log(data);
	    });
	}
	//console.log(val);
    });
});



// var response = rss.parseURL(config.feed_url, function(articles) {
//     util.puts(articles.length);
//     for(i=0; i<articles.length; i++) {
// 	util.puts("Article: "+i+", "+
// 		 articles[i].title+"\n"+
// 		 articles[i].link+"\n"+
// 		 articles[i].description+"\n"+
// 		 articles[i].content
// 		);
//     }
// });

