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
    let gcQuotesService;
    let quotesService;

    const onStorageServiceInitDone = (informationHolder) => {
        gcGeoServiceFreegeoip = new GcFreegeoipServiceProvider();
        geoServiceFreegeoip = new FreegeoipServiceProvider();
        gcGeoServiceNekudo = new GcNekudoServiceProvider();
        geoServiceNekudo = new NekudoServiceProvider();
        gcQuotesService = new GcQuotesServiceProvider(eventAggregator);
        if (informationHolder.quotesProvider === "ECB") {
            quotesService = new EcbQuotesServiceProvider(eventAggregator, informationHolder);
        }
        else if (informationHolder.quotesProvider === "Currencylayer") {
            quotesService = new CurrencylayerQuotesServiceProvider(eventAggregator, informationHolder);
        }
        else if (informationHolder.quotesProvider === "Yahoo") {
            quotesService = new Yahoo2QuotesServiceProvider(eventAggregator, informationHolder);
        }
        const contentInterface = new GcContentInterface(informationHolder);
        const chromeInterface = new GcChromeInterface(informationHolder.conversionEnabled);
        eventAggregator.subscribe("countryReceivedFreegeoip", (countryCode) => {
            if (countryCode !== "") {
                informationHolder.convertToCountry = countryCode;
                quotesService.loadQuotes(gcQuotesService, informationHolder.apiKey);
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
            quotesService.loadQuotes(gcQuotesService, informationHolder.apiKey);
        });
        eventAggregator.subscribe("quotesParsed", () => {
            contentInterface.watchForPages();
        });
        eventAggregator.subscribe("toggleConversion", (eventArgs) => {
            contentInterface.toggleConversion(eventArgs);
        });
        eventAggregator.subscribe("showQuotesTab", () => {
            contentInterface.showQuotesTab();
        });
        eventAggregator.subscribe("showTestTab", () => {
            contentInterface.showTestTab();
        });
        eventAggregator.subscribe("saveSettings", (eventArgs) => {
            const toCurrencyChanged = informationHolder.convertToCurrency !== eventArgs.contentScriptParams.convertToCurrency;
            const quotesProviderChanged = informationHolder.quotesProvider !== eventArgs.contentScriptParams.quotesProvider;
            if (quotesProviderChanged) {
                if (eventArgs.contentScriptParams.quotesProvider === "ECB") {
                    quotesService = new EcbQuotesServiceProvider(eventAggregator, informationHolder);
                }
                else if (eventArgs.contentScriptParams.quotesProvider === "Currencylayer") {
                    quotesService = new CurrencylayerQuotesServiceProvider(eventAggregator, informationHolder);
                }
                else if (eventArgs.contentScriptParams.quotesProvider === "Yahoo") {
                    quotesService = new Yahoo2QuotesServiceProvider(eventAggregator, informationHolder);
                }
            }
            informationHolder.resetReadCurrencies();
            new ParseContentScriptParams(eventArgs.contentScriptParams, informationHolder);
            if (toCurrencyChanged || quotesProviderChanged) {
                quotesService.loadQuotes(gcQuotesService, informationHolder.apiKey);
            }
        });
        eventAggregator.subscribe("resetQuotes", (eventArgs) => {
            informationHolder.resetReadCurrencies();
            quotesService.loadQuotes(gcQuotesService, informationHolder.apiKey);
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
            quotesService.loadQuotes(gcQuotesService, informationHolder.apiKey);
        }
    };
    const onStorageServiceReInitDone = () => {
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
            onStorageServiceReInitDone();
        });
        const gcStorageServiceProvider = new GcStorageServiceProvider();
        gcStorageServiceProvider.init(iso4217Currencies, defaultExcludedDomains);
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

    chrome.runtime.onInstalled.addListener((details) => {
        if (details.reason === "install" || details.reason === "update") {
            chrome.tabs.create({ url:chrome.extension.getURL("common/help.html")} );
        }
    });

})();
