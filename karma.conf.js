'use strict';
var customLaunchers = {};

['chrome', 'firefox', 'iphone', 'ipad', 'android'].forEach(function (browser) {
  customLaunchers['sl_' + browser] = {
    base: 'SauceLabs',
    browserName: browser
  };
});

// Safari defaults to version 5 on Windows 7 (huh?)
customLaunchers.sl_safari = { // eslint-disable-line camelcase
  base: 'SauceLabs',
  browserName: 'safari',
  platform: 'OS X 10.9'
};

[9, 10, 11].forEach(function (version) {
  customLaunchers['sl_ie_' + version] = {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: version
  };
});

var isCI = Boolean(process.env.BUILD_NUMBER) && Boolean(process.env.BUILD_BRANCH);

module.exports = function (config) {
  config.set({
    frameworks: ['promise', 'browserify', 'mocha'],

    files: [
      'tests/*.js',
      {pattern: 'tests/fixtures/*', watched: true, included: false, served: true}
    ],

    preprocessors: {
      'tests/*.js': ['browserify']
    },

    sauceLabs: {
      testName: require('./package.json').name,
      tags: process.env.BUILD_BRANCH
    },

    reporters: isCI ? ['tape'] : ['mocha', 'coverage', 'beep'],

    colors: true,

    logLevel: isCI ? config.LOG_DISABLE : config.LOG_INFO,

    browsers: isCI ? Object.keys(customLaunchers) : null,

    singleRun: isCI,

    browserify: {
      debug: true,
      transform: isCI ? null : [
        ['espowerify'],
        ['browserify-istanbul', {ignore: ['**/*.handlebars']}]
      ]
    },

    coverageReporter: {
      reporters: [
        {type: 'html'},
        {type: 'text'}
      ]
    },

    customLaunchers: customLaunchers
  });
};
