
/**
 * Vantage extension which exposes
 * the command `hacker-news`. This pulls
 * the top entries from hacker news.
 */

/**
 * Module dependencies.
 */

var colors = require('colors')
  , _ = require('lodash')
  , request = require('request')
  , moment = require("moment")
  ;

module.exports = function(vantage, options) {

  vantage
    .command("hacker-news", "Lists the top stories on hacker news.")
    .option("-l, --length [amt]", "Limits the list to a given length.")
    .action(function(args, cb){
      var self = this;
      var length = args.options.length;
      length = (isNaN(length)) ? 3 : length;
      self.log('\n  Pulling top ' + length + " stories on Hacker News:\n")
      getTopStories(length, function(err, data){
        if (!err) {
          getStories(data, function(err, data){
            if (!err) {
              var result = "";
              data = data.sort(function(a, b){
                return (a.rank > b.rank) ? 1 : -1;
              })
              for (var i = 0; i < data.length; ++i) {
                var s = data[i];
                var url = String(s.url).split('//');
                url = (url.length > 1) ? url[1] : s.url;
                url = String(url).split('/')[0];
                url = String(url).split('.');
                url.shift();
                url = url.join(".");
                var str = String("  " + (i+1) + ". ")
                  + String(s.title).white
                  + String(" (" + url + ")") 
                  + "\n     "
                  + "" + s.score + " points by " + s.by + " " + moment(parseFloat(s.time) * 1000).fromNow() + " | " + s.descendants + " comments"
                  + "\n     "
                  ;   
                str = str.replace(/’/g, "").replace(/`/g, "").replace(/‘/g, "");
                result = result + str + "\n";
                self.log(str);
              }
              cb(void 0, result);
            } else {
              console.error("Error getting stories: " + err);
              cb("Error getting stories: " + err);
            }
          })
        } else {
          console.error("Error getting top stories: " + err);
          cb("Error getting stories: " + err);
        }
      });
    });

}

function getStory(id, rank, callback) {
  var url = "https://hacker-news.firebaseio.com/v0/item/" + id + ".json?";
  request.get(url, {json: true, body: {}}, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      body.rank = rank;
      callback(void 0, body);
    } else {
      callback(true, 'Error getting story: ' + err);
    }
  });
}

function getStories(stories, callback) {
  var error = false;
  var results = [];
  var total = stories.length;
  var done = 0;

  function handler() {
    done++;
    if (total == done) {
      if (error !== false) {
        callback(true, error);
      } else {
        callback(void 0, results);
      }
    }
  }

  for (var i = 0; i < stories.length; ++i) {
    getStory(stories[i], (i+1), function(err, data) {
      if (err) {
        error = data;
      } else {
        results.push(data);
      }
      handler();
    });
  }
}

function getTopStories(amt, callback) { 
  amt = amt || 5;
  var url = "https://hacker-news.firebaseio.com/v0/topstories.json?";
  request.get(url, {json: true, body: {}}, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      var sliced = body.slice(0, amt);
      callback(void 0, sliced);
    } else {
      callback(true, 'Error getting top stories: ' + err);
    }
  });
}