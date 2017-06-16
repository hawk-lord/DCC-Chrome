/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const ContentScriptParams = function(aTab, anInformationHolder) {
    "use strict";
    this.conversionQuotes = anInformationHolder.getConversionQuotes();
    this.convertToCurrency = anInformationHolder.convertToCurrency;
    this.convertToCountry = anInformationHolder.convertToCountry;
    this.enableOnStart = anInformationHolder.enableOnStart;
    this.excludedDomains = anInformationHolder.excludedDomains;
    this.convertFroms = anInformationHolder.convertFroms;
    this.quoteAdjustmentPercent = anInformationHolder.quoteAdjustmentPercent;
    this.roundAmounts = anInformationHolder.roundPrices;
    this.showOriginalPrices = anInformationHolder.showOriginalPrices;
    this.showOriginalCurrencies = anInformationHolder.showOriginalCurrencies;
    this.showTooltip = anInformationHolder.showTooltip;
    this.tempConvertUnits = anInformationHolder.tempConvertUnits;
    if (aTab && typeof aTab.isEnabled != "undefined")  {
        this.isEnabled = aTab.isEnabled;
    }
    else {
        this.isEnabled = anInformationHolder.conversionEnabled;
    }
    this.currencyNames = anInformationHolder.getCurrencyNames();
    this.convertFromCurrency = anInformationHolder.convertFromCurrency;
    this.alwaysConvertFromCurrency = anInformationHolder.alwaysConvertFromCurrency;
};

if (typeof exports === "object") {
    exports.ContentScriptParams = ContentScriptParams;
}
