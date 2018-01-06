var storage = chrome.storage.sync;
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

function setData(key, value) {
	storage.set({ [key]: value });
}

// Event Listeners
function onClickMarkStartButton() {
	var date = getCurrentDate();
	var start = { 'start': getCurrentTime() };

	setData(date, start);
}

function onClickMarkEndButton() {
    var date = getCurrentDate();
    chrome.storage.sync.get(date, function (obj) {
		var value = obj[date];
		var startTime = value["start"];
		
        setData(date, {
            start: startTime,
            end: getCurrentTime()
        });
    });
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

$("#mark").click(function () {
	$('html,body').animate({ scrollTop: $("#divMark").offset().top },
		'slow');
});

$("#check").click(function () {
	$('html,body').animate({ scrollTop: $("#divCheck").offset().top },
		'slow');
});

$("#pdf").click(function () {
	$('html,body').animate({ scrollTop: $("#divConvert").offset().top },
		'slow');
});

$("#about").click(function () {
	$('html,body').animate({ scrollTop: $("#divAbout").offset().top },
		'slow');
});

/////////////////////////////////////////////////////////////////////////
// Create a table with date as key
// Fetch for it
// If Exists, then push value. Else create the date
// onLoad check if date exists
// 