/*! © 2026 Efnan Yılmaz. Tüm hakları saklıdır. İzinsiz kopyalanamaz, kullanılamaz veya dağıtılamaz. Ayrıntılar: LICENSE */
/* Noctélia — inner pages: product, cart, collection and account */
(function(){
const N=window.Noctelia;if(!N)return;
const {PRODUCTS,byId,tl,Cart,shot,vessel,sizePicker,wireSizes,FREE_SHIP}=N;
const page=document.body.dataset.page;
const $=s=>document.querySelector(s);

/* header turns solid once you scroll, same as the home page */
const head=$('#top');addEventListener('scroll',()=>head.classList.toggle('scrolled',scrollY>10),{passive:true});


/* ---------- product detail ---------- */
if(page==='urun'){
  const id=new URLSearchParams(location.search).get('id');
  // four notes fit the pyramid's three lines by sharing one: the two shortest neighbours go together
  const pzLines=l=>{if(l.length<4)return l;let k=0;for(let i=1;i<l.length-1;i++)if(l[i].length+l[i+1].length<l[k].length+l[k+1].length)k=i;return [...l.slice(0,k),l[k]+' · '+l[k+1],...l.slice(k+2)]};
  const p=byId(id)||byId('rose-nocturne');
  document.title=`${p.name} — Noctélia Eau de Parfum`;
  const md=document.querySelector('meta[name="description"]');if(md)md.content=`${p.name}: ${p.lede}`;
  $('#crName').textContent=p.name;
  $('#pd').innerHTML=`
    <div class="pd-grid" data-product="${p.id}" style="--juice:${p.juice}">
      <div class="pd-media">
        <div class="pd-stage" data-view="closed">${p.tag?`<span class="c-tag">${p.tag}</span>`:''}${vessel(p,true,true)}</div>
        <div class="pd-views" role="tablist" aria-label="Şişe görünümü">
          <button type="button" role="tab" aria-selected="true" data-v="closed">Kapalı</button>
          <button type="button" role="tab" aria-selected="false" data-v="open">Açık</button>
          <button type="button" role="tab" aria-selected="false" data-v="detail">Kapak detayı</button>
        </div>
      </div>
      <div class="pd-info">
        <p class="c-fam"><i class="sw"></i>${p.family}</p>
        <h1>${p.name}</h1>
        <p class="pd-lede">${p.lede}</p>
        <div class="pd-price"><b data-price>${tl(p.price[30])}</b><span>Eau de Parfum · KDV dahil</span></div>
        <div class="pd-field"><span class="pd-label">Boyut</span>${sizePicker(p)}</div>
        <div class="pd-buy">
          <div class="qty pd-qty" aria-label="Adet"><button type="button" data-d="-1" aria-label="Azalt">−</button><span id="pdQty">1</span><button type="button" data-d="1" aria-label="Artır">+</button></div>
          <button class="btn pd-add" data-add-id="${p.id}" data-size="30" data-qty="1">Sepete ekle</button>
        </div>
        <a class="pd-faq" href="/sss">Sorunuz mu var? Sıkça sorulanlara göz atın →</a>
        <div class="pd-sticky" aria-hidden="true"><span class="ps-name"><b>${p.name}</b><small data-price>${tl(p.price[30])}</small></span><button class="btn ps-add" tabindex="-1" data-add-id="${p.id}" data-size="30" data-qty="1">Sepete ekle</button></div>
      </div>
    </div>
    <section class="pd-notes pd-pyr" aria-labelledby="pdNotesT">
      <div class="pyr-head"><p class="eyebrow">Koku piramidi</p><h2 id="pdNotesT">Üç perdede <em>açılan</em> bir koku</h2></div>
      <div class="pz">
        <div class="pz-center" aria-hidden="true">
          <svg class="pz-lines" viewBox="0 0 600 540" preserveAspectRatio="none">
            <polygon class="pz-fill" data-tier="0" points="300,10 476.8,327 123.2,327"/>
            <polygon class="pz-fill" data-tier="1" points="123.2,327 476.8,327 530.3,423 69.7,423"/>
            <polygon class="pz-fill" data-tier="2" points="69.7,423 530.3,423 590,530 10,530"/>
            <polygon class="pz-edge" points="300,10 590,530 10,530"/>
            <line class="pz-sep" x1="123.2" y1="327" x2="476.8" y2="327"/>
            <line class="pz-sep" x1="69.7" y1="423" x2="530.3" y2="423"/>
            <circle cx="300" cy="10" r="3"/>
          </svg>
          <div class="pz-vessel">${vessel(p,false)}</div>
        </div>
        ${[['I','Üst notalar','0 – 15 dk',p.notes.top,279],['II','Kalp notaları','30 dk – 4 sa',p.notes.heart,375],['III','Dip notalar','4 sa +',p.notes.base,471]].map(([rn,t,time,list,y],i)=>`
        <div class="pz-tier" data-tier="${i}" style="--y:${y}">
          <div class="pz-label"><span class="rn">${rn}</span><b>${t}</b><small>${time}</small></div>
          <p class="pz-notes">${pzLines(list).join('<br>')}</p>
        </div>`).join('')}
      </div>
    </section>
    <section class="pd-more" aria-labelledby="pdMoreT">
      <h2 id="pdMoreT">Koleksiyonun <em>diğer kokuları</em></h2>
      <div class="pd-others">${(i=>PRODUCTS.slice(i+1).concat(PRODUCTS.slice(0,i)).slice(0,3))(PRODUCTS.indexOf(p)).map(o=>`
        <a class="pd-other" href="/urun?id=${o.id}" style="--juice:${o.juice}">
          <span class="po-stage">${vessel(o,false)}</span>
          <span class="po-fam"><i class="sw"></i>${o.family}</span>
          <b>${o.name}</b><span class="po-pr">${tl(o.price[30])}'den başlayan fiyatlarla</span>
        </a>`).join('')}</div>
    </section>`;
  wireSizes($('#pd'));
  // gallery: closed, open, or a close look at the cap
  const stage=$('.pd-stage'),pv=stage.querySelector('.pv'),cp=(N.CAPS||{})[p.id];
  if(cp){const [l,t,w,h]=cp.cap;stage.style.setProperty('--fx',`${l+w/2}%`);stage.style.setProperty('--fy',`${t+h*cp.drop/100+h/2}%`)}
  $('.pd-views').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;stage.dataset.view=b.dataset.v;
    $('.pd-views').querySelectorAll('button').forEach(o=>o.setAttribute('aria-selected',o===b));pv&&pv.classList.toggle('open',b.dataset.v==='open')});
  /* pyramid, as on the home page: the tier you scroll to (or point at) lights up and the outline draws itself in */
  const pz=$('.pd-pyr .pz'),pzTiers=[...pz.querySelectorAll('.pz-tier')],pzFills=[...pz.querySelectorAll('.pz-fill')];
  let pzNow=-1;const pzSet=i=>{if(i===pzNow)return;pzNow=i;pzTiers.forEach((t,k)=>t.classList.toggle('on',k===i));pzFills.forEach((f,k)=>f.classList.toggle('on',k===i))};
  pzSet(0);
  pzTiers.forEach((t,i)=>t.querySelectorAll('.pz-label,.pz-notes').forEach(el=>el.addEventListener('pointerenter',()=>pzSet(i))));
  const pzScroll=()=>{const r=pz.getBoundingClientRect(),H=innerHeight;
    if(r.top<H*.8)pz.classList.add('drawn');
    const k=(H*.65-r.top)/(H*.2+r.height);if(k>=0&&k<=1)pzSet(Math.min(2,Math.floor(k*3)))};
  addEventListener('scroll',pzScroll,{passive:true});pzScroll();
  // quantity stepper feeds the add button
  const add=$('.pd-add'),q=$('#pdQty');
  $('.pd-qty').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const n=Math.max(1,Math.min(9,+q.textContent+ +b.dataset.d));q.textContent=n;add.dataset.qty=n;$('.ps-add').dataset.qty=n});
  // on a phone, once the buy button scrolls away a slim bar keeps the name, the price and the button in reach
  const bar=$('.pd-sticky');
  const buy=$('.pd-buy');let barOn=false;
  const barCheck=()=>{const on=buy.getBoundingClientRect().bottom<0;if(on===barOn)return;barOn=on;bar.classList.toggle('on',on);bar.setAttribute('aria-hidden',!on);bar.querySelector('button').tabIndex=on?0:-1};
  addEventListener('scroll',barCheck,{passive:true});barCheck();
}

