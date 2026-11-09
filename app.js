(()=>{'use strict';
const $=id=>document.getElementById(id);
const vistas=[
['村口小径','入画初夏','白墙黛瓦仍在身后，沿着石板路向田园走去。'],
['溪桥听水','桥下有水声','从岸边轻轻起飞，掠过桥影与荷塘水面，向柳影下的亭子飞去。'],
['柳影亭边','停一停风','凉亭藏在枝影间，水边有细碎的草木。'],
['荷塘见微','荷叶的水珠','初夏荷叶舒展，试着让水珠顺着叶脉滑落。','lotus'],
['沿岸向前','路从水岸转弯','从岸边转过石径，前方渐渐看见村舍的屋檐。'],
['屋前小憩','小院边的访客','走近屋檐和花枝，不妨静下来看看蜻蜓。','dragon'],
['出村见田','麦田渐渐开阔','沿石板路走出村舍，田里的麦粒还未完全成熟。'],
['麦浪将盈','还差一点满','麦粒渐渐灌浆，一阵风吹来，田边青黄交错。','wheat'],
['田野看风','不必急着归去','在疏朗的旷野里多走一会，听风轻轻穿过麦穗。'],
['远处归途','把初夏装进口袋','石板路还在向右伸展，旅程可以继续，也可以回头。']
];
const tasks={lotus:['荷间听雨','润','让水珠沿着荷叶滑落。','拖动滑块，或在荷叶上向左右拖动。'],dragon:['蜓影逐光','候','静静等待蜻蜓停留。','按住观察按钮约三秒。'],wheat:['麦浪将盈','盈','找到正在灌浆、尚未全熟的麦穗。','选择对应小满时节的麦粒状态。']};
const objPatterns=Array.from({length:10},()=>[]);
const strip=$('sceneStrip'),pips=$('vistasPips');

// Stage-anchored assets use the uploaded panorama's original world-space X positions (0..1).
// Only a few silhouettes animate; open space remains intentionally empty.
const deco=[
 {x:.018,kind:'canopy_sparse',size:38,top:-5,opacity:0.68,layer:'front',motion:'branch'},
 {x:.028,kind:'blossom_branch',size:34,top:-2,opacity:0.72,layer:'front',motion:'branch'},
 {x:.040,kind:'road_whiteflowers',size:18,bottom:1,opacity:0.76,layer:'front',motion:'low'},
 {x:.057,kind:'bamboo_fence',size:25,bottom:7,opacity:.52,layer:'behind'},
 {x:.075,kind:'pots_basket',size:17,bottom:5,opacity:.62,layer:'front'},
 {x:.096,kind:'road_grass',size:16,bottom:0,opacity:0.75,layer:'front',motion:'low'},
 {x:.112,kind:'bank_rocks',size:24,bottom:0,opacity:0.77,layer:'front'},
 {x:.132,kind:'road_whiteflowers',size:15,bottom:1,opacity:0.72,layer:'front',motion:'low'},

 {x:.162,kind:'waterside_grass',size:18,bottom:4,opacity:.50,layer:'behind',motion:'low'},
 {x:.180,kind:'bank_rocks',size:30,bottom:-1,opacity:0.78,layer:'front'},
 {x:.198,kind:'lotus_small',size:22,bottom:3,opacity:.48,layer:'behind',motion:'low'},
 {x:.214,kind:'waterside_grass',size:18,bottom:2,opacity:0.74,layer:'front',motion:'low'},
 {x:.232,kind:'road_grass',size:16,bottom:0,opacity:0.72,layer:'front',motion:'low'},
 {x:.250,kind:'blossom_branch',size:24,top:-2,opacity:0.68,layer:'front',motion:'branch'},
 {x:.266,kind:'lotus_small',size:20,bottom:2,opacity:.47,layer:'behind',motion:'low'},
 {x:.284,kind:'canopy_sparse',size:42,top:-4,opacity:0.68,layer:'front',motion:'branch'},
 {x:.302,kind:'daisy_patch',size:16,bottom:1,opacity:.54,layer:'front',motion:'low'},
 {x:.322,kind:'waterside_grass',size:18,bottom:3,opacity:0.70,layer:'front',motion:'low'},
 {x:.344,kind:'bank_rocks',size:24,bottom:-1,opacity:0.73,layer:'front'},
 {x:.366,kind:'road_whiteflowers',size:16,bottom:1,opacity:0.70,layer:'front',motion:'low'},

 {x:.408,kind:'bush_white',size:20,bottom:0,opacity:0.70,layer:'front',motion:'low'},
 {x:.434,kind:'road_grass',size:17,bottom:0,opacity:0.70,layer:'front',motion:'low'},
 {x:.462,kind:'low_wall',size:29,bottom:3,opacity:.48,layer:'behind'},
 {x:.487,kind:'bamboo_fence',size:28,bottom:6,opacity:.48,layer:'behind'},
 {x:.504,kind:'pots_basket',size:16,bottom:4,opacity:.56,layer:'front'},
 {x:.520,kind:'road_whiteflowers',size:16,bottom:1,opacity:0.68,layer:'front',motion:'low'},
 {x:.538,kind:'blossom_branch',size:26,top:-3,opacity:0.68,layer:'front',motion:'branch'},
 {x:.554,kind:'bush_white',size:20,bottom:0,opacity:0.68,layer:'front',motion:'low'},
 {x:.574,kind:'bank_rocks',size:26,bottom:-1,opacity:0.74,layer:'front'},
 {x:.594,kind:'road_grass',size:18,bottom:0,opacity:0.72,layer:'front',motion:'low'},

 {x:.632,kind:'road_whiteflowers',size:16,bottom:1,opacity:.46,layer:'behind',motion:'low'},
 {x:.656,kind:'wheat_patch',size:22,bottom:-1,opacity:0.80,layer:'front',motion:'wheat'},
 {x:.684,kind:'wheat_patch',size:26,bottom:-1,opacity:0.84,layer:'front',motion:'wheat',delay:-1.1},
 {x:.710,kind:'road_grass',size:17,bottom:0,opacity:0.70,layer:'front',motion:'low'},
 {x:.732,kind:'bank_rocks',size:22,bottom:-1,opacity:0.68,layer:'front'},
 {x:.754,kind:'wheat_patch',size:23,bottom:-1,opacity:0.82,layer:'front',motion:'wheat',delay:-1.8},
 {x:.776,kind:'daisy_patch',size:16,bottom:1,opacity:.45,layer:'behind',motion:'low'},
 {x:.798,kind:'bush_white',size:18,bottom:0,opacity:0.68,layer:'front',motion:'low'},
 {x:.820,kind:'wheat_patch',size:25,bottom:-1,opacity:0.83,layer:'front',motion:'wheat'},
 {x:.842,kind:'road_grass',size:18,bottom:0,opacity:0.68,layer:'front',motion:'low'},
 {x:.864,kind:'bank_rocks',size:22,bottom:-1,opacity:0.68,layer:'front'},
 {x:.886,kind:'road_whiteflowers',size:15,bottom:1,opacity:0.68,layer:'front',motion:'low'},
 {x:.910,kind:'wheat_patch',size:24,bottom:-1,opacity:0.80,layer:'front',motion:'wheat'},
 {x:.936,kind:'waterside_grass',size:18,bottom:2,opacity:.46,layer:'behind',motion:'low'},
 {x:.955,kind:'bank_rocks',size:24,bottom:-1,opacity:0.70,layer:'front'},
 {x:.974,kind:'canopy_sparse',size:36,top:-5,opacity:0.68,layer:'front',motion:'branch'},

 // V28: large foreground set pieces. Sparse placement preserves the panorama's negative space.
 {x:.105,kind:'flowering_tree_left',size:52,bottom:-5,opacity:.98,layer:'behind'},
 {x:.335,kind:'willow_overhanging_branch',size:48,top:-7,opacity:.94,layer:'front',motion:'branch'},
 {x:.492,kind:'flowering_tree_center',size:62,bottom:-4,opacity:.98,layer:'front',motion:'branch'},
 {x:.742,kind:'willow_full_tree_bank',size:56,bottom:-4,opacity:.95,layer:'behind'},
 {x:.948,kind:'flowering_branch_corner',size:58,top:-8,opacity:.94,layer:'front',motion:'branch'},

 // V28.1: stronger, sparse seam-cover set pieces in foreground.
 {x:.205,kind:'rock_shrub_bank',size:42,bottom:-2,opacity:.88,layer:'front'},
 {x:.565,kind:'flowering_shrub_bank',size:39,bottom:-2,opacity:.86,layer:'front'},
 {x:.825,kind:'wheat_grass_bank',size:44,bottom:-2,opacity:.88,layer:'front'}
];
const fgHosts={behind:$('foregroundBehind'),front:$('foregroundFront')};
const sceneDecor=deco.map((d,j)=>{
 const outer=document.createElement('div');outer.className='world-deco '+(d.top!==undefined?'upper-deco':'ground-deco');
 const el=document.createElement('img');el.src='assets/foreground/'+d.kind+'.png';el.alt='';el.draggable=false;
 el.className='wind-image '+(d.motion?'wind-'+d.motion:'');
 el.style.animationDelay=(d.delay!==undefined?d.delay:-(j*.8))+'s';
 outer.style.opacity=d.opacity;
 outer.style.width=d.size+'vh';
 if(d.top!==undefined) outer.style.top=d.top+'vh'; else outer.style.bottom=d.bottom+'vh';
 outer.append(el);fgHosts[d.layer].append(outer);
 return {outer, ...d};
});

for(let i=0;i<10;i++){
 const vista=document.createElement('div');vista.className='vista';vista.dataset.index=i;
 
 
 const holder=document.createElement('div');holder.className='vista-foreground';vista.append(holder);
 for(let k=0;k<objPatterns[i].length;k++){const [img,left,bottom,width,depth]=objPatterns[i][k];const el=document.createElement('img');el.src='assets/'+img;el.draggable=false;el.alt='';el.className='vista-item '+(depth==='building'?'building mid':depth);el.style.setProperty('--left',left+'%');el.style.setProperty('--bottom',bottom+'%');el.style.setProperty('--width',width+'%');el.style.setProperty('--wind',(6+(k+i)%6)+'s');el.style.animationDelay=(-i*1.3-k*.9)+'s';holder.append(el)}
 if(vistas[i][3]){const btn=document.createElement('button');btn.type='button';btn.className='vista-poi';btn.textContent='观察 · '+tasks[vistas[i][3]][0];btn.style.setProperty('--poi-x','61%');btn.onclick=()=>openTask(vistas[i][3]);vista.append(btn)}strip.append(vista);
 const pip=document.createElement('button');pip.className='pip';pip.type='button';pip.title=vistas[i][0];pip.innerHTML='<span></span><label>'+vistas[i][0]+'</label>';pip.onclick=()=>travel(i);pips.append(pip)
}
let pos=0,target=0,index=0,started=false,auto=false,autoPause=0,done=new Set(),pressed=new Set(),last=performance.now(),frameClock=0,walkIndex=0,activeTask=null,toastTimeout,facing=1;
try{done=new Set(JSON.parse(localStorage.getItem('xiaoman_v20_progress')||'[]'))}catch{}
const player=$('playerZone'),sprite=$('playerSprite'),music=$('music');music.volume=.48;
const walk=Array.from({length:8},(_,i)=>'assets/walk_'+i+'.png'),actions=Array.from({length:6},(_,i)=>'assets/action_'+i+'.png');[...walk,...actions].forEach(src=>{let im=new Image();im.src=src});
const waterLoop=new Audio('assets/sfx_water_loop.wav'),pavilionBell=new Audio('assets/sfx_pavilion_bell.wav');
waterLoop.loop=true;waterLoop.volume=0;[waterLoop,pavilionBell].forEach(a=>a.preload='auto');
let soundReady=false,lastStepSfx=0,pavilionEntered=false,endingAutoTriggered=false;
function overlay(id){document.querySelectorAll('.overlay').forEach(e=>{e.classList.toggle('open',e.id===id);e.setAttribute('aria-hidden',e.id===id?'false':'true')});pressed.clear()}
function isOverlay(){return !!document.querySelector('.overlay.open')}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('show'),2700)}
function travel(i){target=Math.max(0,Math.min(9,i));autoPause=0;}
function paint(){document.documentElement.style.setProperty('--sat',[.89,.93,.97,1][done.size]);$('progressCount').textContent=done.size+'/3'}
function complete(id,skip=false){const first=!done.has(id);done.add(id);try{localStorage.setItem('xiaoman_v20_progress',JSON.stringify([...done]))}catch{}paint();if(first){$('scenery').animate([{opacity:.90},{opacity:1}],{duration:1100});toast(skip?'这一章已略过，仍可以回来重看':'拾起一枚颜色 · '+tasks[id][1])}else toast('已经记下这处风景。')}
function showScene(i){$('vistasCount').textContent='第 '+String(i+1).padStart(2,'0')+' / 10 景';$('narrativeEyebrow').textContent='初夏行旅 · '+vistas[i][0];$('narrativeTitle').textContent=vistas[i][1];$('narrativeDesc').textContent=vistas[i][2];$('rightTitle').innerHTML=vistas[i][0]+' <span>小满 · '+['一','二','三','四','五','六','七','八','九','十'][i]+'</span>';$('interactBtn').textContent=vistas[i][3]?'走近观察 ↗':'沿途继续 ↗';$('taskStatus').textContent=vistas[i][3]?(done.has(vistas[i][3])?'已记录 · 可以重看':'发现一处细微'):'前方还有风景';[...pips.children].forEach((e,j)=>e.classList.toggle('active',j===i));}
const panoCanvas=$('panoramaCanvas');
const panoCtx=panoCanvas.getContext('2d',{alpha:false});
const panorama=new Image();panorama.src='assets/landscape_user.png';
let lastDrawW=0,lastDrawH=0;
function render(){
 const w=innerWidth,h=innerHeight;
 strip.style.transform='translate3d('+(-pos*w)+'px,0,0)';
 $('trackFill').style.width=(pos/9*100)+'%';
 if(!panorama.complete||!panorama.naturalWidth)return;
 const device=Math.min(devicePixelRatio||1,1.6),pw=Math.round(w*device),ph=Math.round(h*device);
 if(panoCanvas.width!==pw||panoCanvas.height!==ph){panoCanvas.width=pw;panoCanvas.height=ph;}
 const imgW=panorama.naturalWidth,imgH=panorama.naturalHeight;
 // Entire background drawn at same height, with no independent scene replacements.
 const cropW=Math.min(imgW,imgH*(w/h));
 const srcX=(imgW-cropW)*Math.max(0,Math.min(1,pos/9));
 // Anchor each object to its actual horizontal location in the uploaded panorama.
 for(const d of sceneDecor){
   const dx=(d.x*imgW-srcX)/cropW*w;
   d.outer.style.left=dx.toFixed(1)+'px';
   d.outer.style.visibility=(dx < -w*.5||dx>w*1.5)?'hidden':'visible';
 }

 panoCtx.imageSmoothingEnabled=true;panoCtx.imageSmoothingQuality='high';
 panoCtx.drawImage(panorama,srcX,0,cropW,imgH,0,0,pw,ph);
}
panorama.onload=()=>render();
function resize(){document.querySelectorAll('.vista').forEach(e=>e.style.width=innerWidth+'px');strip.style.width=10*innerWidth+'px';render()}addEventListener('resize',resize);resize();
paint();showScene(0);
const pathGuide=[[0,4.8],[0.8,5.5],[1.3,7.0],[2.1,8.4],[2.8,8.0],[3.6,7.0],[4.6,6.0],[5.6,5.3],[6.7,5.0],[7.8,4.8],[9,4.7]];
// V29: take off from the near bank, glide above the pond and descend onto the far bank.
// The bridge remains scenery only; Xiaoman no longer follows its walking path.
const flightGuide=[[.72,6.0],[.95,15.5],[1.35,22.5],[2.10,25.0],[2.85,23.5],[3.55,20.0],[4.05,16.0],[4.6,6.0]];
function lerp(a,b,t){return a+(b-a)*t}
function sampleGuide(guide,x){if(x<=guide[0][0])return guide[0][1];for(let i=1;i<guide.length;i++){const a=guide[i-1],b=guide[i];if(x<=b[0])return lerp(a[1],b[1],(x-a[0])/(b[0]-a[0]||1));}return guide[guide.length-1][1]}
function isFlightZone(x){return inRange(x,.82,4.58)}
function sampleBottom(x){return inRange(x,.72,4.6)?sampleGuide(flightGuide,x):sampleGuide(pathGuide,x)}
function inRange(v,a,b){return v>=a&&v<=b}
function syncAmbient(walking,t){
  const waterZone=inRange(pos,.95,4.35)||inRange(pos,8.65,9.05);
  const pavilionZone=inRange(pos,1.85,2.85);
  if(soundReady){
    if(waterZone){ if(waterLoop.paused) waterLoop.play().catch(()=>{}); waterLoop.volume=Math.min(.18, waterLoop.volume+.02); }
    else { waterLoop.volume=Math.max(0, waterLoop.volume-.03); if(waterLoop.volume<=.01 && !waterLoop.paused) waterLoop.pause(); }
    if(pavilionZone && !pavilionEntered){ pavilionEntered=true; pavilionBell.currentTime=0; pavilionBell.volume=.22; pavilionBell.play().catch(()=>{}); }
    if(!pavilionZone && pos<1.75) pavilionEntered=false;  }
}

