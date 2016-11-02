var express = require('express')
var mongoose = require('mongoose')
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server); 
routes = require('../routes/router')(app,io);

//var messages = [{
//		id:1,
//		text:"Conexión satisfactoria con el servidor",
//		asunt:"Mensaje bienvenida"
//	}]

app.use(express.static('server/public'))
var Agent = require('../models/agent')

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
	if (io.sockets.connected[idSocket]) {
    	io.sockets.connected[idSocket].emit('welcome', idSocket); //dinero
	} else{
		console.log('Se ha desconectado el cliente mientras se guardaba en la db, borrandolo');
		db.agents.remove({'id':idSocket});
		//db.agents.find({'state':True}).count()
	}
	//io.to(socket#id).emit('hey')
	//socket.emit('messages',messages);
	//socket.on('reply-message', function(data){

	//	messages.push(data);
	//	console.log(messages);
		//io.sockets.emit('messages', messages);
	//});
})

server.listen(8080, function() {  
    console.log('Servidor corriendo en http://localhost:8080');
});