/* ---------- cart page ---------- */
if(page==='sepet'){
  const list=$('#cpList'),sum=$('#cpSum');
  function render(){
    const items=Cart.items();
    if(!items.length){
      list.innerHTML=`<div class="cp-empty"><p>Sepetiniz şu an boş.</p><a class="btn" href="/koleksiyon">Koleksiyonu keşfet</a></div>`;
      sum.hidden=true;return;
    }
    sum.hidden=false;
    list.innerHTML=items.map(i=>`<article class="cp-item">
        <a class="cp-img" href="/urun?id=${i.id}">${shot(i.p,false)}</a>
        <div class="cp-info"><p class="c-fam"><i class="sw" style="--juice:${i.p.juice}"></i>${i.p.family}</p><a class="cp-name" href="/urun?id=${i.id}">${i.p.name}</a><span class="cp-size">${i.size} ml · Eau de Parfum · ${tl(i.p.price[i.size])}</span></div>
        <div class="qty" data-id="${i.id}" data-size="${i.size}"><button data-d="-1" aria-label="Azalt">−</button><span>${i.qty}</span><button data-d="1" aria-label="Artır">+</button></div>
        <b class="cp-line">${tl(i.line)}</b>
        <button class="cp-rm" data-id="${i.id}" data-size="${i.size}" aria-label="${i.p.name} ürününü kaldır"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
      </article>`).join('');
    const sub=Cart.subtotal(),ship=Cart.shipping();
    sum.innerHTML=`<h2>Sipariş özeti</h2>
      <div class="cp-row"><span>Ara toplam</span><b>${tl(sub)}</b></div>
      <div class="cp-row"><span>Kargo</span><b>${ship?tl(ship):'Ücretsiz'}</b></div>
      <div class="cp-row"><span>Hediye</span><b>2 ml deneme şişesi</b></div>
      <div class="cp-row cp-total"><span>Toplam</span><b>${tl(sub+ship)}</b></div>
      <p class="cp-tax">KDV dahildir.</p>
      <label class="cp-gift"><input type="checkbox" id="cpGift"> Hediye paketi istiyorum <span>Ücretsiz</span></label>
      <button class="btn cp-pay" id="cpPay">Ödemeye geç</button>
      <p class="cp-msg" id="cpMsg" role="status"></p>
      <a class="ghost cp-back" href="/koleksiyon">Alışverişe devam et</a>`;
    $('#cpPay').addEventListener('click',()=>{$('#cpMsg').textContent='Ödeme altyapısı bağlandığında bu adımda güvenli ödeme sayfasına yönlendirileceksiniz.'});
  }
  list.addEventListener('click',e=>{
    const q=e.target.closest('.qty button');if(q){const w=q.parentElement,it=Cart.items().find(i=>i.id===w.dataset.id&&i.size===w.dataset.size);if(it)Cart.setQty(it.id,it.size,it.qty+ +q.dataset.d);return}
    const r=e.target.closest('.cp-rm');if(r)Cart.remove(r.dataset.id,r.dataset.size);
  });
  Cart.on(render);render();
}

