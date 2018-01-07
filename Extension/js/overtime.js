// Cannot write wrapper around chrome.storage.sync.get()
// because of its Asynchronous behaviour

var storage = chrome.storage.sync;
var btnMarkStart = document.getElementById("btnMarkStart");
var btnMarkEnd = document.getElementById("btnMarkEnd");
var storeKeys = ["start", "end"];
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

function generateTable() {
	storage.get(null, function (items) {
		var allKeys = Object.keys(items);

		var table = document.createElement('table');
		var tableBody = document.createElement('tbody');
		table.style.width = '100%';
		table.setAttribute('border', '1');

		for (var i = 0; i < allKeys.length; ++i) {
			var row = document.createElement('tr');
			var currentKey = allKeys[i];

			storage.get([currentKey], function (result) {

				var value = result[currentKey];
				row.appendChild(document.createTextNode(currentKey));
				for (var j = 0; j < 2; ++j) {
					var td = document.createElement('td');
					td.appendChild(document.createTextNode(value[storeKeys[j]]));
					row.appendChild(td);
				}
			});

			tableBody.appendChild(row);
		}
		table.appendChild(tableBody);
		document.getElementById('tableContent').appendChild(table);
	});
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

	generateTable();
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

$('.datepicker').pickadate({
	selectMonths: true, // Creates a dropdown to control month
	selectYears: 15, // Creates a dropdown of 15 years to control year,
	today: 'Today',
	clear: 'Clear',
	close: 'Ok',
	closeOnSelect: false // Close upon selecting a date,
});

$('.timepicker').pickatime({
	default: 'now', // Set default time: 'now', '1:30AM', '16:30'
	fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
	twelvehour: false, // Use AM/PM or 24-hour formatss
	donetext: 'OK', // text for done-button
	cleartext: 'Clear', // text for clear-button
	canceltext: 'Cancel', // Text for cancel-button
	autoclose: false, // automatic close timepicker
	ampmclickable: true, // make AM PM clickable
	aftershow: function () { } //Function for after opening timepicker
});