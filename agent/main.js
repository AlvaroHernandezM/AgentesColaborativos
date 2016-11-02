var socket = io.connect('http://localhost:8080' ,{'forceNew' : true});


//mensajes quele llegan desde el servidor
socket.on('welcome', function(data){
	//console.log(data); //consola del navegador
	renderOne(data, 'messages');
})

//mensajes quele llegan desde el servidor
socket.on('money', function(data){
    //console.log(data); //consola del navegador
    render(data);
})

//renderiza varios
function render(data) {  
    var html = data.map(function(elem, index){
        return(`<div>
                 <strong>${elem.asunt}</strong>:
                 <em>${elem.text}</em>
        </div>`)
    }).join(" ");
    document.getElementById('sendall').innerHTML = html;
}

function renderOne(data,element){
	 var html = `<div>
                 <strong>${data}</strong>:
                 <em>${data}</em>
        </div>`;
     document.getElementById(element).innerHTML = html;
}

function sendMessage(){
	var varSend = {
		asunt: 'Mensaje cliente:',
		text: 'Soy el cliente respondiendo a partir de lo que llego'
	};

	socket.emit('reply-message',varSend);
	return false;
}