/* ---------- collection: the home page's cards, with family filter and price sort ---------- */
if(page==='koleksiyon'){
  const grid=$('#shopGrid');
  const NOTES={"pivoine-velours": "Safran, şakayık, iris, heliotrop, ambrette, kaşmir, beyaz misk, sedir", "orchidee-noire": "Rom, bal, siyah orkide, sümbülteber, vanilya, mür, süet, sandal ağacı", "rose-nocturne": "Pembe biber, Damask gülü, yasemin, portakal çiçeği, oud, labdanum, vanilya, kehribar", "ambre-interdit": "Acı badem, kimyon, yıldız anason, sambac yasemini, jakaranda, vanilya, sandal, misk", "tulipe-rosee": "Armut, pembe greyfurt, lale, manolya, frezya, beyaz misk, kaşmir ağacı", "jasmin-de-minuit": "Neroli, mandalina, sambac yasemini, sümbülteber, portakal çiçeği, sandal ağacı, vanilya", "magnolia-emeraude": "Bergamot, incir yaprağı, manolya, yasemin çayı, nergis, vetiver, sedir, beyaz misk", "lotus-dombre": "Yuzu, nane yaprağı, kakule, nilüfer, su zambağı, iris, ambergris, beyaz misk", "camelia-noir": "Siyah biber, tütsü, bergamot, kamelya, süsen, gül, deri, paçuli, kehribar"};
  grid.innerHTML=PRODUCTS.map((p,i)=>`<article class="card" data-product="${p.id}" data-family="${p.family}" data-i="${i}" style="--juice:${p.juice}">
      <a class="c-stage" href="/urun?id=${p.id}" aria-label="${p.name} ürün sayfası">${p.tag?`<span class="c-tag">${p.tag}</span>`:''}${vessel(p)}</a>
      <div class="c-info">
        <p class="c-fam"><i class="sw"></i>${p.family}</p>
        <div class="meta"><h3><a href="/urun?id=${p.id}">${p.name}</a></h3><span class="pr" data-price>${tl(p.price[30])}</span></div>
        <p class="notes">${NOTES[p.id]||[...p.notes.top,...p.notes.heart,...p.notes.base].join(', ')}</p>
        ${sizePicker(p)}
        <button class="add" data-add-id="${p.id}" data-size="30">Sepete ekle <span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M12 11.5v5M9.5 14h5"/></svg></span></button>
      </div>
    </article>`).join('');
  wireSizes(grid);
  const cards=[...grid.children];let fam='';
  function apply(){const sort=$('#shopSort').value;
    const shown=cards.filter(c=>{const ok=!fam||fam.split('|').some(f=>c.dataset.family.includes(f));c.hidden=!ok;return ok});
    [...cards].sort((a,b)=>sort?(byId(a.dataset.product).price[30]-byId(b.dataset.product).price[30])*(sort==='asc'?1:-1):a.dataset.i-b.dataset.i).forEach(c=>grid.append(c));
    $('#shopCount').textContent=`${shown.length} koku`;
  }
  $('#phFilter').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;fam=b.dataset.f;
    $('#phFilter').querySelectorAll('button').forEach(o=>{o.classList.toggle('on',o===b);o.setAttribute('aria-pressed',o===b)});apply()});
  $('#shopSort').addEventListener('change',apply);
}

