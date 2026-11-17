/* IKIANGUE V1 — fogo, pó químico e interação */
(function(){
  const K=window.__IK;if(!K)return;
  const {T,R,S,C,ext,tip,placeNozzle,fireLight,lever,cv,DPR}=K;
  const VS='attribute float size;attribute float alpha;attribute vec3 col;varying float vA;varying vec3 vC;uniform float uPix;void main(){vA=alpha;vC=col;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*uPix*(10./-mv.z);gl_Position=projectionMatrix*mv;}';
  const FS='varying float vA;varying vec3 vC;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,d);gl_FragColor=vec4(vC,a*a*vA);}';
  function sys(n,blend){
    const g=new T.BufferGeometry(),P=new Float32Array(n*3),Cc=new Float32Array(n*3),Sz=new Float32Array(n),A=new Float32Array(n);
    g.setAttribute('position',new T.BufferAttribute(P,3));g.setAttribute('col',new T.BufferAttribute(Cc,3));
    g.setAttribute('size',new T.BufferAttribute(Sz,1));g.setAttribute('alpha',new T.BufferAttribute(A,1));
    const m=new T.ShaderMaterial({vertexShader:VS,fragmentShader:FS,uniforms:{uPix:{value:DPR*60}},transparent:true,depthWrite:false,blending:blend});
    const o=new T.Points(g,m);o.frustumCulled=false;S.add(o);
    return {g,P,Cc,Sz,A,m,n,v:new Float32Array(n*3),life:new Float32Array(n),max:new Float32Array(n),i:0};
  }
  const fire=sys(900,T.AdditiveBlending),smoke=sys(260,T.NormalBlending),dust=sys(1400,T.NormalBlending);
  const firePos=new T.Vector3(3,-1.5,0);
  const braz=new T.Group();S.add(braz);
  const bm=new T.MeshStandardMaterial({color:0x3a3d3c,metalness:.85,roughness:.45,side:T.DoubleSide});
  const drum=new T.Mesh(new T.CylinderGeometry(.62,.55,.55,40,1,true),bm);drum.position.y=-.27;braz.add(drum);
  const coal=new T.Mesh(new T.CircleGeometry(.6,40),new T.MeshBasicMaterial({color:0x2a0c04}));coal.rotation.x=-Math.PI/2;coal.position.y=-.08;braz.add(coal);
  [0,1,2,3].forEach(k=>{const l=new T.Mesh(new T.CylinderGeometry(.03,.03,.7,8),bm);const a=k*Math.PI/2+.6;l.position.set(Math.cos(a)*.48,-.85,Math.sin(a)*.48);braz.add(l)});
  let level=1,spraying=false,outAt=0,t0=performance.now();
  const hud=document.querySelector('.hud'),bar=document.getElementById('hudBar'),st=document.getElementById('hudState'),txt=document.getElementById('holdTxt'),btn=document.getElementById('holdBtn');

  function emit(s,x,y,z,vx,vy,vz,life){const i=s.i;s.i=(s.i+1)%s.n;s.P[i*3]=x;s.P[i*3+1]=y;s.P[i*3+2]=z;s.v[i*3]=vx;s.v[i*3+1]=vy;s.v[i*3+2]=vz;s.life[i]=life;s.max[i]=life}
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const cFire=[[1,.95,.6],[1,.62,.12],[.95,.25,.04],[.35,.06,.02]];
  function lerpC(t){const k=Math.min(2.999,t*3),i=k|0,f=k-i,a=cFire[i],b=cFire[i+1];return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f]}

  function layout(){
    const w=cv.clientWidth,h=cv.clientHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix();
    const mob=w/h<.9;
    if(mob){ext.position.set(-.85,-1.55,0);ext.scale.setScalar(.55);firePos.set(1.05,-2.1,0);C.position.set(0,0,13)}
    else{ext.position.set(1.9,-.15,0);ext.scale.setScalar(.68);firePos.set(4.1,-1.05,0);C.position.set(0,1.2,11)}
    braz.position.copy(firePos);braz.scale.setScalar(mob?.6:.9);
    fire.m.uniforms.uPix.value=smoke.m.uniforms.uPix.value=dust.m.uniforms.uPix.value=DPR*(h/9);
  }
  addEventListener('resize',layout);layout();

  let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
  const on=()=>{spraying=true;btn.classList.add('on')},off=()=>{spraying=false;btn.classList.remove('on')};
  btn.addEventListener('pointerdown',e=>{e.preventDefault();on()});cv.addEventListener('pointerdown',on);
  addEventListener('pointerup',off);addEventListener('pointercancel',off);btn.addEventListener('contextmenu',e=>e.preventDefault());
  btn.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();on()}});btn.addEventListener('keyup',off);

  let visible=true;new IntersectionObserver(es=>visible=es[0].isIntersecting).observe(cv);
  const aim=new T.Vector3(),tw=new T.Vector3(),last={t:performance.now()};
  function tick(now){
    requestAnimationFrame(tick);if(!visible)return;
    const dt=Math.min(.05,(now-last.t)/1000);last.t=now;const t=(now-t0)/1000;
    // orientação
    const targetY=spraying?.35:Math.sin(t*.4)*.25+mx*.5;
    ext.rotation.y+=(targetY-ext.rotation.y)*.06;ext.rotation.x+=((spraying?0:my*.12)-ext.rotation.x)*.06;
    ext.position.y+=Math.sin(t*1.3)*.0016;
    lever.rotation.z+=((spraying?.02:.18)-lever.rotation.z)*.2;
    ext.updateMatrixWorld();
    // bocal aponta ao fogo
    const local=ext.worldToLocal(firePos.clone().add(new T.Vector3(0,.5,0)));aim.subVectors(local,new T.Vector3(1.5,-.75,.4));placeNozzle(aim);
    tip.getWorldPosition(tw);
    // fogo
    if(level<=0&&!outAt){outAt=now;hud.classList.add('out');st.textContent='EXTINTO';txt.textContent='Risco controlado ✓'}
    if(outAt&&!spraying&&now-outAt>4200){level=Math.min(1,level+dt*.35);if(level>.15){outAt=0;hud.classList.remove('out');st.textContent='EM CHAMAS';txt.textContent='Mantenha premido para apagar'}}
    const rate=Math.floor(level*9+Math.random());
    for(let k=0;k<rate;k++)emit(fire,firePos.x+rnd(-.42,.42)*(.4+level*.6),firePos.y+rnd(0,.15),firePos.z+rnd(-.3,.3),rnd(-.15,.15),rnd(1.2,2.6)*(.5+level*.6),0,rnd(.5,1.1));
    if(Math.random()<.5+level*.4)emit(smoke,firePos.x+rnd(-.3,.3),firePos.y+1+level,firePos.z,rnd(-.1,.3),rnd(.6,1),0,rnd(2,3.5));
    if(spraying){
      level=Math.max(0,level-dt*.42);
      const d=new T.Vector3().subVectors(firePos.clone().add(new T.Vector3(0,.6,0)),tw).normalize();
      for(let k=0;k<26;k++){const sp=rnd(7,11);emit(dust,tw.x,tw.y,tw.z,d.x*sp+rnd(-.9,.9),d.y*sp+rnd(-.7,.9),d.z*sp+rnd(-.9,.9),rnd(.7,1.4))}
    }
    bar.style.width=(level*100).toFixed(1)+'%';
    fireLight.position.set(firePos.x,firePos.y+.8,firePos.z+.8);coal.material.color.setRGB(.16+level*.5,.05+level*.12,.02);fireLight.intensity=level*(5+Math.sin(t*23)*1.2+Math.sin(t*7)*1.5);
    step(fire,dt,(s,i,p)=>{s.v[i*3]+=Math.sin(t*6+i)*.04;const c=lerpC(1-p);s.Cc.set(c,i*3);s.Sz[i]=(.3+.75*p)*(.45+level*.6);s.A[i]=Math.min(1,p*2.2)*.42});
    step(smoke,dt,(s,i,p)=>{s.Cc.set([.16,.15,.14],i*3);s.Sz[i]=1.6+(1-p)*3;s.A[i]=Math.sin(p*Math.PI)*.22});
    step(dust,dt,(s,i,p)=>{s.v[i*3]*=.925;s.v[i*3+1]=s.v[i*3+1]*.93+.25*dt;s.v[i*3+2]*=.925;s.Cc.set([.94,.95,.97],i*3);s.Sz[i]=.35+(1-p)*2.6;s.A[i]=Math.min(1,p*1.6)*.55});
    R.render(S,C);
  }
  function step(s,dt,f){
    for(let i=0;i<s.n;i++){
      if(s.life[i]<=0){s.A[i]=0;continue}
      s.life[i]-=dt;const p=Math.max(0,s.life[i]/s.max[i]);
      s.P[i*3]+=s.v[i*3]*dt;s.P[i*3+1]+=s.v[i*3+1]*dt;s.P[i*3+2]+=s.v[i*3+2]*dt;f(s,i,p);
    }
    for(const a of ['position','col','size','alpha'])s.g.attributes[a].needsUpdate=true;
  }
  requestAnimationFrame(tick);
})();
