chrome.browserAction.onClicked.addListener(function (tab) {
	console.log('blua');
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"msg": "click"});
	});
})