/* ---------- account: the bottle's tag is written as you type, flips for sign-in, gets sealed on success ---------- */
if(page==='hesap'){
  const {User}=N;
  const form=$('#fAcc'),flow=$('#prFlow'),me=$('#acMe'),h1=$('#acT'),sub=$('#prSub'),btn=$('#acBtn'),msg=$('#acMsg');
  const mail=$('#acMail'),mailFld=$('#prMailFld'),mailRow=$('#prMailRow'),grpIn=$('#grpIn'),grpUp=$('#grpUp');
  const okMail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const esc=v=>v.replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  document.querySelectorAll('.lgn .eye').forEach(b=>b.addEventListener('click',()=>{const i=b.parentElement.querySelector('input'),vis=i.type==='password';i.type=vis?'text':'password';b.classList.toggle('on',vis);b.setAttribute('aria-label',vis?'Şifreyi gizle':'Şifreyi göster')}));
  const bad=(el,on)=>el.closest('.fld').classList.toggle('bad',on);
  document.querySelectorAll('.lgn .fld input').forEach(i=>i.addEventListener('input',()=>bad(i,false)));
  const say=(t,err)=>{msg.textContent=t;msg.classList.toggle('err',!!err)};

  const pass=$('#upPass'),meter=$('#meter'),meterT=$('#meterT');
  pass.addEventListener('input',()=>{const v=pass.value;let s=0;
    if(v){s=1;if(v.length>=8)s=1+(/[a-zçğıöşü]/.test(v)&&/[A-ZÇĞİÖŞÜ]/.test(v))+/\d/.test(v)+/[^\wçğıöşüÇĞİÖŞÜ]/.test(v);if(v.length>=8&&s<2)s=2}
    meter.dataset.s=s;meterT.textContent=['','Zayıf','Orta','İyi','Güçlü'][s]});

  const accounts=()=>{try{return JSON.parse(localStorage.getItem('noctelia-accounts')||'{}')}catch(e){return {}}};
  // three steps on one form: the e-mail, then the password (known address) or a new profile
  const COPY={mail:['E-posta adresinizi girin','Hesabınız varsa giriş yapalım, yoksa birkaç adımda oluşturalım.','Devam et'],
    in:['Tekrar hoş geldiniz','Hesabınıza giriş yapmak için şifrenizi yazın.','Giriş yap'],
    up:['Hesabınızı oluşturun','Bu adresle kayıtlı bir hesap yok. Birkaç bilgiyle hemen oluşturalım.','Hesap oluştur']};
  function step(s,focus=true){form.dataset.step=s;const c=COPY[s];h1.textContent=c[0];sub.textContent=c[1];btn.textContent=c[2];say('');
    mailFld.hidden=s!=='mail';mailRow.hidden=s==='mail';$('#prMailTxt').textContent=mail.value.trim();
    grpIn.hidden=s!=='in';grpUp.hidden=s!=='up';
    if(focus)(s==='mail'?mail:s==='in'?$('#inPass'):$('#upName')).focus()}
  $('#prChange').addEventListener('click',()=>step('mail'));
  function render(){const u=User.get();
    me.hidden=!u;flow.hidden=!!u;
    if(!u)return;
    const n=N.Cart.count();
    me.innerHTML=`<h1 class="lgn-h" id="acHi">Hoş geldiniz, <em>${esc(u.name.split(' ')[0])}</em></h1>
      <p class="lgn-sub">${esc(u.email)} ile giriş yaptınız.</p>
      <div class="ac-tiles"><a href="/koleksiyon"><div><b>Siparişlerim</b><br><span>Henüz siparişiniz yok</span></div><span>→</span></a>
      <a href="/sepet"><div><b>Sepetim</b><br><span>${n?n+' ürün':'Sepetiniz boş'}</span></div><span>→</span></a>
      <a href="/#liste" data-news><div><b>Bülten</b><br><span>${u.news||N.News.has(u.email)?'Abonesiniz':'Abone olmak için dokunun'}</span></div><span>→</span></a></div>
      <button class="ac-out" type="button" id="acOut">Çıkış yap</button>`;
    $('#acOut').addEventListener('click',()=>{User.clear();form.reset();step('mail',false);render();N.toast('Çıkış yaptınız')});
  }
  $('#forgot').addEventListener('click',()=>say(`Şifre sıfırlama bağlantısı ${mail.value.trim()} adresine gönderildi.`));
  form.addEventListener('submit',e=>{e.preventDefault();const s=form.dataset.step,addr=mail.value.trim().toLowerCase(),all=accounts();
    if(s==='mail'){bad(mail,!okMail(addr));if(!okMail(addr)){say('Lütfen geçerli bir e-posta adresi yazın, örneğin ad@ornek.com',1);return}
      step(all[addr]?'in':'up');return}
    if(s==='in'){const p=$('#inPass');bad(p,p.value.length<6);if(p.value.length<6){say('Lütfen en az 6 karakterli şifrenizi yazın.',1);return}
      const acc=all[addr];User.set({name:acc.name,email:addr,news:acc.news});form.reset();step('mail',false);render();N.toast(`Hoş geldiniz, ${acc.name.split(' ')[0]}`);return}
    const n=$('#upName'),name=n.value.trim().replace(/\s+/g,' ');
    bad(n,name.length<2);bad(pass,pass.value.length<8);
    if(name.length<2||pass.value.length<8){say('Lütfen adınızı ve en az 8 karakterli bir şifre yazın.',1);return}
    if(!form.kvkk.checked){say('Devam etmek için üyelik koşullarını onaylayın.',1);return}
    all[addr]={name,news:form.bulten.checked};try{localStorage.setItem('noctelia-accounts',JSON.stringify(all))}catch(err){}
    if(form.bulten.checked)N.News.add(addr);
    User.set({name,email:addr,news:form.bulten.checked});form.reset();meter.dataset.s=0;meterT.textContent='';step('mail',false);render();N.toast(`Hoş geldiniz, ${name.split(' ')[0]}`);
  });
  N.Cart.on(render);render();
}


