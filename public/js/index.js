var socket = io();

socket.on('connect', function ()  {
  socket.on('newMessage', function (message) {
    var formattedTime = moment().format('h:mm a');

    var template = $('#message-template').html();
    var html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });

    $('#messages').append(html);
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