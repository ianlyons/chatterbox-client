// YOUR CODE HERE:
var app = {};

app.getURLParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
};


app.send = function (message) {
	$.ajax({
	  // always use this url
	  url: 'https://api.parse.com/1/classes/chatterbox',
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message sent');
	  },
	  error: function (data) {
	    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message');
	  }
	});
};

app.fetch = function() {
	var dataReturn;
	$.ajax({
		url: 'https://api.parse.com/1/classes/chatterbox',
		type: 'GET',
		dataType: 'json',
		// contentType: 'application/json',
		success: function(data) {
			console.log("got the messages!");
			app.appendMessages(data);
		},
		error: function(data) {
			console.error('chatterbox: Failed to retrieve messages.');
		}
	});
	return dataReturn;
};

app.stripHTML = function(html) {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
};

app.appendMessages = function(messages) {
// console.log('into it');
// 	// var $cont = ;
// 	console.log(messages.results);
	_.each(messages.results, function(item) {
		console.log(item);
		$('#container').prepend('<div class="message" data-createdAt="' + item.createdAt + '"><span class="userId">'+item.username+':</span><span class="messageText">'+ app.stripHTML(item.text) +'</span><abbr class="timeago" title="'+ item.createdAt + '"></div>');
	});
};



app.init = function() {
	// Set up timeago
	jQuery(document).ready(function() {
  	jQuery("abbr").timeago();
	});

	// Initialize the chat box
	var username = app.getURLParameter('username');
	console.log(username);
	$('div#chat-form').append('<span class="your-name">'+username+'</span><form id="chat"> <input type="text" name="chat-text" placeholder="Your message..."> </form>');
};
// var messages = app.fetch();
// app.appendMessages(messages);


// need to display the fetched results in a fun way
// Need a form for user to send messages with
app.fetch();
app.init();



