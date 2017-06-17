/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const GcYahooQuotesServiceProvider = function() {
    const onCompleteFromTo = (aResponse) => {
        try {
            // console.log("onCompleteFromTo aResponse " + aResponse);
            eventAggregator.publish("quotesFromTo", aResponse);
        }
        catch(err) {
            console.error("err " + err);
        }
    };
    const onCompleteToFrom = (aResponse) => {
        try {
            // console.log("onCompleteToFrom aResponse " + aResponse);
            eventAggregator.publish("quotesToFrom", aResponse);
        }
        catch(err) {
            console.error("err " + err);
        }
    };
    const fetchQuotesFromTo = (aUrlString) => {
        // console.log("fetchQuotesFromTo ");
        const urlString = aUrlString;
        const request = new XMLHttpRequest();
        request.open("GET", aUrlString, true);
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                onCompleteFromTo(request.responseText);
            }
        };
        request.send(null);
    };
    const fetchQuotesToFrom = (aUrlString) => {
        // console.log("fetchQuotesToFrom ");
        const urlString = aUrlString;
        const request = new XMLHttpRequest();
        request.open("GET", aUrlString, true);
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                onCompleteToFrom(request.responseText);
            }
        };
        request.send(null);
    };
    return {
        fetchQuotesFromTo: fetchQuotesFromTo,
        fetchQuotesToFrom: fetchQuotesToFrom
    };
};

if (typeof exports === "object") {
    exports.GcYahooQuotesServiceProvider = GcYahooQuotesServiceProvider;
}
