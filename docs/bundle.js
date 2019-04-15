function createBarChart(e,t){let n=Math.min(400,window.innerWidth),l=350,a=n-20,o=50,i=.5,r=20,s=6,c=10*n/400,u=t.columns[0].slice(1),m={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},f=Math.round(u.length/c/6),h=svgEl("svg",{viewBox:`0 0 ${n} ${l+r}`}),g=createCanvas(n,l),{preview:v,previewContainer:x}=function(){let t=el("div","preview-container"),n=createCanvas(a,o);return add(t,n.canvas,createSlider(u,e)),{previewContainer:t,preview:n}}(),{selectedPointInfo:p,pointChartValues:C,pointDate:y}=createSelectedPointInfo(m),{xAxes:E,xAxesHidden:A}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:w,yAxesGroupHidden:D}=function(){let e=svgEl("g",{},"y-axes","text"),t=svgEl("g",{},"y-axes","text","hidden");return[e,t].forEach(e=>{for(let t=0;t<s;t++)add(e,j("",5,0))}),{yAxesGroupShown:e,yAxesGroupHidden:t}}(),B=el("div","charts");add(B,g.canvas,h,x,p),add(h,function(){let e=svgEl("g",{},"y-axes","lines"),t=Math.ceil(l/s);for(let a=0;a<s;a++){let o=createAxisLine(10,n-10,l-t*a,l-t*a);add(e,o)}return e}(),w,D,E,A),add(e,B);let M=0,b=u.length,L=-1,F=0,S=m.columns,T=H(),k=normalizeX(u,n),N=R(S),O=getMax(S.reduce((e,t)=>e.concat(t.data),[]));let P=W(M,b),z=function(e){let t={};for(;e>=0;){let n=[],a=$(e);for(let e=0;e<u.length;e+=a)n.push(j(toXLabel(u[e]),0,l+r-5));t[e]=n,e--}return t}(P),I=z[P],X=null;function G(){if(-1===L||L<M||L>b)return void(p.style.display="none");let e=u[L],t=n*(e-u[M])/(u[b]-u[M]);K(m.columns,(e,t)=>{C[t].value.style.color=getTooltipColor(m.colors[t]);let n=formatPointValue(e[L]);C[t].value.textContent!==n&&(C[t].value.textContent=n,applyAnimation(C[t].value,"date-change")),C[t].value.parentElement.style.display="flex"}),setSelectedPointDate(e,y);let l=t>n/2;p.style.transform="translateX("+(l?t-200:t+20)+"px)",p.style.display="block"}function R(e){return getMax(e.reduce((e,t)=>e.concat(t.data.slice(M,b+1)),[]))}function _(e=!1){K(S,(t,r)=>{!function(e,t){let a=customNormalize(t.slice(M,b+1),N,l),o=n/T.length;if(-1===L)return void V(getLineColor(e.color),T,a,o);if(L>=M&&L<=b)return V(getLineColor(e.color),T.slice(0,L-M),a.slice(0,L-M),o,i),V(getLineColor(e.color),T.slice(L-M+1),a.slice(L-M+1),o,i),void V(getLineColor(e.color),[T[L-M]],[a[L-M]],o);V(getLineColor(e.color),T,a,o,i)}(m.lines[r],t),e&&function(e,t,n){let l=customNormalize(t,O,o);i=e,r=k,s=l,drawBars(v,r,s,getLineColor(i.color),a/r.length);var i,r,s}(m.lines[r],t)})}function H(){return normalizeX(u.slice(M,b+1),n)}function V(e,t,n,l,a){drawBars(g,t,n,e,l,a)}function W(e,t){let n=Math.round(10*(t-e)/u.length);return Math.round(Math.log2(n))}function $(e){return Math.ceil(f*Math.pow(2,e))}function K(e,t){e.forEach(e=>t(e.data,e.name))}function j(e,t,n){let l=svgEl("text",{x:t,y:n,"font-size":13});return l.textContent=e,l}K(S,(e,t)=>{let n=m.colors[t];m.lines[t]={color:n}}),_(!0),on(e,"border-changed",({detail:{start:e,end:t}})=>{let a=W(e,t);if(a!==P&&(I=z[a],function(e,t,n,l,a,o){let i=a!==o;if(n===l||!i){let n=E;E=A,A=n,addClass(E,"pending",i?"right":"",t>e?"even":""),removeClass(E,i?"":"right",t>e?"":"even"),addClass(A,i?"right":""),removeClass(A,"even",t>e?"pending":"",i?"":"right"),setTimeout(()=>{removeClass(E,"hidden"),addClass(A,"hidden")},0)}}(P,a,M,e,b,t),P=a),clearCanvas(g),M=e,b=t,T=H(),N=R(S),_(),!X){let e=F;X=setTimeout(()=>{!function(e,t){if(t===e)return;let n=Math.ceil(t/s),a=Array.apply(null,Array(s)).map((e,t)=>t*n),o=customNormalize(a,t,l),i=D.childNodes;o.reverse().forEach((e,t)=>{let n=i[t];n.textContent=formatAxisValue(a[a.length-t-1]),svgAttrs(n,{x:5,y:l-e-5})}),removeClass(D,"m-down","m-up"),removeClass(w,"m-down","m-up"),addClass(D,t>e?"m-up":"m-down","pending"),addClass(w,t>e?"m-down":"m-up","pending");let r=D;D=w,w=r,setTimeout(()=>{removeClass(w,"hidden","pending"),removeClass(D,"pending"),addClass(D,"hidden")},0)}(e,N),X=null},250)}F=N,function(){clearChildren(E);let e=$(P),t=1;for(;(M+t)%e!=0;)t++;if((M+t)%(2*e)!=0){let l=(M+t-e)/(2*e),a=n*(u[l]-u[M])/(u[b]-u[M]),o=I[l];svgAttrs(o,{x:a}),add(E,o)}for(let n=t;n<T.length-1;n+=e){let t=I[(M+n)/e];svgAttrs(t,{x:T[n]}),add(E,t)}}(),G()}),on(h,"click",e=>{let t=n/T.length,l=M+Math.max(0,T.findIndex(n=>n+t>e.offsetX));l!==L&&(L=l,clearCanvas(g),_(),G())}),on(d,"click",t=>{if(!e.contains(t.target)){let e=-1;e!==L&&(L=e,clearCanvas(g),_(),G())}}),on(d,"mode-change",()=>{clearCanvas(g),clearCanvas(v),_(!0)})}function createBarStackedChart(e,t){let n=Math.min(400,window.innerWidth),l=350,a=n-20,o=50,i=150,r=.5,s=20,c=6,u=10*n/400,m=t.columns[0].slice(1),f={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},h=Math.round(m.length/u/6),g=svgEl("svg",{viewBox:`0 0 ${n} ${l+s}`}),v=createCanvas(n,l),{preview:x,previewContainer:p}=function(){let t=el("div","preview-container"),n=createCanvas(a,o);return add(t,n.canvas,createSlider(m,e)),{previewContainer:t,preview:n}}(),{buttons:C,visibilityMap:y}=createButtons(f,e),{selectedPointInfo:E,pointChartValues:A,pointDate:w,total:D}=createSelectedPointInfo(f,!0),{xAxes:B,xAxesHidden:M}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:b,yAxesGroupHidden:L}=function(){let e=svgEl("g",{},"y-axes","text"),t=svgEl("g",{},"y-axes","text","hidden");return[e,t].forEach(e=>{for(let t=0;t<c;t++)add(e,ue("",5,0))}),{yAxesGroupShown:e,yAxesGroupHidden:t}}(),F=el("div","charts");add(F,v.canvas,g,p,E),add(g,function(){let e=svgEl("g",{},"y-axes","lines"),t=Math.ceil(l/c);for(let a=0;a<c;a++){let o=l-t*a,i=createAxisLine(10,n-10,o,o);add(e,i)}return e}(),b,L,B,M),add(e,F,C);let S=0,T=m.length,k=-1,N=0,O=f.columns,P=oe(),z=normalizeX(m,n),I={},X=ee(O),G=Z(O),R=se(S,T),_=function(e){let t={};for(;e>=0;){let n=[],a=de(e);for(let e=0;e<m.length;e+=a)n.push(ue(toXLabel(m[e]),0,l+s-5));t[e]=n,e--}return t}(R),H=_[R],V=null,W={};ce(O,(e,t)=>{let n=f.colors[t];f.lines[t]={color:n}});let $,K=J(O);le(K);let j=G;function U(e,t){if(t===e)return;let n=Math.ceil(t/c),a=Array.apply(null,Array(c)).map((e,t)=>t*n),o=customNormalize(a,t,l),i=L.childNodes;o.reverse().forEach((e,t)=>{let n=i[t];n.textContent=formatAxisValue(a[a.length-t-1]),svgAttrs(n,{x:5,y:l-e-5})}),removeClass(L,"m-down","m-up"),removeClass(b,"m-down","m-up"),addClass(L,t>e?"m-up":"m-down","pending"),addClass(b,t>e?"m-down":"m-up","pending");let r=L;L=b,b=r,setTimeout(()=>{removeClass(b,"hidden","pending"),removeClass(L,"pending"),addClass(L,"hidden")},0)}function q(){if(-1===k||k<S||k>T)return void(E.style.display="none");let e=m[k],t=n*(e-m[S])/(m[T]-m[S]),l=0;ce(f.columns,(e,t)=>{l+=y[t]?e[k]:0,A[t].value.style.color=getTooltipColor(f.colors[t]);let n=formatPointValue(e[k]);A[t].value.textContent!==n&&(A[t].value.textContent=n,applyAnimation(A[t].value,"date-change")),A[t].value.parentElement.style.display=y[t]?"flex":"none"}),setSelectedPointDate(e,w),D.value.textContent=formatPointValue(l);let a=t>n/2;E.style.transform="translateX("+(a?t-200:t+20)+"px)",E.style.display="block"}function Y(e){let t=J(e),n={};return Object.keys(t).forEach(e=>{n[e]=t[e].slice(2*S,2*T+2)}),n}function J(e){let t=Q(e);if(W[t])return W[t];let n=function(e){let t=e.reduce((e,t)=>(e[t.name]=[],e),{});for(let n=0;n<m.length;n++)for(let l=0;l<e.length;l++){let a=e[l],o=e[l-1],i=o?t[o.name][2*n]+t[o.name][2*n+1]:0,r=a.data[n];t[a.name].push(i),t[a.name].push(r)}return t}(e);return W[t]=n,n}function Q(e){return e.reduce((e,t)=>e+t.name,"")}function Z(e){return getMax(te(e))}function ee(e){return getMax(te(e).slice(S,T+1))}function te(e){let t=Q(e);if(I[t])return I[t];let n=function(e){let t=[];for(let n=0;n<m.length;n++)t.push(e.reduce((e,t)=>e+t.data[n],0));return t}(e);return I[t]=n,n}function ne(e){ce(O,(t,n)=>{ae(f.lines[n],e[n],X)})}function le(e){ce(O,(t,n)=>{!function(e,t){let n=customNormalize(t,G,o);re(getLineColor(e.color),z,n)}(f.lines[n],e[n])})}function ae(e,t,a){let o=customNormalize(t,a,l);if(width=n/(o.length/2),-1!==k)return k>=S&&k<=T?(ie(getLineColor(e.color),P.slice(0,k-S),o.slice(0,2*k-2*S),width,r),ie(getLineColor(e.color),P.slice(k-S+1),o.slice(2*k-2*S+2),width,r),void ie(getLineColor(e.color),[P[k-S]],[o[2*k-2*S],o[2*k-2*S+1]],width)):void ie(getLineColor(e.color),P,o,width,r);ie(getLineColor(e.color),P,o,width)}function oe(){return normalizeX(m.slice(S,T+1),n)}function ie(e,t,n,l,a){drawStackedBars(v,t,n,e,l,a)}function re(e,t,n){drawStackedBars(x,t,n,e,a/t.length)}function se(e,t){let n=Math.round(10*(t-e)/m.length);return Math.round(Math.log2(n))}function de(e){return Math.ceil(h*Math.pow(2,e))}function ce(e,t){e.forEach(e=>t(e.data,e.name))}function ue(e,t,n){let l=svgEl("text",{x:t,y:n});return l.textContent=e,l}on(e,"visibility-updated",({detail:e})=>{y=e;let t=f.columns.filter(e=>y[e.name]),n=J(t);G=Z(t),X=ee(t),U(N,X),function(e,t,n,l,a,r,s,d){let c={},u=e.concat(t).filter(e=>{let t=c[e.name];return c[e.name]=!0,!t}).sort((e,t)=>e.name>t.name?-1:e.name===t.name?0:1);scheduleAnimation(e=>{clearCanvas(v),clearCanvas(x);for(let i=0;i<u.length;i++){let c=u[i].name,m=f.lines[c],h=!t.find(e=>e.name===c),g=!y[c],v=u[i+1],x=[];if(h){x=n[c].slice(0);for(let t=0;t<x.length-1;t+=2)x[t+1]=x[t+1]*e}else if(g){if(1===e)continue;let t=v?l[v.name]:null,a=v?n[v.name]:null;x=l[c].slice(0);for(let n=0;n<x.length-1;n+=2)x[n]=t&&a?t[n]+(a[n]-t[n])+t[n+1]+(a[n+1]-t[n+1])*e:x[n]-x[n]*e,x[n+1]=x[n+1]*(1-e)}else{x=n[c].slice(0);let t=l[c];for(let n=0;n<x.length-1;n+=2)x[n]=t[n]+(x[n]-t[n])*e,x[n+1]=t[n+1]+(x[n+1]-t[n+1])*e}ae(m,x.slice(2*S,2*T+2),d+(s-d)*e);let p=customNormalize(x,r+(a-r)*e,o);re(m.color,z,p)}},i)}(t,O,n,K,G,j,X,N),N=X,j=G,K=n,O=t,q()}),on(e,"border-changed",({detail:{start:e,end:t}})=>{let l=se(e,t);if(l!==R&&(H=_[l],function(e,t,n,l,a,o){let i=a!==o;if(n===l||!i){let n=B;B=M,M=n,addClass(B,"pending",i?"right":"",t>e?"even":""),removeClass(B,i?"":"right",t>e?"":"even"),addClass(M,i?"right":""),removeClass(M,"even",t>e?"pending":"",i?"":"right"),setTimeout(()=>{removeClass(B,"hidden"),addClass(M,"hidden")},0)}}(R,l,S,e,T,t),R=l),clearCanvas(v),S=e,T=t,P=oe(),X=ee(O),ne($=Y(O)),!V){let e=N;V=setTimeout(()=>{U(e,X),V=null},i)}N=X,function(){clearChildren(B);let e=de(R),t=1;for(;(S+t)%e!=0;)t++;if((S+t)%(2*e)!=0){let l=(S+t-e)/(2*e),a=n*(m[l]-m[S])/(m[T]-m[S]),o=H[l];svgAttrs(o,{x:a}),add(B,o)}for(let n=t;n<P.length-1;n+=e){let t=H[(S+n)/e];svgAttrs(t,{x:P[n]}),add(B,t)}}(),q()}),on(g,"click",e=>{let t=P[1]/2,n=S+Math.max(0,P.findIndex(n=>n+t>e.offsetX));n!==k&&(k=n,clearCanvas(v),ne($=Y(O)),q())}),on(d,"click",t=>{if(!e.contains(t.target)){let e=-1;e!==k&&(k=e,clearCanvas(v),ne($=Y(O)),q())}}),on(d,"mode-change",()=>{clearCanvas(v),clearCanvas(x),ne($),le(K)})}function createDoubleYLineChart(e,t){let n=Math.min(400,window.innerWidth),l=350,a=n-20,o=50,i=2,r=1,s=250,c=20,u=6,m=10*n/400,f=t.columns[0].slice(1),h={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},g=Math.round(f.length/m/6),v=svgEl("svg",{viewBox:`0 0 ${n} ${l+c}`}),x=createCanvas(n,l),{preview:p,previewContainer:C}=function(){let t=el("div","preview-container"),n=createCanvas(a,o);return add(t,n.canvas,createSlider(f,e)),{previewContainer:t,preview:n}}(),{buttons:y,visibilityMap:E}=createButtons(h,e),{selectedPointInfo:A,pointChartValues:w,pointDate:D}=createSelectedPointInfo(h),{xAxes:B,xAxesHidden:M}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:b,yAxesGroupHidden:L,yAxesRightGroupShown:F,yAxesRightGroupHidden:S}=function(){let e=svgEl("g",{},"y-axes"),n=svgEl("g",{},"y-axes","hidden");[e,n].forEach(e=>{for(let n=0;n<u;n++){let n=le("",5,0);svgAttrs(n,{fill:t.colors.y0}),add(e,n)}});let l=svgEl("g",{},"y-axes","m-right"),a=svgEl("g",{},"y-axes","m-right","hidden");return[l,a].forEach(e=>{for(let n=0;n<u;n++){let n=le("",5,0);svgAttrs(n,{fill:t.colors.y1}),add(e,n)}}),{yAxesGroupShown:e,yAxesGroupHidden:n,yAxesRightGroupShown:l,yAxesRightGroupHidden:a}}(),T=function(){let e=svgEl("g",{},"y-axes","lines"),t=Math.ceil(l/u);for(let a=0;a<u;a++){let o=createAxisLine(10,n-10,l-t*a,l-t*a);add(e,o)}return e}(),k=createAxisLine(0,0,0,l);addClass(k,"y-axes","lines");let N=el("div","charts");add(N,x.canvas,v,C,A),add(v,k,T,b,L,F,S,B,M),add(e,N,y);let O=0,P=f.length,z=-1,I=h.columns,X=J(),G=normalizeX(f,n),R={y0:{min:0,max:0},y1:{min:0,max:0}},_=U(I);I.forEach(e=>e.yMax={max:getMax(e.data),min:getMin(e.data)});let H=ee(O,P),V=function(e){let t={};for(;e>=0;){let n=[],a=te(e);for(let e=0;e<f.length;e+=a)n.push(le(toXLabel(f[e]),0,l+c-5));t[e]=n,e--}return t}(H),W=V[H],$=null;function K(e,t,a){ne(h.columns,(o,i)=>{let r="y1"===i,s=r?S:L,d=r?F:b;if(!E[i])return removeClass(d,"m-down"),void addClass(d,"hidden","m-up");if(e[i]&&t[i].max===e[i].max&&t[i].min===e[i].min&&a[i]&&E[i])return;let c=Math.ceil((t[i].max-t[i].min)/u),m=Array.apply(null,Array(u)).map((e,n)=>t[i].min+n*c),f=customNormalize(m,t[i].max,l,0,t[i].min).reverse(),h=L.childNodes,g=S.childNodes;if(f.forEach((e,t)=>{let a=r?g[t]:h[t];a.textContent=formatAxisValue(m[m.length-t-1]),svgAttrs(a,{x:r?n-7*(a.textContent.length+1):5,y:l-e-5})}),removeClass(s,"m-down","m-up"),removeClass(d,"m-down","m-up"),addClass(s,e[i]&&t[i].max>e[i].max?"m-up":"m-down","pending"),addClass(d,e[i]&&t[i].max>e[i].max?"m-down":"m-up","pending"),r){let e=S;S=F,F=e}else{L=b,b=s}setTimeout(()=>{removeClass(s,"hidden","pending"),removeClass(d,"pending"),addClass(d,"hidden")},0)})}function j(){if(-1===z||z<O||z>P)return k.style.display="none",A.style.display="none",void ne(h.columns,(e,t)=>{h.lines[t].chartPoint.style.animationName="exit"});let e=f[z],t=n*(e-f[O])/(f[P]-f[O]);svgAttrs(k,{x1:t,x2:t}),ne(h.columns,(e,n)=>{let a=customNormalize([e[z]],R[n].max,l,c,R[n].min)[0],o=h.lines[n].chartPoint;o.style.animationName=E[n]?"enter":"exit",svgAttrs(o,{cx:t});let i=o.firstChild;svgAttrs(i,{from:i.getAttribute("to"),to:a}),i.beginElement(),w[n].value.style.color=getTooltipColor(h.colors[n]);let r=formatPointValue(e[z]);w[n].value.textContent!==r&&(w[n].value.textContent=r,applyAnimation(w[n].value,"date-change")),w[n].value.parentElement.style.display=E[n]?"flex":"none"}),setSelectedPointDate(e,D);let a=t>n/2;A.style.transform="translateX("+(a?t-200:t+20)+"px)",A.style.display="block",k.style.display="block"}function U(e){return e.reduce((e,t)=>{let n=t.data.slice(O,P+1);return e[t.name]={max:getMax(n),min:getMin(n)},e},{})}function q(){ne(I,(e,t,n)=>{!function(e,t,n,l){let a=customNormalize(t,n.max,o,0,n.min);Z(e,G,a,l)}(h.lines[t],e,n.yMax)})}function Y(){ne(I,(e,t,n)=>{!function(e,t,n,a){let o=customNormalize(t.slice(O,P+1),n.max,l,0,n.min);Q(e,X,o,a)}(h.lines[t],e,_[t])})}function J(){return normalizeX(f.slice(O,P+1),n)}function Q(e,t,n,l=1){drawLine(x,t,n,getLineColor(e.color),l,i)}function Z(e,t,n,l=1){drawLine(p,t,n,getLineColor(e.color),l,r)}function ee(e,t){let n=Math.round(10*(t-e)/f.length);return Math.round(Math.log2(n))}function te(e){return Math.ceil(g*Math.pow(2,e))}function ne(e,t){e.forEach(e=>t(e.data,e.name,e))}function le(e,t,n){let l=svgEl("text",{x:t,y:n,"font-size":13});return l.textContent=e,l}ne(I,(e,t)=>{let n=h.colors[t],l=svgEl("circle",{r:6,fill:"white",stroke:n,"stroke-width":i});l.style.animationName="exit",h.lines[t]={chartPoint:l,color:n},add(l,function(e="points"){return svgEl("animate",{attributeName:e,repeatCount:1,dur:"250ms",fill:"freeze",from:0,to:0})}("cy")),add(v,l)}),q(),on(e,"visibility-updated",({detail:e})=>{let t=E;E=e;let n=h.columns.filter(e=>E[e.name]);_=U(h.columns),function(e,t,n){let a=e.length>=I.length?e:t;scheduleAnimation(e=>{clearCanvas(x),clearCanvas(p),ne(a,(a,i,r)=>{let s=h.lines[i],d=1,c=o,u=l,m=!t.find(e=>e.name===i),f=!E[i];if(m)d=Math.min(1,2*e),c*=1-e+1,u*=1-e+1;else if(f){if(1===e)return;d=Math.max(0,1-2*e),u+=u*e,c+=c*e}let g=a.slice(O,P+1),v=customNormalize(g,n[i].max,u,0,n[i].min);Q(s,X,v,d);let x=customNormalize(a,r.yMax.max,c,0,r.yMax.min);Z(s,G,x,d)})},s)}(n,I,_),K(R,_,t),R=_,I=n,j()}),on(e,"border-changed",({detail:{start:e,end:t}})=>{let l=ee(e,t);if(l!==H&&(W=V[l],function(e,t,n,l,a,o){let i=a!==o;if(n===l||!i){let n=B;B=M,M=n,addClass(B,"pending",i?"right":"",t>e?"even":""),removeClass(B,i?"":"right",t>e?"":"even"),addClass(M,i?"right":""),removeClass(M,"even",t>e?"pending":"",i?"":"right"),setTimeout(()=>{removeClass(B,"hidden"),addClass(M,"hidden")},0)}}(H,l,O,e,P,t),H=l),clearCanvas(x),O=e,P=t,X=J(),_=U(I),Y(),!$){let e=R;$=setTimeout(()=>{K(e,_,E),$=null},s)}R=_,function(){clearChildren(B);let e=te(H),t=1;for(;(O+t)%e!=0;)t++;if((O+t)%(2*e)!=0){let l=(O+t-e)/(2*e),a=n*(f[l]-f[O])/(f[P]-f[O]),o=W[l];svgAttrs(o,{x:a}),add(B,o)}for(let n=t;n<X.length-1;n+=e){let t=W[(O+n)/e];svgAttrs(t,{x:X[n]}),add(B,t)}}(),j()}),on(v,"click",e=>{let t=X[1]/2,n=O+Math.max(0,X.findIndex(n=>n+t>e.offsetX));n!==z&&(z=n,j())}),on(d,"click",t=>{if(!e.contains(t.target)){let e=-1;e!==z&&(z=e,j())}}),on(d,"mode-change",()=>{clearCanvas(x),clearCanvas(p),Y(),q()})}function createLineChart(e,t){let n=Math.min(400,window.innerWidth),l=350,a=n-20,o=50,i=2,r=1,s=250,c=20,u=6,m=10*n/400,f=t.columns[0].slice(1),h={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},g=Math.round(f.length/m/6),v=svgEl("svg",{viewBox:`0 0 ${n} ${l+c}`}),x=createCanvas(n,l),{preview:p,previewContainer:C}=function(){let t=el("div","preview-container"),n=createCanvas(a,o);return add(t,n.canvas,createSlider(f,e)),{previewContainer:t,preview:n}}(),{buttons:y,visibilityMap:E}=createButtons(h,e),{selectedPointInfo:A,pointChartValues:w,pointDate:D}=createSelectedPointInfo(h),{xAxes:B,xAxesHidden:M}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:b,yAxesGroupHidden:L}=function(){let e=svgEl("g",{},"y-axes","text"),t=svgEl("g",{},"y-axes","text","hidden");return[e,t].forEach(e=>{for(let t=0;t<u;t++)add(e,re("",5,0))}),{yAxesGroupShown:e,yAxesGroupHidden:t}}(),F=createAxisLine(0,0,0,l);addClass(F,"y-axes","lines");let S=el("div","charts");add(S,x.canvas,v,C,A),add(v,F,function(){let e=svgEl("g",{},"y-axes","lines"),t=Math.ceil(l/u);for(let a=0;a<u;a++){let o=createAxisLine(10,n-10,l-t*a,l-t*a);add(e,o)}return e}(),b,L,B,M),add(e,S,y);let T=0,k=f.length,N=-1,O=0,P=0,z=0,I=0,X=h.columns,G=te(),R=normalizeX(f,n),{max:_,min:H}=Q(X),{max:V,min:W}=J(X),$=ae(T,k),K=function(e){let t={};for(;e>=0;){let n=[],a=oe(e);for(let e=0;e<f.length;e+=a)n.push(re(toXLabel(f[e]),0,l+c-5));t[e]=n,e--}return t}($),j=K[$],U=null;function q(e,t,n,a){if(t===e&&n===a)return;let o=Math.ceil((t-a)/u),i=Array.apply(null,Array(u)).map((e,t)=>a+t*o),r=customNormalize(i,t,l,0,a),s=L.childNodes;r.reverse().forEach((e,t)=>{let n=s[t];n.textContent=formatAxisValue(i[i.length-t-1]),svgAttrs(n,{x:5,y:l-e-5})}),removeClass(L,"m-down","m-up"),removeClass(b,"m-down","m-up"),addClass(L,t>e?"m-up":"m-down","pending"),addClass(b,t>e?"m-down":"m-up","pending");let d=L;L=b,b=d,setTimeout(()=>{removeClass(b,"hidden","pending"),removeClass(L,"pending"),addClass(L,"hidden")},0)}function Y(){if(-1===N||N<T||N>k)return F.style.display="none",A.style.display="none",void ie(h.columns,(e,t)=>{h.lines[t].chartPoint.style.animationName="exit"});let e=f[N],t=n*(e-f[T])/(f[k]-f[T]);svgAttrs(F,{x1:t,x2:t}),ie(h.columns,(e,n)=>{let a=customNormalize([e[N]],P,l,c,O)[0],o=h.lines[n].chartPoint;o.style.animationName=E[n]?"enter":"exit",svgAttrs(o,{cx:t});let i=o.firstChild;svgAttrs(i,{from:i.getAttribute("to"),to:a}),i.beginElement(),w[n].value.style.color=getTooltipColor(h.colors[n]);let r=formatPointValue(e[N]);w[n].value.textContent!==r&&(w[n].value.textContent=r,applyAnimation(w[n].value,"date-change")),w[n].value.parentElement.style.display=E[n]?"flex":"none"}),setSelectedPointDate(e,D);let a=t>n/2;A.style.transform="translateX("+(a?t-200:t+20)+"px)",A.style.display="block",F.style.display="block"}function J(e){let t=e.reduce((e,t)=>e.concat(t.data),[]);return{max:getMax(t),min:getMin(t)}}function Q(e){let t=e.reduce((e,t)=>e.concat(t.data.slice(T,k+1)),[]);return{max:getMax(t),min:getMin(t)}}function Z(){ie(X,(e,t)=>{!function(e,t,n){let a=customNormalize(t.slice(T,k+1),_,l,0,H);ne(e,G,a,n)}(h.lines[t],e)})}function ee(){ie(X,(e,t)=>{!function(e,t,n){let l=customNormalize(t,V,o,0,W);le(e,R,l,n)}(h.lines[t],e)})}function te(){return normalizeX(f.slice(T,k+1),n)}function ne(e,t,n,l=1){drawLine(x,t,n,getLineColor(e.color),l,i)}function le(e,t,n,l=1){drawLine(p,t,n,getLineColor(e.color),l,r)}function ae(e,t){let n=Math.round(10*(t-e)/f.length);return Math.round(Math.log2(n))}function oe(e){return Math.ceil(g*Math.pow(2,e))}function ie(e,t){e.forEach(e=>t(e.data,e.name))}function re(e,t,n){let l=svgEl("text",{x:t,y:n,"font-size":13});return l.textContent=e,l}ie(X,(e,t)=>{let n=h.colors[t],l=svgEl("circle",{r:6,fill:"white",stroke:n,"stroke-width":i});l.style.animationName="exit",h.lines[t]={chartPoint:l,color:n},add(l,function(e="points"){return svgEl("animate",{attributeName:e,repeatCount:1,dur:"250ms",fill:"freeze",from:0,to:0})}("cy")),add(v,l)}),ee(),I=V,z=W,on(e,"visibility-updated",({detail:e})=>{E=e;let t=h.columns.filter(e=>E[e.name]),{max:n,min:a}=Q(t),{max:i,min:r}=J(t);!function(e,t,n,a,o,i){let r=n-a,d=o-i,c=e.length>=X.length?e:t;scheduleAnimation(e=>{clearCanvas(x),ie(c,(n,o)=>{let s=h.lines[o],c=1;if(t.find(e=>e.name===o)){if(!E[o]){if(1===e)return;c=Math.max(0,1-2*e)}}else c=Math.min(1,2*e);let u=n.slice(T,k+1),m=customNormalize(u,a+r*e,l,0,i+d*e);ne(s,G,m,c)})},s)}(t,X,n,P,a,O),function(e,t,n,l,a,i){let r=n-l,d=a-i,c=e.length>=X.length?e:t;scheduleAnimation(e=>{clearCanvas(p),ie(c,(n,a)=>{let s=h.lines[a],c=1;if(t.find(e=>e.name===a)){if(!E[a]){if(1===e)return;c=Math.max(0,1-2*e)}}else c=Math.min(1,2*e);let u=customNormalize(n,l+r*e,o,0,i+d*e);le(s,R,u,c)})},s)}(t,X,i,I,r,z),q(P,n,O,a),P=n,O=a,I=i,z=r,X=t,Y()}),on(e,"border-changed",({detail:{start:e,end:t}})=>{let l=ae(e,t);l!==$&&(j=K[l],function(e,t,n,l,a,o){let i=a!==o;if(n===l||!i){let n=B;B=M,M=n,addClass(B,"pending",i?"right":"",t>e?"even":""),removeClass(B,i?"":"right",t>e?"":"even"),addClass(M,i?"right":""),removeClass(M,"even",t>e?"pending":"",i?"":"right"),setTimeout(()=>{removeClass(B,"hidden"),addClass(M,"hidden")},0)}}($,l,T,e,k,t),$=l),clearCanvas(x),T=e,k=t,G=te();let a=Q(X);if(H=a.min,_=a.max,Z(),!U){let e=P,t=O;U=setTimeout(()=>{q(e,_,t,H),U=null},s)}P=_,O=H,function(){clearChildren(B);let e=oe($),t=1;for(;(T+t)%e!=0;)t++;if((T+t)%(2*e)!=0){let l=(T+t-e)/(2*e),a=n*(f[l]-f[T])/(f[k]-f[T]),o=j[l];svgAttrs(o,{x:a}),add(B,o)}for(let n=t;n<G.length-1;n+=e){let t=j[(T+n)/e];svgAttrs(t,{x:G[n]}),add(B,t)}}(),Y()}),on(v,"click",e=>{let t=G[1]/2,n=T+Math.max(0,G.findIndex(n=>n+t>e.offsetX));n!==N&&(N=n,Y())}),on(d,"click",t=>{if(!e.contains(t.target)){let e=-1;e!==N&&(N=e,Y())}}),on(d,"mode-change",()=>{clearCanvas(x),clearCanvas(p),Z(),ee()})}function createPercentageStackedAreaChart(e,t){let n=Math.min(400,window.innerWidth),l=350,a=20,o=n-20,i=50,r=150,s=20,c=5,u=10*n/400,m=t.columns[0].slice(1),f={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},h=Math.round(m.length/u/6),g=svgEl("svg",{viewBox:`0 0 ${n} ${l+s}`}),v=createCanvas(n,l),{preview:x,previewContainer:p}=function(){let t=el("div","preview-container"),n=createCanvas(o,i);return add(t,n.canvas,createSlider(m,e)),{previewContainer:t,preview:n}}(),{buttons:C,visibilityMap:y}=createButtons(f,e),{selectedPointInfo:E,pointChartValues:A,pointDate:w}=createSelectedPointInfo(f),{xAxes:D,xAxesHidden:B}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:M,yAxesGroupHidden:b}=function(){let e=svgEl("g",{},"y-axes","text","m-up");e.style.opacity="0";for(let t=0;t<c;t++){let t=Y("",5,0);add(e,t)}return{yAxesGroupHidden:e}}(),L=createAxisLine(0,0,0,l);addClass(L,"y-axes","lines");let F=el("div","charts");add(F,v.canvas,g,p,E),add(g,L,function(){let e=svgEl("g",{},"y-axes","lines"),t=Math.ceil((l-a)/(c-1));for(let a=0;a<c;a++){let o=l-t*a,i=createAxisLine(10,n-10,o,o);add(e,i)}return e}(),M,b,D,B),add(e,F,C);let S=0,T=m.length,k=-1,N=f.columns,O=K(),P=normalizeX(m,n),z=j(S,T),I=function(e){let t={};for(;e>=0;){let n=[],a=U(e);for(let e=0;e<m.length;e+=a)n.push(Y(toXLabel(m[e]),0,l+s-5));t[e]=n,e--}return t}(z),X=I[z];q(N,(e,t)=>{let n=f.colors[t];f.lines[t]={color:n}});let G=_(N);function R(){if(-1===k||k<S||k>T)return L.style.display="none",void(E.style.display="none");let e=m[k],t=n*(e-m[S])/(m[T]-m[S]);svgAttrs(L,{x1:t,x2:t});let l=f.columns.reduce((e,t)=>e+(y[t.name]?t.data[k]:0),0);q(f.columns,(e,t)=>{A[t].subValue.innerText=Math.round(e[k]/l*100)+"%",A[t].value.style.color=getTooltipColor(f.colors[t]);let n=formatPointValue(e[k]);A[t].value.textContent!==n&&(A[t].value.textContent=n,applyAnimation(A[t].value,"date-change")),A[t].value.parentElement.style.display=y[t]?"flex":"none"}),setSelectedPointDate(e,w);let a=t>n/2;E.style.transform="translateX("+(a?t-200:t+20)+"px)",E.style.display="block",L.style.display="block"}function _(e){let t=e.reduce((e,t)=>(e[t.name]=[],e),{});for(let n=0;n<m.length;n++){let l=e.reduce((e,t)=>e+t.data[n],0);for(let a=0;a<e.length;a++){let o=e[a],i=e[a-1],r=e[a+1],s=i?t[i.name][2*n+1]:0,d=r?s+o.data[n]/l:1;t[o.name].push(s),t[o.name].push(d)}}return t}function H(e){q(N,(t,n)=>{$(f.lines[n],e[n])})}function V(e){q(N,(t,n)=>{W(f.lines[n],e[n])})}function W(e,t){let n=customNormalize(t,1,i);!function(e,t,n){drawStackedArea(x,t,n,getLineColor(e.color))}(e,P,n)}function $(e,t){let n=customNormalize(t.slice(2*S,2*T+2),1,l-a);drawStackedArea(v,O,n,getLineColor(e.color))}function K(){return normalizeX(m.slice(S,T+1),n)}function j(e,t){let n=Math.round(10*(t-e)/m.length);return Math.round(Math.log2(n))}function U(e){return Math.ceil(h*Math.pow(2,e))}function q(e,t){e.forEach(e=>t(e.data,e.name))}function Y(e,t,n){let l=svgEl("text",{x:t,y:n,"font-size":13});return l.textContent=e,l}V(G),function(){let e=Math.ceil(100/(c-1)),t=Array.apply(null,Array(c)).map((t,n)=>n*e),n=customNormalize(t,100,l-a).reverse(),o=b.childNodes;n.forEach((e,n)=>{let a=o[n];a.textContent=formatAxisValue(t[t.length-n-1]),svgAttrs(a,{x:5,y:l-e-5})}),b.style.transition="0s",addClass(b,"m-up");let i=b;b=M,M=i,setTimeout(()=>{M.style.transition=null,M.style.opacity=null},0)}(),on(e,"visibility-updated",({detail:e})=>{y=e;let t=f.columns.filter(e=>y[e.name]),n=_(t);!function(e,t,n,l){let a={},o=e.concat(t).filter(e=>{let t=a[e.name];return a[e.name]=!0,!t}).sort((e,t)=>e.name>t.name?1:e.name===t.name?0:-1);scheduleAnimation(e=>{clearCanvas(v),clearCanvas(x);for(let a=0;a<o.length;a++){let i=o[a].name,r=f.lines[i],s=!t.find(e=>e.name===i),d=!y[i],c=o[a-1],u=o[a+1],m=[];if(s){let t=c?n[c.name]:null,a=c?l[c.name]:null,o=u?n[u.name]:null,r=u?l[u.name]:null;m=n[i].slice(0);for(let n=0;n<m.length-1;n+=2)m[n]=t?a[n+1]+(t[n+1]-a[n+1])*e:a?a[n+1]*(1-e):0,m[n+1]=o?r[n]+(o[n]-r[n])*e:a&&!t?1:t?1:e}else if(d){if(1===e)continue;let t=c?n[c.name]:null,a=c?l[c.name]:null,o=u?n[u.name]:null,r=u?l[u.name]:null;m=l[i].slice(0);for(let n=0;n<m.length-1;n+=2)m[n]=a&&t?a[n+1]+(t[n+1]-a[n+1])*e:t?t[n+1]*e:o?m[n]*(1-e):m[n]+(1-m[n])*e,m[n+1]=r&&o?r[n]+(o[n]-(r[n]||1))*e:o?1-e:1}else{m=n[i].slice(0);let t=l[i];for(let n=0;n<m.length-1;n+=2)m[n]=t[n]+(m[n]-t[n])*e,m[n+1]=t[n+1]+(m[n+1]-t[n+1])*e}$(r,m),W(r,m)}},r)}(t,N,n,G),G=n,N=t,R()}),on(e,"border-changed",({detail:{start:e,end:t}})=>{let l=j(e,t);l!==z&&(X=I[l],function(e,t,n,l,a,o){let i=a!==o;if(n===l||!i){let n=D;D=B,B=n,addClass(D,"pending",i?"right":"",t>e?"even":""),removeClass(D,i?"":"right",t>e?"":"even"),addClass(B,i?"right":""),removeClass(B,"even",t>e?"pending":"",i?"":"right"),setTimeout(()=>{removeClass(D,"hidden"),addClass(B,"hidden")},0)}}(z,l,S,e,T,t),z=l),clearCanvas(v),S=e,T=t,O=K(),H(G),function(){clearChildren(D);let e=U(z),t=1;for(;(S+t)%e!=0;)t++;if((S+t)%(2*e)!=0){let l=(S+t-e)/(2*e),a=n*(m[l]-m[S])/(m[T]-m[S]),o=X[l];svgAttrs(o,{x:a}),add(D,o),add(D,o)}for(let n=t;n<O.length-1;n+=e){let t=X[(S+n)/e];svgAttrs(t,{x:O[n]}),add(D,t)}}(),R()}),on(g,"click",e=>{let t=O[1]/2,n=S+Math.max(0,O.findIndex(n=>n+t>e.offsetX));n!==k&&(k=n,R())}),on(d,"click",t=>{if(!e.contains(t.target)){let e=-1;e!==k&&(k=e,R())}}),on(d,"mode-change",()=>{clearCanvas(v),clearCanvas(x),H(G),V(G)})}function scheduleAnimation(e,t){let n=performance.now();requestAnimationFrame(function l(a){let o=Math.min(1,Math.max(0,a-n)/t);o<1&&requestAnimationFrame(l),e(o)})}function createCanvas(e,t){let n=el("canvas");n.width=e,n.height=t;let l=n.getContext("2d");return l.setTransform(1,0,0,-1,0,t),{canvas:n,context:l}}function clearCanvas(e){e.context.clearRect(0,0,e.canvas.width,e.canvas.height)}function drawLine(e,t,n,l,a=1,o=1){e.context.beginPath(),e.context.globalAlpha=a,e.context.strokeStyle=l,e.context.lineWidth=o,e.context.moveTo(t[0],n[0]);for(let l=1;l<t.length;l++)e.context.lineTo(t[l],n[l]);e.context.stroke()}function drawBars(e,t,n,l,a,o=1){e.context.beginPath(),a=Math.ceil(a),e.context.fillStyle=l,e.context.globalAlpha=o,e.context.moveTo(t[0],0),e.context.lineTo(t[t.length-1]+a,0);for(let l=t.length-1;l>=0;l--){let o=Math.round(n[l]);e.context.lineTo(t[l]+a,o),e.context.lineTo(t[l],o)}e.context.fill()}function drawStackedArea(e,t,n,l){e.context.beginPath(),e.context.fillStyle=l,e.context.moveTo(t[0],n[0]);for(let l=1;l<t.length;l++)e.context.lineTo(t[l],n[2*l]);for(let l=t.length-1;l>=0;l--)e.context.lineTo(t[l],n[2*l+1]);e.context.fill()}function drawStackedBars(e,t,n,l,a,o=1){e.context.beginPath(),a=Math.ceil(a),e.context.fillStyle=l,e.context.globalAlpha=o;for(let l=0;l<t.length;l++)e.context.rect(t[l],n[2*l],a,n[2*l+1]);e.context.fill()}function createSelectedPointInfo(e,n){let l=el("div","point-info"),a=el("div","charts-info"),o=el("div"),i=el("div"),r=el("div"),s=el("div"),d=el("div");add(o,i,t(","),s,r,d),add(l,o,a);let c,u=Object.entries(e.names).reduce((e,[n,l])=>{let o=el("div","info"),i=el("span"),r=el("span"),s=el("span","name");return add(s,t(l)),add(o,r,s,i),add(a,o),e[n]={value:i,subValue:r},e},{});if(n){let e=el("div","info"),n=el("span");c=el("span");let l=el("span","name");add(l,t("All")),add(e,n,l,c),add(a,e)}return{selectedPointInfo:l,pointChartValues:u,pointDate:{dOW:i,month:r,day:s,year:d},total:{value:c}}}function createAxisLine(e,t,n,l){return svgEl("line",{x1:e,y1:n,x2:t,y2:l,"stroke-width":1})}let xLabelDateFormat=new Intl.DateTimeFormat("en-US",{day:"numeric",month:"short"});function toXLabel(e){return xLabelDateFormat.format(new Date(e))}let selectedPointDateFormat=new Intl.DateTimeFormat("en-GB",{month:"short",weekday:"short"});function formatSelectedPointData(e){let t=new Date(e),n=selectedPointDateFormat.format(t);return{month:n.slice(-4,-1),year:t.getFullYear(),day:t.getDate(),dOW:n.slice(0,3)}}function setSelectedPointDate(e,t){let n=formatSelectedPointData(e);n.year!==+t.year.textContent&&(t.year.textContent=n.year,applyAnimation(t.year,"date-change")),n.month!==t.month.textContent&&(t.month.textContent=n.month,applyAnimation(t.month,"date-change")),n.day!==+t.day.textContent&&(t.day.textContent=n.day,applyAnimation(t.day,"date-change")),n.dOW!==t.dOW.textContent&&(t.dOW.textContent=n.dOW,applyAnimation(t.dOW,"date-change"))}function getLineColor(e){return isDark?LINE_DARK_COLORS[e]:LINE_COLORS[e]}function getButtonColor(e){return isDark?BUTTON_DARK_COLORS[e]:BUTTON_COLORS[e]}function getTooltipColor(e){return isDark?TOOLTIP_DARK_COLORS[e]:TOOLTIP_COLORS[e]}const BUTTON_COLORS={"#FE3C30":"#E65850","#4BD964":"#5FB641","#108BE3":"#3497ED","#E8AF14":"#F5BD25","#3497ED":"#3497ED","#2373DB":"#3381E8","#9ED448":"#9ED448","#5FB641":"#5FB641","#F5BD25":"#F5BD25","#F79E39":"#F79E39","#E65850":"#E65850"},BUTTON_DARK_COLORS={"#FE3C30":"#CF5D57","#4BD964":"#5AB34D","#108BE3":"#4681BB","#E8AF14":"#C9AF4F","#3497ED":"#4681BB","#2373DB":"#466FB3","#9ED448":"#88BA52","#5FB641":"#3DA05A","#F5BD25":"#F5BD25","#F79E39":"#D49548","#E65850":"#CF5D57"},TOOLTIP_COLORS={"#FE3C30":"#F34C44","#4BD964":"#3CC23F","#108BE3":"#108BE3","#E8AF14":"#E4AE1B","#64ADED":"#3896E8","#3497ED":"#108BE3","#2373DB":"#2373DB","#9ED448":"#89C32E","#5FB641":"#4BAB29","#F5BD25":"#EAAF10","#F79E39":"#F58608","#E65850":"#F34C44"},TOOLTIP_DARK_COLORS={"#FE3C30":"#F7655E","#4BD964":"#4BD964","#108BE3":"#108BE3","#E8AF14":"#DEB93F","#64ADED":"#4082CE","#3497ED":"#5199DF","#2373DB":"#3E65CF","#9ED448":"#99CF60","#5FB641":"#3CB560","#F5BD25":"#DBB630","#F79E39":"#EE9D39","#E65850":"#F7655E"},LINE_COLORS={"#FE3C30":"#FE3C30","#4BD964":"#4BD964","#108BE3":"#108BE3","#E8AF14":"#E8AF14","#64ADED":"#64ADED","#3497ED":"#3497ED","#2373DB":"#2373DB","#9ED448":"#9ED448","#5FB641":"#5FB641","#F5BD25":"#F5BD25","#F79E39":"#F79E39","#E65850":"#E65850"},LINE_DARK_COLORS={"#FE3C30":"#E6574F","#4BD964":"#4BD964","#108BE3":"#108BE3","#E8AF14":"#DEB93F","#64ADED":"#4082CE","#3497ED":"#4681BB","#2373DB":"#345B9C","#9ED448":"#88BA52","#5FB641":"#3DA05A","#F5BD25":"#D9B856","#F79E39":"#D49548","#E65850":"#CF5D57"};function isTouchDevice(){return"ontouchstart"in d.documentElement}let d=document;function el(e,...t){return addClass(d.createElement(e),...t)}function t(e){return d.createTextNode(e)}function svgEl(e,t,...n){let l=d.createElementNS("http://www.w3.org/2000/svg",e);return svgAttrs(l,t),addClass(l,...n)}function svgAttrs(e,t={}){Object.entries(t).forEach(([t,n])=>{e.setAttributeNS(null,t,n)})}function addClass(e,...t){return e.classList.add(...t.filter(e=>e)),e}function removeClass(e,...t){e.classList.remove(...t.filter(e=>e))}function add(e,...t){t.filter(e=>!!e).forEach(t=>e.appendChild(t))}function on(e,t,n){e.addEventListener(t,n)}function off(e,t,n){e.removeEventListener(t,n)}function emit(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n}))}function applyAnimation(e,t,n=250){e.style.animationName=t,setTimeout(()=>{e.style.animationName=null},n)}function clearChildren(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function normalizeX(e,t){let n=e[0],l=e[e.length-1],a=Math.abs(l-n);return e.map(e=>Math.ceil(t*(e-n)/a))}function customNormalize(e,t,n,l=0,a=0){let o=e.slice(0);for(let i=0;i<e.length;i++)o[i]=Math.ceil(t?n*(o[i]-a)/(t-a)+l:l);return o}function getMax(e){let t=e[0];for(let n=1;n<e.length;n++)t=e[n]>t?e[n]:t;return t}function getMin(e){let t=e[0];for(let n=1;n<e.length;n++)t=e[n]<t?e[n]:t;return t}function formatAxisValue(e){return e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(1)+"K":e}function formatPointValue(e){let t="",n=e.toString();for(let e=0;e<n.length/3;e++)t=n.slice(Math.max(0,n.length-3*e-3),n.length-3*e)+" "+t;return t}function createButtons(e,n){let l=300,a=null,o=[],i=el("div","buttons");on(i,isTouchDevice()?"touchstart":"mousedown",function(e){let t=e.target.dataset.chart;if(!t)return;on(i,isTouchDevice()?"touchend":"mouseup",c),a=setTimeout(()=>{!function(e){a=null,r={[e]:!0},[...i.childNodes].forEach(e=>r[e.dataset.chart]?removeClass(e,"m-hidden"):addClass(e,"m-hidden")),emit(n,"visibility-updated",r)}(t)},l)}),on(d,"mode-change",()=>{o.forEach(s)});let r=Object.keys(e.names).reduce((e,t)=>({...e,[t]:!0}),{});function s(e){const t=getButtonColor([e.color]);e.button.style.borderColor=t,e.div.style.background=t,e.span.style.color=t}function c(e){off(i,isTouchDevice()?"touchend":"mouseup",c),a&&(clearTimeout(a),a=null,function(e){let t=e.target,l=t.dataset.chart;if(!l)return;let a={...r,[l]:!r[l]};if(!Object.values(a).some(e=>e))return void applyAnimation(t,"shake",800);e.target.classList.toggle("m-hidden"),emit(n,"visibility-updated",r=a)}(e))}return Object.keys(e.names).forEach(n=>{let l=el("button"),a=el("div"),r=el("span");o.push({button:l,div:a,span:r,color:e.colors[n]}),s({button:l,div:a,span:r,color:e.colors[n]}),add(l,a);let d=svgEl("svg",{width:"18",height:"18",viewBox:"0 0 24 24"});add(d,svgEl("path",{d:"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"})),add(r,t(e.names[n])),add(l,d,r),l.dataset.chart=n,add(i,l)}),{buttons:i,visibilityMap:r}}function createChart(e,n){let l=d.getElementById("charts-container"),a=el("div","chart-wrapper"),o=el("div","chart-info"),i=el("h1"),r=el("div","selected-range"),s=el("div","range-from"),c=el("span","range-to");add(r,s,t(" - "),c),add(i,t("Chart #"+n)),add(o,i,r),add(a,o),e.y_scaled?createDoubleYLineChart(a,e):"bar"!==e.types.y0||e.stacked?"area"===e.types.y0?(addClass(a,"bar-chart"),createPercentageStackedAreaChart(a,e)):"bar"===e.types.y0&&e.stacked?(addClass(a,"bar-chart"),createBarStackedChart(a,e)):createLineChart(a,e):(addClass(a,"bar-chart"),createBarChart(a,e)),add(l,a);let u=null,m=e.columns[0].slice(1),f=-1,h=-1,g=-1,v=-1;on(a,"border-changed",({detail:{start:e,end:t}})=>{g=e,v=t,u||(u=setTimeout(()=>{u=null,g!==f&&(f=g,s.textContent=p(m[f]),applyAnimation(s,"date-change")),v!==h&&(h=v,c.textContent=p(m[h]),applyAnimation(c,"date-change"))},250))});let x=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric"});function p(e){return x.format(new Date(e))}}let isDark=!1;function createSlider(e,t){let n,l=50,{slider:a,leftBar:o,rightBar:i}=function(){let e=el("div","slider"),t=el("div","slider__bar","left"),n=el("div","slider__bar","right");return{slider:e,leftBar:t,rightBar:n}}(),r=el("div","shadow","left"),s=el("div","shadow","right");on(t,"mousedown",v),on(t,"touchstart",v);let c,u,m,f=0,h=0,g={start:-1,end:-1};function v(e){let n=e.target,l=n===a?x:n===o||n===i?e=>(function(e,t){e.preventDefault();let n=C(e),l=m-n,a=t?Math.max(0,c-l):u,o=t?h:Math.max(0,f+l);y(a,o)&&(t?E(a):A(o),D())})(e,n===o):void 0;if(!l)return;m=C(e);let r=()=>{p(),off(t,"mousemove",l),off(t,"touchmove",l),off(d,"mouseup",r),off(d,"touchend",r)};on(t,"mousemove",l),on(t,"touchmove",l),on(d,"mouseup",r),on(d,"touchend",r)}function x(e){e.preventDefault();let t=C(e),n=m-t,l=c-n,a=f+n;y(l,a)&&(E(l),A(a),D())}function p(){y(u,h)&&(c=u,f=h)}function C(e){return e.touches?e.touches[0].clientX:e.clientX}function y(e,t){return e>=0&&t>=0&&n-e-t>=l}function E(e){u=e,w(r,e)}function A(e){h=e,w(s,e)}function w(e,t){e.style.width=`${t}px`}function D(){let l={start:Math.max(0,Math.round(u*e.length/n)),end:Math.min(e.length-1,Math.round((n-h)*(e.length-1)/n))};g.start===l.start&&g.end===l.end||(g=l,emit(t,"border-changed",l))}requestAnimationFrame(()=>{n=a.parentElement.getBoundingClientRect().width,u=n-l,A(h),E(u),p(),D()});let B=el("div","slider-container");return add(B,r,o,a,i,s),B}(()=>{let e="Switch to Night Mode",t="Switch to Day Mode",n=d.getElementById("mode-switcher");on(n,"click",function(){d.body.classList.toggle("dark"),isDark=!isDark,n.innerText=isDark?t:e,emit(d,"mode-change",{isDark:isDark})}),n.innerText=e})();