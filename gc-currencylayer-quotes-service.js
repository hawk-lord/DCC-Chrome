/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const GcCurrencylayerQuotesServiceProvider = function() {
    const onComplete = (aResponse) => {
        try {
            // console.log("onComplete aResponse " + aResponse);
            eventAggregator.publish("quotesReceived", aResponse);
        }
        catch(err) {
            console.error("err " + err);
        }
    };
    const fetchQuotes = (aUrlString) => {
        // console.log("fetchQuotes ");
        const urlString = aUrlString;
        const request = new XMLHttpRequest();
        request.open("GET", aUrlString, true);
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                onComplete(request.responseText);
            }
        };
        request.send(null);
    };
    return {
        fetchQuotes: fetchQuotes
    };
};

if (typeof exports === "object") {
    exports.GcCurrencylayerQuotesServiceProvider = GcCurrencylayerQuotesServiceProvider;
}
