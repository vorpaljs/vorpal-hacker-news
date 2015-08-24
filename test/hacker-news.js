'use strict';

require('assert');

var should = require('should');
var Vorpal = require('vorpal');
var hn = require('./../lib/index');

var vorpal;
var stdout = '';

function stdoutFn(data) {
  stdout += data;
  return '';
}

describe('vorpal-hacker-news', function () {
  describe('root', function () {
    before('vorpal preps', function () {
      vorpal = new Vorpal().pipe(stdoutFn).show();
    });

    beforeEach('vorpal preps', function () {
      stdout = '';
    });

    it('should exist and be a function', function () {
      should.exist(hn);
      hn.should.be.type('function');
    });

    it('should import into Vorpal', function () {
      (function () {
        vorpal.use(hn);
      }).should.not.throw();
    });

    it('should pull three items from HN.', function (done) {
      this.timeout(20000);
      vorpal.exec('hacker-news', function (err) {
        should.not.exist(err);
        stdout.should.containEql('1.');
        stdout.should.containEql('2.');
        stdout.should.containEql('3.');
        stdout.should.not.containEql('4.');
        done();
      });
    });

    it('should pull a custom number of items from HN.', function (done) {
      this.timeout(20000);
      vorpal.exec('hacker-news -l 2', function (err) {
        should.not.exist(err);
        stdout.should.containEql('1.');
        stdout.should.containEql('2.');
        stdout.should.not.containEql('3.');
        done();
      });
    });
  });
});

