window.postMessage({'msg': {'chees': 1}}, 'https://vk.com');

var initialized = false;
window.playAudioNew = function () {
  var args = arguments;
  if (args[args.length - 1] !== false) args = Array.prototype.slice.apply(arguments).concat([true]);
  stManager.add(['audioplayer.js', 'audioplayer.css'], function() {
    init();

	audioPlayer.operate.apply(null, args);
  });
};

window.addEventListener('message', function (event) {
	if (!initialized) {
		return;
	}

	if (event.source !== window) {
		return;
	}

	if (event.origin !== 'https://vk.com') {
		return;
	}

	var msg = event.data;

	if (!msg.add) {
		return;
	}

	var data = msg.add;
	console.log('adding', data);

	if (parseInt(data.oid) !== id0) {
		addAudio({el: void(0), aid: parseInt(data.aid), oid: parseInt(data.oid), hash: hash0});
	}
});

var hash0;
var id0;
function init() {
	if (!initialized) {
		var hash = document.documentElement.innerHTML.match(/\"addAudio[^\"]+\"/g);
		if (!hash) {
			return;
		}
		var hashVal;
		hash.forEach(function (match) {
			if (match.indexOf('hash') !== -1) {
				hashVal = match.match(/hash.{21}/g);

				if (hashVal) {
					hashVal = hashVal[0].substring(7);
				}	
			}
		});

		if (!hashVal || hashVal.length !== 18) {
			return;
		}

		hash0 = hashVal;

		console.log('AHSH', hash0);
		var id = vk && vk.id;

		if (!id) {
			return;
		}

		id0 = id;

		audioPlayer.oldOperate = audioPlayer.operate;
		audioPlayer.operate = function (id) {
			audioPlayer.oldOperate.apply(audioPlayer, arguments);
			window.postMessage({'play_id': id}, 'https://vk.com');
		};
		initialized = true;
	}
}

