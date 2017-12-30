var btnMarkStart = document.getElementById("btnMarkStart");
var btnMarkEnd = document.getElementById("btnMarkEnd");
var now = new Date();

function getCurrentDate() {
	var currentDate = (now.getDate()) + "/" + (now.getMonth() + 1) + "/" + (now.getFullYear());
	return currentDate;
}

function getCurrentTime() {
	var currentTime = (now.getHours()) + ":" + (now.getMinutes());
	return currentTime;
}

// Event Listeners
function onClickMarkStartButton() {
	var date = getCurrentDate();
	var start = getCurrentTime();
	chrome.storage.sync.set({},function(){

	});
}

function onClickMarkEndButton() {
	
}

function onLoad() {
	console.log("onLoad() executed");

	if (btnMarkStart) {
		btnMarkStart.addEventListener("click", onClickMarkStartButton);
	}

	if (btnMarkEnd) {
		btnMarkEnd.addEventListener("click", onClickMarkEndButton);
	}
}

document.addEventListener('DOMContentLoaded', onLoad, false);

chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.create({ url: chrome.runtime.getURL("overtime.html") });
});

/////////////////////////////////////////////////////////////////////////
// Create a table with date as key
// Fetch for it
// If Exists, then push value. Else create the date
// onLoad check if date exists
// 