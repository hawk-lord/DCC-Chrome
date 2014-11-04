const message = {greeting: "Hej"};
const options = null;
chrome.runtime.sendMessage(message, options, DirectCurrencySettings.showSettings);

document.addEventListener('DOMContentLoaded', DirectCurrencySettings);
