/**
 * Created by per on 2017-03-17.
 */

const toggleConversion = () => {
    chrome.extension.sendMessage({command: "toggleConversion"});
};

const openQuotesPage = () => {
    chrome.extension.sendMessage({command: "showQuotesTab"});
};

const openTest = document.getElementById("toggleConversion");
openTest.addEventListener("click", toggleConversion);

const openQuotes = document.getElementById("openQuotes");
openQuotes.addEventListener("click", openQuotesPage);
