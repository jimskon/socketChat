// Simple Web chat client
// Jim Skon 2018
// Kenyon College
// port must match  port of client and be >8000
var port=8463;
var socket = io.connect('http://cslab.kenyon.edu:'+port);
// Watch for incomming messages from server (chatapp.js)
$(document).ready(function () {
    socket.on('message', function(message) {
	// A join message: {operation: 'join', name: clientname}
	if (message.operation == 'join') {
	    var names=message.name;
	    console.log(names);
	    var name=names[names.length-1];
	    console.log("Joins:" + name);
	    $('#chatBox').html($('#chatBox').html() + "<font color='red'>User joins: </font>" + name + "<br />");
	    var groupList="";
	    for (var n in names) {
		groupList+=names[n]+", ";
	    }
	    groupList=groupList.slice(0,-2);
	    $('#members').html("<h3>Chat Group: "+groupList+"</h3>"); 
	}
	// A text message: {operation: 'mess', name: clientname, text: message}
	if (message.operation == 'mess') {
	    console.log("Mess:" + message.text);
	    $('#chatBox').html($('#chatBox').html() + "<font color='red'>" + message.name + ": </font>" + message.text + "<br />");
	}
    })
    $('#chatinput').hide();
    // Action if they push the set name button
    $('#name-btn').click(function() {
	var name = $('#yourname').val()
	console.log(name + " joins!");
	$('#register').hide();
	$('#user').html("<h3>Name: "+name+"</h3>");
	$('#chatinput').show();
	// Action if they push the send message button or enter
	socket.emit('message', {
	    operation: "join",
	    name: name
	});
    })

    //function called on submit or enter on text input
    function sendText() {
	console.log("hello");
	var message = $('#message').val();
	$('#message').val("");
	var name = $('#yourname').val();
	console.log(" message:" + message);
	socket.emit('message', {
	    operation: "mess",
	    name: name,
	    text: message
	});
    }

    $('#send-btn').click(sendText);
    $('#message').keyup(function (e){
	var key=e.which;
	if (key == 13) {
	    sendText();
    }   
});
});



