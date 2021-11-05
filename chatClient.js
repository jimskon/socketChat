// Simple Web chat client
// Jim Skon 2018
// Kenyon College
// port must match  port of client and be >8000
var port=9001;
var socket = io.connect('http://jimskon.com:'+port);
var state="off";
var myname="";
// Watch for incomming messages from server (chatapp.js)
$(document).ready(function () {
    socket.on('message', function(message) {
	// A join message: {operation: 'join', name: clientname}
	if (message.operation == 'join') {
	    if (state=="off") {
		console.log("Not logged in!");
		return;
	    }
	    var names=message.partners;
	    console.log(names);
	    var name=message.name;;
	    $('#chatBox').html($('#chatBox').html() + "<font color='red'>User Joins: </font>" + name + "<br />");
	    var groupList="";
	    for (var n in names) {
		groupList+=names[n]+", ";
	    }
	    groupList=groupList.slice(0,-2);
	    $('#members').html("<b>Chat Group:</b> "+"<font color='blue'>"+groupList+"</font>"); 
	}
	if (message.operation == 'leave') {
	    if (state=="off") {
		return;
	    }
	    var name=message.name;
	    $('#chatBox').html($('#chatBox').html() + name  + "<font color='red'>: has left the room.</font><br />");
	    var groupList="";
	    for (var n in message.partners) {
		groupList+=message.partners[n]+", ";
	    }
	    groupList=groupList.slice(0,-2);
	    $('#members').html("<b>Chat Group:</b> "+"<font color='blue'>"+groupList+"</font>"); 
	}
	// A text message: {operation: 'mess', name: clientname, text: message}
	if (message.operation == 'mess') {
	    if (state=="off") {
		return;
	    }
	    $('#chatBox').html($('#chatBox').html() + "<font color='red'>" + message.name + ": </font>" + message.text + "<br />");
	}
    })
    $('#chatinput').hide();
    $('#status').hide();
    // Action if they push the join button
    $('#name-btn').click(function() {
	myname = $('#yourname').val()
	state="on";
	$('#register').hide();
	$('#status').show();
	$('#user').html("<b>Name:</b> <font color='blue'>"+myname+"</font>");
	$('#chatinput').show();
	// Action if they push the send message button or enter
	socket.emit('message', {
	    operation: "join",
	    name: myname
	});
    })
    $('#leave').click(leaveSession);

    $('#send-btn').click(sendText);
    $('#message').keyup(function (e){
	var key=e.which;
	if (key == 13) {
	    sendText();
    }   
    });
    
    // Call function on page exit
    $(window).unload(leaveSession);
    
});

//function called on submit or enter on text input
function sendText() {
    var message = $('#message').val();
    $('#message').val("");
    socket.emit('message', {
	operation: "mess",
	name: myname,
	text: message
    });
}

function leaveSession(){
    state="off";
    socket.emit('message', {
	operation: "signout",
	name: myname,
    });
    $('#yourname').val("");
    $('#register').show();
    $('#user').html("");
    $('#chatinput').hide();
    $('#status').hide();
}


