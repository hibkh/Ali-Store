const C='alistore-v1',SHELL=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);if(u.hostname==='api.github.com')return;
 const same=u.origin===location.origin,cdn=/cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(u.hostname);
 if(!same&&!cdn)return;
 if(same&&(r.mode==='navigate'||/\.(json|html)$/.test(u.pathname))){
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));
  return;
 }
 e.respondWith(caches.match(r).then(m=>{
  const f=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')&&res.status!==206){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>m);
  return m||f;
 }));
});
