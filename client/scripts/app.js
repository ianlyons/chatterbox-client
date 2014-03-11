/* global $, _, moment */

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
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    dataType: 'json',
    data: {
      order: '-createdAt',
      limit: 30,
      where: {
        roomname: app.chatrooms.currentRoom === '-- Select a room! --' ? undefined : app.chatrooms.currentRoom
      }
    },
    success: function(data) {
      if(app.chatrooms.roomSelected) {
        app.appendMessages(data);
      }
      app.getRooms(data);
      app.lastFetch = new Date();
    },
    error: function() {
      console.error('chatterbox: Failed to retrieve messages.');
    }
  });
};

app.stripHTML = function(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

app.appendMessages = function(messages) {
  if(app.lastFetch === undefined) {
    _.each(messages.results, function(item) {
      $('#container').append('<div class="message" data-room="'+ app.stripHTML(item.roomname) +
        '"><span class="userId">'+app.stripHTML(item.username)+
        ':</span><span class="messageText">'+ app.stripHTML(item.text) +
        '</span><abbr class="time">'+ moment(new Date(item.createdAt)).fromNow() + '</div>');
    });
  } else {
    var index = 0;
    while(new Date(messages.results[index].createdAt) > app.lastFetch){
      index++;
    }
    for(index; index > 0; index--){
      var item = messages.results[index - 1];
      $('#container').prepend('<div class="message" data-room="'+ app.stripHTML(item.roomname) +
        '"><span class="userId">'+app.stripHTML(item.username)+
        ':</span><span class="messageText">'+ app.stripHTML(item.text) +
        '</span><abbr class="time">'+ moment(new Date(item.createdAt)).fromNow() + '</div>');
    }
  }
};

app.username = app.getURLParameter('username');

app.getRooms = function(data) {
  _.each(data.results, function(item) {
    app.chatrooms.allRooms[app.stripHTML(item.roomname)] = true;
  });


  $('#room select').empty();
  $('#room select').append('<option selected value="' + app.chatrooms.currentRoom + '">' + app.chatrooms.currentRoom +'</option>');
  for(var room in app.chatrooms.allRooms) {
    if(room !== app.chatrooms.currentRoom) {
      $('#room select').append('<option value="' + app.stripHTML(room) + '">' + app.stripHTML(room) + '</option>');
    }
  }
};

app.chatrooms = {
  'roomSelected' : false,
  'currentRoom' : '-- Select a room! --',
  'allRooms' : {

  }
};

app.init = function() {
  // Initialize the chat box
  $(function() {
    $('.your-name').text('You\'re logged in as: ' +app.username);
    app.fetch();

    $('#room select').change(function () {
      console.log("Change triggered");
      app.chatrooms.roomSelected = true;
      app.chatrooms.currentRoom = $('#room select').val();
      $('#container').empty();
      app.lastFetch = undefined;
      app.fetch();
    });

    $('#newRoom').on('click', function(e){
      e.preventDefault();
      var response = prompt('Where shall we go, sir?');
      console.log(response);
    });
  });
};

app.sendMessage = function() {
  var text = $('#chatText').val();
  var message =  {
    'username': app.username,
    'text': text,
    'roomname': app.chatrooms.currentRoom
  };

  app.send(message);

  $('#chatText').val('');
  setTimeout(function() {
    app.fetch();
  }, 600);
};



// need to display the fetched results in a fun way
// Need a form for user to send messages with




app.init();
