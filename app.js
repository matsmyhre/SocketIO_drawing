var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookie = require("cookie");


app.use(express.static(__dirname + '/public'));




var port = 3000;
http.listen(process.env.PORT, process.env.IP, function() {
	    console.log('Server running on port ' + process.env.PORT);
});

var allClients = [];
var currentDrawer = 0;



var seconds_left = 10;
var roundstarted = false;

function startRound(socket){
	var interval = setInterval(function() {
	
		io.sockets.emit("updateTimer",seconds_left);
		seconds_left--;
	    if (seconds_left <= 0)
	    {
	    	seconds_left = 10;
	    	io.sockets.emit('currentDrawer',allClients[1]);
	    	console.log("changed to : " + allClients[1]);
	        clearInterval(interval);
	    }
	}, 1000);

}

io.on('connection', function (socket) {

	allClients.push(socket.id);
	console.log("Client connected => " +  socket.id);


	
	 socket.send(socket.id);
	
	socket.on('disconnect', function (data) {
    console.log('Client disconnected =>' + socket.io);
    allClients.splice( allClients.indexOf(socket.id), 1 );
  });
  
	console.log(allClients.length );
	if(allClients.length > 1 && !roundstarted){
		startRound(socket);
		roundstarted = true;
		console.log("round started!");
		socket.broadcast.emit('currentDrawer',allClients[0]);
	}
	
	


	
	

	socket.on('draw', function (data) {
		socket.broadcast.emit('draw', data);
	});
	
	
	
		socket.on('clear', function () {
		socket.broadcast.emit('clear');
	});
});
