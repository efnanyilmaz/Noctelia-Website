/*! © 2026 Efnan Yılmaz. Tüm hakları saklıdır. İzinsiz kopyalanamaz, kullanılamaz veya dağıtılamaz. Ayrıntılar: LICENSE */
/* Noctélia — products, cart (kept in localStorage so it follows you across pages) and the cart drawer */
(function(){
const SIZES=['30','50','100'];
const PRODUCTS=[
  {id:'pivoine-velours',name:'Pivoine Velours',family:'Çiçeksi · Pudralı · Amber',juice:'#e8a9b4',tag:'',
   price:{30:2300,50:3700,100:5550},
   lede:'Şafakta açan bir şakayık kadar yumuşak. Safranla ısınan, irisle pudralanan, kaşmirle tende kadife gibi kalan bir çiçek.',
   notes:{top:['Bergamot','Safran'],heart:['Şakayık','İris','Heliotrop'],base:['Ambrette','Kaşmir','Beyaz misk','Sedir']}},
  {id:'orchidee-noire',name:'Orchidée Noire',family:'Çiçeksi · Oryantal',juice:'#8a3ad0',tag:'',
   price:{30:2200,50:3500,100:5250},
   lede:'Rom ve balla açılan, siyah orkideyle derinleşen koyu bir oryantal. Mür ve süetle gece boyunca tende iz bırakır.',
   notes:{top:['Rom','Bal'],heart:['Siyah orkide','Sümbülteber'],base:['Vanilya','Mür','Süet','Sandal ağacı']}},
  {id:'rose-nocturne',name:'Rose Nocturne',family:'Gül · Oud · Amber',juice:'#b0304a',tag:'İmza koku',
   price:{30:2100,50:3450,100:5150},
   lede:'Gecede açan Damask gülü. Pembe biberle parlayan açılış, yasemin ve portakal çiçeğiyle dolgun bir kalp, oud ve kehribarla bitmeyen bir iz.',
   notes:{top:['Calabria bergamotu','Pembe biber','Siyah frenk üzümü'],heart:['Damask gülü','Gece manolyası','Yasemin','Portakal çiçeği'],base:['Oud','Labdanum','Madagaskar vanilyası','Kehribar']}},
  {id:'ambre-interdit',name:'Ambre Interdit',family:'Oryantal · Vanilyalı',juice:'#c9773a',tag:'Yeni',
   price:{30:2000,50:3300,100:4950},
   lede:'Acı badem ve kimyonla başlayan, yasemin ve jakarandayla ısınan baştan çıkarıcı bir oryantal. Vanilya ve miskle tende yavaşça erir.',
   notes:{top:['Acı badem','Kimyon','Yıldız anason'],heart:['Sambac yasemini','Jakaranda'],base:['Vanilya','Sandal ağacı','Misk']}},
  {id:'tulipe-rosee',name:'Tulipe Rosée',family:'Çiçeksi · Taze · Misk',juice:'#d9577a',tag:'',
   price:{30:1950,50:3150,100:4700},
   lede:'Bahar sabahının ilk lalesi. Armut ve pembe greyfurtla parlayan, manolya ve frezyayla yumuşayan, beyaz miskle tende hafif bir tül gibi kalan bir çiçek.',
   notes:{top:['Armut','Pembe greyfurt','Frenk üzümü yaprağı'],heart:['Lale akoru','Manolya','Frezya'],base:['Beyaz misk','Kaşmir ağacı','Ambrette']}},
  {id:'jasmin-de-minuit',name:'Jasmin de Minuit',family:'Çiçeksi · Beyaz çiçek',juice:'#e3c98a',tag:'Sınırlı seri',
   price:{30:2400,50:3800,100:5650},
   lede:'Gece yarısı açan yasemin. Neroli ve mandalinayla aydınlanan, sambac yasemini ve sümbülteberle derinleşen, sandal ağacı ve vanilyayla ipeksi biten beyaz bir çiçek.',
   notes:{top:['Neroli','Mandalina','Bergamot'],heart:['Sambac yasemini','Sümbülteber','Portakal çiçeği'],base:['Sandal ağacı','Vanilya','Beyaz misk']}},
  {id:'magnolia-emeraude',name:'Magnolia Émeraude',family:'Çiçeksi · Yeşil · Odunsu',juice:'#1f7a4d',tag:'Yeni',
   price:{30:2250,50:3600,100:5400},
   lede:'Gece bahçesinde açan manolya. İncir yaprağı ve bergamotla serinleyen, manolya ve yasemin çayıyla açılan, vetiver ve sedirle tende zümrüt bir iz bırakan bir koku.',
   notes:{top:['Bergamot','İncir yaprağı','Yeşil mandalina'],heart:['Manolya','Yasemin çayı','Nergis'],base:['Vetiver','Sedir','Beyaz misk']}},
  {id:'lotus-dombre',name:'Lotus d’Ombre',family:'Akuatik · Çiçeksi · Misk',juice:'#2a3a8c',tag:'',
   price:{30:2150,50:3450,100:5200},
   lede:'Gece suyunda açan nilüfer. Yuzu ve nane yaprağıyla serinleyen, nilüfer ve su zambağıyla açılan, ambergris ve beyaz miskle tende sessiz bir gölge bırakan bir koku.',
   notes:{top:['Yuzu','Nane yaprağı','Kakule'],heart:['Nilüfer','Su zambağı','İris'],base:['Ambergris','Beyaz misk','Sandal ağacı']}},
  {id:'camelia-noir',name:'Camélia Noir',family:'Çiçeksi · Deri · Odunsu',juice:'#4a4a52',tag:'',
   price:{30:2400,50:3850,100:5750},
   lede:'Gecenin en koyu çiçeği. Siyah biber ve tütsüyle açılan, kamelya ve süsenle kadifeleşen, deri ve paçuliyle tende dumanlı bir iz bırakan bir koku.',
   notes:{top:['Siyah biber','Tütsü','Bergamot'],heart:['Kamelya','Süsen','Gül'],base:['Deri','Paçuli','Kehribar']}}
];
const FREE_SHIP=0, SHIP_FEE=0, KEY='noctelia-cart'; // shipping is free on every order
const byId=id=>PRODUCTS.find(p=>p.id===id);
const tl=n=>'₺'+n.toLocaleString('tr-TR');

/* ---------- cart state ---------- */
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter(i=>byId(i.id)&&SIZES.includes(String(i.size))):[]}catch(e){return []}}
let items=read();
const subs=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){}subs.forEach(f=>f())}
const Cart={
  items:()=>items.map(i=>({...i,p:byId(i.id),line:byId(i.id).price[i.size]*i.qty})),
  count:()=>items.reduce((n,i)=>n+i.qty,0),
  subtotal:()=>items.reduce((n,i)=>n+byId(i.id).price[i.size]*i.qty,0),
  shipping(){const s=this.subtotal();return s===0||s>=FREE_SHIP?0:SHIP_FEE},
  add(id,size,qty=1){size=String(size);const it=items.find(i=>i.id===id&&i.size===size);if(it)it.qty=Math.min(9,it.qty+qty);else items.push({id,size,qty});save()},
  setQty(id,size,qty){const it=items.find(i=>i.id===id&&i.size===size);if(!it)return;if(qty<=0)items=items.filter(i=>i!==it);else it.qty=Math.min(9,qty);save()},
  remove(id,size){items=items.filter(i=>!(i.id===id&&i.size===size));save()},
  on:f=>subs.push(f)
};
// another tab changed the cart
addEventListener('storage',e=>{if(e.key===KEY){items=read();subs.forEach(f=>f())}});

