/**
 * New node file
 */
var request = require('request'), express = require('express'), assert = require("assert"), http = require("http");

describe('http tests', function() {

    it('should return the login if the url is correct', function(done) {
        http.get('http://localhost:3004/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should not return the Hello123 page if the url is wrong', function(done) {
        http.get('http://localhost:3004/hello123', function(res) {
            assert.equal(404, res.statusCode);
            done();
        })
    });

    it('should login', function(done) {
        request.post('http://localhost:3004/signin', {
            form : {
                inputUsername : 'a@b.cd',
                inputPassword : '123456'
            }
        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});