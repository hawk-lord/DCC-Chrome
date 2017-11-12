/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const Yahoo2QuotesServiceProvider = function(anEventAggregator) {
    const eventAggregator = anEventAggregator;
    const loadQuotes = (aYahooQuotesService) => {
        const urlString = "https://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json";
        aYahooQuotesService.fetchQuotes(urlString);
    };
    return {
        loadQuotes: loadQuotes
    };
};

if (typeof exports === "object") {
    exports.YahooQuotesServiceProvider = YahooQuotesServiceProvider;
}


