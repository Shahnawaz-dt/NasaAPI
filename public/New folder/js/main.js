document.addEventListener('DOMContentLoaded', () => {
  loadAPOD();
  loadMarsPhotos();
  loadAsteroids();

  // Reload on tab change
  document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', (e) => {
      const target = e.target.getAttribute('href');
      if (target === '#apod') loadAPOD();
      if (target === '#mars') loadMarsPhotos();
      if (target === '#asteroids') loadAsteroids();
    });
  });
});

async function loadAPOD() {
  const container = document.getElementById('apod-container');
  container.innerHTML = '<div class="spinner-border" role="status"></div>';

  try {
    const res = await fetch('/api/nasa/apod');
    const data = await res.json();

    container.innerHTML = `
      <h2 class="mb-3">${data.title}</h2>
      ${data.media_type === 'video' 
        ? `<iframe width="100%" height="500" src="${data.url}" frameborder="0" allowfullscreen></iframe>`
        : `<img src="${data.hdurl || data.url}" class="img-fluid rounded shadow" alt="${data.title}">`
      }
      <p class="mt-4 lead">${data.explanation}</p>
      <small class="text-muted">${data.date} | © ${data.copyright || 'NASA'}</small>
    `;
  } catch (err) {
    container.innerHTML = '<p class="text-danger">Failed to load APOD</p>';
  }
}

async function loadMarsPhotos() {
  const gallery = document.getElementById('mars-gallery');
  gallery.innerHTML = '<div class="col"><div class="spinner-border" role="status"></div></div>';

  try {
    const res = await fetch('/api/nasa/mars');
    const { photos } = await res.json();

    if (!photos.length) {
      gallery.innerHTML = '<p>No photos found</p>';
      return;
    }

    gallery.innerHTML = photos.slice(0, 12).map(photo => `
      <div class="col">
        <div class="card bg-dark text-light h-100">
          <img src="${photo.img_src}" class="card-img-top" alt="Mars photo" loading="lazy">
          <div class="card-body">
            <h5 class="card-title">Camera: ${photo.camera.full_name}</h5>
            <p class="card-text">Earth Date: ${photo.earth_date}</p>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    gallery.innerHTML = '<p class="text-danger">Failed to load Mars photos</p>';
  }
}

async function loadAsteroids() {
  const list = document.getElementById('asteroids-list');
  list.innerHTML = '<div class="spinner-border" role="status"></div>';

  try {
    const res = await fetch('/api/nasa/asteroids');
    const data = await res.json();
    const today = new Date().toISOString().split('T')[0];
    const neos = data.near_earth_objects[today] || [];

    if (!neos.length) {
      list.innerHTML = '<p>No close approaches today</p>';
      return;
    }

    list.innerHTML = `
      <h3>Close Approaches Today</h3>
      <div class="row row-cols-1 row-cols-md-2 g-4">
        ${neos.map(neo => `
          <div class="col">
            <div class="card bg-secondary text-light">
              <div class="card-body">
                <h5>${neo.name}</h5>
                <p>Diameter: ~${Math.round(neo.estimated_diameter.meters.estimated_diameter_max)} m</p>
                <p>Distance: ${Math.round(neo.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km</p>
                <span class="badge ${neo.is_potentially_hazardous_asteroid ? 'bg-danger' : 'bg-success'}">
                  ${neo.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Safe'}
                </span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    list.innerHTML = '<p class="text-danger">Failed to load asteroids</p>';
  }
}