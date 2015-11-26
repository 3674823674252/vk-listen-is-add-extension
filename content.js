var working = true;

var chrome

window.addEventListener('message', function (event) {
	if (!working) {
		return;
	}

	if (event.source !== window) {
		return;
	}

	if (event.origin !== 'https://vk.com') {
		return;
	}

	var msg = event.data;

	if (msg.clear) {
		return chrome.storage.local.clear(function () {
			window.postMessage({'cleared' : true}, 'https://vk.com/');
		});
	}

	if (!msg.play_id) {
		return;
	}

	var split = msg.play_id.split('_');
	var oid = split[0];
	var aid = split[1];
	var ts = (new Date()).getTime();

	chrome.storage.local.get('val', function (val) {
		console.log('what');
		if (typeof val !== 'object' && val) {
			val = JSON.parse(val);
		} else if (!val) {
			val = {};
		}
		val = val.val || {};

		if (typeof val === 'string') {
			val = JSON.parse(val);
		}

		console.log(val);
		if (ts - val.ts > 50000) {
			window.postMessage({add: val}, 'https://vk.com');
		} else {
			console.log('too fast bro');
		}
		console.log('setting', oid, aid, ts);
		chrome.storage.local.set({val: JSON.stringify({oid: oid, aid: aid, ts:ts})}, function () {
			console.log('received', msg);
		});
	});
	
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.msg === 'click') {
		working = !working;
		console.log('automatic addition of music is', working && 'enabled' || 'disabled');
	}
});

var s = document.createElement('script');
s.src = chrome.extension.getURL('inject.js');
s.onload = function () {
	this.parentNode.removeChild(this);
};
document.body.appendChild(s);
