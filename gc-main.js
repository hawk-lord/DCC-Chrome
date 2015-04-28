/**
 * Google Chrome specific
 * TODO Caution: Consider using event pages instead. Learn more.
 */
    /*
     "scripts": [
     "dcc-common-lib/eventAggregator.js",
     "gc-freegeoip-service.js",
     "dcc-common-lib/freegeoip-service.js",
     "dcc-common-lib/yahoo-quotes.js",
     "gc-storage-service.js",
     "dcc-common-lib/informationHolder.js",
     "dcc-common-lib/parseContentScriptParams.js",
     "gc-l10n.js",
     "gc-main.js"],

     */
const DirectCurrencyConverter = (function() {
    "use strict";
    let currencyData;
    let currencySymbols;
    let iso4217Currencies;
    let regionFormats;
    const onJsonsDone = function() {
        const localisation = new Localisation();
        const _ = localisation._;
        const gcGeoService = new GcFreegeoipServiceProvider();
        const geoService = new FreegeoipServiceProvider();
        const quotesService = new YahooQuotesServiceProvider(eventAggregator);
        const gcStorageServiceProvider = new GcStorageServiceProvider();
        const informationHolder = new InformationHolder(gcStorageServiceProvider, currencyData, currencySymbols, iso4217Currencies, regionFormats, _);
        console.log(informationHolder.convertToCountry);
    };
    const onCurrencyData = function(result) {
        const currencyDataJson = result;
        currencyData = JSON.parse(currencyDataJson);
        if (currencyData && currencySymbols && iso4217Currencies && regionFormats) {
            onJsonsDone();
        }
    };
    const currencyDataRequest = new XMLHttpRequest();
    currencyDataRequest.overrideMimeType("application/json");
    currencyDataRequest.open("GET", "dcc-common-lib/currencyData.json", true);
    currencyDataRequest.onreadystatechange = function () {
        if (currencyDataRequest.readyState === 4 && currencyDataRequest.status === 200) {
            onCurrencyData(currencyDataRequest.responseText);
        }
    };
    currencyDataRequest.send(null);
    const onCurrencySymbols = function(result) {
        const currencySymbolsJson = result;
        currencySymbols = JSON.parse(currencySymbolsJson);
        if (currencyData && currencySymbols && iso4217Currencies && regionFormats) {
            onJsonsDone();
        }
    };
    const currencySymbolsRequest = new XMLHttpRequest();
    currencySymbolsRequest.overrideMimeType("application/json");
    currencySymbolsRequest.open("GET", "dcc-common-lib/currencySymbols.json", true);
    currencySymbolsRequest.onreadystatechange = function () {
        if (currencySymbolsRequest.readyState === 4 && currencySymbolsRequest.status === 200) {
            onCurrencySymbols(currencySymbolsRequest.responseText);
        }
    };
    currencySymbolsRequest.send(null);
    const oniso4217Currencies = function(result) {
        const iso4217CurrenciesJson = result;
        iso4217Currencies = JSON.parse(iso4217CurrenciesJson);
        if (currencyData && currencySymbols && iso4217Currencies && regionFormats) {
            onJsonsDone();
        }
    };
    const iso4217CurrenciesRequest = new XMLHttpRequest();
    iso4217CurrenciesRequest.overrideMimeType("application/json");
    iso4217CurrenciesRequest.open("GET", "dcc-common-lib/iso4217Currencies.json", true);
    iso4217CurrenciesRequest.onreadystatechange = function () {
        if (iso4217CurrenciesRequest.readyState === 4 && iso4217CurrenciesRequest.status === 200) {
            oniso4217Currencies(iso4217CurrenciesRequest.responseText);
        }
    };
    iso4217CurrenciesRequest.send(null);
    const onRegionFormats = function(result) {
        const regionFormatsJson = result;
        regionFormats = JSON.parse(regionFormatsJson);
        if (currencyData && currencySymbols && regionFormats && regionFormats) {
            onJsonsDone();
        }
    };
    const regionFormatsRequest = new XMLHttpRequest();
    regionFormatsRequest.overrideMimeType("application/json");
    regionFormatsRequest.open("GET", "dcc-common-lib/regionFormats.json", true);
    regionFormatsRequest.onreadystatechange = function () {
        if (regionFormatsRequest.readyState === 4 && regionFormatsRequest.status === 200) {
            onRegionFormats(regionFormatsRequest.responseText);
        }
    };
    regionFormatsRequest.send(null);

/*
    var convertToCountry = "SE";
    var convertToCountry = null;
    if (convertToCountry === null || convertToCountry == null) {
        geoService.loadUserCountry(gcGeoService, convertToCountry);
        eventAggregator.subscribe("countryReceived", function(countryCode) {
            console.log("countryCode " + countryCode);
        });
    }
    quotesService.loadQuotes();
    */
})();
