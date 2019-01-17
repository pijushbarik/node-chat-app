var socket = io();

socket.on('connect', function ()  {
  socket.on('newMessage', function (message) {
    var formattedTime = moment().format('h:mm a');

    var li = $('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    $('#messages').append(li);
  });

  socket.on('newUser', function (message) {
    var newUser = $('<h4></h4>');
    newUser.text(message.text);
    $('#messages').append(newUser);
  });

  socket.on('newLocationMessage', function (message) {
    var formattedTime = moment().format('h:mm a');

    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');
    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);

    $('#messages').append(li);
  });
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();

  var msgBox = $('#new-message');

  socket.emit('createMessage', {
    from: 'user',
    text: msgBox.val()
  }, function () {
    msgBox.val('');
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