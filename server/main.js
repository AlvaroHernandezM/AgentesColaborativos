var express = require('express')
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server); 

var messages = [{
		id:1,
		text:"Conexión satisfactoria con el servidor",
		asunt:"Mensaje bienvenida"
	}]

app.use(express.static('public'))

app.get('/saludo', function(req, res){
	res.status(200).send('Hola, soy el servidor nodemon');
});

//comando on dice se queda escuchando el servidor
io.on('connection', function(socket){ //cliente que ha mandado el mensaje
	console.log('Alguien se ha conectado con Socket')
	socket.emit('messages',messages);

	socket.on('reply-message', function(data){

		messages.push(data);
		console.log(messages)
		//io.sockets.emit('messages', messages);
	});
})

server.listen(8080, function() {  
    console.log('Servidor corriendo en http://localhost:8080');
});