/* IKIANGUE V1 — extintor 3D interativo (Three.js r128) */
(function(){
  const cv=document.getElementById('stage');
  if(!cv||!window.THREE)return;
  let R;
  try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:'high-performance'})}catch(e){document.querySelector('.hud')?.remove();return}
  const T=THREE,DPR=Math.min(devicePixelRatio||1,2);
  R.setPixelRatio(DPR);R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.15;
  const S=new T.Scene(),C=new T.PerspectiveCamera(35,1,.1,100);C.position.set(0,1.2,11);

  /* luzes */
  S.add(new T.HemisphereLight(0xbfd8cf,0x120806,.55));
  const key=new T.DirectionalLight(0xffffff,1.4);key.position.set(-4,6,6);S.add(key);
  const rim=new T.DirectionalLight(0x13a07c,2.2);rim.position.set(-6,2,-5);S.add(rim);
  const fireLight=new T.PointLight(0xff6a1f,6,12,1.6);S.add(fireLight);

  /* extintor */
  const ext=new T.Group();S.add(ext);
  const red=new T.MeshStandardMaterial({color:0xc8141b,metalness:.45,roughness:.28});
  const metal=new T.MeshStandardMaterial({color:0x2a2d2c,metalness:.9,roughness:.3});
  const chrome=new T.MeshStandardMaterial({color:0xd9dcd8,metalness:1,roughness:.15});
  const black=new T.MeshStandardMaterial({color:0x111111,roughness:.7});
  const pts=[[0,-1.6],[.62,-1.6],[.7,-1.5],[.72,-1.3],[.72,.95],[.68,1.25],[.55,1.48],[.32,1.62],[.2,1.66],[0,1.66]].map(p=>new T.Vector2(p[0],p[1]));
  const body=new T.Mesh(new T.LatheGeometry(pts,64),red);ext.add(body);
  // rótulo
  const lc=document.createElement('canvas');lc.width=512;lc.height=256;const g=lc.getContext('2d');
  g.fillStyle='#f4f1e8';g.fillRect(0,0,512,256);g.fillStyle='#0b735a';g.fillRect(0,0,512,46);
  g.fillStyle='#ffc427';g.font='700 26px Archivo, sans-serif';g.fillText('IKIANGUE',24,32);
  g.fillStyle='#111';g.font='800 64px Archivo, sans-serif';g.fillText('PÓ ABC',24,120);
  g.font='500 22px JetBrains Mono, monospace';g.fillText('INSPECIONADO ✓  HSST',24,170);
  ['A','B','C'].forEach((l,i)=>{g.fillStyle=['#2e7d32','#c62828','#1565c0'][i];g.fillRect(24+i*70,190,56,52);g.fillStyle='#fff';g.font='800 34px Archivo';g.fillText(l,40+i*70,228)});
  const tex=new T.CanvasTexture(lc);tex.encoding=T.sRGBEncoding;tex.anisotropy=8;
  const label=new T.Mesh(new T.CylinderGeometry(.725,.725,1.1,64,1,true,-Math.PI*.55,Math.PI*1.1),new T.MeshStandardMaterial({map:tex,roughness:.6}));
  label.position.y=-.2;ext.add(label);
  const neck=new T.Mesh(new T.CylinderGeometry(.16,.2,.32,24),chrome);neck.position.y=1.8;ext.add(neck);
  const head=new T.Mesh(new T.BoxGeometry(.5,.28,.34),metal);head.position.y=2.05;ext.add(head);
  const lever=new T.Mesh(new T.BoxGeometry(1.1,.07,.18),metal);lever.position.set(-.3,2.28,0);lever.rotation.z=.18;ext.add(lever);
  const handle=new T.Mesh(new T.BoxGeometry(.95,.07,.18),metal);handle.position.set(-.32,1.98,0);handle.rotation.z=-.05;ext.add(handle);
  const pin=new T.Mesh(new T.TorusGeometry(.13,.025,10,28),new T.MeshStandardMaterial({color:0xffc427,metalness:.6,roughness:.3}));pin.position.set(.05,2.08,.22);ext.add(pin);
  const gauge=new T.Mesh(new T.CylinderGeometry(.13,.13,.06,32),chrome);gauge.rotation.x=Math.PI/2;gauge.position.set(.12,2.05,.2);ext.add(gauge);
  const gface=new T.Mesh(new T.CircleGeometry(.11,32),new T.MeshBasicMaterial({color:0x13a07c}));gface.position.set(.12,2.05,.235);ext.add(gface);
  // mangueira
  const hosePts=[[.22,2.02,0],[.55,1.9,.05],[.85,1.2,.1],[.9,.2,.15],[.95,-.6,.2],[1.15,-.9,.3],[1.5,-.75,.4]].map(p=>new T.Vector3(...p));
  const hoseCurve=new T.CatmullRomCurve3(hosePts);
  const hose=new T.Mesh(new T.TubeGeometry(hoseCurve,80,.06,12),black);ext.add(hose);
  const nozzle=new T.Mesh(new T.CylinderGeometry(.11,.07,.42,20),black);ext.add(nozzle);
  const tip=new T.Object3D();ext.add(tip);
  function placeNozzle(aim){
    const end=hosePts[hosePts.length-1];
    nozzle.position.copy(end);
    const dir=aim.clone().normalize();
    nozzle.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir);
    tip.position.copy(end).addScaledVector(dir,.24);
  }
  const shadow=new T.Mesh(new T.CircleGeometry(1.2,48),new T.MeshBasicMaterial({color:0,transparent:true,opacity:.35}));
  shadow.rotation.x=-Math.PI/2;shadow.position.y=-1.62;ext.add(shadow);

  window.__IK={T,R,S,C,ext,tip,placeNozzle,fireLight,lever,cv,DPR};
})();
