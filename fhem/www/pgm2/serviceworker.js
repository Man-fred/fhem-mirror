// Service Worker 
const version = "v0.0.0.001";
const cacheName = "my-pwa-" + version;
const filesToCache = [
    "/",
    "index.php",
    "./js/index.js",
    "./styles/styles.css",
    "/assets/icon0/ios/20.png",
    "/assets/icon0/icon.png",
    "/assets/icon0/ios/32.png",
    "/assets/icon0/bars.svg",
    "/assets/icon0/user-lock.svg",
    "/assets/icon0/xmark.svg",
    "/assets/icon0/bars000.svg",
    "/assets/icon0/user-lock000.svg",
    "/assets/icon0/xmark000.svg",
    '/manifest.webmanifest'
];

// (A) INSTANT WORKER ACTIVATION
self.addEventListener("install", e => {
    console.log("[ServiceWorker] - Install");
    //Window.localStorage.setItem('version', version);
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log("[ServiceWorker] - Caching app shell");
        //await cache.addAll(filesToCache);
    })());
    // forces a service worker to activate immediately
    self.skipWaiting();
});

// (B) CLAIM CONTROL INSTANTLY
// when this SW becomes activated, we claim all the opened clients
// they can be standalone PWA windows or browser tabs
self.addEventListener("activate", e => {
    e.waitUntil((async () => {
        const keyList = await caches.keys();
        await Promise.all(
                keyList.map(key => {
                    console.log(key);
                    if (key !== cacheName) {
                        console.log("[ServiceWorker] - Removing old cache", key);
                        return caches.delete(key);
                    }
                })
                );
    })());
    e.waitUntil(self.clients.claim());
});

// (C) LISTEN TO PUSH
self.addEventListener("push", evt => {
    console.log("On push: ");
	console.log(evt.data);
    try {
        data = evt.data.json();
    } catch (e) {
        data = {"body": version + ":"+evt.data.text(), "icon": "", "image": ""}; // error in the above string (in this case, yes)!
    }
    //const data = evt.data.json();
    console.log("Push", data);
    self.registration.showNotification(data.title, data);
});

function openClient(focus, tag, action) {
    self.clients
            .matchAll({
                type: "window"
            })
            .then((clientList) => {
                for (const client of clientList) {
                    if (focus)
                        client.focus();
                    client.postMessage({tag: tag, action: action});
                    return;
                }
                if (self.clients.openWindow)
                    return self.clients.openWindow("/");
            });
}

//* cache first
self.addEventListener('fetch', evt => {
    if (evt.request.url.match(/version$/)) {
        // fix response without page
        evt.respondWith(
                new Response(version, {
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8'
                    }
                })
                );
    } else if (evt.request.url.match(/server/)) {
        // only Network
        return;
    } else {
        if (evt.request.url.match(/index.php#.=/)) {
            var url = new URL(evt.request.url);
            var cmd = url.hash.substr(0,1);
            var hash = url.hash.substr(2);;
            evt.request.url = url.pathname;
            if (cmd === 'x') {
                openClient(false, "hash", hash);
            }
        }
        // cache first
        //console.log('[Service Worker] Fetching resource cache first: ' + evt.request.url);
        evt.respondWith((async () => {
            const resource = await caches.match(evt.request);
            //console.log('[Service Worker] Fetching resource: '+evt.request.url);
            return resource || fetch(evt.request);
        })());
    }
});
// cache first */

/* general strategy when making a request (eg if online try to fetch it
 // from the network with a timeout, if something fails serve from cache)
 self.addEventListener('fetch', evt => {
 evt.respondWith(
 fromNetwork(evt.request, 10000).catch(() => fromCache(evt.request))
 );
 evt.waitUntil(update(evt.request));
 });
 // network first */

// fetch the resource from the network
const fromNetwork = (requestN, timeout) =>
    new Promise((fulfill, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(requestN).then(response => {
            clearTimeout(timeoutId);
            fulfill(response);
            update(requestN);
        }, reject);
    });

// fetch the resource from the browser cache
const fromCache = requestC =>
    caches
            .open(cacheName)
            .then(cache =>
                cache
                        .match(requestC)
                        .then(matching => matching || cache.match('/offline/'))
            );

// cache the current page to make it available for offline
const update = requestU =>
    caches
            .open(cacheName)
            .then(cache =>
                fetch(requestU).then(response => cache.put(requestU, response))
            );

self.addEventListener("notificationclick", (event) => {
    console.log("On notification click: ", event.notification.tag, event.action);
    event.notification.close();

    // This looks to see if the current app is already open and focuses if it is
    // or starts a new app
    event.waitUntil(
            openClient(true, event.notification.tag, event.action)
            /*
             self.clients
             .matchAll({
             type: "window"
             })
             .then((clientList) => {
             for (const client of clientList) {
             client.focus();
             client.postMessage({tag: event.notification.tag, action: event.action});
             return;
             }
             if (self.clients.openWindow)
             return self.clients.openWindow("/");
             })
             */
            );
});