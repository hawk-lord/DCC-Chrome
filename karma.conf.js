// Karma configuration
// Generated on Sun Aug 30 2015 21:09:48 GMT+0300 (EEST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["mocha", "sinon-chrome", "chai"],

        // list of files / patterns to load in the browser
        files: [
            // default was false
            {pattern: "common/jquery-3.2.1.min.js", included: true},
            {pattern: "common/jquery-ui-1.12.1.min.js", included: true},
            {pattern: "common/dcc-regexes.js", included: true},
            {pattern: "common/dcc-content.js", included: true},
            {pattern: "common/dcc-settings.js", included: true},
            {pattern: "dcc-common-lib/eventAggregator.js", included: true},
            {pattern: "gc-chromeInterface.js", included: true},
            {pattern: "gc-contentInterface.js", included: true},
            {pattern: "gc-freegeoip-service.js", included: true},
            {pattern: "gc-quotes-service.js", included: true},
            {pattern: "gc-storage-service.js", included: true},
            {pattern: "dcc-common-lib/contentScriptParams.js", included: true},
            {pattern: "dcc-common-lib/freegeoip-service.js", included: true},
            {pattern: "dcc-common-lib/informationHolder.js", included: true},
            {pattern: "dcc-common-lib/parseContentScriptParams.js", included: true},
            {pattern: "dcc-common-lib/yahoo-2-quotes.js", included: true},
            {pattern: "test/karma/dcc-mock-content-adapter.js", included: true},
            {pattern: "test/karma/dcc-mock-contentscriptparams.js", included: true},
            {pattern: "test/karma/dcc-mock-informationholder.js", included: true},
            {pattern: "test/karma/dcc-mock-status.js", included: true},
            {pattern: "test/karma/test-contentScriptParams.js", included: true},
            {pattern: "test/karma/test-dcc-content.js", included: true},
            {pattern: "test/karma/test-dcc-regexes.js", included: true},
            {pattern: "test/karma/test-dcc-settings.js", included: true},
            {pattern: "test/karma/test-eventAggregator.js", included: true},
            //{pattern: "test/karma/test-gc-chromeInterface.js", included: true},
            {pattern: "test/karma/test-gc-contentInterface.js", included: true},
            {pattern: "test/karma/test-gc-freegeoip-service.js", included: true},
            {pattern: "test/karma/test-gc-storage-service.js", included: true},
            {pattern: "test/karma/test-freegeoip-service.js", included: true},
            {pattern: "test/karma/test-informationHolder.js", included: true},
            {pattern: "test/karma/test-parseContentScriptParams.js", included: true},
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        //    '**/*.js': ['coverage']
        },

        coverageReporter:{
            type:'html',
            dir:'/Users/per'
        },

        // test results reporter to use
        // possible values: "dots", "progress"
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        //reporters: ["progress", "coverage"],
        reporters: ["progress"],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ["Firefox"],
        browsers: ["ChromeHeadless"],
        //browsers: ["PhantomJS2"],

        //plugins : ["karma-chrome-launcher", "karma-firefox-launcher", "karma-chai", "karma-mocha"],
        //plugins : ["karma-chrome-launcher", "karma-firefox-launcher", "karma-chai", "karma-mocha", "karma-coverage"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // To enable breakpoints
        debug: true
    })
};
