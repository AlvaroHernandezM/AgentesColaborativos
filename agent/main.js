var socket = io.connect('http://localhost:8080' ,{'forceNew' : true});


//mensajes quele llegan desde el servidor
socket.on('messages', function(data){
	console.log(data); //consola del navegador
})

socket.on('money', function(data){
    console.log(data); //consola del navegador
    sendMoney(data); //parm- nombre del evento
})

socket.on('numSales', function(data){
    console.log(data); //consola del navegador
    sendNumSales(data);
})

socket.on('timeSale', function(data){
    console.log(data); //consola del navegador
    sendTimeSale(data);
})

socket.on('gain', function(data){
    console.log(data); //consola del navegador
    sendGain(data);
})

socket.on('typeEvent', function(data){
    console.log(data); //consola del navegador
    sendTypeEvent(data);
})


function sendMoney(nameEvent) {
	var active = dataBase.result;
	var data = active.transaction(["agent"], "readonly");
	var object = data.objectStore("agent");
	var request = object.get(1);
	request.onsuccess = function () {
		var result = request.result;

		if (result !== undefined) {
			console.log("Enviando money: " + result.money);
			sendData('money', result.money, nameEvent);
		}
	};
}

function sendNumSales(nameEvent) {
	var active = dataBase.result;
	var data = active.transaction(["agent"], "readonly");
	var object = data.objectStore("agent");
	var request = object.get(1);
	request.onsuccess = function () {
		var result = request.result;

		if (result !== undefined) {
			console.log("Enviando numSales: " + result.numSales);
			sendData('numSales', result.numSales, nameEvent);
		}
	};
}

function sendTimeSale(nameEvent) {
	var active = dataBase.result;
	var data = active.transaction(["agent"], "readonly");
	var object = data.objectStore("agent");
	var request = object.get(1);
	request.onsuccess = function () {
		var result = request.result;

		if (result !== undefined) {
			console.log("Enviando timeSale: " + result.timeSale);
			sendData('timeSale', result.timeSale,nameEvent);
		}
	};
}

function sendGain(nameEvent) {
	var active = dataBase.result;
	var data = active.transaction(["agent"], "readonly");
	var object = data.objectStore("agent");
	var request = object.get(1);
	request.onsuccess = function () {
		var result = request.result;

		if (result !== undefined) {
			console.log("Enviando gain: " + result.gain);
			sendData('gain', result.gain,nameEvent);
		}
	};
}

function sendTypeEvent(nameEvent) {
	var active = dataBase.result;
	var data = active.transaction(["agent"], "readonly");
	var object = data.objectStore("agent");
	var request = object.get(1);
	request.onsuccess = function () {
		var result = request.result;

		if (result !== undefined) {
			console.log("Enviando typeEvent: " + result.typeEvent);
			sendData('typeEvent', result.typeEvent,nameEvent);
		}
	};
}

function sendData(response, value, nameEvent){
	var data = {
		response:response,
		value:value,
		nameEvent:nameEvent
	};

	socket.emit('reply-message',data);
	return false;
}



