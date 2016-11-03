module.exports = function(app,io,Event){

	

	app.get('/saludo', function(req, res){
		res.status(200).send('Hola, soy el servidor nodemon');
	//io.sockets.in(req.sessionID).send('Man, good to see you back!'); 2
	});

	app.get('/sendagents/:name/:numTickets/:price/:typeEvent/:dateEvent', function(req,res){
		console.log('entrando');
		var event = new Event({name:req.params.name, numTickets:req.params.numTickets, price:req.params.price, typeEvent:req.params.typeEvent, dateEvent:req.params.dateEvent});
		event.save(function(err, event){
			if(err) return console.error(err);
			console.log('Se ha guardado el evente con nombre: '+event.name);
			console.log(event.name+" - "+event.numTickets+" - "+event.price+" - "+event.typeEvent+" - "+event.dateEvent);
		});
		var message = 'Evento creado correctamente';
		res.status(200).send(message);
		io.sockets.emit('money',event.name);
	});
}