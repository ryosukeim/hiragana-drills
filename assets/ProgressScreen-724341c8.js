import{s as x,i as l}from"./index-e61e5b3a.js";import{h as $,k as _}from"./kana-data-373ad0d8.js";class N{constructor(e){this.router=e,this.gamificationData=null}async loadData(){this.gamificationData=await x.getGamificationData()}render(){var y,h,b,f;const e=document.createElement("div");e.className="screen p-xl",e.style.maxWidth="900px",e.style.margin="0 auto";const c=document.createElement("div");c.className="flex items-center justify-between mb-xl",c.innerHTML=`
      <h1 data-i18n="progress_title">${l.t("progress_title")}</h1>
      <button class="btn btn-icon btn-secondary" id="back-btn">←</button>
    `;const s=document.createElement("div");s.className="flex gap-md mb-xl",s.style.flexWrap="wrap";const d=((y=this.gamificationData)==null?void 0:y.streak)||0,a=((h=this.gamificationData)==null?void 0:h.level)||1,t=((b=this.gamificationData)==null?void 0:b.xp)||0,i=t%100/100*100;s.innerHTML=`
      <!-- Streak Card -->
      <div class="card flex-col items-center gap-sm p-lg" style="flex: 1; min-width: 200px;">
        <div style="font-size: 48px;">🔥</div>
        <div class="text-3xl font-bold">${d}</div>
        <div class="text-md text-secondary">
          <span data-i18n="progress_streak">${l.t("progress_streak")}</span>
          <span data-i18n="progress_days">${l.t("progress_days")}</span>
        </div>
      </div>
      
      <!-- Level Card -->
      <div class="card flex-col items-center gap-sm p-lg" style="flex: 1; min-width: 200px;">
        <div style="font-size: 48px;">⭐</div>
        <div class="text-3xl font-bold" data-i18n="progress_level">${l.t("progress_level")} ${a}</div>
        <div class="text-md text-secondary">${t} XP</div>
        <div class="progress-bar mt-sm" style="width: 100%;">
          <div class="progress-fill" style="width: ${i}%;"></div>
        </div>
        <div class="text-sm text-muted">${t%100} / 100 XP</div>
      </div>
    `;const o=document.createElement("div");o.className="card p-lg mb-xl";const m=document.createElement("h2");m.className="mb-md",m.setAttribute("data-i18n","progress_kanaMastery"),m.textContent=l.t("progress_kanaMastery");const n=document.createElement("div");n.className="kana-mastery-grid",n.id="kana-mastery-grid",n.style.display="grid",n.style.gridTemplateColumns="repeat(auto-fill, minmax(60px, 1fr))",n.style.gap="var(--space-sm)",o.appendChild(m),o.appendChild(n);const p=document.createElement("div");p.className="card p-lg";const g=document.createElement("h2");g.className="mb-md",g.setAttribute("data-i18n","progress_collectibles"),g.textContent=l.t("progress_collectibles");const r=document.createElement("div");r.style.display="grid",r.style.gridTemplateColumns="repeat(auto-fill, minmax(80px, 1fr))",r.style.gap="var(--space-md)";const u=["🪐","🌟","🚀","👽","🌙","☄️","🛸","🌈"],k=((f=this.gamificationData)==null?void 0:f.collectibles)||[];return u.forEach((C,E)=>{const v=document.createElement("div");v.className="card text-center p-md",v.style.opacity=k.includes(`collectible_${E}`)?"1":"0.3",v.innerHTML=`<div style="font-size: 48px;">${C}</div>`,r.appendChild(v)}),p.appendChild(g),p.appendChild(r),e.appendChild(c),e.appendChild(s),e.appendChild(o),e.appendChild(p),e}async onEnter(){await this.loadData(),document.getElementById("back-btn").onclick=()=>this.router.goBack(),await this.loadKanaMastery()}async loadKanaMastery(){const e=document.getElementById("kana-mastery-grid");if(!e)return;const s=await x.getSetting("kanaSet","hiragana")==="hiragana"?$:_;for(const d of s){const a=await x.getKanaMastery(d.char),t=document.createElement("div");t.className="card text-center p-sm",t.style.position="relative";let i="rgba(255, 255, 255, 0.05)";a>=80?i="rgba(111, 255, 111, 0.2)":a>=60?i="rgba(255, 211, 61, 0.2)":a>0&&(i="rgba(255, 107, 157, 0.2)"),t.style.background=i,t.innerHTML=`
        <div class="japanese text-xl">${d.char}</div>
        ${a>0?`<div class="text-xs text-muted">${a}</div>`:""}
      `,e.appendChild(t)}}}export{N as ProgressScreen};
