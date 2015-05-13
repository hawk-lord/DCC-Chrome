/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const GcStorageServiceProvider = function() {
    "use strict";
    var storage = {};
    const init = function (aDefaultEnabled, anExcludedDomains) {
        chrome.storage.local.get(null, function(aStorage) {
            storage = aStorage;
            if (!storage.excludedDomains) {
                storage.excludedDomains = anExcludedDomains;
                console.log("storage.excludedDomains " + storage.excludedDomains);
            }
            console.log("storage.dccPrefs " + storage.dccPrefs);
            if (!storage.dccPrefs) {
                storage.dccPrefs = {
                    // convertToCurrency: "EUR",
                    // convertToCountry: "PL",
                    customSymbols: {},
                    subUnitSeparator: ",",
                    enableOnStart: true,
                    quoteAdjustmentPercent: 0,
                    roundAmounts: false,
                    separatePrice: true,
                    showOriginalPrices: true,
                    unitAfter: true,
                    tempConvertUnits: false,
                    thousandSep: ".",
                    enabledCurrencies: aDefaultEnabled
                };
                console.log("done storage.dccPrefs " + storage.dccPrefs);
            }
            else {
                //if (storage.dccPrefs.convertToCurrency == null) {
                //    storage.dccPrefs.convertToCurrency = "EUR";
                //}
                //if (storage.dccPrefs.convertToCountry == null) {
                //    storage.dccPrefs.convertToCountry = "CZ";
                //}
                if (!storage.dccPrefs.customSymbols) {
                    storage.dccPrefs.customSymbols = {};
                }
                if (!storage.dccPrefs.subUnitSeparator) {
                    storage.dccPrefs.subUnitSeparator = ",";
                }
                if (!storage.dccPrefs.enableOnStart) {
                    storage.dccPrefs.enableOnStart = true;
                }
                if (!storage.dccPrefs.quoteAdjustmentPercent) {
                    storage.dccPrefs.quoteAdjustmentPercent = 0;
                }
                if (!storage.dccPrefs.roundAmounts) {
                    storage.dccPrefs.roundAmounts = false;
                }
                if (!storage.dccPrefs.separatePrice) {
                    storage.dccPrefs.separatePrice = true;
                }
                if (!storage.dccPrefs.showOriginalPrices) {
                    storage.dccPrefs.showOriginalPrices = true;
                }
                if (!storage.dccPrefs.unitAfter) {
                    storage.dccPrefs.unitAfter = true;
                }
                if (!storage.dccPrefs.tempConvertUnits) {
                    storage.dccPrefs.tempConvertUnits = false;
                }
                if (!storage.dccPrefs.thousandSep) {
                    storage.dccPrefs.thousandSep = ".";
                }
                if (!storage.dccPrefs.enabledCurrencies) {
                    storage.dccPrefs.enabledCurrencies = aDefaultEnabled;
                }
                else {
                    Object.keys(aDefaultEnabled).forEach(
                        function (key, index) {
                            if (!storage.dccPrefs.enabledCurrencies[key]) {
                                storage.dccPrefs.enabledCurrencies[key] = aDefaultEnabled[key];
                            }
                        }
                    )
                }
            }
            chrome.storage.local.set(storage);
            eventAggregator.publish("storageInitDone");
        });
    };
    const resetSettings = function()  {
        storage = {excludedDomains: [], dccPrefs: {}};
        chrome.storage.local.set(storage);
    };
    return {
        init: init,
        get convertToCurrency () {
            return storage.dccPrefs.convertToCurrency;
        },
        set convertToCurrency (aCurrency) {
            storage.dccPrefs.convertToCurrency = aCurrency;
                chrome.storage.local.set(storage);
        },
        get convertToCountry () {
            console.log("convertToCountry storage.dccPrefs " + storage.dccPrefs);
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
        get decimalSep () {
            return storage.dccPrefs.subUnitSeparator;
        },
        set decimalSep (aDecimalSep) {
            storage.dccPrefs.subUnitSeparator = aDecimalSep;
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
        get enabledCurrencies () {
            return storage.dccPrefs.enabledCurrencies;
        },
        set enabledCurrencies (anEnabledCurrencies) {
            storage.dccPrefs.enabledCurrencies = anEnabledCurrencies;
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
        get separatePrice () {
            return storage.dccPrefs.separatePrice;
        },
        set separatePrice (aSeparatePrice) {
            storage.dccPrefs.separatePrice = aSeparatePrice;
                chrome.storage.local.set(storage);
        },
        get showOriginalPrices () {
            return storage.dccPrefs.showOriginalPrices;
        },
        set showOriginalPrices (aShowOriginalPrices) {
            storage.dccPrefs.showOriginalPrices = aShowOriginalPrices;
                chrome.storage.local.set(storage);
        },
        get unitAfter () {
            return storage.dccPrefs.unitAfter;
        },
        set unitAfter (aUnitAfter) {
            storage.dccPrefs.unitAfter = aUnitAfter;
                chrome.storage.local.set(storage);
        },
        get thousandSep () {
            return storage.dccPrefs.thousandSep;
        },
        set thousandSep (aThousandSep) {
            storage.dccPrefs.thousandSep = aThousandSep;
                chrome.storage.local.set(storage);
        },
        get tempConvertUnits () {
            return storage.dccPrefs.tempConvertUnits;
        },
        set tempConvertUnits (aTempConvertUnits) {
            storage.dccPrefs.tempConvertUnits = aTempConvertUnits;
                chrome.storage.local.set(storage);
        },
        resetSettings: resetSettings
    };
};

