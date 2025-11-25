// Service Worker for Little Learner PWA
// Version 2.0 - Enhanced caching, offline support, and update notifications

const SW_VERSION = '2.0.0';
const CACHE_PREFIX = 'little-learner';
const STATIC_CACHE = `${CACHE_PREFIX}-static-v2`;
const DYNAMIC_CACHE = `${CACHE_PREFIX}-dynamic-v2`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images-v2`;
const AUDIO_CACHE = `${CACHE_PREFIX}-audio-v2`;

// Critical assets to cache immediately (app shell)
const APP_SHELL = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Routes to precache for offline navigation
const PRECACHE_ROUTES = [
  '/phonics',
  '/words',
  '/sight-words',
  '/word-families',
  '/blending-activities',
  '/stories',
  '/levels',
  '/achievements',
  '/settings',
  '/assessment',
];

// Cache size limits
const CACHE_LIMITS = {
  images: 100,
  audio: 200,
  dynamic: 50,
};

// Install event - cache app shell
self.addEventListener('install', (event) => {
  console.log(`[SW ${SW_VERSION}] Installing...`);

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log(`[SW ${SW_VERSION}] Caching app shell`);
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        // Precache routes in background (don't block install)
        caches.open(STATIC_CACHE).then((cache) => {
          PRECACHE_ROUTES.forEach((route) => {
            fetch(route)
              .then((response) => {
                if (response.ok) {
                  cache.put(route, response);
                }
              })
              .catch(() => {/* Ignore precache failures */});
          });
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches and notify clients
self.addEventListener('activate', (event) => {
  console.log(`[SW ${SW_VERSION}] Activating...`);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith(CACHE_PREFIX) &&
                     name !== STATIC_CACHE &&
                     name !== DYNAMIC_CACHE &&
                     name !== IMAGE_CACHE &&
                     name !== AUDIO_CACHE;
            })
            .map((name) => {
              console.log(`[SW ${SW_VERSION}] Deleting old cache: ${name}`);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Notify all clients about the update
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SW_UPDATED',
              version: SW_VERSION,
            });
          });
        });
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Strategy selection based on request type
  if (isImageRequest(request, url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, CACHE_LIMITS.images));
  } else if (isAudioRequest(request, url)) {
    event.respondWith(cacheFirst(request, AUDIO_CACHE, CACHE_LIMITS.audio));
  } else if (isNavigationRequest(request)) {
    event.respondWith(networkFirstWithOffline(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE, CACHE_LIMITS.dynamic));
  }
});

// Message handler for client communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: SW_VERSION });
  }

  if (event.data && event.data.type === 'CACHE_AUDIO') {
    const audioUrls = event.data.urls || [];
    caches.open(AUDIO_CACHE).then((cache) => {
      audioUrls.forEach((url) => {
        fetch(url)
          .then((response) => {
            if (response.ok) {
              cache.put(url, response);
            }
          })
          .catch(() => {/* Ignore cache failures */});
      });
    });
  }
});

// Helper functions
function isImageRequest(request, url) {
  return (
    request.destination === 'image' ||
    /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url.pathname) ||
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('images.unsplash.com')
  );
}

function isAudioRequest(request, url) {
  return (
    request.destination === 'audio' ||
    /\.(mp3|wav|ogg|m4a)$/i.test(url.pathname)
  );
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

function isStaticAsset(url) {
  return (
    /\.(js|css|woff2?|ttf|eot)$/i.test(url.pathname) ||
    url.pathname.startsWith('/_next/static/')
  );
}

// Caching strategies
async function cacheFirst(request, cacheName, limit) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const responseClone = response.clone();
      cache.put(request, responseClone);

      // Limit cache size if specified
      if (limit) {
        limitCacheSize(cacheName, limit);
      }
    }
    return response;
  } catch (error) {
    // Return offline fallback for images
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#f0f0f0" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="#999">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    throw error;
  }
}

async function networkFirstWithOffline(request) {
  const cache = await caches.open(STATIC_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    // Return offline page for navigation requests
    const offlinePage = await cache.match('/offline');
    if (offlinePage) {
      return offlinePage;
    }

    // Fallback to home page
    const homePage = await cache.match('/');
    if (homePage) {
      return homePage;
    }

    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName, limit) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Fetch in background
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
        if (limit) {
          limitCacheSize(cacheName, limit);
        }
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    // Delete oldest entries (FIFO)
    const deleteCount = keys.length - maxItems;
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
}

// Background sync for offline progress
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  // Future: Sync progress data with server
  console.log('[SW] Background sync triggered');
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Time to learn!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Little Learner', options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
