module.exports = function(app,io,Event){

	

	app.get('/saludo', function(req, res){
		res.status(200).send('Hola, soy el Servidor. API funcionando correctamente');
	//io.sockets.in(req.sessionID).send('Man, good to see you back!'); 2
	});

	app.get('/sendagents/:name/:numTickets/:price/:typeEvent/:dateEvent', function(req,res){
		var event = new Event({name:req.params.name, numTickets:req.params.numTickets, price:req.params.price, typeEvent:req.params.typeEvent, dateEvent:req.params.dateEvent});
		event.save(function(err, event){
			if(err) return console.error(err);
			console.log('Se ha guardado el evente con nombre: '+event.name);
			console.log(event.name+" - "+event.numTickets+" - "+event.price+" - "+event.typeEvent+" - "+event.dateEvent);
		});
		var message = 'Evento '+event.name+' creado correctamente';
		res.status(200).send(message);
		io.sockets.emit('numSales',event.name);
		timer = setInterval(function() {
			Event.findOne({ name: event.name }, function (err, eventAux){ //obteniendo evento
				if(eventAux.dateEvent>0 && eventAux.state==true){
					eventAux.dateEvent=eventAux.dateEvent-1;
					eventAux.save(function(err,event){
						if(err) return console.error(err);
						console.log('Se ha disminuido el valor de dateEvent '+eventAux.dateEvent+' y se espera un segundo para volver a disminuir');
					});
				} else {
					if(eventAux.state==false){
						console.log('el evento ha sido asignado antes de terminar el tiempo');
					} else {
						eventAux.state=false;
						eventAux.agent='None';
						eventAux.save(function(err){
						if(err) return console.error(err);
							console.log('Agrtenando como None el agente para este evento porque se ha terminado nadie se ha recuperado antes de su final');
						});
					}
					clearInterval(timer);
					timer = null;
				}
			});
		}, 10000);
	});
}