var socket = io();




function scrollToButtom () {
//selectors
var messages = jQuery('#messages');
var newMessage = messages.children('li:last-child');

//height
var clientHeight = messages.prop('clientHeight');
var scrollTop = messages.prop('scrollTop');
var scrollHeight = messages.prop('scrollHeight');
var newMessageHeight = newMessage.innerHeight();
var lastMessageHeight = newMessage.prev().innerHeight();

if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){

messages.scrollTop(scrollHeight);
}
};

socket.on('connect', function (){
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params,function (err){
    if(err){
      alert(err);
      window.location.href = '/';
    }else{
      console.log('No error');
    }
  });
});


socket.on('connect',function (){
  console.log('Connected to Server');

});
socket.on('disconnect',function (){
  console.log('Disconnected');
  });

socket.on('updateUserList', function (user){
var params = jQuery.deparam(window.location.search);
  var li = jQuery('<li></li>');
  li.text(params.name);

  jQuery('#userss').append(li);
});


  socket.on('newMessage',function (message){

  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template,{
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
scrollToButtom ();

    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    //
    // jQuery('#messages').append(li);
  });


var messageTextBox = jQuery('[name=message]');

jQuery('#message-form').on('submit', function (e){
  var params = jQuery.deparam(window.location.search);
  e.preventDefault();
  socket.emit('createMessage',{
    from: params.name,
    text: messageTextBox.val()
  },function () {
    messageTextBox.val('')
  });
});


socket.on('newLocationMessage', function (message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My Current Location</a>');
  //
  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr('href',message.url);
  // li.append(a);


  var template = jQuery('#location-message-template').html();
  var params = jQuery.deparam(window.location.search);
  var html = Mustache.render(template,{
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToButtom();
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function (){
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your Browser.')
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function (position){
    locationButton.removeAttr('disabled').text('Send Location');
      socket.emit('createLocationMessage',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
  },function (){
        locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location.');
  });

});
