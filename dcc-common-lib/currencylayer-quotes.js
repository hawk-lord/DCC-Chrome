/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const CurrencylayerQuotesServiceProvider = function(anEventAggregator, anInformationHolder) {
    const eventAggregator = anEventAggregator;

    eventAggregator.subscribe("quotesReceived", (eventArgs) => {
        // Convert from Currencylayer response.
        const response = JSON.parse(eventArgs);
        let quote = 1;
        // Currencylayer free subscription always converts from USD.
        // Check quote between USD and target currency.
        for (let resource in response.quotes) {
            console.log(resource + " " + anInformationHolder.convertToCurrency);

            if (anInformationHolder.convertToCurrency === resource.substring(3, 6)) {
                quote = response.quotes[resource];
                break;
            }
        }
        for (let resource in response.quotes) {
            anInformationHolder.setConversionQuote(resource.substring(3, 6), quote / response.quotes[resource]);
        }
        eventAggregator.publish("quotesParsed");
    });

    const loadQuotes = (aYahooQuotesService, apiKey) => {
        const urlString = "http://apilayer.net/api/live?access_key=" + apiKey + "&source=USD";
        aYahooQuotesService.fetchQuotes(urlString);
    };
    return {
        loadQuotes: loadQuotes
    };
};

if (typeof exports === "object") {
    exports.CurrencylayerQuotesServiceProvider = CurrencylayerQuotesServiceProvider;
}


