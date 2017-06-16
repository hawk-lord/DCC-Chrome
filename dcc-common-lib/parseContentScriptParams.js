/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

/**
 *
 * @param aContentScriptParams
 * @param anInformationHolder
 * @constructor
 */
const ParseContentScriptParams = function(aContentScriptParams, anInformationHolder) {
    "use strict";
    anInformationHolder.convertToCurrency = aContentScriptParams.convertToCurrency;
    anInformationHolder.convertToCountry = aContentScriptParams.convertToCountry;
    anInformationHolder.enableOnStart = aContentScriptParams.enableOnStart;
    anInformationHolder.excludedDomains = aContentScriptParams.excludedDomains;
    anInformationHolder.convertFroms = aContentScriptParams.convertFroms;
    anInformationHolder.quoteAdjustmentPercent = aContentScriptParams.quoteAdjustmentPercent;
    anInformationHolder.roundPrices = aContentScriptParams.roundAmounts;
    anInformationHolder.showOriginalPrices = aContentScriptParams.showOriginalPrices;
    anInformationHolder.showOriginalCurrencies = aContentScriptParams.showOriginalCurrencies;
    anInformationHolder.showTooltip = aContentScriptParams.showTooltip;
    anInformationHolder.tempConvertUnits = aContentScriptParams.tempConvertUnits;
};

if (typeof exports === "object") {
    exports.ParseContentScriptParams = ParseContentScriptParams;
}
