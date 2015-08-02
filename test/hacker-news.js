"use strict";

var assert = require("assert")
  , should = require("should")
  , Vantage = require("vantage")
  , hn = require("./../lib/index")
  ;

var vantage
  , stdout = ""
  ;

function stdoutFn(data) {
  stdout += data;
  return "";
}

describe("vantage-hacker-news", function() {

  describe("root", function() {

    before("vantage preps", function() {
      vantage = new Vantage().pipe(stdoutFn).show();
    });

    beforeEach("vantage preps", function() {
      stdout = "";
    });

    it("should exist and be a function", function() {
      should.exist(hn);
      hn.should.be.type("function");
    });

    it("should import into Vantage", function() {
      (function(){
        vantage.use(hn);
      }).should.not.throw();
    });

    it("should pull three items from HN.", function(done) {
      this.timeout(20000);
      vantage.exec("hacker-news", function(err, data){
        should.not.exist(err);
        stdout.should.containEql("1.");
        stdout.should.containEql("2.");
        stdout.should.containEql("3.");
        stdout.should.not.containEql("4.");
        done();
      });
    });

    it("should pull a custom number of items from HN.", function(done) {
      this.timeout(20000);
      vantage.exec("hacker-news -l 2", function(err, data){
        should.not.exist(err);
        stdout.should.containEql("1.");
        stdout.should.containEql("2.");
        stdout.should.not.containEql("3.");
        done();
      });
    });

  });
});

