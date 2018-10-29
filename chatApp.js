// Simple multi client chat
// Jim Skon, 2018
// Kenyon College
// Run: node chatApp.js
var http = require('http');
var fs = require('fs');

//Everyone must use own port > 8000
port=8463

partners=[];
// Loading the index file . html displayed to the client
var server = http.createServer(function(req, res) {
  var url = req.url;
  // If no path, get the index.html
  if (url == "/") url = "/index.html";
  // get the file extension (needed for Content-Type)
  var ext = url.split('.').pop();
  console.log(url + "  :  " + ext);
  // convert file type to correct Content-Type
  var memeType = 'html'; // default
  switch (ext) {
    case 'css':
      memeType = 'css';
      break;
    case 'png':
      memeType = 'png';
      break;
    case 'jpg':
      memeType = 'jpeg';
      break;
  }
  // Send the requested file
  fs.readFile('.' + url, 'utf-8', function(error, content) {
    res.writeHead(200, {
      "Content-Type": "text/" + memeType
    });
    res.end(content);
  });
});

console.log("Loaded index file");
// Loading socket.io
var io = require('socket.io').listen(server);

// When a client connects, we note it in the console
io.sockets.on('connection', function(socket) {
    console.log('A client is connected!');
    // watch for message from client (JSON)
    socket.on('message', function(message) {
	// Join message {operation: 'join', name: clientname}
	if (message.operation == 'join') {
	    console.log('Client: ' + message.name + " joins");
	    // Send join message to all other clients
	    partners.push(message.name);
	    io.emit('message', {
		operation: 'join',
		name: partners
	    });
	}
	// Message from client {operation: 'mess', name: clientname, test: message}
	if (message.operation == 'mess') {
	    console.log('Message: ' + message.text);
	    // sent back out to everyone
	    socket.broadcast.emit('message', {
		operation: 'mess',
		name: message.name,
		text: message.text
	    });
	    // send back to sender
	    socket.emit('message', {
		operation: 'mess',
		name: message.name,
		text: message.text
	    });
	    
	}
    });
});

server.listen(port);
console.log("Listening on port: "+port);
