"""Builds docs/stage-1/merova-stage1-review.html (the Stage 1 review page) from register.json and the master logo SVGs.
Run after register.py:  python3 docs/stage-1/source/review_page.py
"""
import json, os, re, base64

HERE = os.path.dirname(os.path.abspath(__file__))
STAGE = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(STAGE))
LOGO = os.path.join(ROOT, "public/assets/brand/master")

d = json.load(open(os.path.join(STAGE, "register.json")))
slim = dict(
    cats={k: dict(name=v["name"], slug=v["slug"], promise=v["promise"], intro=v["intro"]) for k, v in d["categories"].items()},
    products=[dict(id=p["id"], n=p["name"], c=p["category"], s=p["subcategory"], st=p["status"], f=p["flags"], v=p["variants"],
                   u=p["url"], d=p["desc"], m=p["merged"], no=p["note"]) for p in d["products"]],
    inds=[dict(n=i["name"], s=i["slug"], ops=[dict(n=o["name"], s=o["slug"], pg=o["page"], p=o["primary"], x=o["secondary"]) for o in i["ops"]]) for i in d["industries"]],
    dedup=d["dedup"], verify=d["verification"], dec=d["decisions"])

def svg_uri(name):
    s = open(os.path.join(LOGO, name)).read()
    return "data:image/svg+xml;base64," + base64.b64encode(s.encode()).decode()

LOCKUP = svg_uri("merova-lockup-primary-transparent.svg")
LOCKUP_REV = svg_uri("merova-lockup-reverse-transparent.svg")
MARK = svg_uri("merova-mark-primary-transparent.svg")
MARK_REV = svg_uri("merova-mark-reverse-transparent.svg")

P = d["products"]
n_total = len(P); n_s1 = sum(p["status"] == 1 for p in P); n_s2 = sum(p["status"] == 2 for p in P); n_s3 = sum(p["status"] == 3 for p in P)
n_held = sum(p["flags"] == "SUP" for p in P)
n_ops = sum(len(i["ops"]) for i in d["industries"]); n_pages = sum(o["page"] for i in d["industries"] for o in i["ops"])
cat_counts = {k: sum(p["category"] == k for p in P) for k in d["categories"]}

