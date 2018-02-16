// Author: Abhishek L. Deore
// Next Stages: 1. Add validations
//			    2. Improve/Polish UI (Add Notification toast, Design changes in UI)
//			    3. Add Delete (Need Design checks!)
//			    4. Sort dates properly!

var storage = chrome.storage.sync;
var btnMarkAdd = document.getElementById("btnMarkAdd");
var btnMarkUpdate = document.getElementById("btnMarkUpdate");
var btnExportTable = document.getElementById("btnExportTable");
var btnDownloadEmail = document.getElementById("btnSendEmail");
var checkbox = document.querySelector("input[name=deleteMode]");
var deleteMode = false;

function getValueForHTMLId(htmlId) {
	return document.getElementById(htmlId).value;
}

function setData(key, value) {
	storage.set({ [key]: value });
}

function removeData(key) {
	storage.remove([key]);
}

function generateEmail(email) {
	var css = (
		'<style>' +
		'@page tableContentDoc{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
		'div#attendanceTable {page: tableContentDoc;}' +
		'table{border-collapse:collapse;}td{border:1px gray solid;width:5em;padding:2px;}' +
		'*{font-family:"Arial, Helvetica, sans-serif"}' +
		'</style>'
	);

	return (
		"To: <" + email.sendTo + ">" + "\n" +
		"Subject: " + email.subject + "\n" +
		"X-Unsent: 1" + "\n" +
		"Content-Type: text/html" + "\n\n" +
		"<html>" + "\n" +
		"<head>" + "\n" +
		css + "\n" +
		"</head>" + "\n" +
		"<body>" + "\n" +
		email.message + "\n\n" +
		email.tableContent + "\n\n\n" +
		email.footer + "\n" +
		"</body>" + "\n" +
		"</html>"
	);
}

function generateList() {

	storage.get(null, function (items) {
		var allKeys = Object.keys(items);

		var selectDate = document.createElement("select");
		selectDate.id = "dateSelector";

		var option = document.createElement("option");
		option.text = "Choose a Date";
		option.selected = true;
		option.disabled = true;
		selectDate.appendChild(option);

		for (var i = 0; i < allKeys.length; ++i) {
			var currentKey = allKeys[i];

			option = document.createElement("option");
			option.value = currentKey;
			option.text = currentKey;

			selectDate.appendChild(option);
		}

		document.getElementById("selectDate").appendChild(selectDate);
	});
}

function updateList() {
	
	if (dateSelector) {
		storage.get(null, function (items) {
			var allKeys = Object.keys(items);

			// Create a Hash for all the dates in visible list
			var optionSet = new Set();
			for (var i = 0; i < dateSelector.length; ++i) {
				optionSet.add(dateSelector.options[i].value);
			}

			// Find which date is missing
			var flag = false;
			var value;
			for (var i = 0; i < allKeys.length; ++i) {
				if (optionSet.has(allKeys[i]) == false) {
					value = allKeys[i]
					flag = true;
					break;
				}
			}

			// If found such date, add it to the list
			if (flag) {
				var option = document.createElement("option");
				option.value = value;
				option.text = value;

				dateSelector.appendChild(option);

				// This is needed to refresh the list
				$('select').material_select();
			}
		});
	}

}

function generateTable() {
	var table = document.createElement('table');
	table.setAttribute("id", "attendanceTable");
	table.setAttribute("class", "striped highlight centered");
	
	var tHead = document.createElement("thead");
	var tableHeader = document.createElement('tr');
	tableHeader.appendChild(createTableHeading("Date"));
	tableHeader.appendChild(createTableHeading("Start"));
	tableHeader.appendChild(createTableHeading("End"));
	tableHeader.appendChild(createTableHeading("Tasks"));
	tHead.appendChild(tableHeader);
	table.appendChild(tHead);

	var tBody = document.createElement("tBody");
	storage.get(null, function (items) {
		if (Object.keys(items).length == 0) {
			toggleTableWithEmptyContainer(true);
			return;
		}

		toggleTableWithEmptyContainer(false);
		for (currentKey of Object.keys(items)) {
			var dateElement = items[currentKey];

			var tableRow = document.createElement('tr');
			tableRow.appendChild(createTableData(currentKey));

			for (elementValue of Object.values(dateElement)) {
				tableRow.appendChild(createTableData(elementValue));
			}
			tBody.appendChild(tableRow);
		}
		table.appendChild(tBody);
		document.getElementById("tableContent").appendChild(table);
	});
}

function toggleTableWithEmptyContainer(visible) {
	if(visible) {
		$("#placeHolder").show();
	}else {
		$("#placeHolder").hide();
	}
}

function createTableData(value) {
	var tableData = document.createElement('td');
	tableData.appendChild(document.createTextNode(value));
	return tableData;
}

function createTableHeading(value) {
	var tableHeading = document.createElement('th');
	tableHeading.appendChild(document.createTextNode(value));
	return tableHeading;
}

