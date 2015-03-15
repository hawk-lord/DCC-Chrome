/**
 * Google Chrome specific
 */
const DirectCurrencyConverter = (function() {
    "use strict";
//    console.error("Hej");
    console.log("Hej");
//    const eventAggregator = require("./eventAggregator");
//    const {GcFreegeoipServiceProvider} = require("./ff-freegeoip-service");
    const ffGeoService = new GcFreegeoipServiceProvider();
//    const {FreegeoipServiceProvider} = require("./freegeoip-service");
    const geoService = new FreegeoipServiceProvider();
//    const {YahooQuotesServiceProvider} = require("./yahoo-quotes");
    const quotesService = new YahooQuotesServiceProvider();
    var convertToCountry = "SE";
    var convertToCountry = null;
    if (convertToCountry === null || convertToCountry == null) {
        geoService.loadUserCountry(ffGeoService, convertToCountry);
        eventAggregator.subscribe("countryReceived", function(countryCode) {
            console.log("countryCode " + countryCode);
        });
    }
    quotesService.loadQuotes();
})();
