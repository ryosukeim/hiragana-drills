import{i as n}from"./index-8827e970.js";class o{constructor(e,t,s,i,r,a){this.router=e,this.result=t,this.xpEarned=s,this.leveledUp=i,this.newLevel=r,this.practiceScreen=a}render(){const e=document.createElement("div");e.className="screen p-xl flex-col items-center justify-center",e.style.minHeight="100vh",this.result.score>=70&&this.createConfetti();const t=document.createElement("div");t.className="card card-gradient p-xl text-center animate-slide-up",t.style.maxWidth="500px";const s=this.getEmojiForScore(this.result.score),i=this.getTitleKeyForScore(this.result.score);if(t.innerHTML=`
      <div style="font-size: 100px;" class="mb-lg animate-bounce">${s}</div>
      <h2 data-i18n="${i}" class="mb-lg">${n.t(i)}</h2>
      
      <!-- Score display -->
      <div class="mb-xl">
        <div class="text-huge font-bold" style="color: var(--color-star-yellow);">${this.result.score}</div>
        <div class="text-lg text-secondary" data-i18n="results_score">${n.t("results_score")}</div>
      </div>
      
      <!-- Feedback message -->
      <div class="card p-lg mb-lg" style="background: rgba(255, 255, 255, 0.1);">
        <p data-i18n="${this.result.feedback}" class="text-lg">${n.t(this.result.feedback)}</p>
      </div>
      
      <!-- XP earned -->
      <div class="flex items-center justify-center gap-md mb-lg">
        <span style="font-size: 28px;">⭐</span>
        <span class="text-xl">+${this.xpEarned}</span>
        <span class="text-md text-secondary" data-i18n="results_xpEarned">${n.t("results_xpEarned")}</span>
      </div>
    `,this.leveledUp){const a=document.createElement("div");a.className="card p-lg mb-lg animate-pulse",a.style.background="var(--gradient-success)",a.style.color="var(--color-space-dark)",a.innerHTML=`
        <div class="flex items-center justify-center gap-md">
          <span style="font-size: 32px;">🎉</span>
          <div>
            <div class="font-bold text-xl" data-i18n="results_newLevel">${n.t("results_newLevel")}</div>
            <div class="text-lg">${n.t("progress_level")} ${this.newLevel}</div>
          </div>
        </div>
      `,t.appendChild(a)}const r=document.createElement("div");return r.className="flex gap-md mt-lg",r.style.width="100%",this.result.score<70?r.innerHTML=`
        <button class="btn btn-secondary" id="try-again-btn" style="flex: 1;">
          🔄 <span data-i18n="writing_tryAgain">${n.t("writing_tryAgain")}</span>
        </button>
        <button class="btn btn-primary" id="next-btn" style="flex: 1;">
          → <span data-i18n="results_next">${n.t("results_next")}</span>
        </button>
      `:r.innerHTML=`
        <button class="btn btn-large btn-success" id="next-btn" style="width: 100%;">
          → <span data-i18n="results_next">${n.t("results_next")}</span>
        </button>
      `,t.appendChild(r),e.appendChild(t),e}onEnter(){const e=document.getElementById("next-btn");e&&(e.onclick=()=>{this.router.navigateTo(this.practiceScreen),this.practiceScreen.nextWord()});const t=document.getElementById("try-again-btn");t&&(t.onclick=()=>{this.router.goBack()})}getEmojiForScore(e){return e>=90?"🌟":e>=80?"⭐":e>=70?"😊":e>=60?"👍":"💪"}getTitleKeyForScore(e){return e>=90?"results_awesome":e>=80?"results_great":e>=70?"results_good":"results_tryAgain"}createConfetti(){const e=["#ffd93d","#ff6b9d","#6bcfff","#6fff6f"];for(let t=0;t<30;t++)setTimeout(()=>{const s=document.createElement("div");s.className="confetti",s.style.left=Math.random()*100+"%",s.style.background=e[Math.floor(Math.random()*e.length)],s.style.animationDuration=Math.random()*1+1.5+"s",s.style.animationDelay=Math.random()*.5+"s",document.body.appendChild(s),setTimeout(()=>s.remove(),3e3)},t*50)}}export{o as ResultsScreen};
