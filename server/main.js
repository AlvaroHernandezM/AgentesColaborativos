var express = require('express')
var mongoose = require('mongoose')
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server); 

//var messages = [{
//		id:1,
//		text:"Conexión satisfactoria con el servidor",
//		asunt:"Mensaje bienvenida"
//	}]

app.use(express.static('server/public'))
var Agent = require('../models/agent')
var Event = require('../models/event')
routes = require('../routes/router')(app,io,Event);

//conectando a bd
mongoose.connect('mongodb://localhost/app_agents')

var db = mongoose.connection;


db.on('error', console.error.bind(console, 'conexión a bd con error:'));
db.once('open', function() {
	console.log('Abierta la bd');
});

//comando on dice se queda escuchando el servidor
io.on('connection', function(socket){ //cliente que ha mandado el mensaje
	//console.log('Alguien se ha conectado con Socket: '+socket.id+' - '+socket.handshake.sessionID)
	var idSocket = socket.id;
	var agent = new Agent({id:idSocket});
	//almacena el agente por id
	agent.save(function(err, agent){
		if(err) return console.error(err);
		console.log('Se ha guardado el agente con id: '+socket.id);
	});
	//socket.join(socket.handshake.sessionID); 2
	//enviando id asginado en la bd al cliente
	//if (io.sockets.connected[idSocket]) {
    //	io.sockets.connected[idSocket].emit('welcome', idSocket); //dinero
	//} else{
	//	console.log('Se ha desconectado el cliente mientras se guardaba en la db, borrandolo');
	//	Agent.remove({ id: idSocket }, function (err) {
	//	if (err) return handleError(err);
		  	//console.log('Usuario desconectado y eliminado db: '+idSocket);
		//});
		//db.agents.find({'state':True}).count()
	//}
	//io.to(socket#id).emit('hey')
	//socket.emit('messages',messages);
	//socket.on('reply-message', function(data){

	//	messages.push(data);
	//	console.log(messages);
		//io.sockets.emit('messages', messages);
	//});
	socket.on('reply-message',function(data){
		console.log(data);
		if(data.response=='money'){
			console.log('Es sobre dinero: '+data.value);
			Agent.findOne({ id: idSocket }, function (err, agent){
				if(err) return console.error(err);
				agent.money = data.value;				
				agent.save(function(err, agent){
					if(err) return console.error(err);
					console.log('Se ha actualizado agente con money: '+agent.money);
				});
				console.log('Que postula al evento: '+data.nameEvent);
			  Event.findOne({ name: data.nameEvent }, function (err, event){ //obteniendo evento
			  	if((event.price*event.numTickets)>agent.money){ //comparando los precios
			  		agent.state = false;  //cambiando el estado del agente (verificar problemas futuros)
			  		agent.save(function(err,agent){
			  			if(err) return console.error(err);
			  			console.log('Se ha cambiando el estado del agente a '+agent.state+' por la insuficinete cantidad de dienro.');
			  		});
			  	} else {
			  		agent.state=true;
			  		agent.save(function(err,agent){
			  			if(err) return console.error(err);
			  			console.log('Se ha cambiando el estado del agente a '+agent.state);
			  		});			  		
			  	}
			  	agent.request = 'money';
			  	compareMoney(Agent,event,io,agent);			

			  });

			});
		} else if(data.response=='numSales') {
			console.log('Es sobre numSales: '+data.value);
			Agent.findOne({ id: idSocket }, function (err, agent){
				agent.numSales = data.value;
				agent.request = 'numSales';
				agent.save(function(err, agent){
					if(err) return console.error(err);
					console.log('Se ha actualizado agente con numSales: '+agent.numSales);
				});
				io.sockets.connected[idSocket].emit('money',data.nameEvent);
				console.log('peticion dinero enviado correctamente')
			});
		}  else if(data.response=='typeEvent') {
			console.log('Es sobre typeEvent: '+data.value);
			Agent.findOne({ id: idSocket }, function (err, agent){
				agent.typeEvent = data.value;
				agent.save(function(err, agent){
					if(err) return console.error(err);
					console.log('Se ha actualizado agente con typeEvent: '+agent.typeEvent);
				});
				console.log('Que postula al evento: '+data.nameEvent);
				Agent.find({state:true}).exec(function(err, result4){
					if(err) return console.error(err);
					console.log('result4.length ** '+result4.length);
					console.log(result4);
					var agentsEvent = result4;
					Event.findOne({ name: data.nameEvent }, function (err, event){ //obteniendo evento
				  	if(event.typeEvent==agent.typeEvent){ //comparando los precios
						agent.state = true;  //cambiando el estado del agente (verificar problemas futuros)
						agent.save(function(err,agent){
							if(err) return console.error(err);
							console.log('Se ha cambiando el estado del agente a '+agent.state+' porque coincide el tipo de evento: '+event.typeEvent);
						});
					} else {
						agent.state=false;
						agent.save(function(err,agent){
							if(err) return console.error(err);
							console.log('Se ha cambiando el estado del agente a '+agent.state+' porque no coincide con el tipo');
						});			  		
					}
					agent.request = 'typeEvent';
					compareEvent(Agent,event,io,agent,agentsEvent);			

					});

				});	
			  
			});
		}
	});

	socket.on('disconnect', function(){
		Agent.remove({ id: idSocket }, function (err) {
			if (err) return handleError(err);
			console.log('Agente desconectado y eliminado db: '+idSocket);
		});
	});
});

