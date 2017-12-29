var markStartBtn = document.getElementById("btnMarkStart");
var markEndBtn = document.getElementById("btnMarkEnd");

function onLoad() {
	chrome.storage.sync.get("allowStartTimeBtn", function (obj) {
		if (markStartBtn) {
			if (obj.allowStartTimeBtn) {
				markStartBtn.disabled = false;
			} else {
				markStartBtn.disabled = true;
			}
		}
	});
}

function markDayStartTime(time) {
	var today = new Date();
	var date = today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear();

	chrome.storage.sync.set({ 'day': date, 'start': time }, function () {
		console.log("Date: " + date + " Start Time: " + time + " Saved!");
	});
}

function saveEntry(endOfWorkTime) {
	chrome.storage.sync.set({ 'end': endOfWorkTime }, function () {
		console.log("End Time " + endOfWorkTime);
	});
}

// Event Listeners
function onClickMarkStartButton() {
	var start = Date.now();
	markDayStartTime(start);

	var end = start + (9 * 60 * 60 * 1000);
	setAlarm(end);

	chrome.storage.sync.set({ 'allowStartTimeBtn': false }, function () {
		console.log("button value saved");
	});
}

function onClickMarkEndButton() {
	var end = Date.now();
	saveEntry(end);
}

if (markStartBtn) {
	addEventListener("click", onClickMarkStartButton);
}

if (markEndBtn) {
	addEventListener("click", onClickMarkEndButton);
}

document.addEventListener('DOMContentLoaded', onLoad, false);

chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.create({ url: chrome.runtime.getURL("overtime.html") });
});