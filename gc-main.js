/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * TODO Caution: Consider using event pages instead.
 *
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
        const gcYahooQuotesService = new GcYahooQuotesServiceProvider();
        const yahooQuotesService = new YahooQuotesServiceProvider(eventAggregator);
        const gcStorageServiceProvider = new GcStorageServiceProvider();
        const informationHolder = new InformationHolder(gcStorageServiceProvider, currencyData, currencySymbols, iso4217Currencies, regionFormats, _);
        //const contentInterface = new GcContentInterface(informationHolder);
        //const chromeInterface = new GcChromeInterface();
        eventAggregator.subscribe("quotesFromTo", function(eventArgs) {
            // console.log("subscribe quotesFromTo");
            yahooQuotesService.quotesHandlerFromTo(eventArgs);
        });
        eventAggregator.subscribe("quotesToFrom", function(eventArgs) {
            // console.log("subscribe quotesToFrom");
            yahooQuotesService.quotesHandlerToFrom(eventArgs);
        });
        eventAggregator.subscribe("storageInitDone", function(eventArgs) {
            if (!informationHolder.convertToCountry) {
                geoService.loadUserCountry(gcGeoService);
                eventAggregator.subscribe("countryReceived", function(countryCode) {
                    // console.log("subscribe countryReceived");
                    // console.log("countryCode " + countryCode);
                    informationHolder.convertToCountry = countryCode;
                    yahooQuotesService.loadQuotes(gcYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
                });
            }
            else {
                yahooQuotesService.loadQuotes(gcYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
            }
        });
        eventAggregator.subscribe("toggleConversion", function(eventArgs) {
            console.log("subscribe toggleConversion");
            //var number = 123456.789;
            //const inf = new Intl.NumberFormat('da-DK', { style: 'currency', currencyDisplay: 'symbol', currency: 'DKK' });
            //console.log(inf.format(number));
            //const dojo = require("./dojo.js.uncompressed");
            //const id = dojo.getPlatformDefaultId();
            //console.log(id);
            /*
             function(cldrMonetary){
             // the ISO 4217 currency code for Euro:
             var iso = "EUR";
             // get monetary data:
             var cldrMonetaryData = cldrMonetary.getData(iso);

             // print out places:
             console.log("Places: " + cldrMonetaryData.places);

             // print out round:
             //dom.byId("round").innerHTML = "Round: " + cldrMonetaryData.round;
             });
             */
            contentInterface.toggleConversion(eventArgs);
        });
        eventAggregator.subscribe("showSettingsTab", function() {
            console.log("subscribe showSettingsTab");
            contentInterface.showSettingsTab();
        });
        eventAggregator.subscribe("showTestTab", function() {
            console.log("subscribe showTestTab");
            contentInterface.showTestTab();
        });
        eventAggregator.subscribe("saveSettings", function(eventArgs) {
            console.log("subscribe saveSettings");
            const toCurrencyChanged = informationHolder.convertToCurrency != eventArgs.contentScriptParams.convertToCurrency;
            informationHolder.resetReadCurrencies();
            new ParseContentScriptParams(eventArgs.contentScriptParams, informationHolder);
            contentInterface.closeSettingsTab();
            if (toCurrencyChanged) {
                // controller.loadQuotes();
                yahooQuotesService.loadQuotes(gcYahooQuotesService, informationHolder.getFromCurrencies(),
                    informationHolder.convertToCurrency);
            }
        });
        eventAggregator.subscribe("resetSettings", function() {
            console.log("subscribe resetSettings");
            informationHolder.resetSettings();
            informationHolder.resetReadCurrencies();
            contentInterface.closeSettingsTab();
            // TODO this is copied from above
            if (!informationHolder.convertToCountry) {
                console.log("subscribe resetSettings if");
                geoService.loadUserCountry(gcGeoService);
                // TODO already subscribed once
                //eventAggregator.subscribe("countryReceived", (countryCode) => {
                //    console.log("countryCode " + countryCode);
                //    informationHolder.convertToCountry = countryCode;
                //    yahooQuotesService.loadQuotes(gcYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
                //});
            }
            else {
                console.log("subscribe resetSettings else");
                yahooQuotesService.loadQuotes(gcYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
            }
        });
        //contentInterface.registerToTabsEvents();

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
