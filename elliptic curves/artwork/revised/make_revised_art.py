"""Generate editable mathematical poster art for the Math Is Art image set."""
from pathlib import Path
import math

OUT = Path(__file__).with_name('revised')
OUT.mkdir(exist_ok=True)
NAVY, BLUE, RED, PAPER, DOT = '#073e4b', '#0c6680', '#980b13', '#f7f2e9', '#a7b5b5'

def path(points):
    return ' '.join(('M' if i == 0 else 'L') + f'{x:.2f},{y:.2f}' for i,(x,y) in enumerate(points))

def svg(body, footer, bg=PAPER):
    dots = ''.join(f'<circle cx="{x}" cy="{y}" r="2.4" fill="{DOT}" opacity=".45"/>' for x in range(24,1500,43) for y in range(24,1210,43))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1500" viewBox="0 0 1500 1500"><rect width="1500" height="1500" fill="{bg}"/>{dots}<g stroke-linecap="round" stroke-linejoin="round">{body}</g><rect y="1215" width="1500" height="285" fill="{RED}"/><text x="750" y="1390" text-anchor="middle" fill="{PAPER}" font-family="Georgia,serif" font-size="64">{footer}</text></svg>'''

def curve_paths(b, x0, x1, y0, y1, box):
    # Find exact real branch endpoints, then sample y² = x³ - x + b.
    left,top,width,height=box
    def xy(x,y): return (left+(x-x0)/(x1-x0)*width,top+(y1-y)/(y1-y0)*height)
    f=lambda x:x*x*x-x+b
    roots=[]; prev=x0
    for i in range(1,4001):
        cur=x0+(x1-x0)*i/4000
        if f(prev)*f(cur)<=0:
            lo,hi=prev,cur
            for _ in range(45):
                mid=(lo+hi)/2
                if f(lo)*f(mid)<=0:hi=mid
                else:lo=mid
            root=(lo+hi)/2
            if not roots or abs(root-roots[-1])>1e-5:roots.append(root)
        prev=cur
    bounds=[x0]+roots+[x1]; result=''
    for a,c in zip(bounds,bounds[1:]):
        if f((a+c)/2)<0:continue
        for sign in (1,-1):
            pts=[]
            for i in range(801):
                x=a+(c-a)*i/800;y=sign*math.sqrt(max(0,f(x)))
                if y0<=y<=y1:pts.append(xy(x,y))
            if len(pts)>2:result+=f'<path d="{path(pts)}" fill="none" stroke="{BLUE}" stroke-width="5"/>'
    return result

# 05: the smooth genus-one lemniscatic quartic, whose real oval underlies the integral.
def quartic():
    upper=[];lower=[]
    for i in range(901):
        x=-1+2*i/900; y=math.sqrt(max(0,1-x**4)); X=750+490*x
        upper.append((X,650-380*y));lower.append((X,650+380*y))
    body=f'<path d="{path(upper+list(reversed(lower)))} Z" fill="none" stroke="{NAVY}" stroke-width="7"/>'
    body+=f'<path d="M750 270V1030M260 650H1240" stroke="{DOT}" stroke-width="3" opacity=".7"/>'
    body+=f'<circle cx="750" cy="270" r="11" fill="{RED}"/><text x="790" y="262" fill="{NAVY}" font-size="36" font-family="Georgia">(0, 1)</text>'
    body+=f'<text x="750" y="1150" text-anchor="middle" fill="{NAVY}" font-size="47" font-family="Georgia">v² = 1 − u⁴</text>'
    return svg(body,'∫₀¹ dt / √(1 − t⁴) = ϖ / 2')

