function markDayStartTime(time) {
	console.log("Start Time : " + time);
}

function setAlarm(time){
	chrome.alarms.create("EndWork", {when : time + 1000});
}

function saveEntry(time){
	console.log("End Time : " + time);
}

function onClickMarkTimeButton(){
	var start = Date.now();
	markDayStartTime(start);
	setAlarm(start + 10);
}

chrome.alarms.onAlarm.addListener(function(alarm){
		console.log("End time: " + Date.now());
});

document.getElementById("btnMarkTime").addEventListener("click", onClickMarkTimeButton);