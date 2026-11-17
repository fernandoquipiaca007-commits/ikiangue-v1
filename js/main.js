/* IKIANGUE V1 — interface */
(function(){
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  $('#yr').textContent=new Date().getFullYear();
  const nav=$('#nav'),wa=$('.wa-float');
  const onScroll=()=>{nav.classList.toggle('solid',scrollY>40);wa.classList.toggle('show',scrollY>innerHeight*.6)};
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* serviços */
  const I={
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    chart:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-7"/>',
    shield:'<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
    users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .8 3.2 2.6 3.6 5.2"/>',
    sign:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 7v6M12 16.5v.5"/>',
    ext:'<path d="M9 7h6v14H9z"/><path d="M10 7V5h4v2M14 4h4l2 2M12 4V2"/><path d="M9 11h6"/>',
    pulse:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>'
  };
  const SV=[
    ['eye','Identificação de Riscos','Mapeamos e classificamos os perigos existentes e desenvolvemos planos de mitigação eficazes.'],
    ['chart','Avaliação de Riscos','Analisamos probabilidades e impactos para decisões estratégicas e preventivas.'],
    ['shield','Prevenção de Riscos','Medidas que reduzem a exposição a acidentes e incidentes operacionais.'],
    ['users','Formações e Sensibilizações','Capacitamos equipas e líderes para fortalecer a cultura de segurança.'],
    ['sign','Procedimentos e Pictogramas','Comunicação visual e procedimentos padronizados, claros e conformes.'],
    ['ext','Revisão de Extintores','Manutenção e funcionalidade dos meios de combate a incêndio e emergência.'],
    ['pulse','Estatísticas e Monitorização','Indicadores e relatórios de desempenho em HSST para melhoria contínua.'],
    ['doc','Documentação e Relatórios','Documentação técnica completa, transparente e alinhada às normas vigentes.']
  ];
  $('#svcGrid').innerHTML=SV.map((s,i)=>`<article class="svc reveal" style="transition-delay:${(i%4)*80}ms"><span class="n">${String(i+1).padStart(2,'0')}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${I[s[0]]}</svg><h3>${s[1]}</h3><p>${s[2]}</p></article>`).join('');
  if(matchMedia('(hover:hover)').matches)$$('.svc').forEach(c=>{
    c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');c.style.transform=`perspective(800px) rotateX(${(.5-y)*8}deg) rotateY(${(x-.5)*10}deg) translateY(-4px)`});
    c.addEventListener('pointerleave',()=>c.style.transform='');
  });

  /* galeria */
  const G=[['grupo-campo','w','Exercício prático · combate a incêndio'],['spray-man','v','Técnica P.A.S.S. com fogo real'],['turma-sala','w','Turma de formação profissional'],['instrutora-fogo','t','Instrução em campo · foco classe A'],['inspecao','t','Instalação e inspeção de extintores'],['grupo-pneu','w','Equipa certificada em segurança'],['spray-fogo','v','Extinção com pó químico ABC'],['instalacao','t','Fixação de meios de emergência'],['turma-ampla','w','Formação em HSST'],['ferramentas-equipa','t','Equipamento e ferramentas de trabalho'],['grupo-amarelo','t','Turma no simulacro de incêndio'],['reuniao','w','Sensibilização e briefing de segurança'],['formandas-rua','t','Formandas em ação de campo']];
  $('#rail').innerHTML=G.map(g=>`<figure class="${g[1]}"><img src="img/${g[0]}-sm.webp" srcset="img/${g[0]}-sm.webp 720w, img/${g[0]}.webp 1600w" sizes="(max-width:700px) 80vw, 40vw" alt="${g[2]}" loading="lazy"><figcaption>${g[2]}</figcaption></figure>`).join('');
  const rail=$('#rail');let down=false,sx=0,sl=0;
  rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;sx=e.clientX;sl=rail.scrollLeft;rail.style.scrollSnapType='none'});
  addEventListener('pointermove',e=>{if(down)rail.scrollLeft=sl-(e.clientX-sx)});
  addEventListener('pointerup',()=>{if(down){down=false;rail.style.scrollSnapType=''}});

  /* revelações */
  const big=$('.reveal-words');big.innerHTML=big.textContent.split(' ').map(w=>`<span class="w">${w}</span>`).join(' ');
  const words=$$('.w',big);
  const lit=()=>{const r=big.getBoundingClientRect(),p=(innerHeight*.85-r.top)/(r.height+innerHeight*.35);const n=Math.round(Math.max(0,Math.min(1,p))*words.length);words.forEach((w,i)=>w.classList.toggle('lit',i<n))};
  addEventListener('scroll',lit,{passive:true});lit();
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
  $$('.reveal,.sec-head,.fact,.contact-card').forEach(el=>{el.classList.add('reveal');io.observe(el)});
  const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,to=+el.dataset.count;let s=null;const f=t=>{s??=t;const p=Math.min(1,(t-s)/1400);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f);cio.unobserve(el)}),{threshold:.6});
  $$('[data-count]').forEach(el=>cio.observe(el));

  /* P.A.S.S. */
  const steps=$$('#passSteps li'),img=$('#passImg'),letter=$('#passLetter');let cur=-1;
  const sio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const i=steps.indexOf(e.target);if(i===cur)return;cur=i;steps.forEach((s,k)=>s.classList.toggle('on',k===i));letter.textContent=e.target.querySelector('b').textContent;img.classList.add('swap');setTimeout(()=>{img.src=e.target.dataset.img;img.alt=e.target.dataset.alt;img.onload=()=>img.classList.remove('swap');setTimeout(()=>img.classList.remove('swap'),400)},300)}),{rootMargin:'-45% 0px -45% 0px'});
  steps.forEach(s=>sio.observe(s));
})();
