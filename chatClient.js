// Simple Web chat client
// Jim Skon 2018
// Kenyon College
// port (8080) must match  port of client
var socket = io.connect('http://cslab.kenyon.edu:8080');
// Watch for incomming messages from server (chatapp.js)
socket.on('message', function(message) {
  // A join message: {operation: 'join', name: clientname}
  if (message.operation == 'join') {
    console.log("Joins:" + message.name);
    $('#chatBox').html($('#chatBox').html() + "<font color='red'>User joins: </font>" + message.name + "<br />");
  }
  // A text message: {operation: 'mess', name: clientname, text: message}
  if (message.operation == 'mess') {
    console.log("Mess:" + message.text);
    $('#chatBox').html($('#chatBox').html() + "<font color='red'>" + message.name + ": </font>" + message.text + "<br />");
  }
})

// Action if they push the set name button
$('#name-btn').click(function() {
  var name = $('#yourname').val();
  console.log(name + " joins!");
  socket.emit('message', {
    operation: "join",
    name: name
  });
})
// Action if they push the send message button
$('#send-btn').click(function() {
  var message = $('#message').val();
  var name = $('#yourname').val();
  console.log(" message:" + message);
  socket.emit('message', {
    operation: "mess",
    name: name,
    text: message
  });
})