function play(){soundReady=true;music.play().then(()=>{$('soundBtn').textContent='♫ 音乐开';$('volumeBox').hidden=false}).catch(()=>{$('soundBtn').textContent='♫ 点击开启音乐'})}
$('soundBtn').onclick=()=>{if(music.paused)play();else{music.pause();$('soundBtn').textContent='♫ 音乐关';$('volumeBox').hidden=true}};$('volume').oninput=e=>music.volume=Number(e.target.value)/100;
$('startBtn').onclick=()=>{started=true;overlay(null);play();toast('慢慢走，风景会自己出现。')};$('introSkip').onclick=()=>{started=true;overlay(null);travel(1);play()};
$('interactBtn').onclick=()=>{if(vistas[index][3])openTask(vistas[index][3]);else travel(Math.min(9,index+1))};$('forwardBtn').onclick=()=>travel(Math.min(9,Math.round(target)+1));$('backBtn').onclick=()=>travel(Math.max(0,Math.round(target)-1));
$('autoBtn').onclick=()=>{auto=!auto;autoPause=0;$('autoBtn').classList.toggle('active',auto);$('autoBtn').textContent=auto?'Ⅱ 暂停漫游':'▷ 自动漫游'};
$('skipBtn').onclick=()=>{if(vistas[index][3])complete(vistas[index][3],true);travel(Math.min(9,index+1))};
$('endingBtn').onclick=()=>overlay('ending');$('closeEnding').onclick=$('returnBtn').onclick=()=>overlay(null);
$('journalBtn').onclick=()=>{const host=$('journalCards');host.innerHTML='';for(const id of ['lotus','dragon','wheat']){const c=document.createElement('div');c.className='journal-item'+(done.has(id)?'':' locked');c.innerHTML='<img src="assets/'+({lotus:'flora_5.png',dragon:'flora_8.png',wheat:'flora_9.png'}[id])+'"><b>'+tasks[id][0]+'</b><p>'+(done.has(id)?tasks[id][1]+' · 已收录':'尚未观察')+'</p>';host.append(c)}overlay('journal')};$('closeJournal').onclick=$('journalContinue').onclick=()=>overlay(null);
function closeTask(){overlay(null);player.classList.remove('observing')};$('closeActivity').onclick=closeTask;
$('activitySkip').onclick=()=>{if(activeTask)complete(activeTask,true);closeTask()};
function openTask(id){activeTask=id;const t=tasks[id];$('activityEyebrow').textContent='观察 '+t[1];$('activityTitle').textContent=t[0];$('activityDesc').textContent=t[2];$('activityHint').textContent=t[3];const g=$('activityGame');g.innerHTML='';player.classList.add('observing');
 if(id==='lotus'){
 const leaf=document.createElement('div');leaf.className='leaf-game';const drop=document.createElement('div');drop.className='waterdrop';const slider=document.createElement('input');slider.className='leaf-slider';slider.type='range';slider.min='-100';slider.max='100';slider.value=0;slider.setAttribute('aria-label','荷叶倾斜角度');g.append(leaf,drop,slider);let down=false,beginX=0,initial=0;function update(v){v=Math.max(-100,Math.min(100,v));slider.value=v;leaf.style.transform=`rotate(${v*.24}deg)`;drop.style.left=(50+v*.27)+'%';drop.style.top=(43+Math.abs(v)*.26)+'%';if(Math.abs(v)>86){complete('lotus');closeTask()}}slider.oninput=()=>update(Number(slider.value));leaf.addEventListener('pointerdown',e=>{down=true;beginX=e.clientX;initial=Number(slider.value);leaf.setPointerCapture(e.pointerId)});leaf.addEventListener('pointermove',e=>{if(down)update(initial+(e.clientX-beginX)*.85)});leaf.addEventListener('pointerup',()=>down=false);
 }else if(id==='dragon'){
 const image=document.createElement('img');image.src='assets/flora_6.png';image.style.cssText='position:absolute;height:80%;opacity:.55;left:7%';const button=document.createElement('button');button.className='observe-button';button.textContent='按住，静静等待';button.style.zIndex=2;const bar=document.createElement('div');bar.className='observe-progress';g.append(image,button,bar);let down=false,begin=0,raf=0;function tick(){if(!down)return;let t=performance.now()-begin;bar.style.width=Math.min(100,t/2800*100)+'%';if(t>=2800){down=false;complete('dragon');closeTask();return}raf=requestAnimationFrame(tick)}function start(){if(down)return;down=true;begin=performance.now();tick()}function stop(){down=false;cancelAnimationFrame(raf);bar.style.width=0}button.addEventListener('pointerdown',start);button.addEventListener('pointerup',stop);button.addEventListener('pointercancel',stop);button.addEventListener('pointerleave',stop);button.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();start()}});button.addEventListener('keyup',stop);
 }else{
 const row=document.createElement('div');row.className='wheat-options';[['抽穗','刚刚长出'],['灌浆','小满时节'],['成熟','完全成熟']].forEach(([title,sub],i)=>{const b=document.createElement('button');b.innerHTML='<img src="assets/flora_9.png" style="filter:'+['hue-rotate(35deg) saturate(.55)','saturate(.9)','sepia(.75) saturate(1.3)'][i]+'"><b>'+title+'</b><small>'+sub+'</small>';b.onclick=()=>{if(i===1){complete('wheat');closeTask()}else $('activityHint').textContent='小满时麦粒渐满，但仍然尚青。'};row.append(b)});g.append(row)}overlay('activity')}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['input','textarea','select'].includes(document.activeElement?.tagName.toLowerCase()))return;if([' ','arrowleft','arrowright'].includes(k))e.preventDefault();pressed.add(k);if(k==='escape')closeTask();if(e.repeat)return;if(k==='j'&&!isOverlay())$('journalBtn').click();if(k==='e'&&!isOverlay()&&vistas[index][3])openTask(vistas[index][3]);if(k===' '&&!isOverlay()&&!isFlightZone(pos)){player.classList.remove('hopping');void player.offsetWidth;player.classList.add('hopping');sprite.src='assets/action_3.png';setTimeout(()=>player.classList.remove('hopping'),640)}});addEventListener('keyup',e=>pressed.delete(e.key.toLowerCase()));addEventListener('blur',()=>pressed.clear());