# 08: a single blue torus, with no linking arrows; the surface denotes genus one.
def torus():
    body=f'''<ellipse cx="750" cy="775" rx="565" ry="315" fill="{BLUE}" stroke="{NAVY}" stroke-width="7"/>
    <path d="M195 770C230 1040 475 1114 750 1114s520-74 555-344" fill="none" stroke="#8fc4c4" stroke-width="5" opacity=".72"/>
    <ellipse cx="750" cy="668" rx="282" ry="129" fill="{PAPER}" stroke="{NAVY}" stroke-width="6"/>
    <path d="M468 668C492 746 585 835 750 838s258-92 282-170" fill="{NAVY}" stroke="{NAVY}" stroke-width="4"/>
    <ellipse cx="750" cy="668" rx="282" ry="129" fill="none" stroke="#8fc4c4" stroke-width="4" opacity=".65"/>
    <text x="750" y="267" text-anchor="middle" fill="{PAPER}" font-family="Georgia" font-style="italic" font-size="104">g = 1</text>'''
    return svg(body,'ℓ(D) − ℓ(K − D) = deg D − g + 1',bg=RED)

# 09: three actual nonsingular members of y² = x³ − x + b.
def family():
    body=''
    for i,(b,label) in enumerate([(-.25,'b = −¼'),(0,'b = 0'),(.25,'b = ¼')]):
        left=65+i*475
        body+=f'<rect x="{left}" y="190" width="430" height="830" rx="10" fill="{PAPER}" stroke="{NAVY}" stroke-width="3"/>'
        body+=f'<text x="{left+215}" y="289" text-anchor="middle" fill="{NAVY}" font-family="Georgia" font-size="48">{label}</text>'
        body+=curve_paths(b,-1.65,2.05,-2.5,2.5,(left+38,350,354,585))
        body+=f'<path d="M{left+38} 642H{left+392}" stroke="{DOT}" stroke-width="2" opacity=".7"/>'
    body+=f'<text x="750" y="1140" text-anchor="middle" fill="{PAPER}" font-family="Georgia" font-size="48">Each panel traces the real points of a smooth cubic.</text>'
    return svg(body,'y² = x³ − x + b     ·     Δ = 16(4 − 27b²)',bg=RED)

# 13: chord and reflection on E: y² = x³ − x + 1.
def group_law():
    left,top,width,height=115,260,1260,810
    x0,x1,y0,y1=-1.55,2.15,-2.4,2.4
    def xy(x,y):return (left+(x-x0)/(x1-x0)*width,top+(y1-y)/(y1-y0)*height)
    body=f'<rect x="70" y="120" width="1360" height="1000" rx="12" fill="{PAPER}" stroke="{NAVY}" stroke-width="4"/>'
    body+=curve_paths(1,x0,x1,y0,y1,(left,top,width,height))
    Y=xy(0,1)[1]; Xs=xy(-1,1)[0]; Xp=xy(0,1)[0]; Xq=xy(1,1)[0]; Yr=xy(-1,-1)[1]
    body+=f'<path d="M{Xs-80:.1f},{Y:.1f}H{Xq+80:.1f}" stroke="{RED}" stroke-width="5"/>'
    body+=f'<path d="M{Xs:.1f},{Y:.1f}V{Yr:.1f}" stroke="{RED}" stroke-width="4" stroke-dasharray="12 13"/>'
    for x,y,label,color,dx,dy in [(Xp,Y,'P',BLUE,-25,-24),(Xq,Y,'Q',BLUE,20,-24),(Xs,Y,'−(P + Q)',RED,-55,-29),(Xs,Yr,'P + Q',BLUE,-48,52)]:
        body+=f'<circle cx="{x:.1f}" cy="{y:.1f}" r="11" fill="{color}"/><text x="{x+dx:.1f}" y="{y+dy:.1f}" fill="{NAVY}" font-family="Georgia" font-size="38">{label}</text>'
    body+=f'<text x="750" y="181" text-anchor="middle" fill="{NAVY}" font-family="Georgia" font-size="43">A line meets the cubic three times; reflect the third point.</text>'
    return svg(body,'E: y² = x³ − x + 1     ·     P + Q = (−1, −1)',bg=RED)

for name,render in [('05_Lemniscate',quartic),('08_Riemann_Roch',torus),('09_Elliptic_family',family),('13_Group_law',group_law)]:
    (OUT/(name+'.svg')).write_text(render(),encoding='utf-8')
    print(OUT/(name+'.svg'))
