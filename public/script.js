// public/script.js

document.addEventListener('DOMContentLoaded', function() {
 var map = L.map('mapReal').setView([0, 0], 13);

 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 }).addTo(map);

 var userMarker = L.marker([0, 0]).addTo(map).bindPopup("Você está aqui!").openPopup();
 var otherMarkers = {};

 function updateMarker(lat, lon) {
  var latlng = L.latLng(lat, lon);
  map.setView(latlng, 15);
  userMarker.setLatLng(latlng).update();
 }

 if (navigator.geolocation) {
  navigator.geolocation.watchPosition(function(position) {
   var lat = position.coords.latitude;
   var lon = position.coords.longitude;
   updateMarker(lat, lon);
   socket.emit('updatePosition', { lat: lat, lon: lon });
  }, function(error) {
   alert("Erro ao obter localização: " + error.message);
  }, { enableHighAccuracy: true });
 } else {
  alert("Geolocalização não é suportada pelo seu navegador.");
 }

 var socket = io('/api/socket.js');

 socket.on('positions', function(users) {
  for (var id in users) {
   if (id !== socket.id) {
    var user = users[id];
    if (otherMarkers[id]) {
     otherMarkers[id].setLatLng([user.lat, user.lon]).update();
    } else {
     otherMarkers[id] = L.marker([user.lat, user.lon]).addTo(map).bindPopup("Outro usuário").openPopup();
    }
   }
  }
 });
});
