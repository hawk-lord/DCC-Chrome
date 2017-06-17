/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const toggleConversion = () => {
    chrome.runtime.sendMessage({command: "toggleConversion"});
};

const openQuotesPage = () => {
    chrome.runtime.sendMessage({command: "showQuotesTab"});
};

const openTest = document.getElementById("toggleConversion");
openTest.addEventListener("click", toggleConversion);

const openQuotes = document.getElementById("openQuotes");
openQuotes.addEventListener("click", openQuotesPage);
