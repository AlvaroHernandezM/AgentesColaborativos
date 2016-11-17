var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//Creacion base de datos
function startDB(name) {
	indexedDB.deleteDatabase(name);
	console.log('Eliminados datos de agente antiguo');
	dataBase = indexedDB.open(name, 1);
	dataBase.onupgradeneeded = function (e) {
		active = dataBase.result;

		object = active.createObjectStore('agent', {keyPath : 'id', autoIncrement : false });
		object.createIndex('by_money', 'money', { unique : false });
		object.createIndex('by_numSales', 'numSales', { unique : false });
		object.createIndex('by_timeSale', 'timeSale', { unique : false });
		object.createIndex('by_gain', 'gain', { unique : false });
		object.createIndex('by_typeEvent', 'typeEvent', { unique : false });

		object = active.createObjectStore('event', {keyPath : 'id', autoIncrement : false });
		object.createIndex('by_name', 'name', { unique : false });
		object.createIndex('by_state', 'state', { unique : false });
		object.createIndex('by_numTickets', 'numTickets', { unique : false });
		object.createIndex('by_price', 'price', { unique : false });
		object.createIndex('by_typeEvent', 'typeEvent', { unique : false });
		object.createIndex('by_dateEvent', 'dateEvent', { unique : false });
	};

	dataBase.onsuccess = function (e) {
		console.log('Base de datos iniciada correctamente');
		addAgent();
	};

	dataBase.onerror = function (e)  {
		console.log('Error cargando la base de datos');
	};
}

//Agregar agente a la coleccion agent
function addAgent() {
	var active = dataBase.result;
	var data = active.transaction(['agent'], 'readwrite');
	var object = data.objectStore('agent');

	var request = object.put({
		id: 1,
		money: parseInt(document.querySelector('#money').value),
		numSales: 0,
		timeSale: parseInt(document.querySelector('#timeSale').value),
		gain: parseInt(document.querySelector('#gain').value),
		typeEvent: document.querySelector('#typeEvent').value
	});

	request.onerror = function (e) {
		console.log(request.error.name + '\n\n' + request.error.message);
	};

	data.oncomplete = function (e) {
		console.log('Agente almacenado correctamente');
		ip = document.querySelector('#ip').value;
		connectServer(ip);
	};
}

//Agregar agente a la coleccion agent
function addEvent(event) {
	var active = dataBase.result;
	var data = active.transaction(['event'], 'readwrite');
	var object = data.objectStore('event');

	var request = object.put({
		id: event._id,
		name: event.name,
		state: 'Vendiendo',
		numTickets: event.numTickets,
		price: event.price,
		typeEvent: event.typeEvent,
		dateEvent: event.dateEvent
	});

	request.onerror = function (e) {
		console.log(request.error.name + '\n\n' + request.error.message);
	};

	data.oncomplete = function (e) {
		renderEvent();
	};
}

function refreshEvent(event) {
	var active = dataBase.result;
	var data = active.transaction(['event'], 'readwrite');
	var object = data.objectStore('event');

	var request = object.put({
		id: event._id,
		name: event.name,
		state: 'Vendido',
		numTickets: event.numTickets,
		price: event.price,
		typeEvent: event.typeEvent,
		dateEvent: event.dateEvent
	});

	request.onerror = function (e) {
		console.log(request.error.name + '\n\n' + request.error.message);
	};

	data.oncomplete = function (e) {
		renderEvent();
	};
}

function renderEvent() {
	var active = dataBase.result;
	var data = active.transaction(["event"], "readonly");
	var object = data.objectStore("event");

	var elements = [];

	object.openCursor().onsuccess = function (e) {
		var result = e.target.result;
		if (result === null) {
			return;
		}
		elements.push(result.value);
		result.continue();
	};

	data.oncomplete = function () {
		var outerHTML = '';
		for (var key in elements) {
			outerHTML += '\n\
			<tr>\n\
			<td>' + elements[key].name + '</td>\n\
			<td>' + elements[key].state + '</td>\n\
			<td>' + elements[key].numTickets + '</td>\n\
			<td>' + elements[key].typeEvent + '</td>\n\
			<td>' + elements[key].price + '</td>\n\
			</tr>';
		}

		elements = [];
		document.querySelector("#elementsList").innerHTML = outerHTML;
	};
}


//Actualizar dinero agente
function setMoney(event, mode) {
	var active = dataBase.result;
	var data = active.transaction(['agent'], 'readwrite');
	var object = data.objectStore('agent');

	var agent = [];

	object.openCursor().onsuccess = function (e) {
		var result = e.target.result;
		if (result === null) {
			return;
		}
		agent.push(result.value);
		result.continue();

		if (mode) { //Compra  - 
			console.log('Vendiendo boletas del evento "' + event.name + '".');
			newMoney = agent[0].money - (event.price*event.numTickets);
		}else{ // Ganacia + 
			console.log('Boletas del evento "' + event.name + '" vendidas con exito.');
			refreshEvent(event);
			newMoney = agent[0].money + (event.price*event.numTickets) + ((agent[0].gain *(event.price*event.numTickets))/100);
		}

		var request = object.put({
			id: agent[0].id,
			money: newMoney,
			numSales: agent[0].numSales,
			timeSale: agent[0].timeSale,
			gain: agent[0].gain,
			typeEvent: agent[0].typeEvent
		});
		request.onerror = function (e) {
			console.log(request.error.name + '\n\n' + request.error.message);
		};

		data.oncomplete = function (e) {
			console.log('Nuevo dinero: ' + newMoney);
			if (mode) {
				setTimeout(function() {
					setMoney(event, false);
				}, agent[0].timeSale*60000);
			}
		};
	};	
}

//Agregar nueva venta, agente
function startSale(event) {
	var active = dataBase.result;
	var data = active.transaction(['agent'], 'readwrite');
	var object = data.objectStore('agent');

	var agent = [];

	object.openCursor().onsuccess = function (e) {
		var result = e.target.result;
		if (result === null) {
			return;
		}
		agent.push(result.value);
		result.continue();
		var request = object.put({
			id: agent[0].id,
			money: agent[0].money,
			numSales: agent[0].numSales + 1,
			timeSale: agent[0].timeSale,
			gain: agent[0].gain,
			typeEvent: agent[0].typeEvent
		});

		request.onerror = function (e) {
			console.log(request.error.name + '\n\n' + request.error.message);
		};

		data.oncomplete = function (e) {
			console.log('Nuevo numero de ventas: ' + agent[0].numSales++);
			setMoney(event, true);
		};
	};
}



