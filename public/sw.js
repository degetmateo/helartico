self.addEventListener('install', (event) => {
    console.log('[Service Worker] instalado correctamente.');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] activado y listo para controlar la pagina.');
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {

});