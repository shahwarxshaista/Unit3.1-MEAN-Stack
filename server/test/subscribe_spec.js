TEST_USERS = require('/tmp/readerTestCreds.js');

var frisby = require('frisby');
var async = require('async');
var config = require('../config/environment');

var lifeHackerFeedURL = 'https://lifehacker.com/rss';
var ynabBlogFeedURL = 'https://www.youneedabudget.com/feed/';
var nycEaterFeedURL = 'https://ny.eater.com/rss/index.xml';

var uri = config.test.apiServerURI;

feedTestArray = [
    function addEmptyFeedListTest(callback) {
        var user = TEST_USERS[0];
        frisby.create('GET empty feed list for user ' + user.email)
            .get(uri + '/feeds')
            .addHeader('Authorization', 'Bearer ' + user.token)
            .expectStatus(200)
            .expectHeader('Content-Type', 'application/json; charset=utf-8')
            .expectJSON({feeds : []})
            .toss()
        callback(null);
    },
    function subOneFeed(callback) {
        var user = TEST_USERS[0];
        frisby.create('PUT Add feed sub for user ' + user.email)
            .put(uri + '/feeds/subscribe',
                 {'feedURL' : ynabBlogFeedURL})
            .addHeader('Authorization', 'Bearer ' + user.token)
            .expectStatus(200)
            .expectHeader('Content-Type', 'application/json; charset=utf-8')
            .expectJSONLength('user.subs', 1)
            .toss()
        callback(null);
    },
    function subDuplicateFeed(callback) {
        var user = TEST_USERS[0];
        frisby.create('PUT Add duplicate feed sub for user ' + user.email)
            .put(uri + '/feeds/subscribe',
                 {'feedURL' : ynabBlogFeedURL})
            .addHeader('Authorization', 'Bearer ' + user.token)
            .expectStatus(200)
            .expectHeader('Content-Type', 'application/json; charset=utf-8')
            .expectJSONLength('user.subs', 1)
            .toss()
        callback(null);
    },
    function subSecondFeed(callback) {
        var user = TEST_USERS[0];
        frisby.create('PUT Add second feed sub for user ' + user.email)
            .put(uri + '/feeds/subscribe',
                 {'feedURL' : nycEaterFeedURL})
            .addHeader('Authorization', 'Bearer ' + user.token)
            .expectStatus(200)
            .expectHeader('Content-Type', 'application/json; charset=utf-8')
            .expectJSONLength('user.subs', 2)
            .toss()
        callback(null);
    },
    function subOneFeedSecondUser(callback) {
        var user = TEST_USERS[1];
        frisby.create('PUT Add one feed sub for second user ' + user.email)
            .put(uri + '/feeds/subscribe',
                 {'feedURL' : nycEaterFeedURL})
            .addHeader('Authorization', 'Bearer ' + user.token)
            .expectStatus(200)
            .expectHeader('Content-Type', 'application/json; charset=utf-8')
            .expectJSONLength('user.subs', 1)
            .toss()
        callback(null);
    }
]

async.series(feedTestArray);
