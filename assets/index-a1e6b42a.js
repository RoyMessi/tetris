const t=[function(t,e){return t.insertAdjacentHTML("afterbegin",function(){let t="<h1>Welcome to Tetris!</h1>";return t+="<p></p>",t+="<button class='btn' data-next-step>Got it</button>","<h1>Welcome to Tetris!</h1><p></p><button class='btn' data-next-step>Got it</button>"}()),{start(){t.querySelector("[data-next-step]").addEventListener("click",e,{once:!0})},dispose(){t.querySelector("[data-next-step]").removeEventListener("click",e,{once:!0})}}}];function e(e){let n,o,s,i=1;function c(){i++,o.dispose(),n.innerHTML="",r()}function r(){"function"==typeof t[i-1]?(o=t[i-1](n,c),o.start()):(a(),s())}function a(){return document.body.classList.remove("welcome-page"),e.innerHTML="",this}return{start:function(){return document.body.classList.add("welcome-page"),e.insertAdjacentHTML("afterbegin",'<div id="welcome" class="p-2"></div>'),n=e.firstChild,r(),this},dispose:a,onStartTheGame:function(t){s=t}}}export{e as default};