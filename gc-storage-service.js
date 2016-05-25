/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const GcStorageServiceProvider = function() {
    "use strict";
    let storage = {};
    const init = function (aConvertFroms, anExcludedDomains) {
        chrome.storage.local.get(null, function(aStorage) {
            storage = aStorage;
            if (!storage.excludedDomains) {
                storage.excludedDomains = anExcludedDomains;
            }
            if (!storage.dccPrefs) {
                storage.dccPrefs = {
                    customSymbols: {},
                    enableOnStart: true,
                    quoteAdjustmentPercent: 0,
                    roundAmounts: false,
                    showOriginalPrices: false,
                    showOriginalCurrencies: false,
                    showTooltip: true,
                    beforeCurrencySymbol: true,
                    currencySpacing: " ",
                    monetarySeparatorSymbol: ",",
                    monetaryGroupingSeparatorSymbol: ".",
                    tempConvertUnits: false,
                    convertFroms: aConvertFroms
                };
            }
            else {
                if (!storage.dccPrefs.customSymbols) {
                    storage.dccPrefs.customSymbols = {};
                }
                if (!storage.dccPrefs.monetarySeparatorSymbol) {
                    storage.dccPrefs.monetarySeparatorSymbol = ",";
                }
                if (storage.dccPrefs.enableOnStart === null || storage.dccPrefs.enableOnStart == null) {
                    storage.dccPrefs.enableOnStart = true;
                }
                if (!storage.dccPrefs.quoteAdjustmentPercent) {
                    storage.dccPrefs.quoteAdjustmentPercent = 0;
                }
                if (storage.dccPrefs.roundAmounts === null || storage.dccPrefs.roundAmounts == null) {
                    storage.dccPrefs.roundAmounts = false;
                }
                if ("string" !== typeof storage.dccPrefs.currencySpacing) {
                    storage.dccPrefs.currencySpacing = " ";
                }
                if (storage.dccPrefs.showOriginalPrices === null || storage.dccPrefs.showOriginalPrices == null) {
                    storage.dccPrefs.showOriginalPrices = false;
                }
                if (storage.dccPrefs.showOriginalCurrencies === null || storage.dccPrefs.showOriginalCurrencies == null) {
                    storage.dccPrefs.showOriginalCurrencies = false;
                }
                if (storage.dccPrefs.showTooltip === null || storage.dccPrefs.showTooltip == null) {
                    storage.dccPrefs.showTooltip = true;
                }
                if (storage.dccPrefs.beforeCurrencySymbol === null || storage.dccPrefs.beforeCurrencySymbol == null) {
                    storage.dccPrefs.beforeCurrencySymbol = true;
                }
                if (storage.dccPrefs.tempConvertUnits === null || storage.dccPrefs.tempConvertUnits == null) {
                    storage.dccPrefs.tempConvertUnits = false;
                }
                if (!storage.dccPrefs.monetaryGroupingSeparatorSymbol) {
                    storage.dccPrefs.monetaryGroupingSeparatorSymbol = ".";
                }
                if (!storage.dccPrefs.convertFroms) {
                    storage.dccPrefs.convertFroms = aConvertFroms;
                }
                else {
                    for (let currency of aConvertFroms) {
                        let found = false;
                        for (let storedCurrency of storage.dccPrefs.convertFroms) {
                            if (currency.isoName === storedCurrency.isoName) {
                                found = true;
                                break;
                            }
                        }
                        if (!found){
                            storage.dccPrefs.convertFroms.push(currency);
                        }
                    }
                }
                storage.dccPrefs.enabledCurrencies = null;
            }
            chrome.storage.local.set(storage);
            eventAggregator.publish("storageInitDone");
        });
    };
    const resetSettings = function(aDefaultEnabled)  {
        storage.dccPrefs = {
            customSymbols: {},
            enableOnStart: true,
            quoteAdjustmentPercent: 0,
            roundAmounts: false,
            showOriginalPrices: false,
            showOriginalCurrencies: false,
            showTooltip: true,
            beforeCurrencySymbol: true,
            currencySpacing: " ",
            monetarySeparatorSymbol: ",",
            monetaryGroupingSeparatorSymbol: ".",
            tempConvertUnits: false,
            convertFroms: aDefaultEnabled
        };
        chrome.storage.local.set(storage);
        eventAggregator.publish("storageReInitDone");
    };
    return {
        init: init,
        get convertToCurrency () {
            if (storage.dccPrefs) {
                return storage.dccPrefs.convertToCurrency;
            }
            else  {
                return "EUR";
            }
        },
        set convertToCurrency (aCurrency) {
            storage.dccPrefs.convertToCurrency = aCurrency;
            chrome.storage.local.set(storage);
        },
        get convertToCountry () {
            return storage.dccPrefs.convertToCountry;
        },
        set convertToCountry (aCountry) {
            storage.dccPrefs.convertToCountry = aCountry;
            chrome.storage.local.set(storage);
        },
        get customSymbols () {
            return storage.dccPrefs.customSymbols;
        },
        set customSymbols (aCustomSymbols) {
            storage.dccPrefs.customSymbols = aCustomSymbols;
            chrome.storage.local.set(storage);
        },
        get monetarySeparatorSymbol () {
            return storage.dccPrefs.monetarySeparatorSymbol;
        },
        set monetarySeparatorSymbol (aMonetarySeparatorSymbol) {
            storage.dccPrefs.monetarySeparatorSymbol = aMonetarySeparatorSymbol;
            chrome.storage.local.set(storage);
        },
        get enableOnStart () {
            if (storage.dccPrefs) {
                return storage.dccPrefs.enableOnStart;
            }
            return true;
        },
        set enableOnStart (anEnableOnStart) {
            storage.dccPrefs.enableOnStart = anEnableOnStart;
            chrome.storage.local.set(storage);
        },
        get excludedDomains () {
            return storage.excludedDomains;
        },
        set excludedDomains (anExcludedDomains) {
            storage.excludedDomains = anExcludedDomains;
            chrome.storage.local.set(storage);
        },
        get convertFroms () {
            return storage.dccPrefs.convertFroms;
        },
        set convertFroms (aConvertFroms) {
            storage.dccPrefs.convertFroms = aConvertFroms;
            chrome.storage.local.set(storage);
        },
        get quoteAdjustmentPercent () {
            return storage.dccPrefs.quoteAdjustmentPercent;
        },
        set quoteAdjustmentPercent (aQuoteAdjustmentPercent) {
            storage.dccPrefs.quoteAdjustmentPercent = aQuoteAdjustmentPercent;
            chrome.storage.local.set(storage);
        },
        get roundPrices () {
            return storage.dccPrefs.roundAmounts;
        },
        set roundPrices (aRoundPrices) {
            storage.dccPrefs.roundAmounts = aRoundPrices;
            chrome.storage.local.set(storage);
        },
        get currencySpacing () {
            return storage.dccPrefs.currencySpacing;
        },
        set currencySpacing (aCurrencySpacing) {
            storage.dccPrefs.currencySpacing = aCurrencySpacing;
            chrome.storage.local.set(storage);
        },
        get showOriginalPrices () {
            return storage.dccPrefs.showOriginalPrices;
        },
        set showOriginalPrices (aShowOriginalPrices) {
            storage.dccPrefs.showOriginalPrices = aShowOriginalPrices;
            chrome.storage.local.set(storage);
        },
        get showOriginalCurrencies () {
            return storage.dccPrefs.showOriginalCurrencies;
        },
        set showOriginalCurrencies (aShowOriginalCurrencies) {
            storage.dccPrefs.showOriginalCurrencies = aShowOriginalCurrencies;
            chrome.storage.local.set(storage);
        },
        get showTooltip () {
            return storage.dccPrefs.showTooltip;
        },
        set showTooltip (aShowTooltip) {
            storage.dccPrefs.showTooltip = aShowTooltip;
            chrome.storage.local.set(storage);
        },
        get beforeCurrencySymbol () {
            return storage.dccPrefs.beforeCurrencySymbol;
        },
        set beforeCurrencySymbol (aBeforeCurrencySymbol) {
            storage.dccPrefs.beforeCurrencySymbol = aBeforeCurrencySymbol;
            chrome.storage.local.set(storage);
        },
        get monetaryGroupingSeparatorSymbol () {
            return storage.dccPrefs.monetaryGroupingSeparatorSymbol;
        },
        set monetaryGroupingSeparatorSymbol (aMonetaryGroupingSeparatorSymbol) {
            storage.dccPrefs.monetaryGroupingSeparatorSymbol = aMonetaryGroupingSeparatorSymbol;
            chrome.storage.local.set(storage);
        },
        get tempConvertUnits () {
            return storage.dccPrefs.tempConvertUnits;
        },
        set tempConvertUnits (aTempConvertUnits) {
            storage.dccPrefs.tempConvertUnits = aTempConvertUnits;
            chrome.storage.local.set(storage);
        },
        setEnabledCurrency(aCurrency, anEnabled) {
            let found = false;
            for (let storedCurrency of storage.dccPrefs.convertFroms) {
                if (aCurrency.isoName === storedCurrency.isoName) {
                    found = true;
                    aCurrency.enabled = anEnabled;
                    break;
                }
            }
            if (!found){
                storage.dccPrefs.convertFroms.push({isoName: currency, enabled: anEnabled});
            }
            chrome.storage.local.set(storage);
        },
        resetSettings: resetSettings
    };
};