/* ---------- store locator: no resellers are listed yet, so every search ends on the same note ---------- */
if(page==='magaza'&&window.L){
  const q=$('#slQ'),clear=$('#slClear'),loc=$('#slLocate'),status=$('#slStatus');
  const CENTER=[41.0082,28.9784],ZOOM=10;
  const map=L.map('slMap',{zoomControl:false,fadeAnimation:false,attributionControl:true}).setView(CENTER,ZOOM);
  L.control.zoom({position:'bottomright'}).addTo(map);
  // Esri's light grey canvas needs no key and loads from a local file as well as from a server; CSS lifts it to near white
  const esri='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/';
  L.tileLayer(esri+'World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',{maxZoom:16,attribution:'Harita &copy; Esri, HERE, Garmin, OpenStreetMap katkıcıları'}).addTo(map);
  L.tileLayer(esri+'World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',{maxZoom:16}).addTo(map);
  const pin=L.divIcon({className:'sl-pin',iconSize:[30,40],iconAnchor:[15,40],
    html:'<svg viewBox="0 0 30 40" aria-hidden="true"><path d="M15 39S2 24.6 2 14.5a13 13 0 0 1 26 0C28 24.6 15 39 15 39z"/><circle cx="15" cy="14.5" r="4.6"/></svg>'});
  const mark=L.marker(CENTER,{icon:pin,keyboard:false,interactive:false}).addTo(map);
  const show=at=>{mark.setLatLng(at);status.hidden=false};
  q.addEventListener('input',()=>{clear.hidden=!q.value});
  $('#slForm').addEventListener('submit',e=>{e.preventDefault();q.blur();show(CENTER);map.flyTo(CENTER,ZOOM,{duration:.8})});
  clear.addEventListener('click',()=>{q.value='';clear.hidden=true;q.focus()});
  loc.addEventListener('click',()=>{
    if(!navigator.geolocation){show(CENTER);return}
    loc.classList.add('busy');
    navigator.geolocation.getCurrentPosition(p=>{loc.classList.remove('busy');const at=[p.coords.latitude,p.coords.longitude];
      q.value='Konumum';clear.hidden=false;show(at);map.flyTo(at,8,{duration:.8})},
      ()=>{loc.classList.remove('busy');show(CENTER)},{timeout:10000,maximumAge:600000});
  });
  addEventListener('load',()=>{map.invalidateSize();map.setView(CENTER,ZOOM)});
}



