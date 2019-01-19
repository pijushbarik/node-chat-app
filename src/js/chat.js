import './../scss/style.scss'

const io = require('socket.io-client');
const $ = require('jquery');
const moment = require('moment');
const Mustache = require('mustache');

const deparam = uri => {
  if (uri === undefined) {
    uri = window.location.search;
  }

  var queryString = {};

  uri.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
    queryString[key] = value;
  });

  return queryString;
};

var socket = io();

const scrollToBottom = () => {
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
};

socket.on('connect', () => {
  var params = deparam(window.location.search);
  
  socket.emit('join', params, (err) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    }
  });
});

socket.on('updateUsersList', (users) => {
  var ol = $('<ol></ol>');

  users.forEach(user => {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
});

socket.on('newMessage', (message) => {
  var formattedTime = moment().format('h:mm a');

  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);

  scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
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

$('#message-form').on('submit', (e) => {
  e.preventDefault();

  var msgBox = $('#new-message');

  socket.emit('createMessage', {
    from: 'user',
    text: msgBox.val()
  }, () => {
    msgBox.val('');
    msgBox.focus();
  });
});

var locationBtn = $('#location');

locationBtn.on('click', (e) => {
  if (!navigator.geolocation) return alert('geolocation not supported by your browser');

  locationBtn.attr('disabled', 'disabled').text('Sending...');

  navigator.geolocation.getCurrentPosition((position) => {
    locationBtn.removeAttr('disabled').text('Send location');

    socket.emit('createLocationMessage', {
      from: 'user',
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    });
  }, () => {
    alert('unable to fetch location');

    locationBtn.removeAttr('disabled').text('Send location');
  })
});