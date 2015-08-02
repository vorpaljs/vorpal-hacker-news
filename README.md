# vantage-hacker-news

<img src="https://travis-ci.org/dthree/vantage.svg" alt="Build Status" />

Demo extension for vantage.js. This is used in the vantage.js tutorial to demonstrate how to do a live import of a vantage extension.

##### Installation

```bash
npm install vantage-hacker-news
npm install vantage
```

##### Programmatic use

```js
// index.js
var Vantage = require('vantage')
  , hn = require('vantage-hacker-news')
  ;

var vantage = Vantage();

vantage
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
$ vantage 192.168.0.100:4000
websvr~$ 
websvr~$ use vantage-hacker-news
Successfully installed vantage-hacker-news
websvr~$ 
websvr~$ hacker-news --length 10

  Pulling top 10 stories on Hacker News:

  ...

websvr~$ 
```
