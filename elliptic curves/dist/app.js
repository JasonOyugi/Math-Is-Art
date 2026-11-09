const $ = id => document.getElementById(id);
const state = { a: -1, b: 1, p: 11 };
const limits = { x0: -3.6, x1: 4.2, y0: -5.1, y1: 5.1 };
let visiblePoints = [];

function signed(n, variable = '') { return n === 0 ? '' : `${n < 0 ? ' − ' : ' + '}${Math.abs(n) === 1 && variable ? '' : Math.abs(n)}${variable}`; }
function equation(a, b) { return `y² = x³${signed(a, 'x')}${signed(b)}`; }
function fmt(n, places = 3) { return Number.isInteger(n) ? String(n) : Number(n.toFixed(places)).toString(); }
function pointText(P) { return P ? `(${P.xExact ?? fmt(P.x)}, ${P.yExact ?? fmt(P.y)})` : 'O'; }
function rhs(x, a = state.a, b = state.b) { return x*x*x + a*x + b; }
function discriminant(a = state.a, b = state.b) { return -16 * (4*a*a*a + 27*b*b); }
function integralPoints(a, b, bound = 50) {
  const points = [];
  for (let x = -bound; x <= bound; x++) {
    const v = rhs(x, a, b);
    if (v < 0) continue;
    const y = Math.round(Math.sqrt(v));
    if (y*y === v) { points.push({x,y}); if (y) points.push({x,y:-y}); }
  }
  return points.sort((P,Q) => P.x-Q.x || Q.y-P.y);
}
function gcd(a,b) { a=a<0n?-a:a; b=b<0n?-b:b; while(b){[a,b]=[b,a%b];} return a; }
function rational(n,d=1n) { if(d<0n){n=-n;d=-d;} const g=gcd(n,d); return {n:n/g,d:d/g}; }
function radd(a,b) { return rational(a.n*b.d+b.n*a.d,a.d*b.d); }
function rsub(a,b) { return rational(a.n*b.d-b.n*a.d,a.d*b.d); }
function rmul(a,b) { return rational(a.n*b.n,a.d*b.d); }
function rdiv(a,b) { return rational(a.n*b.d,a.d*b.n); }
function rstr(a) { return a.d===1n?String(a.n):`${a.n}/${a.d}`; }
function rnum(a) { return Number(a.n)/Number(a.d); }
function add(P,Q) {
  if (!P) return { result: Q, slope: null, kind: 'identity' };
  if (!Q) return { result: P, slope: null, kind: 'identity' };
  if (P.x === Q.x && P.y === -Q.y) return { result: null, slope: null, kind: 'vertical' };
  const doubling = P.x === Q.x && P.y === Q.y;
  const px=rational(BigInt(P.x)), py=rational(BigInt(P.y)), qx=rational(BigInt(Q.x)), qy=rational(BigInt(Q.y));
  const m = doubling ? rational(BigInt(3*P.x*P.x+state.a),BigInt(2*P.y)) : rdiv(rsub(qy,py),rsub(qx,px));
  const xr=rsub(rsub(rmul(m,m),px),qx);
  const yr=rsub(rmul(m,rsub(px,xr)),py);
  return { result: {x:rnum(xr),y:rnum(yr),xExact:rstr(xr),yExact:rstr(yr)}, slope:rnum(m), slopeExact:rstr(m), kind: doubling ? 'tangent' : 'secant' };
}
function line(svg, x1,y1,x2,y2,stroke,width=1,opacity=1,dash='') {return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;}
function plotMarkup(width,height,a,b,dark=false,addition=null) {
  const pad = dark ? 38 : 45;
  const X=x=>pad+(x-limits.x0)/(limits.x1-limits.x0)*(width-2*pad);
  const Y=y=>height-pad-(y-limits.y0)/(limits.y1-limits.y0)*(height-2*pad);
  const grid=dark?'#304454':'#e7eeeb', axis=dark?'#617789':'#a7b7b8', curve=dark?'#80dec0':'#207d74';
  let out='';
  for(let x=-3;x<=4;x++)out+=line(X(x),pad,X(x),height-pad,grid,1,x===0?.9:.65);
  for(let y=-5;y<=5;y++)out+=line(pad,Y(y),width-pad,Y(y),grid,1,y===0?.9:.65);
  out+=line(X(0),pad,X(0),height-pad,axis,1.4,.9)+line(pad,Y(0),width-pad,Y(0),axis,1.4,.9);
  for(let x=-3;x<=4;x++)if(x!==0)out+=`<text x="${X(x)}" y="${Y(0)+18}" text-anchor="middle" fill="${axis}" font-size="11" font-family="Arial">${x}</text>`;
  for(let sign of [1,-1]){
    let path='', active=false;
    const steps=1000;
    for(let i=0;i<=steps;i++){
      const x=limits.x0+(limits.x1-limits.x0)*i/steps, value=rhs(x,a,b);
      if(value<0){active=false;continue;}
      const y=sign*Math.sqrt(value);
      if(y<limits.y0||y>limits.y1){active=false;continue;}
      path+=`${active?'L':'M'}${X(x).toFixed(2)} ${Y(y).toFixed(2)} `;active=true;
    }
    out+=`<path d="${path}" fill="none" stroke="${curve}" stroke-width="${dark?3:3.5}" stroke-linejoin="round" stroke-linecap="round"/>`;
  }
  if(addition&&addition.P&&addition.Q&&discriminant(a,b)!==0){
    const {P,Q,sum}=addition;
    if(sum.kind==='vertical')out+=line(X(P.x),pad,X(P.x),height-pad,'#d89969',2,.7,'6 5');
    else if(sum.slope!==null){
      const intercept=P.y-sum.slope*P.x;
      out+=line(X(limits.x0),Y(sum.slope*limits.x0+intercept),X(limits.x1),Y(sum.slope*limits.x1+intercept),'#d89969',2,.8,'7 5');
      if(sum.result)out+=line(X(sum.result.x),Y(-sum.result.y),X(sum.result.x),Y(sum.result.y),'#d89969',1.8,.85,'5 4');
    }
    const dots=[[P,'P','#de9a68'],[Q,'Q','#de9a68'],[sum.result,'P+Q','#1b766c']];
    for(const [pt,label,color] of dots){if(!pt||pt.x<limits.x0||pt.x>limits.x1||pt.y<limits.y0||pt.y>limits.y1)continue;out+=`<circle cx="${X(pt.x)}" cy="${Y(pt.y)}" r="5.5" fill="${color}" stroke="white" stroke-width="2"/><text x="${X(pt.x)+9}" y="${Y(pt.y)-9}" fill="${dark?'#eee':'#3c5d5a'}" font-family="Arial" font-size="12" font-weight="bold">${label}</text>`;}
  }
  return out;
}
function renderHero(){ $('heroPlot').innerHTML=plotMarkup(520,390,-1,1,true,{P:{x:0,y:1},Q:{x:1,y:1},sum:{result:{x:-1,y:-1},slope:0,kind:'secant'}}); }
function renderPlot(){
  const P=visiblePoints[Number($('pointP').value)],Q=visiblePoints[Number($('pointQ').value)];
  const sum=P&&Q?add(P,Q):null;
  $('mainPlot').innerHTML=plotMarkup(760,520,state.a,state.b,false,sum?{P,Q,sum}:null);
  $('mainPlot').setAttribute('aria-label',`Graph of ${equation(state.a,state.b)}${sum?`, showing ${pointText(P)} plus ${pointText(Q)} equals ${pointText(sum.result)}`:''}`);
  if(discriminant()===0){$('sumResult').textContent='This cubic is singular';$('additionFormula').textContent='The elliptic curve group law needs a smooth curve (Δ ≠ 0).';return;}
  if(!sum){$('sumResult').textContent='Choose two points to add';$('additionFormula').textContent='Integral points in the current plot window appear in the menus.';return;}
  $('sumResult').textContent=`${pointText(P)} + ${pointText(Q)} = ${pointText(sum.result)}`;
  $('additionFormula').textContent=sum.kind==='vertical'?'Vertical line: P and Q are inverses, so P + Q = O.':`${sum.kind==='tangent'?'Tangent at P':'Secant through P and Q'}: exact slope m = ${sum.slopeExact}. Reflect the third intersection across the x-axis.`;
}
function renderPoints(){
  const all=integralPoints(state.a,state.b);
  $('integerCount').textContent=all.length;
  const prevP=$('pointP').value?visiblePoints[Number($('pointP').value)]:null,prevQ=$('pointQ').value?visiblePoints[Number($('pointQ').value)]:null;
  visiblePoints=all.filter(P=>P.x>=limits.x0&&P.x<=limits.x1&&P.y>=limits.y0&&P.y<=limits.y1);
  const options=visiblePoints.map((P,i)=>`<option value="${i}">${pointText(P)}</option>`).join('');
  $('pointP').innerHTML=options;$('pointQ').innerHTML=options;
  const match=(pt)=>visiblePoints.findIndex(P=>pt&&P.x===pt.x&&P.y===pt.y);
  let pi=match(prevP),qi=match(prevQ);
  if(pi<0)pi=Math.max(0,visiblePoints.findIndex(P=>P.x===0&&P.y===1));
  if(qi<0)qi=Math.max(0,visiblePoints.findIndex(P=>P.x===1&&P.y===1));
  $('pointP').value=String(pi);$('pointQ').value=String(qi);
  $('pointP').disabled=$('pointQ').disabled=visiblePoints.length===0||discriminant()===0;
}
function mod(n,p){return ((n%p)+p)%p;}
function renderField(){
  const p=state.p, points=[];
  for(let x=0;x<p;x++)for(let y=0;y<p;y++)if(mod(y*y-x*x*x-state.a*x-state.b,p)===0)points.push([x,y]);
  const singular=mod(discriminant(),p)===0;
  $('fieldCount').textContent=singular?'—':String(points.length+1);
  $('fieldLabel').textContent=singular?'SINGULAR REDUCTION':'POINTS, INCLUDING O';
  const keys=new Set(points.map(([x,y])=>`${x},${y}`));
  const cells=[];
  for(let y=p-1;y>=0;y--)for(let x=0;x<p;x++)cells.push(`<span class="cell${keys.has(`${x},${y}`)?' on':''}" title="(${x}, ${y})"></span>`);
  $('fieldGrid').style.gridTemplateColumns=`repeat(${p},1fr)`;
  $('fieldGrid').innerHTML=cells.join('');
  $('fieldGrid').setAttribute('aria-label',singular?`The equation has singular reduction modulo ${p}`:`${points.length} affine solutions modulo ${p}, plus the point at infinity`);
  $('fieldStatus').textContent=singular?`p = ${p} divides Δ. The reduction is singular, so this is not an elliptic curve group.`:`#E(𝔽${p}) = ${points.length} affine points + O = ${points.length+1}`;
}
function render(){
  const {a,b}=state, delta=discriminant();
  $('equation').textContent=equation(a,b);$('aInput').value=$('aRange').value=a;$('bInput').value=$('bRange').value=b;
  $('deltaValue').textContent=delta===0?'0':delta.toLocaleString();$('deltaNote').textContent=delta===0?'Zero · singular cubic':'Nonzero · smooth curve';
  const den=4*a*a*a+27*b*b, j=den===0?null:1728*4*a*a*a/den;
  $('jValue').textContent=j===null?'undefined':fmt(j,3);
  $('shapeValue').textContent=delta===0?'Singular':delta>0?'Two components':'One component';
  $('shapeNote').textContent=delta===0?'A node or cusp appears where smoothness fails.':delta>0?'Three real roots give an oval and an unbounded branch.':'One unbounded real branch.';
  $('curveStatus').textContent=delta===0?'Δ = 0: this cubic is singular. Change a or b to restore an elliptic curve.':'';
  document.querySelectorAll('.preset').forEach(el=>el.classList.toggle('active',el.dataset.preset===`${a},${b}`));
  renderPoints();renderPlot();renderField();
}
function setCoefficient(key,value){state[key]=Math.max(-12,Math.min(12,Math.round(Number(value)||0)));render();}
document.querySelectorAll('[data-step]').forEach(el=>el.addEventListener('click',()=>{const [key,delta]=el.dataset.step.split(':');setCoefficient(key,state[key]+Number(delta));}));
for(const key of ['a','b']){ $(`${key}Input`).addEventListener('change',e=>setCoefficient(key,e.target.value));$(`${key}Range`).addEventListener('input',e=>setCoefficient(key,e.target.value)); }
document.querySelectorAll('[data-preset]').forEach(el=>el.addEventListener('click',()=>{[state.a,state.b]=el.dataset.preset.split(',').map(Number);render();}));
$('primeSelect').addEventListener('change',e=>{state.p=Number(e.target.value);renderField();});
$('pointP').addEventListener('change',renderPlot);$('pointQ').addEventListener('change',renderPlot);
let journeyStage=0;
function renderJourney(){
  const width=760,height=520,pad=45;
  const X=x=>pad+(x-limits.x0)/(limits.x1-limits.x0)*(width-2*pad);
  const Y=y=>height-pad-(y-limits.y0)/(limits.y1-limits.y0)*(height-2*pad);
  const dot=(x,y,label,color,dx=10,dy=-10)=>`<circle cx="${X(x)}" cy="${Y(y)}" r="7" fill="${color}" stroke="#fff" stroke-width="2"/><text x="${X(x)+dx}" y="${Y(y)+dy}" fill="${color}" font-family="Arial" font-size="16" font-weight="bold">${label}</text>`;
  let marks=dot(0,1,'P','#d27857')+dot(1,1,'Q','#d27857');
  if(journeyStage>=1){marks+=line(X(limits.x0),Y(1),X(limits.x1),Y(1),'#d27857',2.5,.9,'7 5')+dot(-1,1,'R','#d27857',-24,-9);}
  if(journeyStage>=2){marks+=line(X(-1),Y(1),X(-1),Y(-1),'#d27857',2,.8,'5 5')+dot(-1,-1,'P + Q','#126b60');}
  $('journeyPlot').innerHTML=plotMarkup(width,height,-1,1)+marks;
  $('journeyPlot').setAttribute('aria-label',journeyStage===0?'Curve y squared equals x cubed minus x plus one, with P at zero comma one and Q at one comma one.':journeyStage===1?'A horizontal line through P and Q also meets the curve at R, negative one comma one.':'The third intersection R is reflected across the x-axis to give P plus Q at negative one comma negative one.');
  const prompts=[
    'On <strong>y² = x³ − x + 1</strong>, begin with <strong>P = (0, 1)</strong> and <strong>Q = (1, 1)</strong>. Both points have rational coordinates. What happens if we draw the line through them?',
    'The line is <strong>y = 1</strong>. It meets the curve again at <strong>R = (−1, 1)</strong>. In the addition law, which point is <strong>P + Q</strong>?',
    'Yes. Reflect R across the x-axis. The sum is <strong>P + Q = (−1, −1)</strong>. Why should a construction like this always produce rational coordinates?',
    'The picture suggests a rule. The formulas make it exact, and the point at infinity completes the operation.'
  ];
  $('journeyPrompt').innerHTML=prompts[journeyStage];
  $('journeyCaption').textContent=journeyStage===0?'P = (0, 1) · Q = (1, 1)':journeyStage===1?'The line y = 1 meets the curve at R = (−1, 1)':'P + Q = (−1, −1) · EXACT RATIONAL COORDINATES';
  const controls=$('journeyControls');
  controls.innerHTML=journeyStage===0?'<button type="button" class="journey-button" data-journey="line">Draw the line ↗</button>':journeyStage===1?'<button type="button" class="journey-choice" data-journey="third">R = (−1, 1)</button><button type="button" class="journey-choice" data-journey="reflect">Its reflection = (−1, −1)</button>':journeyStage===2?'<button type="button" class="journey-button" data-journey="theorem">Reveal the theorem ↗</button>':'<a class="journey-button" href="#explorer">Explore other curves ↓</a>';
  $('journeyTheorem').hidden=journeyStage!==3;
  [...document.querySelectorAll('.journey-progress span')].forEach((el,i)=>el.classList.toggle('active',i===Math.min(journeyStage,2)));
}
$('journeyControls').addEventListener('click',e=>{
  const action=e.target.closest('[data-journey]')?.dataset.journey;
  if(!action)return;
  if(action==='third'){$('journeyFeedback').textContent='R is the third intersection. The group law takes one more move: reflect R across the x-axis.';return;}
  journeyStage=action==='line'?1:action==='reflect'?2:3;
  $('journeyFeedback').textContent=action==='reflect'?'Exactly: reflect the third intersection to obtain the sum.':'';
  renderJourney();
});
renderHero();render();renderJourney();
