const chapters = [
  {title:'Arithmetic of curves',source:'After Silverman',detail:'Following Joseph H. Silverman, The Arithmetic of Elliptic Curves.',field:'#efa4b8',disc:'#f69235'},
  {title:'Differential geometry of curves',source:'Plane curves · SML 96',detail:'Following Differential Geometry of Plane Curves, Student Mathematical Library 96.',field:'#b4a5ec',disc:'#6657cf'},
  {title:'Galois theory',source:'Reading list to be selected',detail:'The lecture notes and primary references for this chapter will be selected during development.',field:'#9fd6b9',disc:'#f4c849'},
  {title:'Classification of surfaces',source:'References to be selected',detail:'The source path for the classification of surfaces will be selected during development.',field:'#f2b3a2',disc:'#5ab6a9'},
  {title:'The spectral theorem',source:'After Einsiedler & Ward',detail:'Following Functional Analysis, Spectral Theory, and Applications by Manfred Einsiedler and Thomas Ward.',field:'#9daee3',disc:'#263e79'}
];
const scene=document.getElementById('scene');
const cards=[...document.querySelectorAll('.chapter')];
const track=document.getElementById('carouselTrack');
const prev=document.getElementById('prevChapter');
const next=document.getElementById('nextChapter');
const dialog=document.getElementById('chapterDialog');
const aboutDialog=document.getElementById('aboutDialog');
let selected=0;
let swipeStart=null;
let suppressClick=false;
let lastWheel=0;
const two=n=>String(n).padStart(2,'0');
function selectChapter(index){
  selected=Math.max(0,Math.min(chapters.length-1,index));
  const chapter=chapters[selected];
  scene.style.setProperty('--field',chapter.field);
  scene.style.setProperty('--disc',chapter.disc);
  document.querySelector('.header-edition span').textContent=`${two(selected+1)} / 05`;
  document.getElementById('activeTitle').textContent=`${two(selected+1)}. ${chapter.title}`;
  document.getElementById('activeSubtitle').textContent=chapter.source;
  document.getElementById('activeCount').textContent=`${two(selected+1)}:05 · in preparation`;
  cards.forEach((card,i)=>{
    const offset=i-selected, distance=Math.abs(offset), face=card.querySelector('.chapter-face');
    const scale=distance===0?1:distance===1?.55:.38;
    card.style.setProperty('--offset',offset);
    card.style.setProperty('--scale',scale);
    card.style.setProperty('--angle',`${(offset<0?-1:1)*(distance===0?0:distance===1?8:13)}deg`);
    card.style.setProperty('--z',5-distance);
    card.style.setProperty('--opacity',distance>2?0:distance===2?.8:1);
    card.style.setProperty('--brightness',distance===0?1:.96);
    card.classList.toggle('is-far',distance>2);
    card.setAttribute('aria-hidden',distance>2?'true':'false');
    face.tabIndex=distance>2?-1:0;
    face.setAttribute('aria-label',i===selected?`Open ${chapter.title} chapter preview`:`Select ${chapters[i].title}`);
  });
  prev.disabled=selected===0;
  next.disabled=selected===chapters.length-1;
  document.title=`${chapter.title} — Math Is Art`;
}
function openChapter(){
  const chapter=chapters[selected];
  document.getElementById('dialogNumber').textContent=`CHAPTER ${two(selected+1)} / 05`;
  document.getElementById('dialogTitle').textContent=chapter.title;
  document.getElementById('dialogSource').textContent=chapter.detail;
  document.getElementById('dialogExplorer').hidden=selected!==0;
  dialog.showModal();
  document.getElementById('closeDialog').focus();
}
cards.forEach((card,i)=>card.querySelector('.chapter-face').addEventListener('click',()=>{
  if(suppressClick)return;
  if(i===selected)openChapter();else selectChapter(i);
}));
prev.addEventListener('click',()=>selectChapter(selected-1));
next.addEventListener('click',()=>selectChapter(selected+1));
document.getElementById('openChapter').addEventListener('click',openChapter);
document.getElementById('closeDialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.getElementById('openChapter').focus());
document.getElementById('aboutButton').addEventListener('click',()=>{aboutDialog.showModal();document.getElementById('closeAbout').focus();});
document.getElementById('closeAbout').addEventListener('click',()=>aboutDialog.close());
aboutDialog.addEventListener('close',()=>document.getElementById('aboutButton').focus());
for(const modal of [dialog,aboutDialog])modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});
document.addEventListener('keydown',e=>{
  if(dialog.open||aboutDialog.open)return;
  if(e.key==='ArrowRight'){e.preventDefault();selectChapter(selected+1);}
  if(e.key==='ArrowLeft'){e.preventDefault();selectChapter(selected-1);}
  if(e.key==='Home'){e.preventDefault();selectChapter(0);}
  if(e.key==='End'){e.preventDefault();selectChapter(chapters.length-1);}
});
track.addEventListener('pointerdown',e=>{swipeStart={x:e.clientX,y:e.clientY};});
track.addEventListener('pointerup',e=>{
  if(!swipeStart)return;
  const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;swipeStart=null;
  if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy))return;
  suppressClick=true;
  selectChapter(selected+(dx<0?1:-1));
  setTimeout(()=>{suppressClick=false;},0);
});
track.addEventListener('pointercancel',()=>{swipeStart=null;});
track.addEventListener('wheel',e=>{
  if(Math.abs(e.deltaY)<25&&Math.abs(e.deltaX)<25)return;
  e.preventDefault();
  const now=Date.now();if(now-lastWheel<650)return;lastWheel=now;
  selectChapter(selected+((Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)>0?1:-1));
},{passive:false});
document.getElementById('fullscreenButton').addEventListener('click',async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else await scene.requestFullscreen();}catch{}
});
selectChapter(0);