server.listen(8080, function() {  
	Agent.remove({}, function (err) {
		if (err) return handleError(err);
		console.log('Eliminados todos agentes db');
	});
	Event.remove({}, function (err) {
		if (err) return handleError(err);
		console.log('Eliminados todos eventos db');
	});
	console.log('Servidor corriendo en http://localhost:8080');
});

function compareMoney(Agent,event,io,agent){
	Agent.find({request:'money'}).exec(function (err, results) {
		if(err) return console.error(err);
		var countRequestMoney;
		var countAgents;
		console.log("money "+results.length);
		countRequestMoney = results.length;
		Agent.find({}).exec(function (err, results1) {
			if(err) return console.error(err);
			console.log("todos "+results1.length);
			countAgents = results1.length;
			if(countAgents==countRequestMoney){
				iterateMoney(Agent,event,io,agent);
			} else {
				console.log('recursivo');
				compareMoney(Agent,event,io,agent);
			}
		});
	});
}

function iterateMoney(Agent,event,io,agent){
	console.log('ULTIMO');
	Agent.find({state:true}).exec(function (err, results3) {
	if(err) return console.error(err);
	console.log("stado final "+results3.length);
	if(results3.length==1){
		if(results3[0].id == agent.id){
			io.sockets.connected[agent.id].emit('messages', event);
			event.state=false;
			event.agent=agent.id;
			event.save(function(err,event){
				if(err) return console.error(err);
				console.log('Se ha cambiando el estado del evento: '+event.state+' y se agregado el agente asignado: '+event.agent);
			});
			console.log('enviado el eventp '+event.name+' a '+agent.id+' resultado ');
		} else {
			console.log('no hago nada');
		}						  				
	} else if(results3.length==0){
		if(event.dateEvent>0){
			setTimeout(function() {
				io.sockets.connected[agent.id].emit('numSales',event.name);
			}, 1000);
		} else {
			console.log('se le ha acabado el tiempo al evento, ese evento no deberia existir')
		}
	} else if (agent.state == true){
		console.log('continuando con pregunta tipo evento para '+agent.id);
		io.sockets.connected[agent.id].emit('typeEvent', event.name);
	}
	});
}

function compareEvent(Agent,event,io,agent,agentsEvent){
	Agent.find({request:'typeEvent'}).exec(function (err, results) {
		if(err) return console.error(err);
		var countRequestEvent;
		console.log("typeEvent "+results.length);
		countRequestEvent = results.length;
		if(agentsEvent.length==countRequestEvent){
			iterarEvent(Agent,event,io,agent,agentsEvent);
		} else {
			console.log('recursivo');
			compareEvent(Agent,event,io,agent,agentsEvent);
		}
	});
}

function iterarEvent(Agent,event,io,agent,agentsEvent){
	console.log('YA TODOS PASARON');
	Agent.find({state:true}).exec(function (err, results3) {
		if(err) return console.error(err);
		console.log("stado final "+results3.length);
		if(results3.length==1){
			if(results3[0].id == agent.id){
				io.sockets.connected[agent.id].emit('messages', event);
				event.state=false;
				event.agent=agent.id;
				event.save(function(err,agent){
				if(err) return console.error(err);
				console.log('Se ha cambiando el estado del evento: '+event.state+' y se agregado el agente asignado: '+event.agent);
				});
				console.log('enviado el eventp '+event.name+' a '+agent.id+' resultado ');
			} else {
				console.log('no hago nada');
			}						  				
		} else if(results3.length==0){
				//se debe ver con que agentes se tiene estado de true anteriormente
				//for (var aux in agentsEvent){
				//	io.sockets.connected[aux.id].emit('typeEvent', event.name);
				//}
			console.log('ninguno cumple la condición del evento, se asginara el amenor')
			Agent.find({}).exec(function (err, agents) {
				if(err) throw err;
				min=1000;
				id=-1;
				idMin=-1;
				agents.forEach(function(agent){
					id+=1;
					if(agent.numSales<min && agent.request=='typeEvent'){
						min = agent.numSales;
						idMin=id;
					}
				});
				if(agents[idMin].id == agent.id){
					io.sockets.connected[agent.id].emit('messages', event);
					event.state=false;
					event.agent=agent.id;
					event.save(function(err,agent){
					if(err) return console.error(err);
					console.log('Se ha cambiando el estado del evento: '+event.state+' y se agregado el agente asignado: '+event.agent);
					});
					console.log('enviado el eventp '+event.name+' a '+agent.id+' ya que es el que menos numero de vetas tiene ');
				} else {
					console.log('no hago nada')
				}				
			});
		} else if(agent.state == true){
			console.log('continuando con pregunta numero ventas para el resto');
			io.sockets.connected[agent.id].emit('numSales', event.name);
		}
	});
}