function markDayStartTime(time) {
	// will be replaced with storage 
	console.log("Start Time : " + time);
}

function saveEntry(time){
	// will be replaced with storage
	console.log("End Time : " + time);
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
}

chrome.alarms.onAlarm.addListener(function(alarm){
		console.log("End time: " + Date.now());
		alert('Day is over! Good Bye :)');
});

document.getElementById("btnMarkStart").addEventListener("click", onClickMarkStartButton);
document.getElementById("btnMarkEnd").addEventListener("click", onClickMarkEndButton);