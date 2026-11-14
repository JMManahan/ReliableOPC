(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const src=u=>encodeURI(u);
const pg=document.body.dataset.page;
const ICO={arrow:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
pin:'<svg viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
ph:'<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
ml:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'};
/* analytics + chat (kept from original site) */
const g=document.createElement('script');g.async=1;g.src='https://www.googletagmanager.com/gtag/js?id=G-WVF5DDJFB1';document.head.append(g);
window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','G-WVF5DDJFB1');
window.$crisp=[];window.CRISP_WEBSITE_ID='fab81483-1195-4437-83a0-6232cb7ec95f';{const s=document.createElement('script');s.src='https://client.crisp.chat/l.js';s.async=1;document.head.append(s)}
/* missing images -> tidy placeholder */
document.addEventListener('error',e=>{const t=e.target;if(t.tagName==='IMG'){t.classList.add('missing');t.parentElement.classList.add('noimg')}},true);
const sess=()=>{try{return JSON.parse(localStorage.getItem('rb_session')||sessionStorage.getItem('rb_session'))}catch(e){return null}};
/* header + footer */
const NAV=[['index.html','Home','home'],['about1.html','About','about'],['products.html','Products','products'],['events.html','Events','events'],['contact.html','Contact','contact']];
const logo='<a class="logo" href="index.html"><img src="img/RBMB_LOGO1.png" alt="Reliable Brand Medical Business OPC"><span>Reliable<b>OPC</b></span></a>';
$('#hd').outerHTML=`<div id="prog"></div><header class="hd"><div class="wrap">${logo}<button class="burger" aria-label="Menu"><i></i><i></i></button><nav class="nv">${NAV.map(n=>`<a href="${n[0]}" class="${pg==n[2]?'on':''}">${n[1]}</a>`).join('')}<a class="lg ${pg=='login'||pg=='portal'?'on':''}" href="${sess()?'portal.html':'login.html'}">${sess()?'Employee Portal':'Employee Login'}</a></nav></div></header>`;
const soc=['Facebook','Instagram','YouTube','Twitter'].map(n=>`<a href="#" aria-label="${n}" title="${n}">${n[0]}</a>`).join('');
$('#ft').outerHTML=`<footer class="ft"><div class="wrap"><div class="fg"><div>${logo}<p>Importing and retailing modern medical &amp; surgical equipment across the Philippines.</p></div>
<div><h5>Pages</h5><ul>${NAV.map(n=>`<li><a href="${n[0]}">${n[1]}</a></li>`).join('')}<li><a href="login.html">Employee Login</a></li></ul></div>
<div><h5>Brands</h5><ul>${Object.values(BRANDS).map(b=>`<li><a href="${b.page}">${b.name}</a></li>`).join('')}</ul></div>
<div><h5>Follow</h5><div class="soc">${soc}</div></div></div>
<div class="cp"><span>© ${new Date().getFullYear()} Reliable Brand Medical Business OPC. All rights reserved.</span><span>Imus, Cavite · Parañaque · Cebu</span></div></div></footer><button id="top" aria-label="Back to top">↑</button><div class="toast" id="toast"></div>`;
const hd=$('header.hd'),bg=$('.burger'),nv=$('nav.nv');
bg.onclick=()=>{bg.classList.toggle('x');nv.classList.toggle('open')};
const sc=()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;hd.classList.toggle('solid',y>40);$('#prog').style.width=(y/h*100)+'%';$('#top').classList.toggle('s',y>700)};
addEventListener('scroll',sc,{passive:true});sc();$('#top').onclick=()=>scrollTo({top:0});
const toast=(m,e)=>{const t=$('#toast');t.textContent=m;t.className='toast s'+(e?' err':'');setTimeout(()=>t.className='toast',3200)};
/* reveal + counters */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);const c=e.target.querySelector('[data-count]');if(c)count(c)}),{threshold:.15});
const rv=()=>$$('[data-r]:not(.in)').forEach((el,i)=>{el.style.setProperty('--d',(i%4)*.08+'s');io.observe(el)});
function count(el){const to=+el.dataset.count,t0=performance.now();(function f(t){const p=Math.min((t-t0)/1400,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}
$$('[data-count="auto"]').forEach(e=>e.dataset.count=PRODUCTS.length);
document.addEventListener('mousemove',e=>{const s=e.target.closest&&e.target.closest('.spot');if(s){const r=s.getBoundingClientRect();s.style.setProperty('--mx',e.clientX-r.left+'px');s.style.setProperty('--my',e.clientY-r.top+'px')}});
/* modal (product quick view + lightbox) */
const mo=document.createElement('div');mo.className='mo';document.body.append(mo);
const close=()=>{mo.classList.remove('open');if(location.hash)history.replaceState(null,'',location.pathname+location.search)};mo.onclick=e=>{if(e.target===mo||e.target.classList.contains('x'))close()};
addEventListener('keydown',e=>{if(e.key==='Escape')close();if(mo.classList.contains('open')&&mo.dataset.lb!==undefined&&(e.key==='ArrowRight'||e.key==='ArrowLeft'))lb(+mo.dataset.lb+(e.key==='ArrowRight'?1:-1))});
function quick(p){const b=BRANDS[p.b];mo.dataset.lb=undefined;delete mo.dataset.lb;mo.innerHTML=`<div class="md" style="--bc:${b.color}"><button class="x" aria-label="Close">×</button><div class="im"><img src="${src(p.i)}" alt="${esc(p.n)}"></div><div class="tx"><span class="tag" style="align-self:flex-start">${b.name}</span><h3>${esc(p.n)}</h3><p style="color:var(--muted)">${esc(p.s)} · ${esc(p.c)}</p><p>Available through Reliable OPC with full after-sales support and training. Ask us for specifications, availability and a demo.</p><div class="acts"><a class="btn" href="contact.html?product=${encodeURIComponent(p.n+' ('+b.name+')')}">Inquire ${ICO.arrow}</a><a class="btn dk" href="${p.u}" target="_blank" rel="noopener">Manufacturer page</a></div></div></div>`;mo.classList.add('open')}
let figs=[];function lb(i){figs=figs.length?figs:$$('.bento figure');i=(i+figs.length)%figs.length;const f=figs[i];mo.dataset.lb=i;mo.innerHTML=`<div class="md lb"><button class="x" style="background:#fff3;color:#fff" aria-label="Close">×</button><img src="${f.querySelector('img').src}" alt=""><p>${f.querySelector('figcaption').textContent}</p></div>`;mo.classList.add('open')}
$$('.bento figure').forEach((f,i)=>f.onclick=()=>lb(i));
/* product card */
const card=(p,i)=>{const b=BRANDS[p.b];return `<article class="pc" data-i="${PRODUCTS.indexOf(p)}" style="--bc:${b.color};animation-delay:${Math.min(i,12)*.04}s"><div class="im"><img src="${src(p.i)}" alt="${esc(p.n)}" loading="lazy"></div><div class="bd"><span class="tag">${b.name}</span><h4>${esc(p.n)}</h4><small>${esc(p.s)}</small></div></article>`};
document.addEventListener('click',e=>{const c=e.target.closest('.pc');if(c)quick(PRODUCTS[c.dataset.i])});
/* brands */
const bx=$('#brands');if(bx)bx.innerHTML=Object.values(BRANDS).map((b,i)=>`<a class="brand spot" href="${b.page}" style="--bc:${b.color}" data-r><div class="bi"><img src="${src(b.img)}" alt="${b.name}"></div><small style="letter-spacing:.14em;text-transform:uppercase;opacity:.8">${b.tag}</small><h3>${b.name}</h3><p>${b.blurb}</p><div class="sites"><b${b.sites==null?'':` data-count="${b.sites}"`}>${b.sites==null?'–':0}</b><span>installation sites in the Philippines</span></div><span class="go">View products ${ICO.arrow}</span></a>`).join('');
/* home: hero card + carousel */
const hc=$('#hcard');if(hc){const hs=HIGHLIGHTS.map(n=>PRODUCTS.find(p=>p.n==n));let k=0,t;const show=()=>{const p=hs[k],b=BRANDS[p.b];hc.innerHTML=`<div class="ph"><img src="${src(p.i)}" alt="${esc(p.n)}"></div><small>${b.name}</small><h4>${esc(p.n)} — ${esc(p.s)}</h4><div class="pl">${hs.map((_,j)=>`<i class="${j==k?'on':''}" data-j="${j}"></i>`).join('')}</div>`;clearTimeout(t);t=setTimeout(()=>{k=(k+1)%hs.length;show()},4500)};show();
hc.onclick=e=>{const j=e.target.dataset.j;if(j!==undefined){k=+j;show()}};
hc.onmousemove=e=>{const r=hc.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hc.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`};hc.onmouseleave=()=>hc.style.transform=''}
const tr=$('#track');if(tr){tr.innerHTML=HIGHLIGHTS.concat(PRODUCTS.filter(p=>!HIGHLIGHTS.includes(p.n)).filter((p,i)=>i%4==0).map(p=>p.n)).map(n=>card(PRODUCTS.find(p=>p.n==n),0)).join('');
const step=d=>tr.scrollBy({left:d*(tr.firstElementChild.offsetWidth+22),behavior:'smooth'});$('#prev').onclick=()=>step(-1);$('#next').onclick=()=>step(1);
let ap=setInterval(()=>tr.scrollLeft+tr.clientWidth>=tr.scrollWidth-4?tr.scrollTo({left:0,behavior:'smooth'}):step(1),4500);tr.onmouseenter=()=>clearInterval(ap)}
/* catalog */
const cat=$('#catalog');if(cat){let brand=document.body.dataset.brand||'all',c='all',q='';const bc=$('#bchips'),cc=$('#cchips');
const draw=()=>{let L=PRODUCTS.filter(p=>brand=='all'||p.b==brand);const cats=[...new Set(L.map(p=>p.c))];if(!cats.includes(c))c='all';
if(bc&&!bc.dataset.d){bc.dataset.d=1;bc.innerHTML=[['all','All brands']].concat(Object.entries(BRANDS).map(([k,v])=>[k,v.name])).map(([k,n])=>`<button class="chip" data-b="${k}">${n}</button>`).join('')}
if(bc)$$('.chip',bc).forEach(x=>x.classList.toggle('on',x.dataset.b==brand));
cc.innerHTML=['all'].concat(cats).map(x=>`<button class="chip ${x==c?'on':''}" data-c="${esc(x)}">${x=='all'?'All categories':esc(x)}</button>`).join('');
L=L.filter(p=>(c=='all'||p.c==c)&&(p.n+p.c+p.s+BRANDS[p.b].name).toLowerCase().includes(q));
let h='',last='',i=0;L.forEach(p=>{if(p.c!=last){last=p.c;h+=`<h3 class="cat">${esc(p.c)}</h3>`}h+=card(p,i++)});
cat.innerHTML=h||'<div class="empty">No products match your search. <a href="contact.html" style="color:var(--teal-d);font-weight:600">Ask us — we can source it.</a></div>';$('#count').textContent=L.length+' product'+(L.length==1?'':'s')};
document.addEventListener('click',e=>{const t=e.target;if(t.dataset.b!==undefined&&t.classList.contains('chip')){brand=t.dataset.b;c='all';draw()}if(t.dataset.c!==undefined&&t.classList.contains('chip')){c=t.dataset.c;draw()}});
$('#q').oninput=e=>{q=e.target.value.trim().toLowerCase();draw()};draw()}
/* team */
const tm=$('#team');if(tm){let d='All';const ds=['All'].concat([...new Set(TEAM.map(t=>t.d))]);$('#tabs').innerHTML=ds.map(x=>`<button class="chip ${x==d?'on':''}">${x}</button>`).join('');
const dr=()=>tm.innerHTML=TEAM.filter(t=>d=='All'||t.d==d).map((t,i)=>`<div class="tm" style="animation-delay:${i*.04}s"><div class="ph">${t.n.replace(/^(Dr\.\/Atty\.|Engr\.|Atty\.|Mr\.|Ms\.|Dr\.)\s*/,'')[0]}<img src="img/770x860/${src(t.i)}.png" alt="${esc(t.n)}" loading="lazy"></div><div class="in"><h4>${esc(t.n)}</h4><p>${esc(t.r)}</p></div></div>`).join('');
$('#tabs').onclick=e=>{if(e.target.classList.contains('chip')){d=e.target.textContent;$$('.chip',$('#tabs')).forEach(x=>x.classList.toggle('on',x==e.target));dr()}};dr()}
/* contact */
const OF={Imus:['Imus, Cavite — Main Office','Unit 301, 3F Eljay’s Building, Aguinaldo Highway, Anabu I-E, 4103 City of Imus, Cavite, Philippines','+63-46-416-6352'],Parañaque:['Parañaque City — Satellite Office','8120 Dr. A. Santos Avenue, Brgy. San Dionisio, Parañaque City','+63-967-129-7149']};
const ot=$('#offices');if(ot){const EM='info.rbmbopc@gmail.com',keys=Object.keys(OF);
ot.innerHTML=`<div class="chips" style="margin-bottom:20px">${keys.map((k,i)=>`<button class="chip ${i?'':'on'}" data-o="${k}">${k}</button>`).join('')}</div>`+keys.map((k,i)=>{const o=OF[k];return `<div class="ofc ${i?'':'on'}" data-o="${k}"><h3 style="margin-bottom:6px">${o[0]}</h3>
<div class="row">${ICO.pin}<span>${o[1]}</span><a class="cpy" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o[1])}">Map</a></div>
<div class="row">${ICO.ph}<span>${o[2]}</span><button class="cpy" data-copy="${o[2]}">Copy</button></div>
<div class="row">${ICO.ml}<span>${EM}</span><button class="cpy" data-copy="${EM}">Copy</button></div></div>`}).join('');
ot.onclick=e=>{const t=e.target;if(t.dataset.o){$$('[data-o]',ot).forEach(x=>x.classList.toggle('on',x.dataset.o==t.dataset.o))}if(t.dataset.copy){navigator.clipboard&&navigator.clipboard.writeText(t.dataset.copy);toast('Copied: '+t.dataset.copy)}};
const pr=new URLSearchParams(location.search).get('product');if(pr)$('#message').value='Hello, I would like to inquire about '+pr+'. ';
const f=$('#contact-form');f.onsubmit=ev=>{ev.preventDefault();const b=f.querySelector('button'),v=id=>$('#'+id).value;b.disabled=true;b.textContent='Sending…';
if(!window.emailjs){toast('Email service failed to load. Please email us directly.',1);b.disabled=false;b.textContent='Send message';return}
emailjs.init({publicKey:'-ebaw7uEA31GkAoIr'});
emailjs.send('service_35ipv2j','template_388f6pg',{first_name:v('first-name'),last_name:v('last-name'),email:v('email'),phone_number:v('phone-number'),institution:v('institution'),medical_field:v('medical-field'),message:v('message')})
.then(()=>{f.reset();toast('Thank you! Your message was sent.');b.textContent='Sent ✓';setTimeout(()=>{b.disabled=false;b.textContent='Send message'},2500)},()=>{toast('Could not send. Please try again.',1);b.disabled=false;b.textContent='Send message'})}}
/* events */
if(typeof EVENTS!=='undefined'){const CC={Conventions:'#1397a6',Workshops:'#d9822b',Trainings:'#1f8400',Meetings:'#6b4fbb',Community:'#c2386b'},col=c=>CC[c]||'#587079';
const E=EVENTS.slice().sort((a,b)=>b.d.localeCompare(a.d)),yr=e=>e.d.slice(0,4),cats=[...new Set(E.map(e=>e.c))],yrs=[...new Set(E.map(yr))];
const fd=e=>e.dp||new Date(e.d+'T00:00').toLocaleDateString('en-PH',{day:'numeric',month:'short',year:'numeric'}),meta=e=>fd(e)+(e.loc?' · '+esc(e.loc):''),href=e=>'event.html?id='+encodeURIComponent(e.id);
const eh=e=>`<a class="ec" href="${href(e)}" style="--bc:${col(e.c)}"><div class="im"><img src="${src(e.img)}" alt="${esc(e.t)}" loading="lazy"><span class="dt">${fd(e)}</span>${e.sample?'<span class="sm">Sample</span>':''}</div><div class="bd"><span class="tag">${esc(e.c)}</span><h4>${esc(e.t)}</h4><small>${esc(e.loc||'')}</small></div></a>`;
const shw=$('#showcase');if(shw){const S=E.filter(e=>e.feat).concat(E.filter(e=>!e.feat)).slice(0,5);shw.innerHTML=S.map(e=>`<a class="bt" href="${href(e)}" style="--bc:${col(e.c)}"><img src="${src(e.img)}" alt="${esc(e.t)}" loading="lazy">${e.sample?'<span class="sm">Sample</span>':''}<div class="ov"><span class="tag">${esc(e.c)}</span><h4>${esc(e.t)}</h4><small>${meta(e)}</small><p>${esc(e.desc)}</p></div></a>`).join('')}
const ec=$('#events');if(ec){let C='all',Y='all',q='',V='grid';
$('#n-ev').dataset.count=E.length;$('#n-cat').dataset.count=cats.length;$('#n-yr').dataset.count=yrs.length;
const draw=()=>{$('#ecats').innerHTML=[['all','All events',E.length]].concat(cats.map(c=>[c,c,E.filter(e=>e.c==c).length])).map(([k,n,x])=>`<button class="chip ${k==C?'on':''}" data-c="${esc(k)}">${esc(n)} <em style="opacity:.6;font-style:normal">${x}</em></button>`).join('');
$('#eyears').innerHTML=['all'].concat(yrs).map(y=>`<button class="chip ${y==Y?'on':''}" data-y="${y}">${y=='all'?'All years':y}</button>`).join('');
$$('#eview .chip').forEach(b=>b.classList.toggle('on',b.dataset.v==V));
const L=E.filter(e=>(C=='all'||e.c==C)&&(Y=='all'||yr(e)==Y)&&(e.t+e.c+e.loc+e.desc).toLowerCase().includes(q));
$('#ecount').textContent=L.length+' event'+(L.length==1?'':'s');ec.className=V=='grid'?'cg':'tlv';
let h='',last='';L.forEach(e=>{if(V=='tl'&&yr(e)!=last){last=yr(e);h+=`<h3 class="yh">${last}</h3>`}h+=eh(e)});
ec.innerHTML=h||'<div class="empty">No events match your filters.</div>'};
document.addEventListener('click',e=>{const k=e.target.closest('.chip');if(!k)return;if(k.dataset.c!==undefined){C=k.dataset.c;draw()}if(k.dataset.y!==undefined){Y=k.dataset.y;draw()}if(k.dataset.v!==undefined){V=k.dataset.v;draw()}});
$('#eq').oninput=e=>{q=e.target.value.trim().toLowerCase();draw()};draw();
/* highlight banner */
const F=E.filter(e=>e.feat),hh=$('#ehl');if(!F.length)hh.closest('section').remove();else{let k=0,t;const sh=()=>{const e=F[k];hh.innerHTML=`<div class="hl" style="--bc:${col(e.c)}"><div class="im"><img src="${src(e.img)}" alt="${esc(e.t)}"><span class="sm2">★ Event highlight</span>${e.sample?'<span class="sm">Sample</span>':''}</div><div class="tx"><span class="tag" style="align-self:flex-start">${esc(e.c)}</span><h3>${esc(e.t)}</h3><p style="color:var(--muted);font-weight:500">${meta(e)}</p><p>${esc(e.desc)}</p><div class="acts"><a class="btn" href="${href(e)}">View event details ${ICO.arrow}</a></div>${F.length>1?`<div class="dots">${F.map((_,j)=>`<i class="${j==k?'on':''}" data-j="${j}"></i>`).join('')}</div>`:''}</div></div>`;clearTimeout(t);if(F.length>1)t=setTimeout(()=>{k=(k+1)%F.length;sh()},7000)};sh();hh.onclick=e=>{if(e.target.dataset.j!==undefined){k=+e.target.dataset.j;sh()}}}}
/* event details page */
const ed=$('#evd');if(ed){const e=E.find(x=>x.id==new URLSearchParams(location.search).get('id'));
if(!e)ed.innerHTML='<section class="sec" style="padding-top:160px;text-align:center"><div class="wrap"><h2 class="h2">Event not found</h2><p class="lead" style="margin:0 auto 26px">This event may have been moved or removed.</p><a class="btn dk" href="events.html">Back to all events</a></div></section>';
else{document.title=e.t+' — Reliable OPC';const c=col(e.c),g=e.gal||[],rel=E.filter(x=>x.id!=e.id).sort((a,b)=>(b.c==e.c)-(a.c==e.c)).slice(0,3);
ed.innerHTML=`<section class="ph2" style="--bc:${c};background:linear-gradient(150deg,#06141cdd,#0a2a36cc 55%,${c}cc),url('${src(e.img)}') center/cover"><div class="orb o1"></div><div class="wrap"><a class="crumb" href="events.html">← All events</a><span class="tag" style="background:#fff;color:${c};display:block;width:max-content">${esc(e.c)}</span><h1 style="margin-top:14px">${esc(e.t)}</h1><p>${meta(e)}${e.sample?' · <b>Sample event</b>':''}</p></div></section>
<section class="sec"><div class="wrap evg" style="--bc:${c}"><div data-r><span class="eyebrow">About this event</span>${(e.body||[e.desc]).map(p=>`<p class="lead" style="margin-bottom:16px;max-width:none">${esc(p)}</p>`).join('')}${e.hl?`<h3 style="margin:30px 0 14px">Highlights</h3><ul class="ck">${e.hl.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</div>
<aside class="card side" data-r><h3>Event info</h3><div class="row"><span><small>Date</small><br><b>${fd(e)}</b></span></div>${e.loc?`<div class="row"><span><small>Location</small><br><b>${esc(e.loc)}</b></span></div>`:''}<div class="row"><span><small>Category</small><br><b>${esc(e.c)}</b></span></div><div class="acts" style="display:grid;gap:10px;margin-top:14px"><a class="btn" href="contact.html?product=${encodeURIComponent('the event "'+e.t+'"')}" style="justify-content:center">Ask about this event</a><button class="btn dk" id="shr" style="justify-content:center">Copy link</button></div></aside></div></section>
${g.length>1?`<section class="sec alt"><div class="wrap"><div class="sh" data-r><span class="eyebrow">Gallery</span><h2 class="h2">Photos from the event</h2></div><div class="bento" data-r>${g.map(u=>`<figure><img src="${src(u)}" alt="" loading="lazy"><figcaption>${esc(e.t)}</figcaption></figure>`).join('')}</div></div></section>`:''}
${rel.length?`<section class="sec"><div class="wrap"><div class="sh" data-r><span class="eyebrow">More events</span><h2 class="h2">You may also like</h2></div><div class="cg">${rel.map(eh).join('')}</div></div></section>`:''}`;
$('#shr').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(location.href);toast('Link copied')};$$('.bento figure').forEach((f,i)=>f.onclick=()=>lb(i))}}}
/* employee login + portal (Firebase, see js/auth.js) */
const initAuth=async()=>{const lf=$('#login-form'),pt=$('#portal');if(!lf&&!pt)return;await AUTH.ready;
if(lf){if(AUTH.user)return location.replace('portal.html');const em=$('#lerr'),pw=$('#password');
if(!AUTH.configured)em.textContent='Employee sign-in isn’t set up yet. Please contact the administrator.';
$('#pwt').onclick=e=>{const sh=pw.type=='password';pw.type=sh?'text':'password';e.target.textContent=sh?'Hide':'Show'};
$('#forgot').onclick=async()=>{const m=$('#username').value.trim();if(!m){em.textContent='Enter your email above first, then click “Forgot password?”.';return}em.textContent='';try{await AUTH.reset(m)}catch(e){}toast('If that email is registered, a reset link is on its way.')};
lf.onsubmit=async ev=>{ev.preventDefault();const b=$('button[type=submit]',lf);em.textContent='';lf.classList.remove('shake');b.disabled=true;b.textContent='Signing in…';
try{await AUTH.signIn($('#username').value.trim(),pw.value,$('#remember').checked);location.href='portal.html'}
catch(err){em.textContent=err.message||'Sign-in failed. Please try again.';void lf.offsetWidth;lf.classList.add('shake');b.disabled=false;b.textContent='Sign in'}}}
if(pt){if(!AUTH.user)return location.replace('login.html');$('#who').textContent=AUTH.name;pt.hidden=false;$('#out').onclick=async()=>{await AUTH.signOut();location.href='login.html'}}};
window.AUTH?initAuth():addEventListener('rb-auth',initAuth);
rv();
})();
