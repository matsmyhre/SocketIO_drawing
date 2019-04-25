function drawLine(context, x1, y1, x2, y2) {
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
}
function CanvasClear(context,h,w){
	context.fillStyle = "#FF0000";
	context.fillRect(0, 0, h, w);
}
var socket = io.connect();


	var user;
	var currentDrawer;
	
	function check(){
		console.log(user == currentDrawer);
	}

document.addEventListener("DOMContentLoaded", function() {
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var width = 500;
	var height = 500;

	
	
	
	document.getElementById("clearBtn").onclick = clear;

	canvas.width = width;
	canvas.height = height;

	var drawing = false;
	var cleared = false;
	var x, y, prevX, prevY;

	
	
	function clear(){
		canvas.width = canvas.width;
		clear = true;
		socket.emit("clear",{
			
		});
	}
	


	canvas.onmousedown = function(e) {
		drawing = true;
		prevX = x;
		prevY = y;
	}

	canvas.onmouseup = function(e) {
		drawing = false;
	}

	canvas.onmousemove = function(e) {
		if(currentDrawer == user){
			
	
		x = e.clientX;
		y = e.clientY;
		if (drawing) {
			socket.emit('draw', {
				'x1': prevX,
				'y1': prevY,
				'x2': x,
				'y2': y
			});

			drawLine(context, prevX, prevY, x, y);
			prevX = x;
			prevY = y;
		
		}
		}
	}


	socket.on('message', function (message) {
		console.log("I AM : " + message);
		user = message;
	});
	
	socket.on('currentDrawer', function (data) {
		console.log("CURRENT DRAWER IS " + data);
		console.log("AM I CURRENT DRAWER?" + data == user);
		currentDrawer = data;
		if(currentDrawer == user){
			document.getElementById("turn").innerHTML = "YOUR TURN";
		}else{
			document.getElementById("turn").innerHTML = "";
		}
	});
	
	
	
	socket.on('draw', function(data) {
		drawLine(context, data.x1, data.y1, data.x2, data.y2);
	});
	
		socket.on('updateTimer', function(data) {
		document.getElementById("timer").innerHTML = data;
	
	});
	
	
	
	
	socket.on('updateUser', function(data) {
		user = data;
	});
	
	

	
	socket.on('clear',function(){
		clear = true;
	//anvasClear(context,canvas.height,canvas.width);
		canvas.width = canvas.width;
		console.log("Cleared for all users!");
	})
});
