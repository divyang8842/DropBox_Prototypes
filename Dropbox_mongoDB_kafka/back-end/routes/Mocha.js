/**
 * New node file
 */
var request = require('request'), express = require('express'), assert = require("assert"), http = require("http");

describe('http tests', function() {

    it('Should return 201 for proper input', function(done) {
        request.post('http://localhost:3004/validateEmails', {
            form : {
                emails : 'a@b.cd',
                password : '123456',
                userid:'123456'
            }
        }, function(error, response, body) {
            assert.equal(201, response.statusCode);
            done();
        });
    });


    it('should return the 501 if the url not given', function(done) {
        http.get('http://localhost:3004/', function(res) {
            assert.equal(501, res.statusCode);
            done();
        })
    });


    it('should return 501 without login', function(done) {
        request.post('http://localhost:3004/getUserLogs', {
            form : {
                username : 'a@b.cd',
                password : '123456'
            }
        }, function(error, response, body) {
            assert.equal(501, response.statusCode);
            done();
        });

    });



    it('should  return 404 the Hello123 page if the url is wrong', function(done) {
        request.post('http://localhost:3004/hello123', {
            form : {
                userid : '123456'
            }
        }, function(error, response, body) {
            assert.equal(404, response.statusCode);
            done();
        });

    });

    it('should return 501 for all get requests', function(done) {
        http.get('http://localhost:3004/mkdir', function(res) {
            assert.equal(501, res.statusCode);
            done();
        })
    });

    it("Star Dir return 500 for invalid filename", function(done) {
        request.post('http://localhost:3004/star', {
            form : {
                userid : '123456',
                filepath : '123456'
            }
        }, function(error, response, body) {
            assert.equal(500, response.statusCode);
            done();
        });
    });


    it("Should return 201 for valid inputs", function(done) {
        request.post('http://localhost:3004/getUserProfile', {
            form : {
                userid : '5a08d9398fa1471d5447cbf0'
            }
        }, function(error, response, body) {
            assert.equal(201, response.statusCode);
            done();
        });
    });
   /* it('should return 501', function(done) {
        http.get('', function(res) {
            assert.equal(501, res.statusCode);
            done();
        })
    });*/




    it('should return 501', function(done) {
        http.get('http://localhost:3004/delDir', function(res) {
            assert.equal(501, res.statusCode);
            done();
        })
    });

    it('should return 501 for access without login', function(done) {
        request.post('http://localhost:3004/unstar', {
            form : {

            }
        }, function(error, response, body) {
            assert.equal(501, response.statusCode);
            done();
        });

    });


    it('should login', function(done) {
        request.post('http://localhost:3004/login', {
            form : {
                username:"a@b.cd",
                password:"123456"
            }
        }, function(error, response, body) {
           // console.log('response',response)
            assert.equal(201, response.statusCode);
            done();
        });
    });


 /*   it('should return 501', function(done) {
        http.get('http://localhost:3004/validateEmails', function(res) {
            assert.equal(501, res.statusCode);
            done();
        })
    });*/




});