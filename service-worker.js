var CACHE = 'cache';
var urlsToCache = [
    '/'
];
var preCacheSrc = [
    '/'
];
// precache tài nguyên khi được đăng ký bởi sw_reg.js
self.addEventListener('install', function (evt) {
    console.log('The service worker is being installed.');
    caches.open(CACHE)
        .then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        });
    evt.waitUntil(precache());
});

// khi tài nguyên được gọi
self.addEventListener('fetch', function (evt) {
    console.log('The service worker is serving the asset.');
  // sau 0.6s không load
    evt.respondWith(fromNetwork(evt.request, 600).catch(function () {
    // lấy từ cache
        return fromCache(evt.request);
    }));
});

// lấy tài nguyên từ network
function fromNetwork (request, timeout) {
    return new Promise(function (fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then(function (response) {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

// precache 
function precache () {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll(preCacheSrc);
    });
}

// lấy tài nguyên từ cache
function fromCache (request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}