(function () {
  'use strict';
  var CACHE_NAME = 'v1';
  var urlsToCache = [
    '/',
    '/style.css',
    '/app.js',
    '/ticker.json',
  ];

  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          return cache.addAll(urlsToCache);
        })
    );
  });

  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }

          var fetchRequest = event.request.clone();

          return fetch(fetchRequest).then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }).catch(() => {
            return new Response();
          });
        })
    );
  });

}());

