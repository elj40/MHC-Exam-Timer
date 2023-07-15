var currentTime = 0;
var endTimes = [];
var extraEndTimes = [];
var lengthTimes = [];

var mainTimeDisplay;

function addExam() {
	examForm = document.querySelector("#exam-form");
	examTable = document.querySelector("#exam-table"); 

	examNameInput = examForm.children[1];
	examStartInput = examForm.children[3];
	examLengthInput = examForm.children[5];

	addTimes(examStartInput, examLengthInput);

	cross = document.createElement("p");
	cross.innerHTML = "&#x2716;";
	cross.className = "x-symbol";
	cross.setAttribute("onclick", "removeRow(this)");

	examName = document.createElement("p");
	examName.innerText = examNameInput.value;

	timeLeft = document.createElement("p");
	timeLeft.innerText = getTimeLeft(endTimes.length-1);

	extraTimeLeft = document.createElement("p");
	extraTimeLeft.innerText = getExtraTimeLeft(extraEndTimes.length-1);

	examTable.appendChild(cross);
	examTable.appendChild(examName);
	examTable.appendChild(timeLeft);
	examTable.appendChild(extraTimeLeft);


	console.log(cross);

}

function removeRow(e) {
	examTable = e.parentElement;

	index = 0;
	for (let child of examTable.children) {
		if (child == e) break;
		index++;
	}

	let im = index%4;

	console.log(index, im);
	endTimes.splice(im,1);
	extraEndTimes.splice(im,1);
	lengthTimes.splice(im,1);


	for (let i = 3; i >= 0; i--) {
		x = examTable.children[index+i];
		examTable.removeChild(x);
	}

}

function hideExamForm() {
	examForm = document.querySelector("#exam-form")
	examForm.className = examForm.className.replace(" shown", " hidden")
}

function showExamForm() {
	examForm = document.querySelector("#exam-form")
	examForm.className = examForm.className.replace( " hidden"," shown")	
}

function updateTimes() {
	examTable = document.querySelector("#exam-table");
	for (let i = 0; i < endTimes.length; i++) {
		index = i*4+4;
		examTable.children[index+2].innerText=getTimeLeft(i);
		examTable.children[index+3].innerText=getExtraTimeLeft(i);
	}
}

function updateColours() {
	
	for (let i=0; i<endTimes.length; i++) {
		index = i*4+4;

		if (endTimes[i]-currentTime < 0) changeRowColours(i, "#0C2D48", "#ffffff");
		else if (endTimes[i]-currentTime < 10*1000) changeRowColours(i, "#ffff00", "#000000");
		else if (endTimes[i]-lengthTimes[i]-currentTime < 0) changeRowColours(i, "#ffffff", "#000000");
		else if (endTimes[i]-lengthTimes[i]-currentTime > 0) changeRowColours(i, "#aaaaaa", "#000000");
	
		if (extraEndTimes[i]-currentTime < 0) changeExtraColours(i, "#0C2D48", "#ffffff");
		else if (extraEndTimes[i]-currentTime < 10*1000) changeExtraColours(i, "#ffff00", "#000000");
		else if (extraEndTimes[i]-lengthTimes[i]*1.25-currentTime < 0) changeExtraColours(i, "#ffffff", "#000000");
		else if (extraEndTimes[i]-lengthTimes[i]*1.25-currentTime > 0) changeExtraColours(i, "#aaaaaa", "#000000");
	}
}

function changeRowColours(index, bgColor, fColor) {
	examTable = document.querySelector("#exam-table");
	i = index*4+4;

	examName = examTable.children[i+1];
	timeLeft = examTable.children[i+2];

	examName.style.backgroundColor = bgColor;
	timeLeft.style.backgroundColor = bgColor;

	examName.style.color = fColor;
	timeLeft.style.color = fColor;

}

function changeExtraColours(index, bgColor, fColor) {
	examTable = document.querySelector("#exam-table");
	i = index*4+4;

	extraTimeLeft = examTable.children[i+3];

	extraTimeLeft.style.backgroundColor = bgColor;

	extraTimeLeft.style.color = fColor;
}
















//Boiler plate for using time

window.onload = function() {
	mainTimeDisplay = document.querySelector("#current-time");

	endTimes[0] = new Date().getTime() + 20000;
	extraEndTimes[0] = new Date().getTime() + 20000*1.25;
	lengthTimes[0] = 20000;
	setInterval(() => {
		let time = new Date()
		currentTime = time.getTime();

		mainTimeString = msToString(currentTime);
		mainTimeDisplay.innerText = mainTimeString;

		updateTimes();
		updateColours();
	}, 1000);

	
}

function msToString(ms){
	let t = new Date(ms);

	sign = "";
	if (ms < 0) sign = "-";
	h = t.getHours().toString();
	m = t.getMinutes().toString();
	s = t.getSeconds().toString();

	if (h.length == 1) h = "0"+h;
	if (m.length == 1) m = "0"+m;
	if (s.length == 1) s = "0"+s;
	return h+":"+m+":"+s;
}

function msToString2(sign, micro) {
	let ms = Math.abs(micro);
	let h = Math.floor(ms/(60*60*1000));
	ms -= h*60*60*1000;

	
	let m = Math.floor(ms/(60*1000));
	ms -= m*60*1000;

	let s = Math.floor(ms/1000);
	ms -= s*1000;

	h = h.toString();
	m = m.toString();
	s = s.toString();

	if (sign.length>0) h = sign+h;

	if (h.length == 1) h = "0"+h;
	if (m.length == 1) m = "0"+m;
	if (s.length == 1) s = "0"+s;
	return h+":"+m+":"+s;
}

function stringToMs(s) {
	sep = s.split(":");

	h = parseInt(sep[0]) * 60 * 60 * 1000;
	m = parseInt(sep[1]) * 60 * 1000;
	s = parseInt(sep[2]) * 1000;
	ms = parseInt(sep[3]);

	return h+m+s+ms;
}


function addTimes(s, l) {
	startTime = s.value + ":00:00";
	length = l.value + ":00";
	lengthMs = stringToMs(length);

	startSplit = startTime.split(":");
	lengthSplit = length.split(":");

	sH = parseInt(startSplit[0]);
	sM = parseInt(startSplit[1]);
	sS = parseInt(startSplit[2]);

	today = new Date(currentTime);

	startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), sH, sM, sS);
	endDate = new Date(startDate.getTime()+lengthMs);
	xEndDate = new Date(startDate.getTime()+lengthMs*1.25);

	endTimes.push(endDate.getTime());
	extraEndTimes.push(xEndDate.getTime());
	lengthTimes.push(lengthMs);
}


function getTimeLeft(i) {
	if (endTimes[i] <= currentTime) return msToString2("+", endTimes[i]-currentTime);
	if (endTimes[i]-lengthTimes[i] > currentTime) return msToString2("-", endTimes[i]-lengthTimes[i]-currentTime);

	return msToString2("", endTimes[i]-currentTime);
}
function getExtraTimeLeft(i) {
	if (extraEndTimes[i] <= currentTime) return msToString2("+", extraEndTimes[i]-currentTime);
	if (extraEndTimes[i]-lengthTimes[i]*1.25 > currentTime) return msToString2("-", extraEndTimes[i]-lengthTimes[i]*1.25-currentTime);

	return msToString2("", extraEndTimes[i]-currentTime);
}