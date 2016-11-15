var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//Creacion base de datos
function startDB(name) {
	indexedDB.deleteDatabase(name);
	dataBase = indexedDB.open(name, 1);
	dataBase.onupgradeneeded = function (e) {
		active = dataBase.result;

		object = active.createObjectStore('agent', {keyPath : 'id', autoIncrement : false });
		object.createIndex('by_money', 'money', { unique : false });
		object.createIndex('by_numSales', 'numSales', { unique : false });
		object.createIndex('by_timeSale', 'timeSale', { unique : false });
		object.createIndex('by_gain', 'gain', { unique : false });
		object.createIndex('by_typeEvent', 'typeEvent', { unique : false });

		object = active.createObjectStore('event', {keyPath : 'id', autoIncrement : true });
		object.createIndex('by_name', 'name', { unique : false });
		object.createIndex('by_state', 'state', { unique : false });
		object.createIndex('by_numTickets', 'numTickets', { unique : false });
		object.createIndex('by_typeEvent', 'typeEvent', { unique : false });
		object.createIndex('by_dateEvent', 'dateEvent', { unique : false });
	};

	dataBase.onsuccess = function (e) {
		console.log('Base de datos cargada correctamente');
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
		money: document.querySelector('#money').value,
		numSales: 0,
		timeSale: document.querySelector('#timeSale').value,
		gain: document.querySelector('#gain').value,
		typeEvent: document.querySelector('#typeEvent').value
	});

	request.onerror = function (e) {
		console.log(request.error.name + '\n\n' + request.error.message);
	};

	data.oncomplete = function (e) {
		console.log('Objeto agregado correctamente');
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
		name: event.name,
		state: event.state,
		numTickets: event.numTickets,
		typeEvent: event.typeEvent,
		dateEvent: event.dateEvent
	});

	request.onerror = function (e) {
		console.log(request.error.name + '\n\n' + request.error.message);
	};

	data.oncomplete = function (e) {
		renderEvent();
		console.log('Evento Asignado');
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
			<td>' + elements[key].dateEvent + '</td>\n\
			</tr>';
		}

		elements = [];
		document.querySelector("#elementsList").innerHTML = outerHTML;
	};
}



