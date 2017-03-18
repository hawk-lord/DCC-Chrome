/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *
 */

const EnabledCurrency = function(isoName, enabled) {
    this.isoName = isoName;
    this.enabled = enabled;
};

const DirectCurrencyConverter = (function() {
    "use strict";
    let currencyData;
    let currencySymbols;
    let convertFroms;
    let regionFormats;
    let iso4217Currencies;
    const defaultExcludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const localisation = new Localisation();
    const _ = localisation._;
    let informationHolder;
    let gcGeoServiceFreegeoip;
    let geoServiceFreegeoip;
    let gcGeoServiceNekudo;
    let geoServiceNekudo;
    let gcYahooQuotesService;
    let yahooQuotesService;

    const onStorageServiceInitDone = (informationHolder) => {
        gcGeoServiceFreegeoip = new GcFreegeoipServiceProvider();
        geoServiceFreegeoip = new FreegeoipServiceProvider();
        gcGeoServiceNekudo = new GcNekudoServiceProvider();
        geoServiceNekudo = new NekudoServiceProvider();
        gcYahooQuotesService = new GcYahooQuotesServiceProvider();
        yahooQuotesService = new YahooQuotesServiceProvider(eventAggregator);
        const contentInterface = new GcContentInterface(informationHolder);
        const chromeInterface = new GcChromeInterface(informationHolder.conversionEnabled);
        eventAggregator.subscribe("countryReceivedFreegeoip", (countryCode) => {
            if (countryCode !== "") {
                informationHolder.convertToCountry = countryCode;
                yahooQuotesService.loadQuotes(gcYahooQuotesService, informationHolder.getConvertFroms(), informationHolder.convertToCurrency);
            }
            else {
                geoServiceNekudo.loadUserCountry(gcGeoServiceNekudo);
            }
        });
        eventAggregator.subscribe("countryReceivedNekudo", (countryCode) => {
            if (countryCode !== "") {
                informationHolder.convertToCountry = countryCode;
            }
            else {
                informationHolder.convertToCountry = "CH";
            }
            yahooQuotesService.loadQuotes(gcYahooQuotesService, informationHolder.getConvertFroms(), informationHolder.convertToCurrency);
        });
        eventAggregator.subscribe("quotesFromTo", (eventArgs) => {
            yahooQuotesService.quotesHandlerFromTo(eventArgs);
        });
        eventAggregator.subscribe("quotesToFrom", (eventArgs) => {
            yahooQuotesService.quotesHandlerToFrom(eventArgs);
        });
        eventAggregator.subscribe("quoteReceived", (eventArgs) => {
            informationHolder.setConversionQuote(eventArgs.convertFromCurrencyName, eventArgs.quote);
            if (informationHolder.isAllCurrenciesRead()) {
                contentInterface.watchForPages();
            }
        });
        eventAggregator.subscribe("toggleConversion", (eventArgs) => {
            contentInterface.toggleConversion(eventArgs);
        });
        eventAggregator.subscribe("showSettingsTab", () => {
            contentInterface.showSettingsTab();
        });
        eventAggregator.subscribe("showTestTab", () => {
            contentInterface.showTestTab();
        });
        eventAggregator.subscribe("showQuotesTab", () => {
            contentInterface.showQuotesTab();
        });
        eventAggregator.subscribe("saveSettings", (eventArgs) => {
            const toCurrencyChanged = informationHolder.convertToCurrency != eventArgs.contentScriptParams.convertToCurrency;
            informationHolder.resetReadCurrencies();
            new ParseContentScriptParams(eventArgs.contentScriptParams, informationHolder);
            if (toCurrencyChanged) {
                yahooQuotesService.loadQuotes(gcYahooQuotesService, informationHolder.getConvertFroms(),
                    informationHolder.convertToCurrency);
            }
        });
        eventAggregator.subscribe("resetQuotes", (eventArgs) => {
            informationHolder.resetReadCurrencies();
            yahooQuotesService.loadQuotes(gcYahooQuotesService, informationHolder.getConvertFroms(),
                    informationHolder.convertToCurrency);
        });
        eventAggregator.subscribe("resetSettings", () => {
            informationHolder.resetSettings(iso4217Currencies);
            informationHolder.resetReadCurrencies();
            geoServiceFreegeoip.loadUserCountry(gcGeoServiceFreegeoip);
        });
        /**
         * Communicate with the Settings tab
         * @param message
         * @param sender
         * @param sendResponse
         */
        const onMessageFromSettings = (message, sender, sendResponse) => {
            if (message.command === "show") {
                sendResponse(new ContentScriptParams(null, informationHolder));
            }
            else if (message.command === "save") {
                eventAggregator.publish("saveSettings", {
                    contentScriptParams: message.contentScriptParams
                })
            }
            else if (message.command === "reset") {
                eventAggregator.publish("resetSettings");
            }
            else if (message.command === "resetQuotes") {
                eventAggregator.publish("resetQuotes");
            }
        };
        chrome.runtime.onMessage.addListener(onMessageFromSettings);
        if (!informationHolder.convertToCountry) {
            geoServiceFreegeoip.loadUserCountry(gcGeoServiceFreegeoip);
        }
        else {
            yahooQuotesService.loadQuotes(gcYahooQuotesService, informationHolder.getConvertFroms(), informationHolder.convertToCurrency);
        }
    };
    const onStorageServiceReInitDone = (informationHolder) => {
        geoServiceFreegeoip.loadUserCountry(gcGeoServiceFreegeoip);
    };
    const onJsonsDone = () => {
        eventAggregator.subscribe("storageInitDone", () => {
            convertFroms = gcStorageServiceProvider.convertFroms;
            informationHolder = new InformationHolder(gcStorageServiceProvider, currencyData,
                currencySymbols, convertFroms, regionFormats, _);
            onStorageServiceInitDone(informationHolder);
        });
        eventAggregator.subscribe("storageReInitDone", () => {
            onStorageServiceReInitDone(informationHolder);
        });
        const gcStorageServiceProvider = new GcStorageServiceProvider();
        gcStorageServiceProvider.init(iso4217Currencies, defaultExcludedDomains);
/*
        for (var currency of iso4217Currencies) {
            var found = false;
            for (var storedCurrency of gcStorageServiceProvider.convertFroms) {
                if (currency.isoName === storedCurrency.isoName) {
                    found = true;
                    break;
                }
            }
            if (!found){
                gcStorageServiceProvider.convertFroms.push(currency);
            }
        }
*/
    };
    const onCurrencyData = (result) => {
        const currencyDataJson = result;
        currencyData = JSON.parse(currencyDataJson);
        if (currencyData && currencySymbols && iso4217Currencies && regionFormats) {
            onJsonsDone();
        }
    };
    const currencyDataRequest = new XMLHttpRequest();
    currencyDataRequest.overrideMimeType("application/json");
    currencyDataRequest.open("GET", "dcc-common-lib/currencyData.json", true);
    currencyDataRequest.onreadystatechange = () => {
        if (currencyDataRequest.readyState === 4 && currencyDataRequest.status === 200) {
            onCurrencyData(currencyDataRequest.responseText);
        }
    };
    currencyDataRequest.send(null);
    const onCurrencySymbols = (result) => {
        const currencySymbolsJson = result;
        currencySymbols = JSON.parse(currencySymbolsJson);
        if (currencyData && currencySymbols && iso4217Currencies && regionFormats) {
            onJsonsDone();
        }
    };
    const currencySymbolsRequest = new XMLHttpRequest();
    currencySymbolsRequest.overrideMimeType("application/json");
    currencySymbolsRequest.open("GET", "dcc-common-lib/currencySymbols.json", true);
    currencySymbolsRequest.onreadystatechange = () => {
        if (currencySymbolsRequest.readyState === 4 && currencySymbolsRequest.status === 200) {
            onCurrencySymbols(currencySymbolsRequest.responseText);
        }
    };
    currencySymbolsRequest.send(null);
    const onIso4217Currencies = (result) => {
        const iso4217CurrenciesJson = result;
        iso4217Currencies = JSON.parse(iso4217CurrenciesJson);
        if (currencyData && currencySymbols && iso4217Currencies && regionFormats) {
            onJsonsDone();
        }
    };
    const iso4217CurrenciesRequest = new XMLHttpRequest();
    iso4217CurrenciesRequest.overrideMimeType("application/json");
    iso4217CurrenciesRequest.open("GET", "dcc-common-lib/iso4217Currencies.json", true);
    iso4217CurrenciesRequest.onreadystatechange = () => {
        if (iso4217CurrenciesRequest.readyState === 4 && iso4217CurrenciesRequest.status === 200) {
            onIso4217Currencies(iso4217CurrenciesRequest.responseText);
        }
    };
    iso4217CurrenciesRequest.send(null);
    const onRegionFormats = (result) => {
        const regionFormatsJson = result;
        regionFormats = JSON.parse(regionFormatsJson);
        if (currencyData && currencySymbols && regionFormats && regionFormats) {
            onJsonsDone();
        }
    };
    const regionFormatsRequest = new XMLHttpRequest();
    regionFormatsRequest.overrideMimeType("application/json");
    regionFormatsRequest.open("GET", "dcc-common-lib/regionFormats.json", true);
    regionFormatsRequest.onreadystatechange = () => {
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
