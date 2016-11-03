var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//Creacion base de datos
function startDB(name) {
	dataBase = indexedDB.open(name, 1);
	dataBase.onupgradeneeded = function (e) {

		active = dataBase.result;

		object = active.createObjectStore("agent", {keyPath : 'id', autoIncrement : true });
		object.createIndex('by_money', 'money', { unique : false });
		object.createIndex('by_numSales', 'numSales', { unique : false });
		object.createIndex('by_timeSale', 'timeSale', { unique : false });
		object.createIndex('by_gain', 'gain', { unique : false });
		object.createIndex('by_typeEvent', 'typeEvent', { unique : false });

		object = active.createObjectStore("event", {keyPath : 'id', autoIncrement : true });
		object.createIndex('by_name', 'name', { unique : false });
		object.createIndex('by_state', 'state', { unique : false });
		object.createIndex('by_numTickets', 'numTickets', { unique : false });
		object.createIndex('by_typeEvent', 'typeEvent', { unique : false });
		object.createIndex('by_dateEvent', 'dateEvent', { unique : false });
	};

	dataBase.onsuccess = function (e) {
		console.log('Base de datos cargada correctamente');

	};

	dataBase.onerror = function (e)  {
		console.log('Error cargando la base de datos');
	};
}

//Agregar agente a la coleccion agent
function addAgent() {
	var active = dataBase.result;
	var data = active.transaction(["agent"], "readwrite");
	var object = data.objectStore("agent");

	var request = object.put({
		money: document.querySelector("#money").value,
		numSales: document.querySelector("#numSales").value,
		timeSale: document.querySelector("#timeSale").value,
		gain: document.querySelector("#gain").value,
		typeEvent: document.querySelector("#typeEvent").value
	});

	request.onerror = function (e) {
		console.log(request.error.name + '\n\n' + request.error.message);
	};

	data.oncomplete = function (e) {
		document.querySelector("#money").value = '';
		document.querySelector("#numSales").value = ''; 
		document.querySelector("#timeSale").value = '';
		document.querySelector("#gain").value = '';
		document.querySelector("#typeEvent").value = '';
		console.log('Objeto agregado correctamente');
	};
}



