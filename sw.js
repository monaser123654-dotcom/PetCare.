const V="petcare-v2",SHELL=["./","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  // never touch n8n/webhook calls or anything cross-origin or non-GET
  if(r.method!=="GET"||u.origin!==location.origin)return;
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put("./",c));return x}).catch(()=>caches.match("./")));
    return;
  }
  e.respondWith(caches.match(r).then(c=>c||fetch(r).then(x=>{if(x.ok){const c2=x.clone();caches.open(V).then(h=>h.put(r,c2))}return x})));
});
