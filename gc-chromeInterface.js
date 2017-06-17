/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const GcChromeInterface = function(conversionEnabled) {
    let buttonStatus = conversionEnabled;
    const setButtonAppearance = () => {
        const colour = buttonStatus ? "#00FF00" : "#FF0000";
        const text = buttonStatus ? "On" : "Off";
        chrome.browserAction.setBadgeBackgroundColor({color: colour});
        chrome.browserAction.setBadgeText({text: text});
    };
    setButtonAppearance();
    const onBrowserAction = () => {
        buttonStatus = !buttonStatus;
        setButtonAppearance();
        eventAggregator.publish("toggleConversion", buttonStatus);
    };
    chrome.browserAction.onClicked.addListener(onBrowserAction);

    const onMessageFromPanel = (message, sender, sendResponse) => {
        if (message.command === "toggleConversion") {
            onBrowserAction();
        }
        else if (message.command === "showQuotesTab") {
            eventAggregator.publish("showQuotesTab");
        }
    };
    chrome.runtime.onMessage.addListener(onMessageFromPanel);
};
