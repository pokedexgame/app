// A new cache name to ensure a fresh start.
const CACHE_NAME = 'pokedex-game-cache-v11'; 

// All paths are relative, which is correct for the service worker itself.
const urlsToCache = [
  './', 
  'index.html',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',

  // All other local asset sprites.
  'sprites/badge_boulder.png', 'sprites/badge_cascade.png', 'sprites/badge_earth.png', 'sprites/badge_marsh.png', 'sprites/badge_rainbow.png', 'sprites/badge_soul.png', 'sprites/badge_thunder.png', 'sprites/badge_volcano.png',
  'sprites/champ_gary.png', 'sprites/e4.png', 'sprites/e4_agatha.png', 'sprites/e4_bruno.png', 'sprites/e4_lance.png', 'sprites/e4_lorelei.png',
  'sprites/escaperope.png', 'sprites/evolutionstone.png', 'sprites/greatball.png', 'sprites/gym_blaine.png', 'sprites/gym_brock.png', 'sprites/gym_erika.png', 'sprites/gym_giovanni.png', 'sprites/gym_koga.png', 'sprites/gym_misty.png', 'sprites/gym_sabrina.png', 'sprites/gym_surge.png',
  'sprites/luckyegg.png', 'sprites/lure.png', 'sprites/map0.png', 'sprites/map1.png', 'sprites/map2.png', 'sprites/map3.png', 'sprites/map4.png', 'sprites/map5.png', 'sprites/map6.png', 'sprites/map7.png', 'sprites/map8.png',
  'sprites/maxlure.png', 'sprites/pokeball.png', 'sprites/pokeflute.png', 'sprites/questionmark.png', 'sprites/repel.png', 'sprites/ultraball.png',

  // Dynamically generate all 151 Pokemon sprite paths.
  ...Array.from({ length: 151 }, (_, i) => {
    const paddedId = String(i + 1).padStart(3, '0');
    return [
      `sprites/pokemon_${paddedId}.png`,
      `sprites/pokemon_${paddedId}_shiny.png`,
      `sprites/pokemon_${paddedId}_silhouette.png`
    ];
  }).flat()
];

// On install, cache all files and immediately activate.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching all assets.');
        return cache.addAll(urlsToCache);
      })
  );
  // This line is crucial to force the new service worker to activate.
  self.skipWaiting(); 
});

// On activation, clean up old caches and take control.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // This line is crucial to take control of the page immediately.
      console.log('Claiming clients for new service worker.');
      return self.clients.claim();
    })
  );
});

// Fetch event: Serve from cache first, then fall back to the network.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});




