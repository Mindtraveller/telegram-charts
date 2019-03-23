function createButtons(e,n){let i=addClass(el("div"),"buttons");on(i,"click",function(e){let t=e.target.dataset.chart;if(!t)return;let i={...l,[t]:!l[t]};if(!Object.values(i).some(e=>e))return;e.target.classList.toggle("m-hidden"),emit(n,"visibility-updated",l=i)});let l=Object.keys(e.names).reduce((e,t)=>({...e,[t]:!0}),{});return Object.keys(e.names).forEach(n=>{let l=el("button"),d=svgEl("svg",{width:"20",height:"20",viewBox:"0 0 24 24"});d.style.borderColor=e.colors[n],d.style.background=e.colors[n],add(d,svgEl("path",{d:"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"})),add(l,d);let r=el("span");add(r,t(e.names[n])),add(l,r),l.dataset.chart=n,add(i,l)}),{buttons:i,visibilityMap:l}}function createChart(e){let n,i,l=d.getElementById("charts-container"),r=Math.min(500,window.innerWidth),a=400,s=50,o=20,c=5,u=.95,f=10*r/500,h=e.columns[0].slice(1),m={...e,columns:e.columns.slice(1),lines:{}},g=Math.round(h.length/f/6),v=addClass(el("div"),"chart-wrapper"),p=svgEl("svg",{viewBox:`0 0 ${r} ${a+o}`}),{preview:C,previewContainer:x}=function(){let e=addClass(el("div"),"preview-container"),t=svgEl("svg",{viewBox:`0 0 ${r} ${s}`});return add(e,t),add(e,createSlider(m,v)),{previewContainer:e,preview:t}}(),{buttons:w,visibilityMap:y}=createButtons(m,v),{selectedPointInfo:E,pointChartValues:b,pointDate:M}=function(){let e=el("div");addClass(e,"point-info");let n=el("div");addClass(n,"charts-info");let i=el("div");add(e,i),add(e,n);let l=Object.entries(m.names).reduce((e,[i,l])=>{let d=el("div");d.style.color=m.colors[i],addClass(d,"info");let r=el("span");return add(d,r),e[i]=r,add(d,t(l)),add(n,d),e},{});return{selectedPointInfo:e,pointChartValues:l,pointDate:i}}(),{xAxes:B,xAxesHidden:k}=function(){let e=svgEl("g");addClass(e,"x-axes");let t=svgEl("g");return addClass(t,"x-axes","hidden"),{xAxes:e,xAxesHidden:t}}();add(p,B),add(p,k),add(v,p),add(v,x),add(v,w),add(v,E),add(l,v);let A,$,L,N=0,S=void 0,D=-1,T=0,j=0,I=m.columns.filter(e=>y[e[0]]),O=K(),P=Q(h,r),_=R(I),X=F(I),z=ee(N,S),H=ne();function V(){if(_===T)return;let e=Math.ceil(_*u/(c-1)),t=Array.apply(null,Array(c-1)).map((t,n)=>(n+1)*e),l=U(t,de(t),a*u);Y(i),l.forEach((e,n)=>{let l=se(10,r-10,e+o,e+o),d=oe(t[t.length-n-1],5,e);add(i,l),add(i,d)}),removeClass(i,"m-down","m-up"),removeClass(n,"m-down","m-up"),addClass(i,_>T?"m-up":"m-down","pending"),addClass(n,_>T?"m-down":"m-up","pending");let d=i;i=n,n=d,setTimeout(()=>{removeClass(n,"hidden","pending"),removeClass(i,"pending"),addClass(i,"hidden")},0)}function q(){if(A&&(p.removeChild(A),A=null),-1===D)return E.style.display="none",void m.columns.forEach(e=>{let t=e[0];m.lines[t].chartPoint.style.animationName="exit"});let e=h[D],t=r*(e-h[N])/(h[S-1]-h[N]);A=se(t,t,o,o+a),m.columns.forEach(e=>{let n=e[0],i=e.slice(1),l=U(i,T,a,o),d=m.lines[n].chartPoint;d.style.animationName=y[n]?"enter":"exit",svgAttrs(d,{cx:t});let r=d.firstChild;svgAttrs(r,{from:r.getAttribute("to"),to:l[D]}),r.beginElement(),b[n].innerText=i[D],b[n].parentElement.style.display=y[n]?"flex":"none"}),p.insertBefore(A,p.firstChild),M.innerText=new Date(e).toString().slice(0,10);let n=t>r/2;E.style[n?"right":"left"]=`${n?r-t:t}px`,E.style[n?"left":"right"]=null,E.style.display="block"}function F(e){return de(e.reduce((e,t)=>e.concat(t.slice(1)),[]))}function R(e){return de(e.reduce((e,t)=>e.concat(t.slice(1+N,S?1+S:void 0)),[]))}function W(e=!1){le(I,(t,n)=>{let i=t.slice(1);J(m.lines[n],i),e&&G(m.lines[n],i)})}function G(e,t,n){let i=U(t,X,s),l=U(t,j,s);Z(e.preview,P,i,l,n)}function J(e,t,n){let i=t.slice(N,S),l=U(i,_,a,o),d=U(i,T,a,o);Z(e.chart,O,l,d,n)}function K(){return Q(h.slice(N,S),r)}function Q(e,t){let n=Math.min(...e),i=de(e),l=Math.abs(i-n);return e.map(e=>t*(e-n)/l)}function U(e,t,n,i=0){return e.map(e=>t?n*e/t+i:i)}function Y(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function Z(e,t,n,i,l=1){let d=e.firstChild;svgAttrs(d,{from:t.reduce((e,t,n)=>e+`${t},${i[n]} `,""),to:t.reduce((e,t,i)=>e+`${t},${n[i]} `,"")}),e.style.animationName=l?"enter":"exit",d.beginElement()}function ee(e,t=h.length){let n=Math.round(10*(t-e)/h.length);return Math.round(Math.log2(n))}function te(){return Math.ceil(g*Math.pow(2,z))}function ne(){let e=[],t=te();for(let n=0;n<h.length;n+=t)e.push(ie(h[n]));return e}function ie(e){let t=new Date(e).toString().slice(4,10);return"0"===t[4]?`${t.slice(0,4)}${t[5]}`:t}function le(e,t){e.forEach(e=>t(e,e[0]))}function de(e){return Math.max(...e)}function re(e="points"){return svgEl("animate",{attributeName:e,repeatCount:1,dur:"250ms",fill:"freeze",from:0,to:0})}function ae(e,t){return svgEl("polyline",{fill:"none",stroke:e,"stroke-width":t})}function se(e,t,n,i){return svgEl("line",{x1:e,y1:n,x2:t,y2:i,fill:"gray",stroke:"gray","stroke-width":.3})}function oe(e,t,n){let i=svgEl("text",{x:t,y:n});return i.textContent=e,i}le(I,(e,t)=>{let n=m.colors[t],i=ae(n,2.5),l=ae(n,1.5),d=svgEl("circle",{r:6,fill:"white",stroke:n,"stroke-width":2.5});d.style.animationName="exit",m.lines[t]={chart:i,preview:l,chartPoint:d},add(i,re()),add(l,re()),add(d,re("cy")),add(p,i),add(p,d),add(C,l)}),function(){let e=svgEl("g"),t=svgEl("g");addClass(e,"y-axes"),addClass(t,"y-axes","hidden"),p.insertBefore(e,p.firstChild),p.insertBefore(t,p.firstChild),p.insertBefore(function(){let e=svgEl("g"),t=se(10,r-10,o,o),n=oe("0",5,-o);return add(e,t),add(e,n),e}(),p.firstChild),n=e,i=t}(),W(!0),V(),T=_,j=X,on(v,"visibility-updated",({detail:e})=>{$=e,L=m.columns.filter(e=>$[e[0]]),_=R(L),X=F(L),le(L.length>I.length?L:I,(e,t)=>{let n=e.slice(1),i=$[t]?1:0;J(m.lines[t],n,i),G(m.lines[t],n,i)}),V(),y=$,T=_,j=X,I=L,q()}),on(v,"border-changed",({detail:{start:e,end:t}})=>{let n=ee(e,t);n!==z&&(z=n,console.log(z),H=ne(),function(e,t,n,i){let l=e!==t,d=n!==i,r=n>i,a=B;B=k,k=a,addClass(B,"pending"),removeClass(B,"hidden","right"),addClass(k,"hidden"),removeClass(k,"pending","right"),!d||r||l||addClass(k,"right")}(N,e,S,t)),N=e,S=t,O=K(),_=R(I),W(),V(),function(){Y(B);let e=te(),t=1;for(;(N+t)%e!=0;)t++;for(let n=t;n<O.length-1;n+=e){let t=oe(H[(N+n)/e],O[n],0);add(B,t)}}(),T=_,q()}),on(p,"click",e=>{let t=e.offsetX,n=O[1]/2,i=N+Math.max(0,O.findIndex(e=>e+n>t));i!==D&&(D=i,q())}),on(d,"click",e=>{v.contains(e.target)||(D=-1,q())})}let d=document;function el(e){return d.createElement(e)}function t(e){return d.createTextNode(e)}function svgEl(e,t){let n=d.createElementNS("http://www.w3.org/2000/svg",e);return svgAttrs(n,t),n}function svgAttrs(e,t={}){Object.entries(t).forEach(([t,n])=>{e.setAttributeNS(null,t,n)})}function addClass(e,...t){return e.classList.add(...t),e}function removeClass(e,...t){e.classList.remove(...t)}function add(e,t){e.appendChild(t)}function on(e,t,n){e.addEventListener(t,n)}function off(e,t,n){e.removeEventListener(t,n)}function emit(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n}))}function createSlider(e,t){let n,i=50,l=e.columns[0].slice(1),{slider:r,leftBar:a,rightBar:s}=function(){let e=addClass(el("div"),"slider"),t=addClass(el("div"),"slider__bar"),n=addClass(el("div"),"slider__bar","right");return add(e,t),add(e,n),{slider:e,leftBar:t,rightBar:n}}(),o=addClass(el("div"),"shadow","left"),c=addClass(el("div"),"shadow","right");on(t,"mousedown",p),on(t,"touchstart",p);let u,f,h,m=0,g=0,v={start:-1,end:-1};function p(e){let n=e.target,i=n===r?C:n===a||n===s?e=>(function(e,t){e.preventDefault();let n=w(e),i=h-n,l=t?Math.max(0,u-i):f,d=t?g:Math.max(0,m+i);y(l,d)&&(t?E(l):b(d),B())})(e,n===a):void 0;if(!i)return;h=w(e);let l=()=>{x(),off(t,"mousemove",i),off(t,"touchmove",i),off(d,"mouseup",l),off(d,"touchend",l)};on(t,"mousemove",i),on(t,"touchmove",i),on(d,"mouseup",l),on(d,"touchend",l)}function C(e){e.preventDefault();let t=w(e),n=h-t,i=u-n,l=m+n;y(i,l)&&(E(i),b(l),B())}function x(){y(f,g)&&(u=f,m=g)}function w(e){return e.touches?e.touches[0].clientX:e.clientX}function y(e,t){return e>=0&&t>=0&&n-e-t>=i}function E(e){f=e,M(o,e)}function b(e){g=e,M(c,e)}function M(e,t){e.style.width=`${t}px`}function B(){let e={start:Math.max(0,Math.floor(f*l.length/n)),end:Math.min(l.length-1,Math.round((n-g)*l.length/n))};v.start===e.start&&v.end===e.end||(v=e,emit(t,"border-changed",e))}requestAnimationFrame(()=>{n=r.parentElement.getBoundingClientRect().width,f=n-i,b(g),E(f),x(),B()});let k=addClass(el("div"),"slider-container");return add(k,o),add(k,r),add(k,c),k}(()=>{let e="Switch to Night Mode",t="Switch to Day Mode",n=!1,i=d.getElementById("mode-switcher");on(i,"click",function(){d.body.classList.toggle("dark"),n=!n,i.innerText=n?t:e}),i.innerText=e})();