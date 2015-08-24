'use strict';

/**
 * Vantage extension which exposes
 * the command `hacker-news`. This pulls
 * the top entries from hacker news.
 */

/**
 * Module dependencies.
 */

var chalk = require('chalk');
var request = require('request');
var moment = require('moment');

function getStory(id, rank, callback) {
  var url = 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json?';
  request.get(url, {json: true, body: {}}, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      body.rank = rank;
      callback(undefined, body);
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
    if (total === done) {
      if (error !== false) {
        callback(true, error);
      } else {
        callback(undefined, results);
      }
    }
  }

  function handleOnce(err, data) {
    if (err) {
      error = data;
    } else {
      results.push(data);
    }
    handler();
  }

  for (var i = 0; i < stories.length; ++i) {
    getStory(stories[i], (i + 1), handleOnce);
  }
}

function getTopStories(amt, callback) {
  amt = amt || 5;
  var url = 'https://hacker-news.firebaseio.com/v0/topstories.json?';
  request.get(url, {json: true, body: {}}, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      var sliced = body.slice(0, amt);
      callback(undefined, sliced);
    } else {
      callback(true, 'Error getting top stories: ' + err);
    }
  });
}

module.exports = function (vorpal) {
  vorpal
    .command('hacker-news', 'Lists the top stories on hacker news.')
    .option('-l, --length [amt]', 'Limits the list to a given length.')
    .action(function (args, cb) {
      var self = this;
      var length = args.options.length;
      length = (isNaN(length)) ? 3 : length;
      self.log('\n  Pulling top ' + length + ' stories on Hacker News:\n');
      getTopStories(length, function (err2, data2) {
        if (!err2) {
          getStories(data2, function (err3, data3) {
            if (!err3) {
              var result = '';
              data3 = data3.sort(function (a, b) {
                return (a.rank > b.rank) ? 1 : -1;
              });
              for (var i = 0; i < data3.length; ++i) {
                var s = data3[i];
                var url = String(s.url).split('//');
                url = (url.length > 1) ? url[1] : s.url;
                url = String(url).split('/')[0];
                url = String(url).split('.');
                url.shift();
                url = url.join('.');
                var nbr = String('  ' + (i + 1) + '. ');
                var title = chalk.white(s.title) + ' (' + url + ')\n';
                var points = '     ' + String(s.score) + ' points by ' + String(s.by) + ' ' + String(moment(parseFloat(s.time) * 1000).fromNow()) + ' | ' + String(s.descendants) + ' comments\n';
                var str = nbr + title + points;
                str = str.replace(/’/g, '').replace(/`/g, '').replace(/‘/g, '');
                result = result + str + '\n';
                self.log(str);
              }
              cb(undefined, result);
            } else {
              console.error('Error getting stories: ' + err3);
              cb('Error getting stories: ' + err3);
            }
          });
        } else {
          console.error('Error getting top stories: ' + err2);
          cb('Error getting stories: ' + err2);
        }
      });
    });
};
