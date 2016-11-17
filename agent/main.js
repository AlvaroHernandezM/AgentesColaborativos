function connectServer(ip) {
	var socket = io.connect('http://' + ip + ':8080' ,{'forceNew' : true});

		//mensajes quele llegan desde el servidor
		socket.on('messages', function(data){
		console.log('Evento "' + data.name + '" asignado.');
		console.log(data); //consola del navegador
		addEvent(data);
		startSale(data);
	})

		socket.on('money', function(data){
	    console.log('Nueva peticion para el  evento: ' + data); //consola del navegador
	    sendMoney(data,socket); //parm- nombre del evento
	})

		socket.on('numSales', function(data){
	    console.log('Nueva peticion para el  evento: ' + data); //consola del navegador
	    sendNumSales(data,socket);
	})

		socket.on('timeSale', function(data){
	    console.log('Nueva peticion para el  evento: ' + data); //consola del navegador
	    sendTimeSale(data,socket);
	})
		
		socket.on('gain', function(data){
	    console.log('Nueva peticion para el  evento: ' + data); //consola del navegador
	    sendGain(data,socket);
	})

		socket.on('typeEvent', function(data){
	    console.log('Nueva peticion para el  evento: ' + data); //consola del navegador
	    sendTypeEvent(data,socket);
	})

	}



	function sendMoney(nameEvent, socket) {
		var active = dataBase.result;
		var data = active.transaction(["agent"], "readonly");
		var object = data.objectStore("agent");
		var request = object.get(1);
		request.onsuccess = function () {
			var result = request.result;

			if (result !== undefined) {
				console.log("Enviando money: " + result.money);
				sendData('money', result.money, nameEvent, socket);
			}
		};
	}

	function sendNumSales(nameEvent,socket) {
		var active = dataBase.result;
		var data = active.transaction(["agent"], "readonly");
		var object = data.objectStore("agent");
		var request = object.get(1);
		request.onsuccess = function () {
			var result = request.result;

			if (result !== undefined) {
				console.log("Enviando numSales: " + result.numSales);
				sendData('numSales', result.numSales, nameEvent, socket);
			}
		};
	}

	function sendTimeSale(nameEvent,socket) {
		var active = dataBase.result;
		var data = active.transaction(["agent"], "readonly");
		var object = data.objectStore("agent");
		var request = object.get(1);
		request.onsuccess = function () {
			var result = request.result;

			if (result !== undefined) {
				console.log("Enviando timeSale: " + result.timeSale);
				sendData('timeSale', result.timeSale,nameEvent,socket);
			}
		};
	}

	function sendGain(nameEvent,socket) {
		var active = dataBase.result;
		var data = active.transaction(["agent"], "readonly");
		var object = data.objectStore("agent");
		var request = object.get(1);
		request.onsuccess = function () {
			var result = request.result;

			if (result !== undefined) {
				console.log("Enviando gain: " + result.gain);
				sendData('gain', result.gain,nameEvent,socket);
			}
		};
	}

	function sendTypeEvent(nameEvent,socket) {
		var active = dataBase.result;
		var data = active.transaction(["agent"], "readonly");
		var object = data.objectStore("agent");
		var request = object.get(1);
		request.onsuccess = function () {
			var result = request.result;

			if (result !== undefined) {
				console.log("Enviando typeEvent: " + result.typeEvent);
				sendData('typeEvent', result.typeEvent,nameEvent,socket);
			}
		};
	}

	function sendData(response, value, nameEvent, socket){
		var data = {
			response:response,
			value:value,
			nameEvent:nameEvent
		};

		socket.emit('reply-message',data);
		return false;
	}


function WriteToFile() {

    set fso = CreateObject("Scripting.FileSystemObject");  
    set s = fso.CreateTextFile("log.txt", True);
    s.writeline("HI");
    s.writeline("Bye");
    s.writeline("-----------------------------");
    s.Close();
 }

WriteToFile();