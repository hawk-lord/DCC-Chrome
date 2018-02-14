/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const CurrencylayerQuotesServiceProvider = function(anEventAggregator) {
    const eventAggregator = anEventAggregator;
    const loadQuotes = (aYahooQuotesService) => {
        const urlString = "http://apilayer.net/api/live?access_key=f1ab3c2017f7014d83863df20d41bef4&source=USD";
        aYahooQuotesService.fetchQuotes(urlString);
    };
    return {
        loadQuotes: loadQuotes
    };
};

if (typeof exports === "object") {
    exports.CurrencylayerQuotesServiceProvider = CurrencylayerQuotesServiceProvider;
}


