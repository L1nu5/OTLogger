// Cannot write wrapper around chrome.storage.sync.get()
// because of its Asynchronous behaviour

// Minor refactorings, modified storage calls to save time picker values

var storage = chrome.storage.sync;
var btnMarkAdd = document.getElementById("btnMarkAdd");
var btnMarkUpdate = document.getElementById("btnMarkUpdate");
var btnExportTable = document.getElementById("btnExportTable");
var now = new Date();

function getCurrentDate() {
	var currentDate = (now.getDate()) + "/" + (now.getMonth() + 1) + "/" + (now.getFullYear());
	return currentDate;
}

function getCurrentTime() {
	var currentTime = (now.getHours()) + ":" + (now.getMinutes());
	return currentTime;
}

function getValueForHTMLId(htmlId) {
	return document.getElementById(htmlId).value;
}

function setData(key, value) {
	storage.set({ [key]: value });
}

function generateList() {
	storage.get(null, function (items) {
		var allKeys = Object.keys(items);
		
		var items = '<ul id="dropdown1" class="dropdown-content">';
		for (var i = 0; i < allKeys.length; ++i) {
			var currentKey = allKeys[i];
			
			items += ('<li><a href="#!">' + currentKey + '</a></li>');
		}
		items += '</ul>';
		
		$("#dropDownDates").append(items);
	});
}

function generateTable() {
	var table = document.createElement('table');
	
	storage.get(null, function (items) {
		for (currentKey of Object.keys(items)) {
			var dateElement = items[currentKey];
			
			var tableRow = document.createElement('tr');
			tableRow.appendChild(createTableData(currentKey));
			
			for (elementValue of Object.values(dateElement)) {
				tableRow.appendChild(createTableData(elementValue));
			}
			table.appendChild(tableRow);
		}
		document.getElementById("tableContent").appendChild(table);
	});
}

function createTableData(value) {
	var tableData = document.createElement('td');
	tableData.appendChild(document.createTextNode(value));
	return tableData;
}

// Event Listeners
function onClickMarkAddButton() {
	var date = getValueForHTMLId('timeAdd-date');
	var timeStamp = {
		"start": getValueForHTMLId('timeAdd-start'),
		"end": getValueForHTMLId('timeAdd-end'),
		"tasks": getValueForHTMLId('timeAdd-tasks')
	};
	console.log(timeStamp);
	setData(date, timeStamp);
}

function onClickMarkUpdateButton() {
	
}

function onClickExportTableButton() {
	
	if (!window.Blob) {
		alert('Your legacy browser does not support this action.');
		return;
	}
	
	var html, link, blob, url, css;
	
	// EU A4 use: size: 841.95pt 595.35pt;
	// US Letter use: size:11.0in 8.5in;
	
	css = (
		'<style>' +
		'@page tableContentDoc{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
		'div#tableContent {page: tableContentDoc;}' +
		'table{border-collapse:collapse;}td{border:1px gray solid;width:5em;padding:2px;}' +
		'</style>'
	);
	
	html = document.getElementById("tableRoot").innerHTML;
	blob = new Blob(['\ufeff', css + html], {
		type: 'application/msword'
	});

	url = URL.createObjectURL(blob);
	link = document.createElement('A');
	link.href = url;
	// Set default file name. 
	// Word will append file extension - do not add an extension here.
	link.download = 'OTTable';

	document.body.appendChild(link);

	if (navigator.msSaveOrOpenBlob) 
		navigator.msSaveOrOpenBlob(blob, 'OTTable.doc'); // IE10-11
	else 
		link.click();  // other browsers

	document.body.removeChild(link);
}

function onLoad() {
	console.log("onLoad() executed");
	
	if (btnMarkAdd) {
		btnMarkAdd.addEventListener("click", onClickMarkAddButton);
	}
	
	if (btnMarkUpdate) {
		//btnMarkUpdate.addEventListener("click", onClickMarkUpdateButton);
	}
	
	if (btnExportTable) {
		btnExportTable.addEventListener("click", onClickExportTableButton);
	}
	
	generateTable();
	generateList();
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
	closeOnSelect: false, // Close upon selecting a date,
	format: 'dd-mm-yyyy'
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

$('.dropdown-button').dropdown({
	inDuration: 300,
	outDuration: 225,
	constrainWidth: false, // Does not change width of dropdown to that of the activator
	hover: true, // Activate on hover
	gutter: 0, // Spacing from edge
	belowOrigin: false, // Displays dropdown below the button
	alignment: 'left', // Displays dropdown with edge aligned to the left of button
	stopPropagation: false // Stops event propagation
}
);

$('#btnScrollTop').click(function () {
	$("html, body").animate({ scrollTop: 0 }, 1000);
});