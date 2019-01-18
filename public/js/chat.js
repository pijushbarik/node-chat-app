var socket = io();

function scrollToBottom () {
  // selectors
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');

  // heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');

  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if ((clientHeight + scrollTop + newMessageHeight + lastMessageHeight) >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function ()  {
  var params = $.deparam(window.location.search);
  
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('perfect');
    }
  });
});

socket.on('updateUsersList', function (users) {
  var ol = $('<ol></ol>');

  users.forEach(user => {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
});

socket.on('newMessage', function (message) {
  var formattedTime = moment().format('h:mm a');
  console.log(message);

  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);

  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment().format('h:mm a');

  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });

  $('#messages').append(html);

  scrollToBottom();
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();

  var msgBox = $('#new-message');

  socket.emit('createMessage', {
    from: 'user',
    text: msgBox.val()
  }, function () {
    msgBox.val('');
    msgBox.focus();
  });
});

var locationBtn = $('#location');

locationBtn.on('click', function (e) {
  if (!navigator.geolocation) return alert('geolocation not supported by your browser');

  locationBtn.attr('disabled', 'disabled').text('Sending...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationBtn.removeAttr('disabled').text('Send location');

    socket.emit('createLocationMessage', {
      from: 'user',
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    });
  }, function () {
    alert('unable to fetch location');

    locationBtn.removeAttr('disabled').text('Send location');
  })
});