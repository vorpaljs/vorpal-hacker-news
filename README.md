# vorpal-hacker-news

<img src="https://travis-ci.org/vorpaljs/vorpal-hacker-news.svg" alt="Build Status" />

Demo extension for [Vorpal.js](https://github.com/dthree/vorpal). This is used in the [Vantage.js](https://github.com/dthree/vantage) demo in tandem with `vorpal-use` to demonstrate how to do a live import of a Vorpal extension.

##### Installation

```bash
npm install vorpal-hacker-news
npm install vorpal
```

##### Programmatic use

```js
// index.js
var Vorpal = require('vorpal')
  , hn = require('vorpal-hacker-news')
  ;

var vorpal = Vorpal();

vorpal
  .delimiter('node~$')
  .use(hn)
  .show();
```

```bash
$
$ node index.js
node~$ 
node~$ hacker-news --length 3

  Pulling top 3 stories on Hacker News:

  1. I Dont Believe in God, but I Believe in Lithium (nytimes.com)
     171 points by pepys 11 hours ago | 64 comments

  2. Running Lisp in Production (grammarly.com)
     300 points by f00biebletch 15 hours ago | 98 comments

  3. Philanthropy for Hackers (wsj.com)
     53 points by petethomas 5 hours ago | 14 comments

node~$
```

##### Realtime use

```bash
$
$ vorpal 192.168.0.100:4000
websvr~$ 
websvr~$ use vorpal-hacker-news
Successfully installed vorpal-hacker-news
websvr~$ 
websvr~$ hacker-news --length 10

  Pulling top 10 stories on Hacker News:

  ...

websvr~$ 
```