html = r"""<title>Merova Stage 1 Review</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&display=swap">
<style>
/* Layout: editorial review document — full-bleed brand bands alternate with a 1240px reading column; prototypes sit in framed "specimen" plates. */
:root{
  --red:#D52B1E; --red-700:#B32217; --red-900:#7A160E; --red-50:#FCEDEA; --reverse:#F1F0EC;
  --bg:#FFFAF3; --sand:#F4EDE3; --surface:#FFFFFF; --ink:#1E1B1B; --charcoal:#454040; --stone:#6F6866; --line:#E6DDD1; --graphite:#2A2626;
  --kraft:#B8875A; --film:#5E7E8C; --fibre:#6B7F4E; --liner:#8A5A3C;
  --warn-bg:#FFF3D6; --warn-fg:#6A4A00;
  --display:"Sora",ui-sans-serif,system-ui,sans-serif; --body:"Inter",ui-sans-serif,system-ui,sans-serif;
  --r-card:28px; --r-well:20px; --ease:cubic-bezier(.2,.7,.1,1);
  --shadow:0 1px 2px rgb(42 38 38/.06); --lift:0 24px 48px -24px rgb(42 38 38/.28);
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#1C1919;--sand:#262222;--surface:#2A2626;--ink:#F4EFE8;--charcoal:#E2DBD3;--stone:#B3AAA4;--line:#3A3434;--red-50:#3A1C19;--warn-bg:#3A3015;--warn-fg:#F2D58A;--shadow:0 1px 2px rgb(0 0 0/.3);--lift:0 24px 48px -24px rgb(0 0 0/.7);color-scheme:dark}}
:root[data-theme="dark"]{--bg:#1C1919;--sand:#262222;--surface:#2A2626;--ink:#F4EFE8;--charcoal:#E2DBD3;--stone:#B3AAA4;--line:#3A3434;--red-50:#3A1C19;--warn-bg:#3A3015;--warn-fg:#F2D58A;--shadow:0 1px 2px rgb(0 0 0/.3);--lift:0 24px 48px -24px rgb(0 0 0/.7);color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font:16px/1.6 var(--body);-webkit-font-smoothing:antialiased}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:#FFFAF3}
.wrap{max-width:1240px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
h1,h2,h3,h4{font-family:var(--display);letter-spacing:-.025em;text-wrap:balance;margin:0;color:var(--ink)}
h2{font-size:clamp(30px,4.2vw,48px);line-height:1.05;font-weight:600}
h3{font-size:clamp(20px,2vw,26px);line-height:1.2;font-weight:600}
p{margin:0}
.eyebrow{font:600 12px/1.2 var(--body);letter-spacing:.12em;text-transform:uppercase;color:var(--red)}
.lede{font-size:clamp(17px,1.6vw,20px);line-height:1.55;color:var(--charcoal);max-width:62ch}
.muted{color:var(--stone)}
a{color:var(--red)} a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--red);outline-offset:2px}
section{padding-block:clamp(56px,8vw,112px)}
.sec-head{display:grid;gap:14px;margin-bottom:40px;max-width:820px}

/* top bar */
.topbar{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:#FFFAF3;border-bottom:1px solid #E6DDD1}
.topbar .wrap{display:flex;align-items:center;gap:20px;height:64px}
.topbar img{height:34px;width:auto}
.topbar nav{display:flex;gap:4px;overflow-x:auto;margin-left:auto;scrollbar-width:none}
.topbar nav a{font:500 14px var(--body);color:#454040;text-decoration:none;padding:8px 12px;border-radius:999px;white-space:nowrap}
.topbar nav a:hover{background:#F4EDE3}
.pill{display:inline-flex;align-items:center;gap:8px;border-radius:999px;font:600 15px var(--body);padding:13px 22px;text-decoration:none;border:0;cursor:pointer;transition:background .24s var(--ease),transform .16s var(--ease)}
.pill:active{transform:scale(.98)}
.pill-red{background:var(--red);color:#fff} .pill-red:hover{background:var(--red-700)}
.pill-cloud{background:#FFFAF3;color:var(--red)} .pill-cloud:hover{background:#fff}
.pill-ghost{background:transparent;color:#fff;box-shadow:inset 0 0 0 1.5px rgb(255 255 255/.55)}

/* hero */
.hero{background:var(--red);color:#fff;position:relative;overflow:hidden}
.hero .wrap{position:relative;padding-block:clamp(64px,10vw,140px) clamp(56px,8vw,112px);display:grid;gap:28px}
.hero .mark{position:absolute;right:-8%;bottom:-18%;width:min(78vw,980px);opacity:.16;pointer-events:none}
.hero h1{color:#fff;font-size:clamp(52px,9vw,128px);line-height:.95;font-weight:700;letter-spacing:-.045em}
.hero h1 span{display:block}
.hero .sub{font:500 clamp(18px,2vw,24px)/1.35 var(--display);color:var(--reverse);letter-spacing:-.01em}
.hero .tag{font:600 12px var(--body);letter-spacing:.14em;text-transform:uppercase;color:var(--reverse)}
.hero .cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px}
.hero .note{font-size:13px;color:var(--reverse);opacity:.85;max-width:60ch}
@media (prefers-reduced-motion:no-preference){
 .hero h1 span{animation:rise .8s var(--ease) both}.hero h1 span:nth-child(2){animation-delay:.08s}
 .hero .sub,.hero .cta{animation:rise .8s .18s var(--ease) both}
 @keyframes rise{from{transform:translateY(24px);opacity:.001}to{transform:none;opacity:1}}
}

/* stats */
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--r-card);overflow:hidden}
.stat{background:var(--surface);padding:22px 22px 20px;display:grid;gap:4px}
.stat b{font:600 clamp(30px,3.4vw,42px)/1 var(--display);letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.stat span{font-size:13px;color:var(--stone)}
.alert{margin-top:28px;background:var(--warn-bg);color:var(--warn-fg);border-radius:20px;padding:20px 24px;display:grid;gap:6px}
.alert strong{font-family:var(--display)}

/* two-col text */
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:28px;display:grid;gap:10px;align-content:start;min-width:0}
.card h4{font-size:17px}
.card p,.card li{color:var(--charcoal);font-size:15px}
.card ul{margin:0;padding-left:18px;display:grid;gap:4px}
.quote{font:600 clamp(22px,2.6vw,32px)/1.25 var(--display);letter-spacing:-.02em;color:var(--ink);max-width:30ch}
.quote em{font-style:normal;color:var(--red)}

/* swatches */
.swatches{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px}
.sw{border-radius:var(--r-well);overflow:hidden;border:1px solid var(--line);background:var(--surface)}
.sw i{display:block;height:96px}
.sw div{padding:12px 14px;display:grid;gap:2px;font-size:13px}
.sw b{font:600 14px var(--display)}
.sw code{font:500 12px ui-monospace,monospace;color:var(--stone)}
.logos{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:28px}
.logo-tile{border-radius:var(--r-card);aspect-ratio:16/9;display:grid;place-items:center;padding:28px;border:1px solid var(--line);position:relative}
.logo-tile img{max-height:100%;width:auto;max-width:100%}
.logo-tile small{position:absolute;left:16px;bottom:12px;font:500 11px var(--body);letter-spacing:.04em}

/* type specimen */
.type{display:grid;gap:18px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:clamp(20px,4vw,40px)}
.type .row{display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:16px}
.type .row:last-child{border:0;padding:0}
.type .lbl{font:500 12px var(--body);color:var(--stone)}
@media(max-width:600px){.type .row{grid-template-columns:1fr;gap:4px}}

/* bento */
.bento{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:minmax(220px,auto);gap:16px}
.tile{border-radius:var(--r-card);padding:24px;display:flex;flex-direction:column;gap:10px;text-decoration:none;color:var(--ink);background:var(--surface);border:1px solid var(--line);position:relative;overflow:hidden;transition:transform .3s var(--ease),box-shadow .3s var(--ease);min-width:0}
.tile:hover{transform:translateY(-4px);box-shadow:var(--lift)}
.tile .well{border-radius:var(--r-well);flex:1;min-height:120px;position:relative;overflow:hidden}
.tile .well span{position:absolute;left:12px;bottom:10px;font:500 11px var(--body);color:#fff;background:rgb(30 27 27/.55);padding:3px 8px;border-radius:999px}
.tile h3{font-size:22px}
.tile p{font-size:14px;color:var(--stone)}
.tile .go{font:600 14px var(--body);color:var(--red)}
.tile.L{grid-column:span 2;grid-row:span 2}
.tile.M{grid-column:span 2}
.tile.red{background:var(--red);border-color:var(--red);color:#fff}
.tile.red h3{color:#fff}.tile.red p,.tile.red .go{color:var(--reverse)}
.tile.dark{background:var(--graphite);border-color:var(--graphite)}
.tile.dark h3{color:#fff}.tile.dark p{color:#CFC7C0}.tile.dark .go{color:#FF8C80}
.mat-paper{background:repeating-linear-gradient(115deg,#C99B6D 0 2px,#BF8F60 2px 5px),#C49464}
.mat-plastic{background:linear-gradient(135deg,#DDE6EA,#9DB4BE 45%,#E9F0F2 55%,#86A0AB)}
.mat-compost{background:radial-gradient(circle at 30% 30%,#A9A27E 0 1px,transparent 2px) 0 0/7px 7px,radial-gradient(circle at 70% 60%,#8F8A66 0 1px,transparent 2px) 0 0/9px 9px,#C3BC98}
.mat-corr{background:repeating-radial-gradient(circle at 50% 120%,#9C6B48 0 6px,#B98962 6px 12px)}
@media(max-width:900px){.bento{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.bento{grid-template-columns:1fr}.tile.L,.tile.M{grid-column:auto;grid-row:auto}.tile.L .well{aspect-ratio:4/5}}

/* plates (prototype frames) */
.plate{border:1px solid var(--line);border-radius:var(--r-card);background:var(--sand);padding:clamp(14px,3vw,28px);display:grid;gap:14px;min-width:0}
.plate>.cap{font:600 12px var(--body);letter-spacing:.1em;text-transform:uppercase;color:var(--stone)}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:24px}

/* mega menu mock */
.mega{background:var(--surface);border-radius:22px;box-shadow:var(--lift);overflow:hidden}
.mega .bar{background:#FFFAF3;display:flex;align-items:center;gap:18px;padding:14px 20px;border-bottom:1px solid #E6DDD1;font:500 14px var(--body);color:#454040;flex-wrap:wrap}
.mega .bar img{height:24px}
.mega .bar b{color:var(--red);border-bottom:2px solid var(--red);padding-bottom:2px}
.mega .bar .q{margin-left:auto;background:var(--red);color:#fff;border-radius:999px;padding:7px 14px;font-weight:600;font-size:13px}
.mega .cols4{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;padding:20px}
.mega .col{display:grid;gap:8px;align-content:start;font-size:13px;min-width:0}
.mega .col i{display:block;aspect-ratio:4/3;border-radius:14px}
.mega .col b{font:600 15px var(--display);color:var(--ink)}
.mega .col a{color:var(--charcoal);text-decoration:none}
.mega .foot{border-top:1px solid var(--line);padding:12px 20px;font-size:13px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
@media(max-width:700px){.mega .cols4{grid-template-columns:1fr 1fr}}

/* product card + mira */
.pcard{background:var(--surface);border-radius:22px;overflow:hidden;box-shadow:var(--shadow);border:1px solid var(--line);display:grid;grid-template-columns:1fr 1fr}
.pcard .img{min-height:280px}
.pcard .body{padding:22px;display:grid;gap:10px;align-content:start}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{font:500 12px var(--body);padding:6px 11px;border-radius:999px;border:1px solid var(--line);color:var(--charcoal);background:var(--bg)}
.chip.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.badge{display:inline-block;font:600 11px var(--body);letter-spacing:.06em;text-transform:uppercase;padding:4px 9px;border-radius:999px;background:var(--red-50);color:var(--red-700)}
:root[data-theme="dark"] .badge{color:#FF9A8F}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .badge{color:#FF9A8F}}
.pcard .acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}
.pcard .acts .pill{padding:10px 16px;font-size:14px}
.pill-line{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--line)}
@media(max-width:560px){.pcard{grid-template-columns:1fr}.pcard .img{min-height:200px}}
.mira{background:var(--surface);border-radius:22px;box-shadow:var(--lift);display:grid;grid-template-rows:auto 1fr auto;max-width:420px;width:100%;justify-self:center;overflow:hidden;border:1px solid var(--line)}
.mira header{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--line)}
.mira header img{height:26px;background:#FFFAF3;border-radius:8px;padding:4px 5px}
.mira header b{font:600 15px var(--display)}
.mira header small{margin-left:auto;font:600 10px var(--body);letter-spacing:.08em;background:var(--sand);padding:3px 8px;border-radius:999px;color:var(--stone)}
.mira .log{padding:14px;display:grid;gap:10px;font-size:14px}
.msg{padding:10px 13px;border-radius:16px;max-width:88%}
.msg.u{background:var(--ink);color:var(--bg);justify-self:end;border-bottom-right-radius:4px}
.msg.a{background:var(--sand);color:var(--ink);border-bottom-left-radius:4px}
.mini{display:grid;gap:6px;margin-top:8px}
.mini a{display:flex;justify-content:space-between;gap:8px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:8px 10px;color:var(--ink);text-decoration:none;font-size:13px}
.mini a em{font-style:normal;color:var(--stone);font-size:11px}
.mira footer{padding:10px 14px 14px;display:grid;gap:8px}
.mira footer .disc{font-size:11px;color:var(--stone)}
.mira footer .in{display:flex;gap:8px;border:1px solid var(--line);border-radius:14px;padding:6px 6px 6px 12px;align-items:center;font-size:14px;color:var(--stone)}
.mira footer .in b{margin-left:auto;background:var(--red);color:#fff;border-radius:10px;padding:6px 10px;font-size:12px}

/* flyer */
.flyer{aspect-ratio:210/297;width:100%;max-width:340px;justify-self:center;background:#FFFAF3;border-radius:6px;box-shadow:var(--lift);display:grid;grid-template-rows:auto 1fr auto;overflow:hidden;color:#1E1B1B}
.flyer .top{background:#D52B1E;padding:14px 16px;display:flex;justify-content:space-between;align-items:center}
.flyer .top img{height:26px}
.flyer .top span{font:600 8px var(--body);letter-spacing:.14em;color:#F1F0EC;text-transform:uppercase}
.flyer .mid{padding:14px 16px;display:grid;gap:8px;align-content:start}
.flyer .ph{aspect-ratio:4/3;border-radius:6px}
.flyer h4{font:700 20px/1.05 var(--display);color:#1E1B1B}
.flyer p{font-size:9px;color:#454040;line-height:1.45}
.flyer table{font-size:8px;border-collapse:collapse;width:100%}
.flyer td{border-top:1px solid #E6DDD1;padding:3px 0;color:#454040}
.flyer td:first-child{color:#6F6866;width:45%}
.flyer .bot{background:#2A2626;color:#F1F0EC;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;font-size:8px}
.flyer .bot b{background:#D52B1E;padding:5px 9px;border-radius:999px;font-size:8px}
.flyer .qr{width:30px;height:30px;background:repeating-conic-gradient(#F1F0EC 0 25%,#2A2626 0 50%) 0 0/8px 8px;border-radius:2px}

/* motion table + misc tables */
.tbl-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:20px;background:var(--surface)}
table.t{border-collapse:collapse;width:100%;font-size:14px}
table.t th{position:sticky;top:0;background:var(--sand);text-align:left;font:600 12px var(--body);letter-spacing:.04em;color:var(--stone);padding:12px 14px;white-space:nowrap;z-index:1}
table.t td{padding:12px 14px;border-top:1px solid var(--line);vertical-align:top;color:var(--charcoal)}
table.t td:first-child{font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--stone)}
table.t td b{color:var(--ink);font-weight:600}

/* register explorer */
.filters{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:16px}
.filters button{font:500 13px var(--body);padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--charcoal);cursor:pointer}
.filters button[aria-pressed="true"]{background:var(--red);border-color:var(--red);color:#fff}
.filters input,.filters select{font:500 14px var(--body);padding:9px 14px;border-radius:14px;border:1px solid var(--line);background:var(--surface);color:var(--ink);min-width:0}
.filters input{flex:1 1 220px}
.st{display:inline-block;font:600 11px var(--body);padding:3px 8px;border-radius:999px;white-space:nowrap}
.st1{background:var(--sand);color:var(--charcoal)} .st2{background:var(--warn-bg);color:var(--warn-fg)} .st3{background:var(--red-50);color:var(--red-700)}
.held{background:var(--ink);color:var(--bg)}
.reg-count{font-size:13px;color:var(--stone);margin-left:auto}
.reg-scroll{max-height:640px;overflow:auto}
.var{font-size:12.5px;color:var(--stone)}

/* finder */
.finder{display:grid;gap:16px}
.finder .row{display:flex;gap:8px;flex-wrap:wrap}
.finder .row button{font:500 14px var(--body);padding:10px 16px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer;transition:background .2s var(--ease)}
.finder .row button[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.finder .row.ops button[aria-pressed="true"]{background:var(--red);border-color:var(--red);color:#fff}
.mats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.mat{background:var(--surface);border:1px solid var(--line);border-radius:22px;padding:18px;display:grid;gap:10px;align-content:start;border-top:4px solid var(--c)}
.mat h4{font:600 15px var(--display)}
.mat ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.mat li{font-size:14px;display:flex;gap:8px;align-items:baseline}
.mat li::before{content:"";flex:none;width:8px;height:8px;border-radius:50%;background:var(--c);transform:translateY(-1px)}
.mat li.s{color:var(--stone)} .mat li.s::before{background:transparent;box-shadow:inset 0 0 0 1.5px var(--c)}
.mat li.h{text-decoration:line-through;text-decoration-color:var(--stone)}
.mat .none{font-size:13px;color:var(--stone)}
@media(max-width:900px){.mats{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.mats{grid-template-columns:1fr}}

/* roadmap */
.road{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;counter-reset:ph}
.road .card{gap:6px}
.road .card .n{font:600 12px var(--body);color:var(--red);letter-spacing:.08em}

/* closing band */
.band{background:var(--graphite);color:#F1F0EC}
.band h2{color:#fff}
.band .lede{color:#CFC7C0}
.band .cols .card{background:#332E2E;border-color:#433C3C}
.band .cols .card h4{color:#fff}.band .cols .card p,.band .cols .card li{color:#CFC7C0}
.band code{background:#433C3C;color:#fff;padding:1px 6px;border-radius:6px;font-size:13px}
footer.site{padding-block:32px;font-size:13px;color:var(--stone)}
footer.site .wrap{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
footer.site img{height:30px;background:#FFFAF3;border-radius:8px;padding:5px 6px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>

<div class="topbar"><div class="wrap">
  <img src="__LOCKUP__" alt="Merova">
  <nav aria-label="Sections">
    <a href="#positioning">Positioning</a><a href="#creative">Creative direction</a><a href="#portfolio">Portfolio</a><a href="#finder">Industry mapping</a><a href="#architecture">Architecture</a><a href="#open">Open items</a><a href="#roadmap">Roadmap</a>
  </nav>
</div></div>

<header class="hero">
  <img class="mark" src="__MARK_REV__" alt="">
  <div class="wrap">
    <p class="tag">Stage 1 · Strategic framework &amp; creative direction · For approval</p>
    <h1><span>Packaging,</span><span>Perfected.</span></h1>
    <p class="sub">Engineered to Protect. Designed to Perform.</p>
    <div class="cta"><a class="pill pill-cloud" href="#portfolio">Review the portfolio</a><a class="pill pill-ghost" href="#open">See what we need from Merova</a></div>
    <p class="note">This opening band is also a working prototype of the proposed website hero: full-bleed Merova Red, the supplied reverse mark cropped large as a graphic, Sora display type and pill CTAs.</p>
  </div>
</header>

<section id="summary"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">At a glance</p><h2>A focused portfolio of four materials, mapped to the businesses that buy it.</h2></div>
  <div class="stats">
    <div class="stat"><b>__NT__</b><span>product types after deduplication</span></div>
    <div class="stat"><b>4</b><span>master categories · 21 subcategories</span></div>
    <div class="stat"><b>9</b><span>industries</span></div>
    <div class="stat"><b>__NOPS__</b><span>operators mapped (__NPAGES__ with pages)</span></div>
    <div class="stat"><b>__ND__</b><span>deduplication decisions</span></div>
    <div class="stat"><b>__NV__</b><span>items Merova must verify</span></div>
  </div>
  <div class="alert" role="note"><strong>Compliance finding: __NHELD__ products held from publication</strong>
    <p>India's single-use plastic prohibition (in force since 1 July 2022) covers plastic "cups, glasses… trays" and "wrapping or packing films around sweet boxes". PET glasses, PP glasses and plastic trays are held until Merova confirms a lawful basis for supplying them (for example, export only). Cling film stays listed but must not be marketed for sweet boxes.</p></div>
</div></section>

<section id="positioning" style="background:var(--sand)"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">1 · Positioning</p><h2>One accountable partner across paper, plastic, compostable and corrugated.</h2>
  <p class="lede">For manufacturers, food businesses, retailers and procurement teams that buy packaging in several materials, Merova specifies each pack around the product, prints it to brand standard and confirms it on a sample before production.</p></div>
  <div class="cols">
    <div class="card"><h4>Proof pillars</h4><ul><li><b>One portfolio, four materials:</b> visible in the navigation itself.</li><li><b>Specified, not sold:</b> configurable parameters and product-specific RFQs.</li><li><b>Print as a discipline:</b> proofing, finishes and registration.</li><li><b>Sample before production:</b> the process page.</li><li><b>Material honesty:</b> compostable, recyclable and conventional never blurred.</li></ul></div>
    <div class="card"><h4>Headline system</h4><ul><li><b>Discovery:</b> Every material has a purpose. Find the right one.</li><li><b>Paper:</b> Make the first impression count.</li><li><b>Plastic &amp; Films:</b> Film that seals, wraps and protects at line speed.</li><li><b>Compostable:</b> Compostable, stated precisely.</li><li><b>Corrugated:</b> Strength that moves business forward.</li><li><b>Industries:</b> Tell us what you run. We'll show you what you need.</li></ul></div>
    <div class="card"><h4>Voice rules</h4><p>Confident, exact, short. Every headline names a benefit a buyer can test.</p><p class="muted">Not used: "trusted partner", "one-stop", "best-in-class", "quality is our priority", or any figure Merova has not supplied.</p></div>
  </div>
</div></section>

<section id="creative"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">2 · Creative direction</p><h2>The Red Line.</h2>
  <p class="lede">The Merova mark is one continuous stroke. The site carries that gesture: full-bleed red moments, a thin red rule that draws itself through long pages, and calm warm-white surfaces between them. The logo is used exactly as supplied.</p></div>

  <h3 style="margin-bottom:16px">Logo set (extracted from the supplied .ai, unaltered)</h3>
  <div class="logos">
    <div class="logo-tile" style="background:#FFFAF3"><img src="__LOCKUP__" alt="Merova primary lockup"><small style="color:#6F6866">Primary lockup · on Cloud Dancer</small></div>
    <div class="logo-tile" style="background:#D52B1E;border-color:#D52B1E"><img src="__LOCKUP_REV__" alt="Merova reverse lockup"><small style="color:#F1F0EC">Reverse lockup · on Merova Red</small></div>
    <div class="logo-tile" style="background:#FFFAF3"><img src="__MARK__" alt="Merova mark"><small style="color:#6F6866">Mark · on Cloud Dancer</small></div>
    <div class="logo-tile" style="background:#D52B1E;border-color:#D52B1E"><img src="__MARK_REV__" alt="Merova reverse mark"><small style="color:#F1F0EC">Reverse mark · on Merova Red</small></div>
  </div>
  <p class="muted" style="margin:-12px 0 36px;font-size:14px">No compact horizontal lockup exists in the file. At a 34&nbsp;px header height the wordmark becomes very small, so we request one from Merova's designer (V-13) instead of creating our own.</p>

  <h3 style="margin-bottom:16px">Colour tokens</h3>
  <div class="swatches" style="margin-bottom:12px">
    <div class="sw"><i style="background:#D52B1E"></i><div><b>Merova Red</b><code>#D52B1E · from logo</code></div></div>
    <div class="sw"><i style="background:#454040"></i><div><b>Charcoal</b><code>#454040 · from logo</code></div></div>
    <div class="sw"><i style="background:#FFFAF3"></i><div><b>Cloud Dancer</b><code>#FFFAF3 · from logo</code></div></div>
    <div class="sw"><i style="background:#F1F0EC"></i><div><b>Reverse</b><code>#F1F0EC · mark on red</code></div></div>
    <div class="sw"><i style="background:#B32217"></i><div><b>Red 700</b><code>#B32217 · hover</code></div></div>
    <div class="sw"><i style="background:#2A2626"></i><div><b>Graphite</b><code>#2A2626 · depth</code></div></div>
    <div class="sw"><i style="background:#F4EDE3"></i><div><b>Sand</b><code>#F4EDE3 · alt surface</code></div></div>
    <div class="sw"><i style="background:linear-gradient(90deg,#B8875A 25%,#5E7E8C 25% 50%,#6B7F4E 50% 75%,#8A5A3C 75%)"></i><div><b>Material accents</b><code>rules &amp; icons only</code></div></div>
  </div>
  <p class="muted" style="margin-bottom:40px;font-size:14px">Contrast: red on white 5.0:1, red on Cloud Dancer 4.8:1, white on red 5.0:1 (all AA). No navy or blue anywhere in the system.</p>

  <h3 style="margin-bottom:16px">Typography: Sora (display) with Inter (text)</h3>
  <div class="type" style="margin-bottom:48px">
    <div class="row"><span class="lbl">Display · 128/0.95</span><span style="font:700 clamp(44px,7vw,96px)/.95 var(--display);letter-spacing:-.045em">Perfected.</span></div>
    <div class="row"><span class="lbl">H2 · 48/1.08</span><span style="font:600 clamp(28px,3.6vw,48px)/1.08 var(--display);letter-spacing:-.03em">Strength that moves business forward.</span></div>
    <div class="row"><span class="lbl">H3 · 28/1.2</span><span style="font:600 clamp(20px,2.4vw,28px)/1.2 var(--display);letter-spacing:-.02em">BOPP Heat-Sealable (HST) Rolls</span></div>
    <div class="row"><span class="lbl">Body · 17/1.6</span><span style="max-width:62ch">Heat-sealable BOPP film rolls for overwrapping and form-fill-seal packing of food and consumer goods, specified to your machine, width and seal window.</span></div>
    <div class="row"><span class="lbl">Spec · 15 tnum</span><span style="font:500 15px var(--body);font-variant-numeric:tabular-nums">Width 300–1,200 mm · Core 76 mm · Thickness 18–40 µm <span class="muted">(illustrative format, not Merova data)</span></span></div>
  </div>

  <h3 style="margin-bottom:8px">Bento system: the Products landing</h3>
  <p class="muted" style="margin-bottom:16px;font-size:14px">Card sizes L / M / S, one red card per view, every card a link. Image wells show material texture as placeholders. Each final card carries a commissioned photograph from its shot brief.</p>
  <div class="bento" style="margin-bottom:48px">
    <a class="tile L red" href="#portfolio" data-cat="paper"><div class="well mat-paper"><span>Photography: printed cartons, macro of crease</span></div><p class="eyebrow" style="color:var(--reverse)">__CP__ products</p><h3>Paper Products</h3><p>Make the first impression count. Cartons, rigid boxes, foodservice, bags, labels and print.</p><span class="go">Explore paper →</span></a>
    <a class="tile M" href="#portfolio" data-cat="corrugated"><div class="well mat-corr"><span>Photography: 5-ply cut-away</span></div><p class="eyebrow">__CC__ products</p><h3>Corrugated &amp; Fluted</h3><p>Strength that moves business forward.</p><span class="go">Explore corrugated →</span></a>
    <a class="tile" href="#portfolio" data-cat="plastic"><div class="well mat-plastic"><span>Photography: BOPP roll</span></div><h3>Plastic &amp; Films</h3><span class="go">__CL__ products →</span></a>
    <a class="tile dark" href="#portfolio" data-cat="compostable"><div class="well mat-compost"><span>Photography: fibre clamshell</span></div><h3>Compostable</h3><span class="go">__CO__ products →</span></a>
  </div>

  <div class="grid2" style="margin-bottom:24px">
    <div class="plate"><span class="cap">Prototype · Products mega menu</span>
      <div class="mega">
        <div class="bar"><img src="__LOCKUP__" alt=""><b>Products</b><span>Industries</span><span>About Merova</span><span>Resources</span><span>Contact</span><span class="q">Request a Quote</span></div>
        <div class="cols4">
          <div class="col"><i class="mat-paper"></i><b>Paper</b><a href="#portfolio">Folding &amp; mono cartons</a><a href="#portfolio">Rigid &amp; gift boxes</a><a href="#portfolio">Foodservice</a><a href="#portfolio">Carry bags</a><a href="#portfolio">Labels</a></div>
          <div class="col"><i class="mat-plastic"></i><b>Plastic &amp; Films</b><a href="#portfolio">BOPP films</a><a href="#portfolio">Shrink films</a><a href="#portfolio">Cling &amp; stretch</a><a href="#portfolio">Pouches</a></div>
          <div class="col"><i class="mat-compost"></i><b>Compostable</b><a href="#portfolio">Bags</a><a href="#portfolio">Films &amp; pouches</a><a href="#portfolio">Foodservice</a></div>
          <div class="col"><i class="mat-corr"></i><b>Corrugated</b><a href="#portfolio">3 / 5 / 7-ply boxes</a><a href="#portfolio">Die-cut &amp; e-commerce</a><a href="#portfolio">Inserts</a><a href="#portfolio">Retail-ready</a></div>
        </div>
        <div class="foot"><a href="#portfolio">View all __NPUB__ products →</a><span class="muted">Not sure what you need? Describe your requirement →</span></div>
      </div>
    </div>
    <div class="plate"><span class="cap">Prototype · Product card with variant chips and dual action</span>
      <div class="pcard">
        <div class="img mat-paper" role="img" aria-label="Material placeholder for popcorn tub photography"></div>
        <div class="body"><span class="eyebrow">Paper · Foodservice</span><h3>Popcorn Tubs</h3><p class="muted" style="font-size:14px">Printed paperboard tubs and buckets for cinema concessions and events.</p>
          <div class="chips"><span class="chip on">Regular</span><span class="chip">Medium</span><span class="chip">Large</span><span class="chip">Combo</span><span class="chip">With lid</span></div>
          <span><span class="badge">Specs confirmed at quotation</span></span>
          <div class="acts"><button class="pill pill-red" type="button">Add to enquiry</button><button class="pill pill-line" type="button">Download flyer</button></div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid2" style="margin-bottom:48px">
    <div class="plate"><span class="cap">Prototype · Mira, grounded in the register</span>
      <div class="mira">
        <header><img src="__MARK__" alt=""><b>Mira</b><span class="muted" style="font-size:13px">Merova packaging assistant</span><small>AI</small></header>
        <div class="log">
          <div class="msg u">We run a cinema. What do you offer for our concessions counter?</div>
          <div class="msg a">For a cinema counter, most operators use these. All are paper-based and printable:
            <div class="mini"><a href="#finder">Popcorn Tubs <em>Paper</em></a><a href="#finder">Popcorn Cones <em>Paper</em></a><a href="#finder">Nachos Trays <em>Paper</em></a><a href="#finder">French Fries Cartons <em>Paper</em></a><a href="#finder">Paper Cups + Cup Sleeves <em>Paper</em></a><a href="#finder">3-Ply Boxes for storage <em>Corrugated</em></a></div>
            <p style="margin-top:8px">Want me to add all six to one enquiry? Prices and specifications are confirmed by the Merova team.</p></div>
        </div>
        <footer><div class="in">Ask about packaging… <b>Send</b></div><span class="disc">Mira is an AI assistant and can make mistakes. Talk to a person on WhatsApp or by callback at any time.</span></footer>
      </div>
    </div>
    <div class="plate"><span class="cap">Prototype · One-page product flyer (A4)</span>
      <div class="flyer">
        <div class="top"><img src="__LOCKUP_REV__" alt="Merova"><span>Product flyer · Plastic &amp; Films</span></div>
        <div class="mid">
          <div class="ph mat-plastic"></div>
          <h4>BOPP Heat-Sealable (HST) Rolls</h4>
          <p>Heat-sealable BOPP film for overwrapping and form-fill-seal packing, specified to your machine, width and seal window.</p>
          <table><tr><td>Formats</td><td>One / two-side heat-sealable; plain or printed</td></tr><tr><td>Configurable</td><td>Width, core, micron, roll length</td></tr><tr><td>Used by</td><td>Food manufacturers, confectionery, FMCG</td></tr><tr><td>Values</td><td>Confirmed at quotation</td></tr></table>
        </div>
        <div class="bot"><span>merova · product page via QR</span><b>Request a Quote</b><i class="qr"></i></div>
      </div>
    </div>
  </div>

  <h3 style="margin-bottom:16px">Motion language</h3>
  <div class="tbl-wrap"><table class="t">
    <thead><tr><th>Moment</th><th>Behaviour</th><th>Timing</th></tr></thead>
    <tbody>
      <tr><td>Hero</td><td><b>Headline lines rise through a mask; the mark draws as a stroke; imagery parallaxes at 0.15× scroll.</b> The rise is visible on this page's hero.</td><td>≤1,100 ms total</td></tr>
      <tr><td>Section reveal</td><td>24 px rise and fade, children staggered. Starts from a visible state and plays once.</td><td>600 ms · 60 ms stagger</td></tr>
      <tr><td>Image reveal</td><td>Clip-path inset 8% → 0 with scale 1.06 → 1</td><td>700 ms</td></tr>
      <tr><td>Card hover</td><td>4 px lift, deeper shadow, image scale 1.04, arrow nudges 4 px. Hover the bento cards above.</td><td>300 ms</td></tr>
      <tr><td>Mega menu</td><td>Panel drops 8 px and fades; columns stagger</td><td>240 ms · 40 ms</td></tr>
      <tr><td>Page change</td><td>View Transitions: cross-fade, with card image morphing into product hero</td><td>200 ms</td></tr>
      <tr><td>Add to enquiry</td><td>Thumbnail flies to basket; badge counts up</td><td>450 ms</td></tr>
      <tr><td>Reduced motion</td><td>Transforms and parallax off; opacity only. Content never depends on animation.</td><td>—</td></tr>
    </tbody></table></div>
</div></section>

<section id="portfolio" style="background:var(--sand)"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">3 · Master product register</p><h2>__NT__ product types, each with one home.</h2>
  <p class="lede">Sizes, thicknesses and finishes are variants, not products. Filter by category or status. The spreadsheet holds all 22 fields per product, including RFQ fields, image briefs and an approval column.</p></div>
  <div class="filters" id="catf"></div>
  <div class="filters"><input id="q" type="search" placeholder="Search products, variants or merged names" aria-label="Search products">
    <select id="stf" aria-label="Status"><option value="">All statuses</option><option value="1">1 · Listed by Merova</option><option value="2">2 · Subject to confirmation</option><option value="3">3 · Proposed addition</option><option value="SUP">Held (SUP)</option></select>
    <span class="reg-count" id="regc"></span></div>
  <div class="tbl-wrap reg-scroll"><table class="t" id="reg"><thead><tr><th>ID</th><th>Product</th><th>Subcategory</th><th>Variants</th><th>Status</th><th>URL</th></tr></thead><tbody></tbody></table></div>
  <p class="muted" style="font-size:13px;margin-top:12px">Status: <span class="st st1">1</span> listed by Merova, confirmed on sign-off · <span class="st st2">2</span> listed "where available" · <span class="st st3">3</span> agency proposal · <span class="st held">Held</span> single-use plastic review.</p>

  <div class="cols" style="margin-top:40px">
    <div class="card"><h4>Proposed additions</h4><ul id="adds"></ul></div>
    <div class="card"><h4>Key deduplication decisions</h4><ul id="dd"></ul><p class="muted" style="font-size:13px">__ND__ decisions in total, all in the Dedup Register tab.</p></div>
    <div class="card"><h4>Boundary rules</h4><ul><li><b>Material decides the category,</b> never the industry.</li><li><b>Certification decides compostable.</b> PE-lined cups are Paper; certified cups are Compostable; the two are cross-linked.</li><li><b>Customisation is a journey,</b> not four "custom" products.</li><li><b>Excluded:</b> tissue and hygiene paper, stationery, books, diaries, household plastics, straws.</li></ul></div>
  </div>
</div></section>

<section id="finder"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">4 · Industry and operator mapping (working prototype)</p><h2>Tell us what you run. We'll show you what you need.</h2>
  <p class="lede">This is the industry-first journey running on the real register. Pick an industry and an operator: products separate into the four materials. Filled dots are primary applications, rings are optional.</p></div>
  <div class="finder">
    <div class="row" id="indf" role="group" aria-label="Industry"></div>
    <div class="row ops" id="opf" role="group" aria-label="Operator"></div>
    <div class="mats" id="mats"></div>
    <p class="muted" id="opnote" style="font-size:14px"></p>
  </div>
</div></section>

<section id="architecture" style="background:var(--sand)"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">5 · Website architecture</p><h2>Five menu items. Six journeys. One basket.</h2></div>
  <div class="cols" style="margin-bottom:24px">
    <div class="card"><h4>Navigation</h4><ul><li><b>Products</b>: four-column mega menu with category photography</li><li><b>Industries</b>: industry rail and operator cards</li><li><b>About Merova</b>: overview, manufacturing, quality, process, servicing, sustainability, leadership, careers, partnerships</li><li><b>Resources</b>: downloads, technical resources, FAQs, insights</li><li><b>Contact</b></li><li>Plus search, quote basket and the red <b>Request a Quote</b> button</li></ul></div>
    <div class="card"><h4>URL scheme</h4><ul><li><code>/products/{category}/{product}/</code> with no subcategory segment</li><li><code>/industries/{industry}/{operator}/</code></li><li>152 sitemap rows; 33 old URLs 301-redirected</li><li>Held and unapproved products stay out of the sitemap and are noindexed</li></ul></div>
    <div class="card"><h4>Journeys</h4><ul><li><b>A</b> Product-first → add to enquiry</li><li><b>B</b> Industry → operator → "add the complete kit"</li><li><b>C</b> Describe a custom requirement and upload a photo</li><li><b>D</b> Download a flyer → QR → product → quote</li><li><b>E</b> Direct quote</li><li><b>F</b> Mira recommends → adds to basket</li></ul></div>
  </div>
  <div class="cols">
    <div class="card"><h4>Conversion system</h4><ul><li>Multi-product <b>quote basket</b> that keeps variant and parameter context</li><li>Per-product RFQ fields drawn from the register, with progressive disclosure</li><li>Success shown only after the server confirms delivery</li><li>Leads routed by material mix to team inboxes or the CRM</li></ul></div>
    <div class="card"><h4>Mira</h4><ul><li>Claude via the Anthropic API, server-side</li><li>Tool use over the register only: search, operator kit, compare, downloads, add to enquiry, handover</li><li>No prices, lead times, certifications or unlisted specs</li><li>A 30-question evaluation set runs before launch</li></ul></div>
    <div class="card"><h4>SEO and collateral</h4><ul><li>One primary term per page; automated internal links; Product schema without prices</li><li>A one-page flyer per approved product (up to __NPUB__), 4 category brochures, master catalogue, company profile</li><li>Every PDF page is rasterised and inspected before release</li></ul></div>
  </div>
</div></section>

<section id="open"><div class="wrap">
  <div class="sec-head"><p class="eyebrow">6 · Approval gate</p><h2>What we need from Merova.</h2>
  <p class="lede">Nothing in this list will be invented. Sections whose verified data is missing do not render on the site.</p></div>
  <h3 style="margin-bottom:14px">Decisions</h3>
  <div class="tbl-wrap" style="margin-bottom:36px"><table class="t" id="dec"><thead><tr><th>ID</th><th>Decision</th><th>Response</th></tr></thead><tbody></tbody></table></div>
  <h3 style="margin-bottom:14px">Verification register</h3>
  <div class="tbl-wrap reg-scroll"><table class="t" id="ver"><thead><tr><th>ID</th><th>Item required</th><th>Used for</th><th>Priority</th><th>Blocks</th></tr></thead><tbody></tbody></table></div>
</div></section>

<section id="roadmap" class="band"><div class="wrap">
  <div class="sec-head"><p class="eyebrow" style="color:#FF8C80">7 · Roadmap</p><h2>From approval to a verified production launch.</h2>
  <p class="lede">The existing build's enquiry API, SEO helpers, PDF pipeline and test harness are kept. Taxonomy, design, templates, Mira, imagery and collateral are rebuilt.</p></div>
  <div class="cols">
    <div class="card"><h4>0 · Approval</h4><p>Register ticked, decisions D-01 to D-12, creative direction.</p></div>
    <div class="card"><h4>1 · Foundations</h4><p>Import the register, design tokens, components, header, mega menus, footer.</p></div>
    <div class="card"><h4>2 · Templates</h4><p>Home, category, product, industry, operator, corporate, resources, insights.</p></div>
    <div class="card"><h4>3 · Conversion</h4><p>Basket, RFQ, custom requirement, WhatsApp, Mira with evaluations, analytics.</p></div>
    <div class="card"><h4>4 · Imagery</h4><p>Product photography sets, per shot brief. Blocked on the image source (V-26).</p></div>
    <div class="card"><h4>5 · Collateral</h4><p>Flyers, brochures, catalogue, profile, with page-by-page inspection.</p></div>
    <div class="card"><h4>6 · SEO &amp; content</h4><p>Metadata, schema, sitemap, redirects, articles (noindex until reviewed).</p></div>
    <div class="card"><h4>7–8 · QA &amp; deploy</h4><p>Playwright, accessibility, 11 widths, Lighthouse, Vercel preview, then production on approval.</p></div>
  </div>
  <p style="margin-top:32px;font-size:14px;color:#CFC7C0">Source files in the repository: <code>docs/stage-1/STAGE-1-FRAMEWORK.md</code> · <code>docs/stage-1/merova-stage1-register.xlsx</code> · <code>docs/stage-1/REGISTERS.md</code> · <code>docs/stage-1/register.json</code></p>
</div></section>

<footer class="site"><div class="wrap"><img src="__MARK__" alt=""><span>Merova Printpack · Stage 1 review · 24 November 2026 · Prepared for internal approval</span></div></footer>

<script>
const D = __DATA__;
const byId = Object.fromEntries(D.products.map(p => [p.id, p]));
const CAT = {paper:"--kraft", plastic:"--film", compostable:"--fibre", corrugated:"--liner"};
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const stBadge = p => p.f === "SUP" ? '<span class="st held">Held · SUP</span>' : `<span class="st st${p.st}">${p.st}${p.st===1?" · Listed":p.st===2?" · Confirm":" · Proposed"}</span>`;

// register
let cat = "", q = "", stf = "";
const catf = document.getElementById("catf");
const cats = [["", "All categories"], ...Object.entries(D.cats).map(([k, v]) => [k, v.name])];
catf.innerHTML = cats.map(([k, n]) => `<button type="button" data-k="${k}" aria-pressed="${k===""}">${esc(n)}</button>`).join("");
catf.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; cat = b.dataset.k; catf.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); renderReg(); });
document.getElementById("q").addEventListener("input", e => { q = e.target.value.toLowerCase(); renderReg(); });
document.getElementById("stf").addEventListener("change", e => { stf = e.target.value; renderReg(); });
document.querySelectorAll(".tile[data-cat]").forEach(t => t.addEventListener("click", () => { const b = catf.querySelector(`[data-k="${t.dataset.cat}"]`); b && b.click(); }));
function renderReg() {
  const rows = D.products.filter(p => (!cat || p.c === cat) && (!stf || (stf === "SUP" ? p.f === "SUP" : String(p.st) === stf && p.f !== "SUP")) &&
    (!q || [p.n, p.s, p.v.join(" "), p.m, p.d].join(" ").toLowerCase().includes(q)));
  document.querySelector("#reg tbody").innerHTML = rows.map(p => `<tr><td>${p.id}</td><td><b>${esc(p.n)}</b><div class="var">${esc(p.d)}</div>${p.no ? `<div class="var" style="margin-top:4px;color:var(--red-700)">${esc(p.no)}</div>` : ""}</td><td>${esc(p.s)}</td><td class="var">${esc(p.v.join(" · "))}</td><td>${stBadge(p)}</td><td class="var">${esc(p.u)}</td></tr>`).join("") || '<tr><td colspan="6">No products match. Clear the search or choose another status.</td></tr>';
  document.getElementById("regc").textContent = `${rows.length} of ${D.products.length} products`;
}
renderReg();
document.getElementById("adds").innerHTML = D.products.filter(p => p.st === 3).map(p => `<li><b>${esc(p.n)}</b> <span class="muted">(${esc(D.cats[p.c].name)})</span></li>`).join("");
document.getElementById("dd").innerHTML = D.dedup.slice(0, 7).map(r => `<li><b>${esc(r[0])}</b>: ${esc(r[2])}</li>`).join("");

// finder
let ind = D.inds.findIndex(i => i.s === "food-beverage"), op = 2;
const indf = document.getElementById("indf"), opf = document.getElementById("opf");
indf.innerHTML = D.inds.map((i, k) => `<button type="button" data-k="${k}">${esc(i.n)}</button>`).join("");
indf.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; ind = +b.dataset.k; op = 0; renderFinder(); });
opf.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; op = +b.dataset.k; renderFinder(); });
function renderFinder() {
  indf.querySelectorAll("button").forEach((b, k) => b.setAttribute("aria-pressed", k === ind));
  const I = D.inds[ind];
  opf.innerHTML = I.ops.map((o, k) => `<button type="button" data-k="${k}" aria-pressed="${k===op}">${esc(o.n)}</button>`).join("");
  const O = I.ops[op];
  document.getElementById("mats").innerHTML = Object.entries(D.cats).map(([k, c]) => {
    const pr = O.p.map(x => byId[x]).filter(p => p.c === k), se = O.x.map(x => byId[x]).filter(p => p.c === k);
    const li = (p, s) => `<li class="${s ? "s" : ""} ${p.f === "SUP" ? "h" : ""}" title="${p.f === "SUP" ? "Held pending single-use plastic review" : ""}">${esc(p.n)}</li>`;
    return `<div class="mat" style="--c:var(${CAT[k]})"><h4>${esc(c.name)}</h4>${pr.length + se.length ? `<ul>${pr.map(p => li(p, 0)).join("")}${se.map(p => li(p, 1)).join("")}</ul>` : '<p class="none">No products for this operator.</p>'}</div>`;
  }).join("");
  document.getElementById("opnote").textContent = `${O.pg ? "Dedicated page" : "Section on the industry page"} · /industries/${I.s}/${O.pg ? O.s + "/" : "#" + O.s} · ${O.p.length} primary, ${O.x.length} optional products. Struck-through items are held for single-use plastic review.`;
}
renderFinder();

// open items
document.querySelector("#dec tbody").innerHTML = D.dec.map(r => `<tr><td>${r[0]}</td><td><b>${esc(r[1])}</b></td><td>${esc(r[2])}</td></tr>`).join("");
document.querySelector("#ver tbody").innerHTML = D.verify.map(r => `<tr><td>${r[0]}</td><td><b>${esc(r[2])}</b><div class="var">${esc(r[1])} · ${esc(r[4])}</div></td><td class="var">${esc(r[3])}</td><td><span class="st ${r[5]==="P0"?"st3":r[5]==="P1"?"st2":"st1"}">${r[5]}</span></td><td class="var">${esc(r[6])}</td></tr>`).join("");
</script>
"""
n_pub = n_total - n_held
rep = {"__LOCKUP__": LOCKUP, "__LOCKUP_REV__": LOCKUP_REV, "__MARK__": MARK, "__MARK_REV__": MARK_REV,
       "__NT__": str(n_total), "__NOPS__": str(n_ops), "__NPAGES__": str(n_pages), "__ND__": str(len(d["dedup"])), "__NV__": str(len(d["verification"])),
       "__NHELD__": str(n_held), "__NPUB__": str(n_pub), "__CP__": str(cat_counts["paper"]), "__CC__": str(cat_counts["corrugated"]),
       "__CL__": str(cat_counts["plastic"]), "__CO__": str(cat_counts["compostable"]),
       "__DATA__": json.dumps(slim, ensure_ascii=False).replace("</", "<\\/")}
for k, v in rep.items():
    html = html.replace(k, v)
out = os.path.join(STAGE, "merova-stage1-review.html")
open(out, "w").write(html)
print(out, len(html))
