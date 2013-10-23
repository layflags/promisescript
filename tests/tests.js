'use strict';
/* globals describe, it */
var expect = require('chai').expect,
		promisescript = require('../index'),
		successURL = '/tests/fixtures/success.js',
		failURL = '/tests/fixtures/404.js';

describe('promisescript', function() {
	it('should export a function', function() {
		expect(promisescript).to.be.a('function');
	});

	it('should return a promise', function() {
		var promise = promisescript(successURL);
		expect(promise).to.be.an('object');
		expect(promise).to.have.ownProperty('then');
	});

	it('should the same promise for the same URL', function() {
		var promise1 = promisescript(successURL);
		var promise2 = promisescript(successURL);
		expect(promise1).to.deep.equal(promise2);
	});

	it('should be resolved if the URL loaded successfully', function(done) {
		var promise = promisescript(successURL);
		promise.then(function() {
			done();
		}, done);
	});

	it('should be rejected if the URL is not loaded successfully', function(done) {
		var promise = promisescript(failURL);
		promise.then(function() {
			done(new Error('onFulfilled called'));
		}, function() {
			done();
		});
	});
});