/* ---------- toast ---------- */
let toastT;
function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2200)}

/* ---------- the layered bottle used everywhere ---------- */
// product photos: each scent's own flower-shaped bottle, staged in its colour
const shot=(p,alt=true,eager=false)=>`<img class="shot" src="assets/img/urun/${p.id}-sq.webp?v=60" alt="${alt?p.name+' şişesi':''}" loading="${eager?'eager':'lazy'}" decoding="async">`;
// the bottle shot framed as a square, in two layers: the bottle with its pump, and the cap, which lifts on hover
const CAPS={"pivoine-velours":{"r":"1/1","cap":[35.807,13.802,28.516,22.526],"neck":[50,48.698,10],"drop":60.12,"cut":4.05},"orchidee-noire":{"r":"1/1","cap":[34.245,11.198,31.641,25.13],"neck":[50,48.698,10],"drop":53.89,"cut":3.63},"rose-nocturne":{"r":"1/1","cap":[38.151,12.76,23.698,23.828],"neck":[50,48.698,10],"drop":55.19,"cut":3.28},"tulipe-rosee":{"r":"1/1","cap":[38.151,11.719,23.828,24.609],"neck":[50,48.698,10],"drop":54.5,"cut":3.17},"jasmin-de-minuit":{"r":"1/1","cap":[36.719,11.458,26.693,25.0],"neck":[50,48.698,10],"drop":56.77,"cut":6.77},"ambre-interdit":{"r":"1/1","cap":[32.161,14.714,35.807,21.745],"neck":[50,48.698,10],"drop":61.68,"cut":4.19},"magnolia-emeraude":{"r":"1/1","cap":[34.245,17.969,31.51,18.62],"neck":[50,48.698,10],"drop":70.63,"cut":4.2},"lotus-dombre":{"r":"1/1","cap":[32.422,15.495,35.156,20.964],"neck":[50,48.698,10],"drop":65.22,"cut":5.59},"camelia-noir":{"r":"1/1","cap":[37.5,11.849,25.0,24.609],"neck":[50,48.698,10],"drop":53.97,"cut":3.17}};
const vessel=(p,alt=true,eager=false)=>{const c=CAPS[p.id];if(!c)return shot(p,alt,eager);const ld=eager?'eager':'lazy',[l,t,w,h]=c.cap,[nx,ny,nw]=c.neck;
  return `<span class="pv" style="--r:${c.r};--nx:${nx}%;--ny:${ny}%;--nw:${nw}%"><img class="pv-base" src="assets/img/urun/${p.id}-sqbase.webp?v=60" alt="${alt?p.name+' şişesi':''}" loading="${ld}" decoding="async"><img class="pv-cap" src="assets/img/urun/${p.id}-cap.webp?v=60" alt="" aria-hidden="true" loading="${ld}" decoding="async" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%;--drop:${c.drop}%;--cut:${c.cut||0}%"></span>`};