/* ---------- 404: the signature bottle is the zero ---------- */
if(page==='404'){const z=$('.nf-pv');if(z){z.innerHTML=vessel(byId('rose-nocturne'),false,true);setTimeout(()=>z.querySelector('.pv')?.classList.add('open'),700)}}

/* ---------- scent finder: four questions, every answer leans towards some scents ---------- */
if(page==='bul'){
  const {Q,ID}=N.QUIZ;
  const body=$('#qzBody'),bar=$('#qzBar');let step=0,score={};
  function ask(){
    bar.style.width=`${step/Q.length*100}%`;
    const it=Q[step];
    body.innerHTML=`<div class="qz-step"><p class="qz-n">${['I','II','III','IV'][step]} <span>/ IV</span></p><h2>${it.q}</h2>
      <div class="qz-opts">${it.a.map((o,i)=>`<button type="button" class="qz-opt" data-i="${i}"><span>${o[0]}</span><i aria-hidden="true">→</i></button>`).join('')}</div>
      ${step?'<button type="button" class="qz-back">← Geri</button>':''}</div>`;
    body.querySelector('.qz-opt').focus({preventScroll:true});
  }
  const hist=[];
  body.addEventListener('click',e=>{
    const o=e.target.closest('.qz-opt'),bk=e.target.closest('.qz-back'),re=e.target.closest('.qz-again');
    if(re){step=0;score={};hist.length=0;ask();return}
    if(bk){const last=hist.pop();for(const k in last)score[k]-=last[k];step--;ask();return}
    if(!o)return;const w=Q[step].a[+o.dataset.i][1];hist.push(w);for(const k in w)score[k]=(score[k]||0)+w[k];
    step++;step<Q.length?ask():result();
  });
  function result(){
    bar.style.width='100%';
    const rank=Object.keys(ID).map(k=>[k,score[k]||0]).sort((a,b)=>b[1]-a[1]);
    const best=byId(ID[rank[0][0]]),alts=rank.slice(1,3).map(r=>byId(ID[r[0]]));
    const max=Q.reduce((n,q)=>n+Math.max(...q.a.map(o=>Math.max(0,...Object.values(o[1])))),0),pct=Math.min(98,Math.round(rank[0][1]/max*100));
    body.innerHTML=`<div class="qz-res" style="--juice:${best.juice}">
      <a class="qz-stage" href="/urun?id=${best.id}" aria-label="${best.name} ürün sayfası">${vessel(best,true,true)}</a>
      <div class="qz-info"><p class="eyebrow">Sana en yakın koku · %${pct} uyum</p><h2>${best.name}</h2><p class="c-fam"><i class="sw"></i>${best.family}</p>
        <p class="qz-lede">${best.lede}</p>
        <div class="qz-cta"><button class="btn" data-add-id="${best.id}" data-size="30">Sepete ekle <span class="price">${tl(best.price[30])}</span></button><a class="ghost" href="/urun?id=${best.id}">Kokuyu incele</a></div>
        <p class="qz-alt">Şunlar da sana yakın: ${alts.map(a=>`<a href="/urun?id=${a.id}">${a.name}</a>`).join(' · ')}</p>
        <button type="button" class="qz-again">Testi yeniden çöz</button></div></div>`;
    setTimeout(()=>body.querySelector('.pv')?.classList.add('open'),900);
  }
  ask();
}
})();
