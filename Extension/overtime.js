function markDayStartTime(time) {
	var today = new Date();
	var date = today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear();

	chrome.storage.sync.set({'day':date,'start':time},function(){
		console.log("Date: " + date + " Start Time: " + time + " Saved!");
	});
}

function saveEntry(endOfWorkTime){
	chrome.storage.sync.set({'end':endOfWorkTime}, function(){
		console.log("End Time " + endOfWorkTime);
	});
}

function setAlarm(time){
	chrome.alarms.create("EndWork", {when : time});
}

// Event Listeners
function onClickMarkStartButton(){
	document.getElementById("btnMarkStart").disabled = true;

	var start = Date.now();
	markDayStartTime(start);

	var end = start + (9 * 60 * 60 * 1000);
	setAlarm(end);
}

function onClickMarkEndButton(){
	var end = Date.now();
	saveEntry(end);
}

chrome.alarms.onAlarm.addListener(function(alarm){
		console.log("End time: " + Date.now());
		alert('Day is over! Good Bye :)');
});

document.getElementById("btnMarkStart").addEventListener("click", onClickMarkStartButton);
document.getElementById("btnMarkEnd").addEventListener("click", onClickMarkEndButton);