/* ---------- cart drawer, built once on every page ---------- */
const shell=document.createElement('div');
shell.innerHTML=`<div class="drawer-veil" data-close></div>
<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawerTitle" aria-hidden="true">
  <div class="dr-head"><h2 id="drawerTitle">Sepetim <span id="drCount"></span></h2><button class="dr-x" data-close aria-label="Sepeti kapat"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>
  <div class="dr-ship" id="drShip"></div>
  <ul class="dr-list" id="drList"></ul>
  <div class="dr-foot" id="drFoot"></div>
</aside>`;
document.body.append(...shell.children);
const drawer=document.querySelector('.drawer'),veil=document.querySelector('.drawer-veil');
let lastFocus=null;
function openDrawer(){lastFocus=document.activeElement;document.documentElement.classList.add('drawer-open');drawer.setAttribute('aria-hidden','false');setTimeout(()=>drawer.querySelector('.dr-x').focus(),50)}
function closeDrawer(){document.documentElement.classList.remove('drawer-open');drawer.setAttribute('aria-hidden','true');if(lastFocus)lastFocus.focus()}
veil.addEventListener('click',closeDrawer);
addEventListener('keydown',e=>{if(e.key==='Escape'&&document.documentElement.classList.contains('drawer-open'))closeDrawer()});
const bag=document.getElementById('bag');if(bag)bag.addEventListener('click',openDrawer);

function shipNote(){const s=Cart.subtotal();if(!s)return '';
  return `<p>Kargonuz <b>ücretsiz</b>.</p>`}
function qtyCtl(i){return `<div class="qty" data-id="${i.id}" data-size="${i.size}"><button data-d="-1" aria-label="Azalt">−</button><span>${i.qty}</span><button data-d="1" aria-label="Artır">+</button></div>`}
function renderDrawer(){
  const list=Cart.items();
  document.getElementById('drCount').textContent=list.length?`(${Cart.count()})`:'';
  document.getElementById('drShip').innerHTML=shipNote();
  document.getElementById('drList').innerHTML=list.length?list.map(i=>`<li>
      <a class="dr-img" href="urun.html?id=${i.id}">${shot(i.p,false)}</a>
      <div class="dr-info"><a href="urun.html?id=${i.id}" class="dr-name">${i.p.name}</a><span class="dr-size">${i.size} ml · Eau de Parfum</span>${qtyCtl(i)}</div>
      <div class="dr-right"><b>${tl(i.line)}</b><button class="dr-rm" data-id="${i.id}" data-size="${i.size}">Kaldır</button></div></li>`).join('')
    :`<li class="dr-empty"><p>Sepetiniz şu an boş.</p><a class="ghost" href="koleksiyon.html" data-close>Koleksiyonu keşfet</a></li>`;
  document.getElementById('drFoot').innerHTML=list.length?`<div class="dr-sum"><span>Ara toplam</span><b>${tl(Cart.subtotal())}</b></div><p class="dr-note">Kargo ve vergiler ödeme adımında hesaplanır.</p>
    <a class="btn dr-go" href="sepet.html">Sepete git ve öde</a><button class="dr-cont" data-close>Alışverişe devam et</button>`:'';
}
drawer.addEventListener('click',e=>{
  if(e.target.closest('[data-close]')){closeDrawer();return}
  const q=e.target.closest('.qty button');if(q){const w=q.parentElement,it=items.find(i=>i.id===w.dataset.id&&i.size===w.dataset.size);if(it)Cart.setQty(it.id,it.size,it.qty+ +q.dataset.d);return}
  const r=e.target.closest('.dr-rm');if(r)Cart.remove(r.dataset.id,r.dataset.size);
});
function renderBag(){const n=Cart.count();document.querySelectorAll('#bagCount').forEach(b=>{b.textContent=n})}
Cart.on(renderDrawer);Cart.on(renderBag);renderDrawer();renderBag();