function tick(t){let dt=Math.min(.05,(t-last)/1000);last=t;let direction=0;if(started&&!isOverlay()){
 direction=(pressed.has('d')||pressed.has('arrowright')?1:0)-(pressed.has('a')||pressed.has('arrowleft')?1:0);
 if(direction){target=Math.max(0,Math.min(9,target+direction*dt*(pressed.has('shift')?.39:.22)));auto=false;$('autoBtn').classList.remove('active');$('autoBtn').textContent='▷ 自动漫游';}
 if(auto&&!direction){if(Math.abs(target-pos)<.035){autoPause+=dt;if(autoPause>10){autoPause=0;if(target<9)target=Math.min(9,Math.round(target)+1);else{$('autoBtn').click()}}}}
 }
 const delta=target-pos;pos+=Math.sign(delta)*Math.min(Math.abs(delta),Math.max(.003,Math.abs(delta)*.075));
 const flying=started&&!isOverlay()&&isFlightZone(pos);
 const walking=started&&!isOverlay()&&Math.abs(delta)>.0032&&!flying;
 player.style.bottom=sampleBottom(pos)+'%';
 if(flying){
  // Flight keeps the single approved action_3 pose; no extra sprite carousel.
  player.classList.remove('walking','hopping');
  player.classList.add('flying');
  if(Math.abs(delta)>.0032) facing=delta<0?-1:1;
  sprite.src='assets/action_3.png';
  sprite.style.transform=`scaleX(${facing})`;
 }else if(walking){
  player.classList.remove('flying');
  const running=pressed.has('shift');
  frameClock+=dt*(running?1.18:1);
  if(frameClock>(running?.075:.11)){frameClock=0;walkIndex=(walkIndex+1)%8;sprite.src=walk[walkIndex]}
  facing=delta<0?-1:1;
  sprite.style.transform=`scaleX(${facing})`;
  player.classList.add('walking')
 }else{
  player.classList.remove('walking','flying');
  if(!player.classList.contains('hopping')){sprite.src='assets/action_0.png';sprite.style.transform=`scaleX(${facing})`}
 }
 syncAmbient(walking,t);
 if(done.size===3&&pos>8.78&&!endingAutoTriggered&&!isOverlay()){endingAutoTriggered=true;setTimeout(()=>overlay('ending'),520)}
 const ix=Math.round(pos);if(ix!==index){index=ix;showScene(ix)}render();requestAnimationFrame(tick)}requestAnimationFrame(tick);
})();