var socket = io.connect('http://localhost:8080' ,{'forceNew' : true});


//mensajes quele llegan desde el servidor
socket.on('messages', function(data){
	console.log(data); //consola del navegador
})

socket.on('money', function(data){
    console.log(data); //consola del navegador
    sendMoney();
})

socket.on('numSales', function(data){
    console.log(data); //consola del navegador
    sendNumSales();
})

socket.on('timeSale', function(data){
    console.log(data); //consola del navegador
    sendTimeSale();
})

socket.on('gain', function(data){
    console.log(data); //consola del navegador
    sendGain();
})

socket.on('typeEvent', function(data){
    console.log(data); //consola del navegador
    sendTypeEvent();
})


function sendMoney() {
	var active = dataBase.result;
	var data = active.transaction(["agent"], "readonly");
	var object = data.objectStore("agent");
	var request = object.get(1);
	request.onsuccess = function () {
		var result = request.result;

		if (result !== undefined) {
			console.log("Enviando money: " + result.money);
			sendData('money', result.money);
		}
	};
}

function sendNumSales() {
	var active = dataBase.result;
	var data = active.transaction(["agent"], "readonly");
	var object = data.objectStore("agent");
	var request = object.get(1);
	request.onsuccess = function () {
		var result = request.result;

		if (result !== undefined) {
			console.log("Enviando numSales: " + result.numSales);
			sendData('numSales', result.numSales);
		}
	};
}

function sendTimeSale() {
	var active = dataBase.result;
	var data = active.transaction(["agent"], "readonly");
	var object = data.objectStore("agent");
	var request = object.get(1);
	request.onsuccess = function () {
		var result = request.result;

		if (result !== undefined) {
			console.log("Enviando timeSale: " + result.timeSale);
			sendData('timeSale', result.timeSale);
		}
	};
}

function sendGain() {
	var active = dataBase.result;
	var data = active.transaction(["agent"], "readonly");
	var object = data.objectStore("agent");
	var request = object.get(1);
	request.onsuccess = function () {
		var result = request.result;

		if (result !== undefined) {
			console.log("Enviando gain: " + result.gain);
			sendData('gain', result.gain);
		}
	};
}

function sendTypeEvent() {
	var active = dataBase.result;
	var data = active.transaction(["agent"], "readonly");
	var object = data.objectStore("agent");
	var request = object.get(1);
	request.onsuccess = function () {
		var result = request.result;

		if (result !== undefined) {
			console.log("Enviando typeEvent: " + result.typeEvent);
			sendData('typeEvent', result.typeEvent);
		}
	};
}

function sendData(response, value){
	var data = {
		response:response,
		value:value
	};

	socket.emit('reply-message',data);
	return false;
}