/* ---------- size pickers: any [data-sizes] block next to a [data-price] and an add button ---------- */
function wireSizes(root=document){
  root.querySelectorAll('[data-sizes]').forEach(g=>{
    if(g.dataset.wired)return;g.dataset.wired=1;
    const p=byId(g.dataset.sizes),scope=g.closest('[data-product]')||g.parentElement;
    g.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      g.querySelectorAll('button').forEach(o=>{o.classList.toggle('on',o===b);o.setAttribute('aria-pressed',o===b)});
      scope.querySelectorAll('[data-price]').forEach(el=>el.textContent=tl(p.price[b.dataset.size]));
      scope.querySelectorAll('[data-add-id]').forEach(a=>a.dataset.size=b.dataset.size);
    }));
  });
}
const sizePicker=(p,sel='30')=>`<div class="sizes" role="group" aria-label="Boyut" data-sizes="${p.id}">${SIZES.map(s=>`<button type="button" class="ml${s===sel?' on':''}" data-size="${s}" aria-pressed="${s===sel}">${s} ml</button>`).join('')}</div>`;

/* ---------- add to cart, anywhere on the site ---------- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-add-id]');if(!b)return;
  const p=byId(b.dataset.addId);if(!p)return;
  const qty=+(b.dataset.qty||1);
  Cart.add(p.id,b.dataset.size||'30',qty);
  toast(`${p.name} ${b.dataset.size||'30'} ml sepete eklendi`);
  // card buttons turn gold and say "Eklendi" for a moment
  if(b.classList.contains('add')){const t=b.firstChild;if(t&&t.nodeType===3){b._label=b._label||t.nodeValue;t.nodeValue='Eklendi '}
    b.classList.add('done');clearTimeout(b._done);b._done=setTimeout(()=>{b.classList.remove('done');if(t&&b._label)t.nodeValue=b._label},1800)}
  const bagEl=document.getElementById('bag');if(bagEl){bagEl.classList.remove('bump');void bagEl.offsetWidth;bagEl.classList.add('bump')}
  setTimeout(openDrawer,250);
});

/* ---------- hamburger menu (phones) ---------- */
const menuBtn=document.getElementById('menuBtn');
if(menuBtn){
  const setMenu=open=>{document.documentElement.classList.toggle('menu-open',open);menuBtn.setAttribute('aria-expanded',open);menuBtn.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç')};
  menuBtn.addEventListener('click',()=>setMenu(!document.documentElement.classList.contains('menu-open')));
  document.querySelectorAll('#mnav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  // a click anywhere outside the open menu closes it
  document.addEventListener('click',e=>{if(document.documentElement.classList.contains('menu-open')&&!e.target.closest('#mnav,#menuBtn'))setMenu(false)});
  addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
  matchMedia('(min-width: 861px)').addEventListener('change',e=>{if(e.matches)setMenu(false)});
}

/* ---------- signed-in visitor: name and e-mail only, kept in localStorage ---------- */
const USER_KEY='noctelia-user';
const User={
  get(){try{return JSON.parse(localStorage.getItem(USER_KEY))}catch(e){return null}},
  set(u){try{localStorage.setItem(USER_KEY,JSON.stringify(u))}catch(e){}markAcct()},
  clear(){try{localStorage.removeItem(USER_KEY)}catch(e){}markAcct()}
};
function markAcct(){const u=User.get();document.querySelectorAll('.acct').forEach(a=>{a.classList.toggle('in',!!u);a.setAttribute('aria-label',u?`Hesabım: ${u.name}`:'Giriş yap veya üye ol')})}
markAcct();

/* ---------- customer service panel: the contact channels first, the e-mail one opens the message form ---------- */
const svgI=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const CHANNELS=[
  {name:'WhatsApp',icon:svgI('<path d="M4 20l1.2-4A8 8 0 1 1 8.4 19z"/><path d="M9.2 8.6c.2-.5.6-.5.9-.5h.4c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.4c0 .3 0 .7-.5.9-.6.3-1.7.5-3.3-.4a9.4 9.4 0 0 1-3.4-3.4c-.9-1.6-.7-2.7-.4-3.3z"/>')},
  {name:'Bize bir e-posta gönderin',icon:svgI('<rect x="3.5" y="6" width="17" height="12" rx="1"/><path d="M4 7l8 6 8-6"/>'),mail:1},
  {name:'Bizi arayın',icon:svgI('<path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/>')},
  {name:'Canlı sohbet',icon:svgI('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>')}
];
const msgShell=document.createElement('div');msgShell.className='msg';msgShell.id='msg';
msgShell.innerHTML=`<div class="msg-veil" data-msg-close></div>
<aside class="msg-panel" role="dialog" aria-modal="true" aria-labelledby="msgTitle">
  <button class="msg-x" type="button" data-msg-close aria-label="Kapat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 4l16 16M20 4L4 20"/></svg></button>
  <div class="msg-in" id="msgList">
    <div class="msg-head"><p class="eyebrow">Maison Noctélia</p><h2 id="msgTitle">Müşteri <em>hizmetleri</em></h2></div>
    <ul class="ch">${CHANNELS.map(c=>c.mail
      ?`<li><button type="button" class="ch-i" id="chMail"><span>${c.name}</span>${c.icon}</button></li>`
      :`<li><span class="ch-i off" aria-disabled="true"><span>${c.name} <small>(Çevrimdışı)</small></span>${c.icon}</span></li>`).join('')}</ul>
    <p class="ch-note">Müşteri hizmetlerimize Pazartesi – Cumartesi 10:00 – 19:00 saatleri arasında ulaşabilirsiniz. E-postalarınızı <a href="mailto:you@example.com">you@example.com</a> adresine de gönderebilirsiniz; hafta içi 24 saat içinde yanıtlıyoruz.</p>
  </div>
  <div class="msg-in" id="msgView" hidden>
    <button type="button" class="ch-back" id="chBack">← Tüm iletişim seçenekleri</button>
    <div class="msg-head"><p class="eyebrow">Müşteri hizmetleri</p><h2 id="msgFormTitle">Bize <em>yazın.</em></h2><p>Siparişiniz, iade ya da kokularımız hakkında merak ettikleriniz için yazın; atölyemiz hafta içi 24 saat içinde yanıtlar.</p></div>
    <form class="ac-form" id="msgForm" novalidate>
      <p class="msg-req">Bilgileriniz <small>* zorunlu alan</small></p>
      <div class="msg-two">
        <div class="fld"><input id="msgName" name="ad" placeholder=" " autocomplete="name" maxlength="60" required><label for="msgName">Ad soyad*</label></div>
        <div class="fld"><input id="msgMail" name="eposta" type="email" placeholder=" " autocomplete="email" required><label for="msgMail">E-posta*</label></div>
      </div>
      <div class="fld"><select id="msgTopic" name="konu"><option>Sipariş ve kargo</option><option>İade ve değişim</option><option>Ürün bilgisi</option><option>Kurumsal ve hediye</option><option>Diğer</option></select><label for="msgTopic">Konu</label></div>
      <div class="fld"><textarea id="msgText" name="mesaj" placeholder=" " maxlength="1500" required></textarea><label for="msgText">Mesajınız*</label></div>
      <label class="chk"><input type="checkbox" name="kvkk"> KVKK aydınlatma metnini okudum; mesajıma yanıt verilmesi için bilgilerimin işlenmesini kabul ediyorum.</label>
      <button class="btn" type="submit">Gönder</button>
      <p class="ac-msg err" id="msgErr" role="status"></p>
    </form>
    <div class="msg-done" id="msgDone" hidden><p class="eyebrow">Teşekkürler</p><h3>Mesajınız <em>bize ulaştı.</em></h3><p id="msgDoneT"></p><button type="button" id="msgAgain">Yeni mesaj yaz</button></div>
  </div>
</aside>`;
document.body.appendChild(msgShell);
const msgForm=msgShell.querySelector('#msgForm'),msgDone=msgShell.querySelector('#msgDone'),msgErr=msgShell.querySelector('#msgErr');
// both side panels (message and newsletter) open and close the same way
let panelFocus=null;
function openPanel(el,focusEl){panelFocus=document.activeElement;document.documentElement.classList.remove('menu-open');
  el.classList.add('open');document.documentElement.classList.add('msg-open');setTimeout(()=>focusEl().focus(),400)}
function closePanel(){const el=document.querySelector('.msg.open');if(!el)return;el.classList.remove('open');document.documentElement.classList.remove('msg-open');if(panelFocus)panelFocus.focus()}
const msgList=msgShell.querySelector('#msgList'),msgView=msgShell.querySelector('#msgView');
const msgFocusIn=()=>msgDone.hidden?(msgForm.ad.value?msgForm.mesaj:msgForm.ad):msgShell.querySelector('.msg-x');
function msgShow(form){msgList.hidden=form;msgView.hidden=!form;msgShell.querySelector('.msg-panel').scrollTop=0;
  msgShell.querySelector('.msg-panel').setAttribute('aria-labelledby',form?'msgFormTitle':'msgTitle')}
function openMsg(form=false){const u=User.get(),n=msgForm.ad,m=msgForm.eposta;if(u){if(!n.value)n.value=u.name;if(!m.value)m.value=u.email}
  msgShow(form);openPanel(msgShell,()=>form?msgFocusIn():msgShell.querySelector('#chMail'))}
msgShell.querySelector('#chMail').addEventListener('click',()=>{msgShow(true);msgFocusIn().focus()});
msgShell.querySelector('#chBack').addEventListener('click',()=>{msgShow(false);msgShell.querySelector('#chMail').focus()});
// social icons are placeholders in this portfolio build: they go nowhere
document.addEventListener('click',e=>{if(e.target.closest('[data-social]'))e.preventDefault()});
document.addEventListener('click',e=>{
  const mk=e.target.closest('[data-msg]');
  if(mk){e.preventDefault();openMsg(mk.dataset.msg==='form')}
  else if(e.target.closest('[data-news]')){e.preventDefault();openNews()}
  else if(e.target.closest('[data-region]')){e.preventDefault();openRegion()}
  else if(e.target.closest('[data-msg-close]'))closePanel()});
addEventListener('keydown',e=>{if(e.key==='Escape')closePanel()});
msgForm.querySelectorAll('input,textarea').forEach(i=>i.addEventListener('input',()=>i.closest('.fld')&&i.closest('.fld').classList.remove('bad')));
msgForm.addEventListener('submit',e=>{e.preventDefault();
  const n=msgForm.ad,m=msgForm.eposta,t=msgForm.mesaj,okM=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim());
  const bad=[[n,n.value.trim().length<2],[m,!okM],[t,t.value.trim().length<10]];
  bad.forEach(([el,b])=>el.closest('.fld').classList.toggle('bad',b));
  if(bad.some(x=>x[1])){msgErr.textContent='Lütfen adınızı, geçerli bir e-postayı ve en az 10 karakterlik mesajınızı yazın.';return}
  if(!msgForm.kvkk.checked){msgErr.textContent='Göndermek için KVKK onayını işaretleyin.';return}
  msgErr.textContent='';msgShell.querySelector('#msgDoneT').textContent=`Yanıtımızı ${m.value.trim()} adresine göndereceğiz.`;
  msgForm.hidden=true;msgDone.hidden=false;msgForm.mesaj.value='';msgForm.kvkk.checked=false;toast('Mesajınız gönderildi');
});
msgShell.querySelector('#msgAgain').addEventListener('click',()=>{msgDone.hidden=true;msgForm.hidden=false;msgForm.mesaj.focus()});

/* ---------- location and language: only Türkiye and Türkçe are open for now ---------- */
const REGION_KEY='noctelia-region';
const REGIONS=[{id:'tr',name:'Türkiye',open:1},{id:'fr',name:'Fransa'},{id:'gb',name:'Birleşik Krallık'},{id:'de',name:'Almanya'},{id:'us',name:'Amerika Birleşik Devletleri'}];
const LANGS=[{id:'tr',name:'Türkçe',open:1},{id:'en',name:'English'}];
const regionGet=()=>{try{return JSON.parse(localStorage.getItem(REGION_KEY))||{region:'tr',lang:'tr'}}catch(e){return {region:'tr',lang:'tr'}}};
const opt=(group,o,cur)=>`<label class="rg-opt${o.open?'':' off'}"><input type="radio" name="${group}" value="${o.id}"${o.id===cur?' checked':''}${o.open?'':' disabled'}><span class="rg-dot" aria-hidden="true"></span><span class="rg-name">${o.name}</span>${o.open?'':'<small>Yakında</small>'}</label>`;
const regionShell=document.createElement('div');regionShell.className='msg';regionShell.id='regionPanel';
const rgNow=regionGet();
regionShell.innerHTML=`<div class="msg-veil" data-msg-close></div>
<aside class="msg-panel" role="dialog" aria-modal="true" aria-labelledby="rgTitle">
  <button class="msg-x" type="button" data-msg-close aria-label="Kapat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 4l16 16M20 4L4 20"/></svg></button>
  <form class="msg-in rg" id="rgForm">
    <div class="msg-head"><p class="eyebrow">Maison Noctélia</p><h2 id="rgTitle">Konumunuzu <em>seçin</em></h2></div>
    <fieldset class="rg-set"><legend class="sr">Konum</legend>${REGIONS.map(o=>opt('bolge',o,rgNow.region)).join('')}</fieldset>
    <h2 class="rg-h2">Dilinizi <em>seçin</em></h2>
    <fieldset class="rg-set"><legend class="sr">Dil</legend>${LANGS.map(o=>opt('dil',o,rgNow.lang)).join('')}</fieldset>
    <p class="rg-note">Şimdilik yalnızca Türkiye'ye gönderim yapıyoruz. Yeni ülkeler ve diller çok yakında.</p>
    <button class="btn rg-ok" type="submit">Onayla</button>
  </form>
</aside>`;
document.body.appendChild(regionShell);
const rgForm=regionShell.querySelector('#rgForm');
const rgShow=()=>{const r=REGIONS.find(o=>o.id===regionGet().region)||REGIONS[0];document.querySelectorAll('#fRegion').forEach(s=>s.textContent=r.name)};
rgShow();
function openRegion(){openPanel(regionShell,()=>rgForm.querySelector('input:checked')||regionShell.querySelector('.msg-x'))}
rgForm.addEventListener('submit',e=>{e.preventDefault();
  const v={region:rgForm.bolge.value||'tr',lang:rgForm.dil.value||'tr'};
  try{localStorage.setItem(REGION_KEY,JSON.stringify(v))}catch(err){}
  rgShow();closePanel();toast('Konum ve dil tercihiniz kaydedildi');
});

/* ---------- newsletter: one list for the mail icon panel and the home page form ---------- */
const NEWS_KEY='noctelia-news';
const News={
  all(){try{return JSON.parse(localStorage.getItem(NEWS_KEY))||{}}catch(e){return {}}},
  has(mail){return !!this.all()[mail.toLowerCase()]},
  add(mail,extra={}){const all=this.all(),k=mail.toLowerCase(),had=!!all[k];all[k]={...all[k],...extra,at:all[k]?.at||Date.now()};try{localStorage.setItem(NEWS_KEY,JSON.stringify(all))}catch(e){}return !had}
};
const newsShell=document.createElement('div');newsShell.className='msg';newsShell.id='newsPanel';
newsShell.innerHTML=`<div class="msg-veil" data-msg-close></div>
<aside class="msg-panel" role="dialog" aria-modal="true" aria-labelledby="nwTitle">
  <button class="msg-x" type="button" data-msg-close aria-label="Kapat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 4l16 16M20 4L4 20"/></svg></button>
  <div class="msg-in">
    <div class="msg-head"><p class="eyebrow">Bülten</p><h2 id="nwTitle">Geceye <em>katılın.</em></h2></div>
    <form class="ac-form" id="nwForm" novalidate>
      <p class="msg-req">Doğum tarihiniz <small>* zorunlu alan</small></p>
      <div class="fld"><input id="nwBirth" name="dogum" placeholder=" " inputmode="numeric" maxlength="10" autocomplete="bday"><label for="nwBirth">Doğum tarihi</label></div>
      <p class="nw-hint">GG/AA/YYYY</p>
      <div class="fld"><input id="nwMail" name="eposta" type="email" placeholder=" " autocomplete="email" required><label for="nwMail">E-posta*</label></div>
      <label class="chk"><input type="checkbox" name="kvkk"> Kullanım koşullarını ve KVKK aydınlatma metnini okudum; Noctélia'dan tanıtım ve bana özel e-postalar almayı kabul ediyorum.*</label>
      <button class="btn" type="submit">Abone ol</button>
      <p class="ac-msg err" id="nwErr" role="status"></p>
    </form>
    <div class="msg-done" id="nwDone" hidden><p class="eyebrow">Teşekkürler</p><h3>Artık <em>listedesiniz.</em></h3><p id="nwDoneT"></p><button type="button" data-msg-close>Kapat</button></div>
  </div>
</aside>`;
document.body.appendChild(newsShell);
const nwForm=newsShell.querySelector('#nwForm'),nwDone=newsShell.querySelector('#nwDone'),nwErr=newsShell.querySelector('#nwErr'),nwBirth=nwForm.dogum;
function openNews(){const u=User.get(),m=nwForm.eposta;if(u&&!m.value)m.value=u.email;openPanel(newsShell,()=>nwDone.hidden?nwBirth:newsShell.querySelector('.msg-x'))}
// type the slashes for the visitor: 12051990 -> 12/05/1990
nwBirth.addEventListener('input',()=>{const d=nwBirth.value.replace(/\D/g,'').slice(0,8);nwBirth.value=[d.slice(0,2),d.slice(2,4),d.slice(4)].filter(Boolean).join('/')});
nwForm.querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>i.closest('.fld')&&i.closest('.fld').classList.remove('bad')));
const okBirth=v=>{if(!v)return true;const m=v.match(/^(\d\d)\/(\d\d)\/(\d{4})$/);if(!m)return false;const [d,mo,y]=[+m[1],+m[2],+m[3]],dt=new Date(y,mo-1,d),age=(Date.now()-dt)/31557600000;
  return dt.getDate()===d&&dt.getMonth()===mo-1&&age>=0&&age<120};