function updateUI() {
	document.getElementById("attendanceTable").remove();

	generateTable();
	updateList();
}

// Event Listeners
function onClickMarkAddButton() {
	var date = getValueForHTMLId('timeAdd-date');
	var timeStamp = {
		"begin": getValueForHTMLId('timeAdd-start'),
		"end": getValueForHTMLId('timeAdd-end'),
		"tasks": getValueForHTMLId('timeAdd-tasks')
	};

	setData(date, timeStamp);
	updateUI();
	Materialize.toast('Entry Added!', 1000);
}

function onClickMarkUpdateButton() {
	// Get the new values & store them for the same date
	var e = document.getElementById("dateSelector");
	var date = e.options[e.selectedIndex].value;

	if (e.selectedIndex > 0) {

		if (deleteMode) {
			removeData(date);
			window.location.reload();
			Materialize.toast('Removed!', 1000);

		} else {
			var timeStamp = {
				"begin": getValueForHTMLId('timeUpdate-start'),
				"end": getValueForHTMLId('timeUpdate-end'),
				"tasks": getValueForHTMLId('timeUpdate-tasks')
			};

			setData(date, timeStamp);
			updateUI();

			Materialize.toast('Updated!', 1000);
		}
	}
}

function onClickDownloadEmailButton() {
	var textFile = null;
	var emailContent = {
		sendTo: getValueForHTMLId("txtSendTo"),
		subject: getValueForHTMLId("txtSubject"),
		message: getValueForHTMLId("txtMessage"),
		tableContent: document.getElementById("tableContent").innerHTML,
		footer: getValueForHTMLId("txtEmailFooter")
	}

	var emailBody = generateEmail(emailContent);

	var data = new Blob([emailBody], { type: 'text/plain' });

	if (textFile !== null) {
		window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	btnSendEmail.href = textFile;
}

function onClickExportTableButton() {

	if (!window.Blob) {
		alert('Your legacy browser does not support this action.');
		return;
	}

	var html, link, blob, url, css;

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

	// Word will append file extension - do not add an extension here.
	link.download = 'OTTable';

	document.body.appendChild(link);

	if (navigator.msSaveOrOpenBlob)
		navigator.msSaveOrOpenBlob(blob, 'OTTable.doc'); // IE10-11
	else
		link.click();

	document.body.removeChild(link);
}

function onSelectedDateChanged(date) {
	storage.get([date], function (result) {
		var startTime = result[date].begin;
		var endTime = result[date].end;
		var tasks = result[date].tasks;

		document.getElementById('timeUpdate-start').value = startTime;
		document.getElementById('timeUpdate-end').value = endTime;
		document.getElementById('timeUpdate-tasks').value = tasks;
	});
}

function onLoad() {
	console.log("onLoad() executed");

	if (btnMarkAdd) {
		btnMarkAdd.addEventListener("click", onClickMarkAddButton);
	}

	if (btnMarkUpdate) {
		btnMarkUpdate.addEventListener("click", onClickMarkUpdateButton);
	}

	if (btnExportTable) {
		btnExportTable.addEventListener("click", onClickExportTableButton);
	}

	if (btnDownloadEmail) {
		btnDownloadEmail.addEventListener("click", onClickDownloadEmailButton);
	}

	if (checkbox) {
		checkbox.addEventListener('change', function () {
			if (this.checked) {
				$("#divToggle").hide();
				btnMarkUpdate.value = "Delete";
				deleteMode = true;
			} else {
				$("#divToggle").show();
				btnMarkUpdate.value = "Update";
				deleteMode = false;
			}
		});
	}

	generateTable();
	generateList();
}

document.addEventListener('DOMContentLoaded', onLoad, false);

chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.create({ url: chrome.runtime.getURL("overtime.html") });
});

$(document).on('change', "#dateSelector", function () {
	onSelectedDateChanged($(this).val());
});

$('.datepicker').pickadate({
	selectMonths: true,
	selectYears: 15,
	today: 'Today',
	clear: 'Clear',
	close: 'Ok',
	closeOnSelect: false,
	format: 'dd-mm-yyyy'
});

$('.timepicker').pickatime({
	default: 'now',
	fromnow: 0,
	twelvehour: false,
	donetext: 'OK',
	cleartext: 'Clear',
	canceltext: 'Cancel',
	autoclose: false,
	ampmclickable: true,
	aftershow: function () { }
});

$('.dropdown-button').dropdown({
	inDuration: 300,
	outDuration: 225,
	constrainWidth: false,
	hover: true,
	gutter: 0,
	belowOrigin: false,
	alignment: 'left',
	stopPropagation: false
}
);

$('#btnScrollTop').click(function () {
	$("html, body").animate({ scrollTop: 0 }, 1000);
});

$(document).ready(function () {
	$('select').material_select();
	$('ul.tabs').tabs();
});

$(".button-collapse").sideNav();