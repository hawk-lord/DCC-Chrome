/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *
 */

"use strict";

const EnabledCurrency = function(isoName, enabled) {
    this.isoName = isoName;
    this.enabled = enabled;
};

const DirectCurrencyConverter = (function() {
    let currencyData;
    let convertFroms;
    let iso4217Currencies;
    const defaultExcludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const localisation = new Localisation();
    const _ = localisation._;
    let informationHolder;
    let gcGeoServiceFreegeoip;
    let geoServiceFreegeoip;
    let gcGeoServiceNekudo;
    let geoServiceNekudo;
    let gcYahoo2QuotesService;
    let yahoo2QuotesService;

    const onStorageServiceInitDone = (informationHolder) => {
        gcGeoServiceFreegeoip = new GcFreegeoipServiceProvider();
        geoServiceFreegeoip = new FreegeoipServiceProvider();
        gcGeoServiceNekudo = new GcNekudoServiceProvider();
        geoServiceNekudo = new NekudoServiceProvider();
        gcYahoo2QuotesService = new GcYahoo2QuotesServiceProvider();
        yahoo2QuotesService = new Yahoo2QuotesServiceProvider(eventAggregator);
        const contentInterface = new GcContentInterface(informationHolder);
        const chromeInterface = new GcChromeInterface(informationHolder.conversionEnabled);
        eventAggregator.subscribe("countryReceivedFreegeoip", (countryCode) => {
            if (countryCode !== "") {
                informationHolder.convertToCountry = countryCode;
                yahoo2QuotesService.loadQuotes(gcYahoo2QuotesService);
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
            yahoo2QuotesService.loadQuotes(gcYahoo2QuotesService);
        });
        eventAggregator.subscribe("quotes", (eventArgs) => {
            const response = JSON.parse(eventArgs);
            let quote = 1;
            for (let resource of response.list.resources) {
                if (informationHolder.convertToCurrency === resource.resource.fields.symbol.substring(0, 3)) {
                    quote = resource.resource.fields.price;
                    break;
                }
            }
            for (let resource of response.list.resources) {
                informationHolder.setConversionQuote(resource.resource.fields.symbol.substring(0, 3), quote / resource.resource.fields.price);
            }
                contentInterface.watchForPages();
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
                yahoo2QuotesService.loadQuotes(gcYahoo2QuotesService);
            }
        });
        eventAggregator.subscribe("resetQuotes", (eventArgs) => {
            informationHolder.resetReadCurrencies();
            yahoo2QuotesService.loadQuotes(gcYahoo2QuotesService);
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
            yahoo2QuotesService.loadQuotes(gcYahoo2QuotesService);
        }
    };
    const onStorageServiceReInitDone = (informationHolder) => {
        geoServiceFreegeoip.loadUserCountry(gcGeoServiceFreegeoip);
    };
    const onJsonsDone = () => {
        eventAggregator.subscribe("storageInitDone", () => {
            convertFroms = gcStorageServiceProvider.convertFroms;
            informationHolder = new InformationHolder(gcStorageServiceProvider, currencyData,
                convertFroms, _);
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
        if (currencyData && iso4217Currencies) {
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
    const onIso4217Currencies = (result) => {
        const iso4217CurrenciesJson = result;
        iso4217Currencies = JSON.parse(iso4217CurrenciesJson);
        if (currencyData && iso4217Currencies) {
            onJsonsDone();
        }
    };
    const iso4217CurrenciesRequest = new XMLHttpRequest();
    iso4217CurrenciesRequest.overrideMimeType("application/json");
    iso4217CurrenciesRequest.open("GET", "dcc-common-lib/iso4217Currencies.json", true);
    iso4217CurrenciesRequest.onreadystatechange = () => {
        if (iso4217CurrenciesRequest.readyState === XMLHttpRequest.DONE && iso4217CurrenciesRequest.status === 200) {
            onIso4217Currencies(iso4217CurrenciesRequest.responseText);
        }
    };
    iso4217CurrenciesRequest.send(null);


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
