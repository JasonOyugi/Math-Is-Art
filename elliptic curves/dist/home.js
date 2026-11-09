const plot = document.getElementById('homePlot');
const result = document.getElementById('homeResult');
const buttons = [...document.querySelectorAll('[data-move]')];
const windowRange = { x0: -2.5, x1: 3.5, y0: -3.15, y1: 3.15 };
const sx = x => 35 + (x - windowRange.x0) / (windowRange.x1 - windowRange.x0) * 530;
const sy = y => 355 - (y - windowRange.y0) / (windowRange.y1 - windowRange.y0) * 320;
const line = (x1,y1,x2,y2,stroke,width=1,dash='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const marker = (x,y,label,color,dx=10,dy=-10) => `<circle cx="${sx(x)}" cy="${sy(y)}" r="6" fill="${color}" stroke="#101d30" stroke-width="2"/><text x="${sx(x)+dx}" y="${sy(y)+dy}" fill="${color}" font-size="13" font-family="DM Sans,Arial" font-weight="700">${label}</text>`;
function render(move) {
  buttons.forEach(button => {const active=button.dataset.move===move;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  let svg='<rect width="600" height="390" fill="#101d30"/>';
  for(let x=-2;x<=3;x++)svg+=line(sx(x),35,sx(x),355,'#294255');
  for(let y=-3;y<=3;y++)svg+=line(35,sy(y),565,sy(y),'#294255');
  svg+=line(sx(0),35,sx(0),355,'#728999',1.4)+line(35,sy(0),565,sy(0),'#728999',1.4);
  for(const sign of [1,-1]){
    let path='',open=false;
    for(let i=0;i<=1200;i++){
      const x=windowRange.x0+(windowRange.x1-windowRange.x0)*i/1200,v=x*x*x-x+1;
      if(v<0){open=false;continue}
      const y=sign*Math.sqrt(v);
      if(y<windowRange.y0||y>windowRange.y1){open=false;continue}
      path+=`${open?'L':'M'}${sx(x).toFixed(2)} ${sy(y).toFixed(2)} `;open=true;
    }
    svg+=`<path d="${path}" fill="none" stroke="#80dec0" stroke-width="3.3" stroke-linecap="round"/>`;
  }
  if(move==='chord'){
    svg+=line(sx(-2.4),sy(1),sx(3.4),sy(1),'#efa782',2.2,'7 5');
    svg+=line(sx(-1),sy(1),sx(-1),sy(-1),'#efa782',1.8,'5 4');
    svg+=marker(0,1,'P','#f6b392',9,-10)+marker(1,1,'Q','#f6b392',9,-10)+marker(-1,1,'R','#f6b392',-23,-9)+marker(-1,-1,'P + Q','#8fe8c6',10,5);
    result.textContent='P = (0, 1), Q = (1, 1) → P + Q = (−1, −1)';
    plot.setAttribute('aria-label','Chord through P at (0, 1) and Q at (1, 1) meets the curve at R at (−1, 1); reflection gives P plus Q at (−1, −1).');
  } else {
    svg+=line(sx(-2.4),sy(1-(-2.4)/2),sx(3.4),sy(1-3.4/2),'#efa782',2.2,'7 5');
    svg+=line(sx(.25),sy(.875),sx(.25),sy(-.875),'#efa782',1.8,'5 4');
    svg+=marker(0,1,'P = Q','#f6b392',10,-9)+marker(.25,.875,'R','#f6b392',12,15)+marker(.25,-.875,'2P','#8fe8c6',10,5);
    result.textContent='P = (0, 1) → 2P = (¼, −⅞)';
    plot.setAttribute('aria-label','Tangent at P at (0, 1) meets the curve again at (one quarter, seven eighths); reflection gives two P at (one quarter, negative seven eighths).');
  }
  plot.innerHTML=svg;
}
buttons.forEach(button=>button.addEventListener('click',()=>render(button.dataset.move)));
render('chord');
