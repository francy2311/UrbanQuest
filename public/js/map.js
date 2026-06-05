document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('missions-map');

  if (!mapElement) {
    return;
  }

  const missions = window.URBANQUEST_MISSIONS || [];

  const defaultCenter = [45.4642, 9.1900];

  const map = L.map('missions-map').setView(defaultCenter, 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  if (!missions.length) {
    return;
  }

  const markers = [];

  missions.forEach((mission) => {
    const lat = Number(mission.latitude);
    const lng = Number(mission.longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return;
    }

    const marker = L.marker([lat, lng]).addTo(map);

    marker.bindPopup(`
      <strong>${mission.title}</strong><br>
      Zona: ${mission.zone}<br>
      Punti: ${mission.points}<br>
      <a href="/missions/${mission.id}">Apri dettaglio</a>
    `);

    markers.push(marker);
  });

  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));
  }
});