nwForm.addEventListener('submit',e=>{e.preventDefault();
  const m=nwForm.eposta,mail=m.value.trim(),b=nwBirth.value.trim(),okM=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  m.closest('.fld').classList.toggle('bad',!okM);nwBirth.closest('.fld').classList.toggle('bad',!okBirth(b));
  if(!okBirth(b)){nwErr.textContent='Doğum tarihinizi GG/AA/YYYY biçiminde yazın ya da boş bırakın.';return}
  if(!okM){nwErr.textContent='Geçerli bir e-posta adresi yazın, örneğin ad@ornek.com';return}
  if(!nwForm.kvkk.checked){nwErr.textContent='Abone olmak için onay kutusunu işaretleyin.';return}
  const fresh=News.add(mail,b?{birth:b}:{});nwErr.textContent='';
  newsShell.querySelector('#nwDoneT').textContent=fresh?`İlk e-postamız yeni koleksiyonla birlikte ${mail} adresine gelecek.`:`${mail} zaten listemizde; bilgilerinizi güncelledik.`;
  nwForm.hidden=true;nwDone.hidden=false;nwForm.reset();toast('Bültene abone oldunuz');
});

if('IntersectionObserver' in window&&matchMedia('(hover: none)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting&&!v.classList.contains('open')){v.classList.add('open');clearTimeout(v._t);v._t=setTimeout(()=>v.classList.remove('open'),2600)}}),{threshold:.7});
  const watch=()=>document.querySelectorAll('.pv:not([data-io])').forEach(v=>{v.dataset.io=1;io.observe(v)});
  watch();new MutationObserver(watch).observe(document.body,{childList:true,subtree:true});
}
addEventListener('pagereveal',e=>{const t=e.viewTransition;if(t){t.ready.catch(()=>{});t.finished.catch(()=>{})}});
addEventListener('pageswap',e=>{const t=e.viewTransition;if(t){t.ready.catch(()=>{});t.finished.catch(()=>{})}});
// collection menu: the featured bottle follows the name under the pointer
document.querySelectorAll('.mega').forEach(m=>{const f=m.querySelector('.mg-feature');if(!f)return;const img=f.querySelector('img'),cap=f.querySelector('.mg-cap b'),lab=f.querySelector('.mg-cap small');let t;
  m.querySelectorAll('.mg-item').forEach(a=>{const show=()=>{const p=byId(a.dataset.id);if(!p||f.getAttribute('href')===a.getAttribute('href'))return;
    m.querySelectorAll('.mg-item.on').forEach(o=>o.classList.remove('on'));a.classList.add('on');f.href=a.getAttribute('href');f.style.setProperty('--juice',p.juice);cap.textContent=p.name;lab.textContent=p.family.split(' · ')[0];
    img.classList.add('swap');clearTimeout(t);t=setTimeout(()=>{img.src=img.src.replace(/urun\/[a-z-]+-sq/,`urun/${p.id}-sq`);img.onload=()=>img.classList.remove('swap')},180)};
    a.addEventListener('pointerenter',show);a.addEventListener('focus',show)})});
// smooth scrolling for mouse and trackpad; phones keep their own native scrolling
let lenis=null;
if(window.Lenis&&matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  lenis=new Lenis({duration:1.15,easing:t=>1-Math.pow(1-t,4),
    prevent:n=>!!(n.closest&&n.closest('.drawer,.msg-panel,.mega,.sl-map,[data-lenis-prevent]'))});
  const hook=()=>{if(window.gsap&&window.ScrollTrigger){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
    else{const f=t=>{lenis.raf(t);requestAnimationFrame(f)};requestAnimationFrame(f)}};
  document.readyState==='loading'?addEventListener('DOMContentLoaded',hook):hook();
  // the page holds still while the cart or a side panel is open
  new MutationObserver(()=>{const c=document.documentElement.classList;c.contains('drawer-open')||c.contains('msg-open')?lenis.stop():lenis.start()})
    .observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  // in-page links glide to their section, clear of the header
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a||a.getAttribute('href').length<2)return;
    const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();lenis.scrollTo(t,{offset:-70})});
}
/* ---------- scent quiz: questions and the weight each answer gives to every scent ---------- */
const QUIZ={
  Q:[
    {q:'Kokunu en çok ne zaman taşırsın?',a:[['Gün ışığında',{tulipe:2,lotus:2,magnolia:2,pivoine:2}],['Gece çökünce',{rose:2,orchidee:2,ambre:2,camelia:2,jasmin:2}],['Her an, her yerde',{pivoine:1,jasmin:1,magnolia:1,rose:1}]]},
    {q:'Hangi his seni çeker?',a:[['Taze ve hafif',{tulipe:3,lotus:3,magnolia:2}],['Çiçeksi ve romantik',{pivoine:3,rose:2,jasmin:2,tulipe:1}],['Sıcak ve baştan çıkarıcı',{ambre:3,orchidee:2,rose:1}],['Gizemli ve koyu',{camelia:3,orchidee:2,rose:2}]]},
    {q:'Hangi mevsim senin?',a:[['İlkbahar',{tulipe:2,magnolia:2,pivoine:2}],['Yaz',{lotus:2,jasmin:2,magnolia:1}],['Sonbahar',{ambre:2,rose:2,camelia:1}],['Kış',{orchidee:2,camelia:2,ambre:1,rose:1}]]},
    {q:'Kokun nasıl iz bıraksın?',a:[['Fısıltı gibi, yalnızca yakınına',{tulipe:2,lotus:2,pivoine:1}],['Dengeli, zarif bir hale',{magnolia:2,jasmin:2,pivoine:2}],['Girdiğin odada hatırlansın',{ambre:2,orchidee:2,camelia:2,rose:2}]]}],
  ID:{tulipe:'tulipe-rosee',lotus:'lotus-dombre',magnolia:'magnolia-emeraude',pivoine:'pivoine-velours',rose:'rose-nocturne',orchidee:'orchidee-noire',ambre:'ambre-interdit',camelia:'camelia-noir',jasmin:'jasmin-de-minuit'}
};

window.Noctelia={PRODUCTS,byId,tl,Cart,User,News,shot,vessel,CAPS,QUIZ,sizePicker,wireSizes,openDrawer,toast,FREE_SHIP,SHIP_FEE,lenis};
wireSizes();
})();
