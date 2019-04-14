function createBarChart(e,t){let n=Math.min(400,window.innerWidth),l=350,a=n-20,i=50,o=20,r=6,s=10*n/400,c=t.columns[0].slice(1),u={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},m=Math.round(c.length/s/6),f=svgEl("svg",{viewBox:`0 0 ${n} ${l+o}`}),h=createCanvas(n,l),{preview:g,previewContainer:v}=function(){let t=el("div","preview-container"),n=createCanvas(a,i);return add(t,n,createSlider(c,e)),{previewContainer:t,preview:n}}(),{selectedPointInfo:x,pointChartValues:p,pointDate:C}=createSelectedPointInfo(u),{xAxes:y,xAxesHidden:E}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:A,yAxesGroupHidden:w}=function(){let e=svgEl("g",{},"y-axes","text"),t=svgEl("g",{},"y-axes","text","hidden");return[e,t].forEach(e=>{for(let t=0;t<r;t++)add(e,j("",5,0))}),{yAxesGroupShown:e,yAxesGroupHidden:t}}(),M=el("div","charts");add(M,h,f,v,x),add(f,function(){let e=svgEl("g",{},"y-axes","lines"),t=Math.ceil(l/r);for(let a=0;a<r;a++){let i=createAxisLine(10,n-10,l-t*a,l-t*a);add(e,i)}return e}(),A,w,y,E),add(e,M);let D=0,B=c.length,b=-1,L=0,F=u.columns,T=H(),S=V(c,n),k=R(F),N=getMax(F.reduce((e,t)=>e.concat(t.data),[]));let O=$(D,B),P=function(e){let t={};for(;e>=0;){let n=[],l=K(e);for(let e=0;e<c.length;e+=l)n.push(toXLabel(c[e]));t[e]=n,e--}return t}(O),z=P[O],I=null;function G(){if(-1===b||b<D||b>B)return void(x.style.display="none");let e=c[b],t=n*(e-c[D])/(c[B]-c[D]);W(u.columns,(e,t)=>{p[t].value.style.color=getTooltipColor(u.colors[t]),p[t].value.innerText=formatPointValue(e[b]),p[t].value.parentElement.style.display="flex"}),C.innerText=new Date(e).toString().slice(0,15);let l=t>n/2;x.style.transform="translateX("+(l?t-200:t+20)+"px)",x.style.display="block"}function R(e){return getMax(e.reduce((e,t)=>e.concat(t.data.slice(D,B+1)),[]))}function _(e=!1){W(F,(t,o)=>{!function(e,t){let a=customNormalize(t.slice(D,B+1),k,l),i=n/T.length;if(-1===b)return void X(getLineColor(e.color),T,a,i);if(b>=D&&b<=B)return X("#8cbef5",T.slice(0,b-D),a.slice(0,b-D),i),X("#8cbef5",T.slice(b-D+1),a.slice(b-D+1),i),void X("#558DED",[T[b-D]],[a[b-D]],i);X("#8cbef5",T,a,i)}(u.lines[o],t),e&&function(e,t,n){let l=customNormalize(t,N,i);o=e,r=S,s=l,drawBars(g,r,s,getLineColor(o.color),a/r.length);var o,r,s}(u.lines[o],t)})}function H(){return V(c.slice(D,B+1),n)}function V(e,t){let n=e[0],l=e[e.length-1],a=Math.abs(l-n);return e.map(e=>t*(e-n)/a)}function X(e,t,n,l){drawBars(h,t,n,e,l)}function $(e,t){let n=Math.round(10*(t-e)/c.length);return Math.round(Math.log2(n))}function K(e){return Math.ceil(m*Math.pow(2,e))}function W(e,t){e.forEach(e=>t(e.data,e.name))}function j(e,t,n){let l=svgEl("text",{x:t,y:n,"font-size":13});return l.textContent=e,l}W(F,(e,t)=>{let n=u.colors[t];u.lines[t]={color:n}}),_(!0),on(e,"border-changed",({detail:{start:e,end:t}})=>{let a=$(e,t);if(a!==O&&(z=P[a],function(e,t,n,l,a,i){let o=a!==i;if(n===l||!o){let n=y;y=E,E=n,addClass(y,"pending",o?"right":"",t>e?"even":""),removeClass(y,o?"":"right",t>e?"":"even"),addClass(E,o?"right":""),removeClass(E,"even",t>e?"pending":"",o?"":"right"),setTimeout(()=>{removeClass(y,"hidden"),addClass(E,"hidden")},0)}}(O,a,D,e,B,t),O=a),clearCanvas(h),D=e,B=t,T=H(),k=R(F),_(),!I){let e=L;I=setTimeout(()=>{!function(e,t){if(t===e)return;let n=Math.ceil(t/r),a=Array.apply(null,Array(r)).map((e,t)=>t*n),i=customNormalize(a,t,l),o=w.childNodes;i.reverse().forEach((e,t)=>{let n=o[t];n.textContent=formatAxisValue(a[a.length-t-1]),svgAttrs(n,{x:5,y:l-e-5})}),removeClass(w,"m-down","m-up"),removeClass(A,"m-down","m-up"),addClass(w,t>e?"m-up":"m-down","pending"),addClass(A,t>e?"m-down":"m-up","pending");let s=w;w=A,A=s,setTimeout(()=>{removeClass(A,"hidden","pending"),removeClass(w,"pending"),addClass(w,"hidden")},0)}(e,k),I=null},250)}L=k,function(){clearChildren(y);let e=K(O),t=1;for(;(D+t)%e!=0;)t++;if((D+t)%(2*e)!=0){let a=(D+t-e)/(2*e),i=n*(c[a]-c[D])/(c[B]-c[D]),r=j(z[a],i,l+o-5);add(y,r)}for(let n=t;n<T.length-1;n+=e){let t=j(z[(D+n)/e],T[n],l+o-5);add(y,t)}}(),G()}),on(f,"click",e=>{let t=n/T.length,l=D+Math.max(0,T.findIndex(n=>n+t>e.offsetX));l!==b&&(b=l,clearCanvas(h),_(),G())}),on(d,"click",t=>{if(!e.contains(t.target)){let e=-1;e!==b&&(b=e,clearCanvas(h),_(),G())}}),on(d,"mode-change",()=>{clearCanvas(h),clearCanvas(g),_(!0)})}function createBarStackedChart(e,t){let n=Math.min(400,window.innerWidth),l=350,a=n-20,i=50,o=150,r=.5,s=20,c=6,u=10*n/400,m=t.columns[0].slice(1),f={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},h=Math.round(m.length/u/6),g=svgEl("svg",{viewBox:`0 0 ${n} ${l+s}`}),v=createCanvas(n,l),{preview:x,previewContainer:p}=function(){let t=el("div","preview-container"),n=createCanvas(a,i);return add(t,n,createSlider(m,e)),{previewContainer:t,preview:n}}(),{buttons:C,visibilityMap:y}=createButtons(f,e),{selectedPointInfo:E,pointChartValues:A,pointDate:w,total:M}=createSelectedPointInfo(f,!0),{xAxes:D,xAxesHidden:B}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:b,yAxesGroupHidden:L}=function(){let e=svgEl("g",{},"y-axes","text"),t=svgEl("g",{},"y-axes","text","hidden");return[e,t].forEach(e=>{for(let t=0;t<c;t++)add(e,se("",5,0))}),{yAxesGroupShown:e,yAxesGroupHidden:t}}(),F=el("div","charts");add(F,v,g,p,E),add(g,function(){let e=svgEl("g",{},"y-axes","lines"),t=Math.ceil(l/c);for(let a=0;a<c;a++){let i=l-t*a,o=createAxisLine(10,n-10,i,i);add(e,o)}return e}(),b,L,D,B),add(e,F,C);let T=0,S=m.length,k=-1,N=0,O=f.columns,P=te(),z=ne(m,n),I=J(O),G=Y(O),R=ie(T,S),_=function(e){let t={};for(;e>=0;){let n=[],l=oe(e);for(let e=0;e<m.length;e+=l)n.push(toXLabel(m[e]));t[e]=n,e--}return t}(R),H=_[R],V=null;re(O,(e,t)=>{let n=f.colors[t];f.lines[t]={color:n}});let X,$=q(O);Z($);let K=G;function W(e,t){if(t===e)return;let n=Math.ceil(t/c),a=Array.apply(null,Array(c)).map((e,t)=>t*n),i=customNormalize(a,t,l),o=L.childNodes;i.reverse().forEach((e,t)=>{let n=o[t];n.textContent=formatAxisValue(a[a.length-t-1]),svgAttrs(n,{x:5,y:l-e-5})}),removeClass(L,"m-down","m-up"),removeClass(b,"m-down","m-up"),addClass(L,t>e?"m-up":"m-down","pending"),addClass(b,t>e?"m-down":"m-up","pending");let r=L;L=b,b=r,setTimeout(()=>{removeClass(b,"hidden","pending"),removeClass(L,"pending"),addClass(L,"hidden")},0)}function j(){if(-1===k||k<T||k>S)return void(E.style.display="none");let e=m[k],t=n*(e-m[T])/(m[S]-m[T]),l=0;re(f.columns,(e,t)=>{l+=e[k],A[t].value.style.color=getTooltipColor(f.colors[t]),A[t].value.textContent=formatPointValue(e[k]),A[t].value.parentElement.style.display=y[t]?"flex":"none"}),M.value.textContent=formatPointValue(l),w.textContent=new Date(e).toString().slice(0,15);let a=t>n/2;E.style.transform="translateX("+(a?t-200:t+20)+"px)",E.style.display="block"}function U(e){let t=e.reduce((e,t)=>(e[t.name]=[],e),{});for(let n=T;n<S+1;n++)for(let l=0;l<e.length;l++){let a=e[l],i=e[l-1],o=i?t[i.name][2*(n-T)]+t[i.name][2*(n-T)+1]:0,r=a.data[n];t[a.name].push(o),t[a.name].push(r)}return t}function q(e){let t=e.reduce((e,t)=>(e[t.name]=[],e),{});for(let n=0;n<m.length;n++)for(let l=0;l<e.length;l++){let a=e[l],i=e[l-1],o=i?t[i.name][2*n]+t[i.name][2*n+1]:0,r=a.data[n];t[a.name].push(o),t[a.name].push(r)}return t}function Y(e){let t=[];for(let n=0;n<m.length;n++)t.push(e.reduce((e,t)=>e+t.data[n],0));return getMax(t)}function J(e){let t=[];for(let n=T;n<S+1;n++)t.push(e.reduce((e,t)=>e+t.data[n],0));return getMax(t)}function Q(e){re(O,(t,n)=>{ee(f.lines[n],e[n],I)})}function Z(e){re(O,(t,n)=>{!function(e,t){let n=customNormalize(t,G,i);ae(getLineColor(e.color),z,n)}(f.lines[n],e[n])})}function ee(e,t,a){let i=customNormalize(t,a,l);if(width=n/(i.length/2),-1!==k)return k>=T&&k<=S?(le(getLineColor(e.color),P.slice(0,k-T),i.slice(0,2*k-2*T),width,r),le(getLineColor(e.color),P.slice(k-T+1),i.slice(2*k-2*T+2),width,r),void le(getLineColor(e.color),[P[k-T]],[i[2*k-2*T],i[2*k-2*T+1]],width)):void le(getLineColor(e.color),P,i,width,r);le(getLineColor(e.color),P,i,width)}function te(){return ne(m.slice(T,S+1),n)}function ne(e,t){let n=e[0],l=e[e.length-1],a=Math.abs(l-n);return e.map(e=>t*(e-n)/a)}function le(e,t,n,l,a){drawStackedBars(v,t,n,e,l,a)}function ae(e,t,n){drawStackedBars(x,t,n,e,a/t.length)}function ie(e,t){let n=Math.round(10*(t-e)/m.length);return Math.round(Math.log2(n))}function oe(e){return Math.ceil(h*Math.pow(2,e))}function re(e,t){e.forEach(e=>t(e.data,e.name))}function se(e,t,n){let l=svgEl("text",{x:t,y:n,"font-size":13});return l.textContent=e,l}on(e,"visibility-updated",({detail:e})=>{y=e;let t=f.columns.filter(e=>y[e.name]),n=q(t);I=J(t),W(N,I),G=Y(t),function(e,t,n,l,a,r){let s={},d=e.concat(t).filter(e=>{let t=s[e.name];return s[e.name]=!0,!t}).sort((e,t)=>e.name>t.name?-1:e.name===t.name?0:1);scheduleAnimation(e=>{clearCanvas(v),clearCanvas(x);for(let o=0;o<d.length;o++){let s=d[o].name,c=f.lines[s],u=!t.find(e=>e.name===s),m=!y[s],h=[];if(u){h=n[s].slice(0);for(let t=0;t<h.length-1;t+=2)h[t+1]=h[t+1]*e}else if(m){if(1===e)continue;h=l[s].slice(0);for(let t=0;t<h.length-1;t+=2)h[t]=h[t]-h[t]*e,h[t+1]=h[t+1]*(1-e)}else{h=n[s].slice(0);let t=l[s];for(let n=0;n<h.length-1;n+=2)h[n]=t[n]+(h[n]-t[n])*e,h[n+1]=t[n+1]+(h[n+1]-t[n+1])*e}ee(c,h.slice(2*T,2*S+2),r+(a-r)*e);let g=customNormalize(h,r+(a-r)*e,i);ae(c.color,z,g)}},o)}(t,O,n,$,G,K),N=I,K=G,$=n,O=t,j()}),on(e,"border-changed",({detail:{start:e,end:t}})=>{let a=ie(e,t);if(a!==R&&(H=_[a],function(e,t,n,l,a,i){let o=a!==i;if(n===l||!o){let n=D;D=B,B=n,addClass(D,"pending",o?"right":"",t>e?"even":""),removeClass(D,o?"":"right",t>e?"":"even"),addClass(B,o?"right":""),removeClass(B,"even",t>e?"pending":"",o?"":"right"),setTimeout(()=>{removeClass(D,"hidden"),addClass(B,"hidden")},0)}}(R,a,T,e,S,t),R=a),clearCanvas(v),T=e,S=t,P=te(),I=J(O),Q(X=U(O)),!V){let e=N;V=setTimeout(()=>{W(e,I),V=null},o)}N=I,function(){clearChildren(D);let e=oe(R),t=1;for(;(T+t)%e!=0;)t++;if((T+t)%(2*e)!=0){let a=(T+t-e)/(2*e),i=n*(m[a]-m[T])/(m[S]-m[T]),o=se(H[a],i,l+s-5);add(D,o)}for(let n=t;n<P.length-1;n+=e){let t=se(H[(T+n)/e],P[n],l+s-5);add(D,t)}}(),j()}),on(g,"click",e=>{let t=P[1]/2,n=T+Math.max(0,P.findIndex(n=>n+t>e.offsetX));n!==k&&(k=n,clearCanvas(v),Q(X=U(O)),j())}),on(d,"click",t=>{if(!e.contains(t.target)){let e=-1;e!==k&&(k=e,clearCanvas(v),Q(X=U(O)),j())}}),on(d,"mode-change",()=>{clearCanvas(v),clearCanvas(x),Q(X),Z($)})}function createDoubleYLineChart(e,t){let n=Math.min(400,window.innerWidth),l=350,a=n-20,i=50,o=2,r=1,s=250,c=20,u=6,m=10*n/400,f=t.columns[0].slice(1),h={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},g=Math.round(f.length/m/6),v=svgEl("svg",{viewBox:`0 0 ${n} ${l+c}`}),x=createCanvas(n,l),{preview:p,previewContainer:C}=function(){let t=el("div","preview-container"),n=createCanvas(a,i);return add(t,n,createSlider(f,e)),{previewContainer:t,preview:n}}(),{buttons:y,visibilityMap:E}=createButtons(h,e),{selectedPointInfo:A,pointChartValues:w,pointDate:M}=createSelectedPointInfo(h),{xAxes:D,xAxesHidden:B}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:b,yAxesGroupHidden:L,yAxesRightGroupShown:F,yAxesRightGroupHidden:T}=function(){let e=svgEl("g",{},"y-axes"),n=svgEl("g",{},"y-axes","hidden");[e,n].forEach(e=>{for(let n=0;n<u;n++){let n=ae("",5,0);svgAttrs(n,{fill:t.colors.y0}),add(e,n)}});let l=svgEl("g",{},"y-axes","m-right"),a=svgEl("g",{},"y-axes","m-right","hidden");return[l,a].forEach(e=>{for(let n=0;n<u;n++){let n=ae("",5,0);svgAttrs(n,{fill:t.colors.y1}),add(e,n)}}),{yAxesGroupShown:e,yAxesGroupHidden:n,yAxesRightGroupShown:l,yAxesRightGroupHidden:a}}(),S=function(){let e=svgEl("g",{},"y-axes","lines"),t=Math.ceil(l/u);for(let a=0;a<u;a++){let i=createAxisLine(10,n-10,l-t*a,l-t*a);add(e,i)}return e}(),k=createAxisLine(0,0,0,l);addClass(k,"y-axes","lines");let N=el("div","charts");add(N,x,v,C,A),add(v,k,S,b,L,F,T,D,B),add(e,N,y);let O=0,P=f.length,z=-1,I=h.columns,G=J(),R=Q(f,n),_={y0:{min:0,max:0},y1:{min:0,max:0}},H=U(I);I.forEach(e=>e.yMax={max:getMax(e.data),min:getMin(e.data)});let V=te(O,P),X=function(e){let t={};for(;e>=0;){let n=[],l=ne(e);for(let e=0;e<f.length;e+=l)n.push(toXLabel(f[e]));t[e]=n,e--}return t}(V),$=X[V],K=null;function W(e,t,a){le(h.columns,(i,o)=>{let r="y1"===o,s=r?T:L,d=r?F:b;if(!E[o])return removeClass(d,"m-down"),void addClass(d,"hidden","m-up");if(e[o]&&t[o].max===e[o].max&&t[o].min===e[o].min&&a[o]&&E[o])return;let c=Math.ceil((t[o].max-t[o].min)/u),m=Array.apply(null,Array(u)).map((e,n)=>t[o].min+n*c),f=customNormalize(m,t[o].max,l,0,t[o].min).reverse(),h=L.childNodes,g=T.childNodes;if(f.forEach((e,t)=>{let a=r?g[t]:h[t];a.textContent=formatAxisValue(m[m.length-t-1]),svgAttrs(a,{x:r?n-7*(a.textContent.length+1):5,y:l-e-5})}),removeClass(s,"m-down","m-up"),removeClass(d,"m-down","m-up"),addClass(s,e[o]&&t[o].max>e[o].max?"m-up":"m-down","pending"),addClass(d,e[o]&&t[o].max>e[o].max?"m-down":"m-up","pending"),r){let e=T;T=F,F=e}else{L=b,b=s}setTimeout(()=>{removeClass(s,"hidden","pending"),removeClass(d,"pending"),addClass(d,"hidden")},0)})}function j(){if(-1===z||z<O||z>P)return k.style.display="none",A.style.display="none",void le(h.columns,(e,t)=>{h.lines[t].chartPoint.style.animationName="exit"});let e=f[z],t=n*(e-f[O])/(f[P]-f[O]);svgAttrs(k,{x1:t,x2:t}),le(h.columns,(e,n)=>{let a=customNormalize([e[z]],_[n].max,l,c,_[n].min)[0],i=h.lines[n].chartPoint;i.style.animationName=E[n]?"enter":"exit",svgAttrs(i,{cx:t});let o=i.firstChild;svgAttrs(o,{from:o.getAttribute("to"),to:a}),o.beginElement(),w[n].value.style.color=getTooltipColor(h.colors[n]),w[n].value.innerText=formatPointValue(e[z]),w[n].value.parentElement.style.display=E[n]?"flex":"none"}),M.innerText=new Date(e).toString().slice(0,15);let a=t>n/2;A.style.transform="translateX("+(a?t-200:t+20)+"px)",A.style.display="block",k.style.display="block"}function U(e){return e.reduce((e,t)=>{let n=t.data.slice(O,P+1);return e[t.name]={max:getMax(n),min:getMin(n)},e},{})}function q(){le(I,(e,t,n)=>{!function(e,t,n,l){let a=customNormalize(t,n.max,i,0,n.min);ee(e,R,a,l)}(h.lines[t],e,n.yMax)})}function Y(){le(I,(e,t,n)=>{!function(e,t,n,a){let i=customNormalize(t.slice(O,P+1),n.max,l,0,n.min);Z(e,G,i,a)}(h.lines[t],e,H[t])})}function J(){return Q(f.slice(O,P+1),n)}function Q(e,t){let n=e[0],l=e[e.length-1],a=Math.abs(l-n);return e.map(e=>t*(e-n)/a)}function Z(e,t,n,l=1){drawLine(x,t,n,getLineColor(e.color),l,o)}function ee(e,t,n,l=1){drawLine(p,t,n,getLineColor(e.color),l,r)}function te(e,t){let n=Math.round(10*(t-e)/f.length);return Math.round(Math.log2(n))}function ne(e){return Math.ceil(g*Math.pow(2,e))}function le(e,t){e.forEach(e=>t(e.data,e.name,e))}function ae(e,t,n){let l=svgEl("text",{x:t,y:n,"font-size":13});return l.textContent=e,l}le(I,(e,t)=>{let n=h.colors[t],l=svgEl("circle",{r:6,fill:"white",stroke:n,"stroke-width":o});l.style.animationName="exit",h.lines[t]={chartPoint:l,color:n},add(l,function(e="points"){return svgEl("animate",{attributeName:e,repeatCount:1,dur:"250ms",fill:"freeze",from:0,to:0})}("cy")),add(v,l)}),q(),on(e,"visibility-updated",({detail:e})=>{let t=E;E=e;let n=h.columns.filter(e=>E[e.name]);H=U(h.columns),function(e,t,n){let a=e.length>=I.length?e:t;scheduleAnimation(e=>{clearCanvas(x),clearCanvas(p),le(a,(a,o,r)=>{let s=h.lines[o],d=1,c=i,u=l,m=!t.find(e=>e.name===o),f=!E[o];if(m)d=Math.min(1,2*e),c*=1-e+1,u*=1-e+1;else if(f){if(1===e)return;d=Math.max(0,1-2*e),u+=u*e,c+=c*e}let g=a.slice(O,P+1),v=customNormalize(g,n[o].max,u,0,n[o].min);Z(s,G,v,d);let x=customNormalize(a,r.yMax.max,c,0,r.yMax.min);ee(s,R,x,d)})},s)}(n,I,H),W(_,H,t),_=H,I=n,j()}),on(e,"border-changed",({detail:{start:e,end:t}})=>{let a=te(e,t);if(a!==V&&($=X[a],function(e,t,n,l,a,i){let o=a!==i;if(n===l||!o){let n=D;D=B,B=n,addClass(D,"pending",o?"right":"",t>e?"even":""),removeClass(D,o?"":"right",t>e?"":"even"),addClass(B,o?"right":""),removeClass(B,"even",t>e?"pending":"",o?"":"right"),setTimeout(()=>{removeClass(D,"hidden"),addClass(B,"hidden")},0)}}(V,a,O,e,P,t),V=a),clearCanvas(x),O=e,P=t,G=J(),H=U(I),Y(),!K){let e=_;K=setTimeout(()=>{W(e,H,E),K=null},s)}_=H,function(){clearChildren(D);let e=ne(V),t=1;for(;(O+t)%e!=0;)t++;if((O+t)%(2*e)!=0){let a=(O+t-e)/(2*e),i=n*(f[a]-f[O])/(f[P]-f[O]),o=ae($[a],i,l+c-5);add(D,o)}for(let n=t;n<G.length-1;n+=e){let t=ae($[(O+n)/e],G[n],l+c-5);add(D,t)}}(),j()}),on(v,"click",e=>{let t=G[1]/2,n=O+Math.max(0,G.findIndex(n=>n+t>e.offsetX));n!==z&&(z=n,j())}),on(d,"click",t=>{if(!e.contains(t.target)){let e=-1;e!==z&&(z=e,j())}}),on(d,"mode-change",()=>{clearCanvas(x),clearCanvas(p),Y(),q()})}function createLineChart(e,t){let n=Math.min(400,window.innerWidth),l=350,a=n-20,i=50,o=2,r=1,s=250,c=20,u=6,m=10*n/400,f=t.columns[0].slice(1),h={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},g=Math.round(f.length/m/6),v=svgEl("svg",{viewBox:`0 0 ${n} ${l+c}`}),x=createCanvas(n,l),{preview:p,previewContainer:C}=function(){let t=el("div","preview-container"),n=createCanvas(a,i);return add(t,n,createSlider(f,e)),{previewContainer:t,preview:n}}(),{buttons:y,visibilityMap:E}=createButtons(h,e),{selectedPointInfo:A,pointChartValues:w,pointDate:M}=createSelectedPointInfo(h),{xAxes:D,xAxesHidden:B}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:b,yAxesGroupHidden:L}=function(){let e=svgEl("g",{},"y-axes","text"),t=svgEl("g",{},"y-axes","text","hidden");return[e,t].forEach(e=>{for(let t=0;t<u;t++)add(e,se("",5,0))}),{yAxesGroupShown:e,yAxesGroupHidden:t}}(),F=createAxisLine(0,0,0,l);addClass(F,"y-axes","lines");let T=el("div","charts");add(T,x,v,C,A),add(v,F,function(){let e=svgEl("g",{},"y-axes","lines"),t=Math.ceil(l/u);for(let a=0;a<u;a++){let i=createAxisLine(10,n-10,l-t*a,l-t*a);add(e,i)}return e}(),b,L,D,B),add(e,T,y);let S=0,k=f.length,N=-1,O=0,P=0,z=0,I=0,G=h.columns,R=te(),_=ne(f,n),{max:H,min:V}=Q(G),{max:X,min:$}=J(G),K=ie(S,k),W=function(e){let t={};for(;e>=0;){let n=[],l=oe(e);for(let e=0;e<f.length;e+=l)n.push(toXLabel(f[e]));t[e]=n,e--}return t}(K),j=W[K],U=null;function q(e,t,n,a){if(t===e&&n===a)return;let i=Math.ceil((t-a)/u),o=Array.apply(null,Array(u)).map((e,t)=>a+t*i),r=customNormalize(o,t,l,0,a),s=L.childNodes;r.reverse().forEach((e,t)=>{let n=s[t];n.textContent=formatAxisValue(o[o.length-t-1]),svgAttrs(n,{x:5,y:l-e-5})}),removeClass(L,"m-down","m-up"),removeClass(b,"m-down","m-up"),addClass(L,t>e?"m-up":"m-down","pending"),addClass(b,t>e?"m-down":"m-up","pending");let d=L;L=b,b=d,setTimeout(()=>{removeClass(b,"hidden","pending"),removeClass(L,"pending"),addClass(L,"hidden")},0)}function Y(){if(-1===N||N<S||N>k)return F.style.display="none",A.style.display="none",void re(h.columns,(e,t)=>{h.lines[t].chartPoint.style.animationName="exit"});let e=f[N],t=n*(e-f[S])/(f[k]-f[S]);svgAttrs(F,{x1:t,x2:t}),re(h.columns,(e,n)=>{let a=customNormalize([e[N]],P,l,c,O)[0],i=h.lines[n].chartPoint;i.style.animationName=E[n]?"enter":"exit",svgAttrs(i,{cx:t});let o=i.firstChild;svgAttrs(o,{from:o.getAttribute("to"),to:a}),o.beginElement(),w[n].value.style.color=getTooltipColor(h.colors[n]),w[n].value.innerText=formatPointValue(e[N]),w[n].value.parentElement.style.display=E[n]?"flex":"none"}),M.innerText=new Date(e).toString().slice(0,15);let a=t>n/2;A.style.transform="translateX("+(a?t-200:t+20)+"px)",A.style.display="block",F.style.display="block"}function J(e){let t=e.reduce((e,t)=>e.concat(t.data),[]);return{max:getMax(t),min:getMin(t)}}function Q(e){let t=e.reduce((e,t)=>e.concat(t.data.slice(S,k+1)),[]);return{max:getMax(t),min:getMin(t)}}function Z(){re(G,(e,t)=>{!function(e,t,n){let a=customNormalize(t.slice(S,k+1),H,l,0,V);le(e,R,a,n)}(h.lines[t],e)})}function ee(){re(G,(e,t)=>{!function(e,t,n){let l=customNormalize(t,X,i,0,$);ae(e,_,l,n)}(h.lines[t],e)})}function te(){return ne(f.slice(S,k+1),n)}function ne(e,t){let n=e[0],l=e[e.length-1],a=Math.abs(l-n);return e.map(e=>t*(e-n)/a)}function le(e,t,n,l=1){drawLine(x,t,n,getLineColor(e.color),l,o)}function ae(e,t,n,l=1){drawLine(p,t,n,getLineColor(e.color),l,r)}function ie(e,t){let n=Math.round(10*(t-e)/f.length);return Math.round(Math.log2(n))}function oe(e){return Math.ceil(g*Math.pow(2,e))}function re(e,t){e.forEach(e=>t(e.data,e.name))}function se(e,t,n){let l=svgEl("text",{x:t,y:n,"font-size":13});return l.textContent=e,l}re(G,(e,t)=>{let n=h.colors[t],l=svgEl("circle",{r:6,fill:"white",stroke:n,"stroke-width":o});l.style.animationName="exit",h.lines[t]={chartPoint:l,color:n},add(l,function(e="points"){return svgEl("animate",{attributeName:e,repeatCount:1,dur:"250ms",fill:"freeze",from:0,to:0})}("cy")),add(v,l)}),ee(),I=X,z=$,on(e,"visibility-updated",({detail:e})=>{E=e;let t=h.columns.filter(e=>E[e.name]),{max:n,min:a}=Q(t),{max:o,min:r}=J(t);!function(e,t,n,a,i,o){let r=n-a,d=i-o,c=e.length>=G.length?e:t;scheduleAnimation(e=>{clearCanvas(x),re(c,(n,i)=>{let s=h.lines[i],c=1;if(t.find(e=>e.name===i)){if(!E[i]){if(1===e)return;c=Math.max(0,1-2*e)}}else c=Math.min(1,2*e);let u=n.slice(S,k+1),m=customNormalize(u,a+r*e,l,0,o+d*e);le(s,R,m,c)})},s)}(t,G,n,P,a,O),function(e,t,n,l,a,o){let r=n-l,d=a-o,c=e.length>=G.length?e:t;scheduleAnimation(e=>{clearCanvas(p),re(c,(n,a)=>{let s=h.lines[a],c=1;if(t.find(e=>e.name===a)){if(!E[a]){if(1===e)return;c=Math.max(0,1-2*e)}}else c=Math.min(1,2*e);let u=customNormalize(n,l+r*e,i,0,o+d*e);ae(s,_,u,c)})},s)}(t,G,o,I,r,z),q(P,n,O,a),P=n,O=a,I=o,z=r,G=t,Y()}),on(e,"border-changed",({detail:{start:e,end:t}})=>{let a=ie(e,t);a!==K&&(j=W[a],function(e,t,n,l,a,i){let o=a!==i;if(n===l||!o){let n=D;D=B,B=n,addClass(D,"pending",o?"right":"",t>e?"even":""),removeClass(D,o?"":"right",t>e?"":"even"),addClass(B,o?"right":""),removeClass(B,"even",t>e?"pending":"",o?"":"right"),setTimeout(()=>{removeClass(D,"hidden"),addClass(B,"hidden")},0)}}(K,a,S,e,k,t),K=a),clearCanvas(x),S=e,k=t,R=te();let i=Q(G);if(V=i.min,H=i.max,Z(),!U){let e=P,t=O;U=setTimeout(()=>{q(e,H,t,V),U=null},s)}P=H,O=V,function(){clearChildren(D);let e=oe(K),t=1;for(;(S+t)%e!=0;)t++;if((S+t)%(2*e)!=0){let a=(S+t-e)/(2*e),i=n*(f[a]-f[S])/(f[k]-f[S]),o=se(j[a],i,l+c-5);add(D,o)}for(let n=t;n<R.length-1;n+=e){let t=se(j[(S+n)/e],R[n],l+c-5);add(D,t)}}(),Y()}),on(v,"click",e=>{let t=R[1]/2,n=S+Math.max(0,R.findIndex(n=>n+t>e.offsetX));n!==N&&(N=n,Y())}),on(d,"click",t=>{if(!e.contains(t.target)){let e=-1;e!==N&&(N=e,Y())}}),on(d,"mode-change",()=>{clearCanvas(x),clearCanvas(p),Z(),ee()})}function createPercentageStackedAreaChart(e,t){let n=Math.min(400,window.innerWidth),l=350,a=20,i=n-20,o=50,r=150,s=20,c=5,u=10*n/400,m=t.columns[0].slice(1),f={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},h=Math.round(m.length/u/6),g=svgEl("svg",{viewBox:`0 0 ${n} ${l+s}`}),v=createCanvas(n,l),{preview:x,previewContainer:p}=function(){let t=el("div","preview-container"),n=createCanvas(i,o);return add(t,n,createSlider(m,e)),{previewContainer:t,preview:n}}(),{buttons:C,visibilityMap:y}=createButtons(f,e),{selectedPointInfo:E,pointChartValues:A,pointDate:w}=createSelectedPointInfo(f),{xAxes:M,xAxesHidden:D}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:B,yAxesGroupHidden:b}=function(){let e=svgEl("g",{},"y-axes","text","m-up");e.style.opacity="0";for(let t=0;t<c;t++){let t=J("",5,0);add(e,t)}return{yAxesGroupHidden:e}}(),L=createAxisLine(0,0,0,l);addClass(L,"y-axes","lines");let F=el("div","charts");add(F,v,g,p,E),add(g,L,function(){let e=svgEl("g",{},"y-axes","lines"),t=Math.ceil((l-a)/(c-1));for(let a=0;a<c;a++){let i=l-t*a,o=createAxisLine(10,n-10,i,i);add(e,o)}return e}(),B,b,M,D),add(e,F,C);let T=0,S=m.length,k=-1,N=f.columns,O=W(),P=j(m,n),z=U(T,S),I=function(e){let t={};for(;e>=0;){let n=[],l=q(e);for(let e=0;e<m.length;e+=l)n.push(toXLabel(m[e]));t[e]=n,e--}return t}(z),G=I[z];Y(N,(e,t)=>{let n=f.colors[t];f.lines[t]={color:n}});let R=H(N);function _(){if(-1===k||k<T||k>S)return L.style.display="none",void(E.style.display="none");let e=m[k],t=n*(e-m[T])/(m[S]-m[T]);svgAttrs(L,{x1:t,x2:t});let l=f.columns.reduce((e,t)=>e+(y[t.name]?t.data[k]:0),0);Y(f.columns,(e,t)=>{A[t].subValue.innerText=Math.round(e[k]/l*100)+"%",A[t].value.style.color=getTooltipColor(f.colors[t]),A[t].value.innerText=formatPointValue(e[k]),A[t].value.parentElement.style.display=y[t]?"flex":"none"}),w.innerText=new Date(e).toString().slice(0,15);let a=t>n/2;E.style.transform="translateX("+(a?t-200:t+20)+"px)",E.style.display="block",L.style.display="block"}function H(e){let t=e.reduce((e,t)=>(e[t.name]=[],e),{});for(let n=0;n<m.length;n++){let l=e.reduce((e,t)=>e+t.data[n],0);for(let a=0;a<e.length;a++){let i=e[a],o=e[a-1],r=e[a+1],s=o?t[o.name][2*n+1]:0,d=r?s+i.data[n]/l:1;t[i.name].push(s),t[i.name].push(d)}}return t}function V(e){Y(N,(t,n)=>{K(f.lines[n],e[n])})}function X(e){Y(N,(t,n)=>{$(f.lines[n],e[n])})}function $(e,t){let n=customNormalize(t,1,o);!function(e,t,n){drawStackedArea(x,t,n,getLineColor(e.color))}(e,P,n)}function K(e,t){let n=customNormalize(t.slice(2*T,2*S+2),1,l-a);drawStackedArea(v,O,n,getLineColor(e.color))}function W(){return j(m.slice(T,S+1),n)}function j(e,t){let n=e[0],l=e[e.length-1],a=Math.abs(l-n);return e.map(e=>t*(e-n)/a)}function U(e,t){let n=Math.round(10*(t-e)/m.length);return Math.round(Math.log2(n))}function q(e){return Math.ceil(h*Math.pow(2,e))}function Y(e,t){e.forEach(e=>t(e.data,e.name))}function J(e,t,n){let l=svgEl("text",{x:t,y:n,"font-size":13});return l.textContent=e,l}X(R),function(){let e=Math.ceil(100/(c-1)),t=Array.apply(null,Array(c)).map((t,n)=>n*e),n=customNormalize(t,100,l-a).reverse(),i=b.childNodes;n.forEach((e,n)=>{let a=i[n];a.textContent=formatAxisValue(t[t.length-n-1]),svgAttrs(a,{x:5,y:l-e-5})}),b.style.transition="0s",addClass(b,"m-up");let o=b;b=B,B=o,setTimeout(()=>{B.style.transition=null,B.style.opacity=null},0)}(),on(e,"visibility-updated",({detail:e})=>{y=e;let t=f.columns.filter(e=>y[e.name]),n=H(t);!function(e,t,n,l){let a={},i=e.concat(t).filter(e=>{let t=a[e.name];return a[e.name]=!0,!t}).sort((e,t)=>e.name>t.name?1:e.name===t.name?0:-1);scheduleAnimation(e=>{clearCanvas(v),clearCanvas(x);for(let a=0;a<i.length;a++){let o=i[a].name,r=f.lines[o],s=!t.find(e=>e.name===o),d=!y[o],c=i[a-1],u=i[a+1],m=[];if(s){let t=c?n[c.name]:null,a=c?l[c.name]:null,i=u?n[u.name]:null,r=u?l[u.name]:null;m=n[o].slice(0);for(let n=0;n<m.length-1;n+=2)m[n]=t?a[n+1]+(t[n+1]-a[n+1])*e:a?a[n+1]*(1-e):0,m[n+1]=i?r[n]+(i[n]-r[n])*e:a&&!t?1:t?1:e}else if(d){if(1===e)continue;let t=c?n[c.name]:null,a=c?l[c.name]:null,i=u?n[u.name]:null,r=u?l[u.name]:null;m=l[o].slice(0);for(let n=0;n<m.length-1;n+=2)m[n]=a&&t?a[n+1]+(t[n+1]-a[n+1])*e:t?t[n+1]*e:i?m[n]*(1-e):m[n]+(1-m[n])*e,m[n+1]=r&&i?r[n]+(i[n]-(r[n]||1))*e:i?1-e:1}else{m=n[o].slice(0);let t=l[o];for(let n=0;n<m.length-1;n+=2)m[n]=t[n]+(m[n]-t[n])*e,m[n+1]=t[n+1]+(m[n+1]-t[n+1])*e}K(r,m),$(r,m)}},r)}(t,N,n,R),R=n,N=t,_()}),on(e,"border-changed",({detail:{start:e,end:t}})=>{let a=U(e,t);a!==z&&(G=I[a],function(e,t,n,l,a,i){let o=a!==i;if(n===l||!o){let n=M;M=D,D=n,addClass(M,"pending",o?"right":"",t>e?"even":""),removeClass(M,o?"":"right",t>e?"":"even"),addClass(D,o?"right":""),removeClass(D,"even",t>e?"pending":"",o?"":"right"),setTimeout(()=>{removeClass(M,"hidden"),addClass(D,"hidden")},0)}}(z,a,T,e,S,t),z=a),clearCanvas(v),T=e,S=t,O=W(),V(R),function(){clearChildren(M);let e=q(z),t=1;for(;(T+t)%e!=0;)t++;if((T+t)%(2*e)!=0){let a=(T+t-e)/(2*e),i=n*(m[a]-m[T])/(m[S]-m[T]),o=J(G[a],i,l+s-5);add(M,o)}for(let n=t;n<O.length-1;n+=e){let t=J(G[(T+n)/e],O[n],l+s-5);add(M,t)}}(),_()}),on(g,"click",e=>{let t=O[1]/2,n=T+Math.max(0,O.findIndex(n=>n+t>e.offsetX));n!==k&&(k=n,_())}),on(d,"click",t=>{if(!e.contains(t.target)){let e=-1;e!==k&&(k=e,_())}}),on(d,"mode-change",()=>{clearCanvas(v),clearCanvas(x),V(R),X(R)})}function scheduleAnimation(e,t){let n=performance.now();requestAnimationFrame(function l(a){let i=Math.min(1,Math.max(0,a-n)/t);i<1&&requestAnimationFrame(l),e(i)})}function createCanvas(e,t){let n=el("canvas");return n.width=e,n.height=t,n.getContext("2d").setTransform(1,0,0,-1,0,t),n}function clearCanvas(e){e.getContext("2d").clearRect(0,0,e.width,e.height)}function drawLine(e,t,n,l,a=1,i=1){let o=e.getContext("2d");o.beginPath(),o.globalAlpha=a,o.strokeStyle=l,o.lineWidth=i,o.moveTo(Math.round(t[0]),Math.round(n[0]));for(let e=1;e<t.length;e++)o.lineTo(Math.round(t[e]),Math.round(n[e]));o.stroke()}function drawBars(e,t,n,l,a){let i=e.getContext("2d");i.beginPath(),i.fillStyle=l;for(let e=0;e<t.length;e++)i.rect(t[e],0,Math.ceil(a),Math.round(n[e]));i.fill()}function drawStackedArea(e,t,n,l){let a=e.getContext("2d");a.beginPath(),a.fillStyle=l,a.strokeStyle=l,a.lineWidth=1,a.moveTo(Math.round(t[0]),Math.floor(n[0]));for(let e=1;e<t.length;e++)a.lineTo(Math.round(t[e]),Math.floor(n[2*e]));for(let e=t.length-1;e>=0;e--)a.lineTo(Math.round(t[e]),Math.ceil(n[2*e+1]));a.fill()}function drawStackedBars(e,t,n,l,a,i=1){let o=e.getContext("2d");o.beginPath(),a=Math.ceil(a),o.fillStyle=l,o.globalAlpha=i;for(let e=0;e<t.length;e++)o.rect(t[e],n[2*e],a,n[2*e+1]);o.fill()}function createSelectedPointInfo(e,n){let l=el("div","point-info"),a=el("div","charts-info"),i=el("div");add(l,i,a);let o,r=Object.entries(e.names).reduce((e,[n,l])=>{let i=el("div","info"),o=el("span"),r=el("span"),s=el("span","name");return add(s,t(l)),add(i,r,s,o),add(a,i),e[n]={value:o,subValue:r},e},{});if(n){let e=el("div","info"),n=el("span");o=el("span");let l=el("span","name");add(l,t("All")),add(e,n,l,o),add(a,e)}return{selectedPointInfo:l,pointChartValues:r,pointDate:i,total:{value:o}}}function createAxisLine(e,t,n,l){return svgEl("line",{x1:e,y1:n,x2:t,y2:l,"stroke-width":1})}let xLabelDateFormat=new Intl.DateTimeFormat("en-US",{day:"numeric",month:"short"});function toXLabel(e){return xLabelDateFormat.format(new Date(e))}function getLineColor(e){return isDark?LINE_DARK_COLORS[e]:LINE_COLORS[e]}function getButtonColor(e){return isDark?BUTTON_DARK_COLORS[e]:BUTTON_COLORS[e]}function getTooltipColor(e){return isDark?TOOLTIP_DARK_COLORS[e]:TOOLTIP_COLORS[e]}const BUTTON_COLORS={"#FE3C30":"#E65850","#4BD964":"#5FB641","#108BE3":"#3497ED","#E8AF14":"#F5BD25","#3497ED":"#3497ED","#2373DB":"#3381E8","#9ED448":"#9ED448","#5FB641":"#5FB641","#F5BD25":"#F5BD25","#F79E39":"#F79E39","#E65850":"#E65850"},BUTTON_DARK_COLORS={"#FE3C30":"#CF5D57","#4BD964":"#5AB34D","#108BE3":"#4681BB","#E8AF14":"#C9AF4F","#3497ED":"#4681BB","#2373DB":"#466FB3","#9ED448":"#88BA52","#5FB641":"#3DA05A","#F5BD25":"#F5BD25","#F79E39":"#D49548","#E65850":"#CF5D57"},TOOLTIP_COLORS={"#FE3C30":"#F34C44","#4BD964":"#3CC23F","#108BE3":"#108BE3","#E8AF14":"#E4AE1B","#64ADED":"#3896E8","#3497ED":"#108BE3","#2373DB":"#2373DB","#9ED448":"#89C32E","#5FB641":"#4BAB29","#F5BD25":"#EAAF10","#F79E39":"#F58608","#E65850":"#F34C44"},TOOLTIP_DARK_COLORS={"#FE3C30":"#F7655E","#4BD964":"#4BD964","#108BE3":"#108BE3","#E8AF14":"#DEB93F","#64ADED":"#4082CE","#3497ED":"#5199DF","#2373DB":"#3E65CF","#9ED448":"#99CF60","#5FB641":"#3CB560","#F5BD25":"#DBB630","#F79E39":"#EE9D39","#E65850":"#F7655E"},LINE_COLORS={"#FE3C30":"#FE3C30","#4BD964":"#4BD964","#108BE3":"#108BE3","#E8AF14":"#E8AF14","#64ADED":"#64ADED","#3497ED":"#3497ED","#2373DB":"#2373DB","#9ED448":"#9ED448","#5FB641":"#5FB641","#F5BD25":"#F5BD25","#F79E39":"#F79E39","#E65850":"#E65850"},LINE_DARK_COLORS={"#FE3C30":"#E6574F","#4BD964":"#4BD964","#108BE3":"#108BE3","#E8AF14":"#DEB93F","#64ADED":"#4082CE","#3497ED":"#4681BB","#2373DB":"#345B9C","#9ED448":"#88BA52","#5FB641":"#3DA05A","#F5BD25":"#D9B856","#F79E39":"#D49548","#E65850":"#CF5D57"};function isTouchDevice(){return"ontouchstart"in d.documentElement}let d=document;function el(e,...t){return addClass(d.createElement(e),...t)}function t(e){return d.createTextNode(e)}function svgEl(e,t,...n){let l=d.createElementNS("http://www.w3.org/2000/svg",e);return svgAttrs(l,t),addClass(l,...n)}function svgAttrs(e,t={}){Object.entries(t).forEach(([t,n])=>{e.setAttributeNS(null,t,n)})}function addClass(e,...t){return e.classList.add(...t.filter(e=>e)),e}function removeClass(e,...t){e.classList.remove(...t.filter(e=>e))}function add(e,...t){t.filter(e=>!!e).forEach(t=>e.appendChild(t))}function on(e,t,n){e.addEventListener(t,n)}function off(e,t,n){e.removeEventListener(t,n)}function emit(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n}))}function applyAnimation(e,t,n=250){e.style.animationName=t,setTimeout(()=>{e.style.animationName=null},n)}function clearChildren(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function customNormalize(e,t,n,l=0,a=0){let i=e.slice(0);for(let o=0;o<e.length;o++)i[o]=Math.round(t?n*(i[o]-a)/(t-a)+l:l);return i}function getMax(e){let t=e[0];for(let n=1;n<e.length;n++)t=e[n]>t?e[n]:t;return t}function getMin(e){let t=e[0];for(let n=1;n<e.length;n++)t=e[n]<t?e[n]:t;return t}function formatAxisValue(e){return e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(1)+"K":e}function formatPointValue(e){let t="",n=e.toString();for(let e=0;e<n.length/3;e++)t=n.slice(Math.max(0,n.length-3*e-3),n.length-3*e)+" "+t;return t}function createButtons(e,n){let l=300,a=null,i=[],o=el("div","buttons");on(o,isTouchDevice()?"touchstart":"mousedown",function(e){let t=e.target.dataset.chart;if(!t)return;on(o,isTouchDevice()?"touchend":"mouseup",c),a=setTimeout(()=>{!function(e){a=null,r={[e]:!0},[...o.childNodes].forEach(e=>r[e.dataset.chart]?removeClass(e,"m-hidden"):addClass(e,"m-hidden")),emit(n,"visibility-updated",r)}(t)},l)}),on(d,"mode-change",()=>{i.forEach(s)});let r=Object.keys(e.names).reduce((e,t)=>({...e,[t]:!0}),{});function s(e){const t=getButtonColor([e.color]);e.button.style.borderColor=t,e.div.style.background=t,e.span.style.color=t}function c(e){off(o,isTouchDevice()?"touchend":"mouseup",c),a&&(clearTimeout(a),a=null,function(e){let t=e.target,l=t.dataset.chart;if(!l)return;let a={...r,[l]:!r[l]};if(!Object.values(a).some(e=>e))return void applyAnimation(t,"shake",800);e.target.classList.toggle("m-hidden"),emit(n,"visibility-updated",r=a)}(e))}return Object.keys(e.names).forEach(n=>{let l=el("button"),a=el("div"),r=el("span");i.push({button:l,div:a,span:r,color:e.colors[n]}),s({button:l,div:a,span:r,color:e.colors[n]}),add(l,a);let d=svgEl("svg",{width:"18",height:"18",viewBox:"0 0 24 24"});add(d,svgEl("path",{d:"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"})),add(r,t(e.names[n])),add(l,d,r),l.dataset.chart=n,add(o,l)}),{buttons:o,visibilityMap:r}}function createChart(e,n){let l=d.getElementById("charts-container"),a=el("div","chart-wrapper"),i=el("div","chart-info"),o=el("h1"),r=el("div","selected-range"),s=el("div","range-from"),c=el("span","range-to");add(r,s,t(" - "),c),add(o,t("Chart #"+n)),add(i,o,r),add(a,i),e.y_scaled?createDoubleYLineChart(a,e):"bar"!==e.types.y0||e.stacked?"area"===e.types.y0?(addClass(a,"bar-chart"),createPercentageStackedAreaChart(a,e)):"bar"===e.types.y0&&e.stacked?(addClass(a,"bar-chart"),createBarStackedChart(a,e)):createLineChart(a,e):(addClass(a,"bar-chart"),createBarChart(a,e)),add(l,a);let u=null,m=e.columns[0].slice(1),f=-1,h=-1,g=-1,v=-1;on(a,"border-changed",({detail:{start:e,end:t}})=>{g=e,v=t,u||(u=setTimeout(()=>{u=null,g!==f&&(f=g,s.textContent=p(m[f]),applyAnimation(s,"time-change")),v!==h&&(h=v,c.textContent=p(m[h]),applyAnimation(c,"time-change"))},250))});let x=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric"});function p(e){return x.format(new Date(e))}}let isDark=!1;function createSlider(e,t){let n,l=50,{slider:a,leftBar:i,rightBar:o}=function(){let e=el("div","slider"),t=el("div","slider__bar","left"),n=el("div","slider__bar","right");return{slider:e,leftBar:t,rightBar:n}}(),r=el("div","shadow","left"),s=el("div","shadow","right");on(t,"mousedown",v),on(t,"touchstart",v);let c,u,m,f=0,h=0,g={start:-1,end:-1};function v(e){let n=e.target,l=n===a?x:n===i||n===o?e=>(function(e,t){e.preventDefault();let n=C(e),l=m-n,a=t?Math.max(0,c-l):u,i=t?h:Math.max(0,f+l);y(a,i)&&(t?E(a):A(i),M())})(e,n===i):void 0;if(!l)return;m=C(e);let r=()=>{p(),off(t,"mousemove",l),off(t,"touchmove",l),off(d,"mouseup",r),off(d,"touchend",r)};on(t,"mousemove",l),on(t,"touchmove",l),on(d,"mouseup",r),on(d,"touchend",r)}function x(e){e.preventDefault();let t=C(e),n=m-t,l=c-n,a=f+n;y(l,a)&&(E(l),A(a),M())}function p(){y(u,h)&&(c=u,f=h)}function C(e){return e.touches?e.touches[0].clientX:e.clientX}function y(e,t){return e>=0&&t>=0&&n-e-t>=l}function E(e){u=e,w(r,e)}function A(e){h=e,w(s,e)}function w(e,t){e.style.width=`${t}px`}function M(){let l={start:Math.max(0,Math.round(u*e.length/n)),end:Math.min(e.length-1,Math.round((n-h)*(e.length-1)/n))};g.start===l.start&&g.end===l.end||(g=l,emit(t,"border-changed",l))}requestAnimationFrame(()=>{n=a.parentElement.getBoundingClientRect().width,u=n-l,A(h),E(u),p(),M()});let D=el("div","slider-container");return add(D,r,i,a,o,s),D}(()=>{let e="Switch to Night Mode",t="Switch to Day Mode",n=d.getElementById("mode-switcher");on(n,"click",function(){d.body.classList.toggle("dark"),isDark=!isDark,n.innerText=isDark?t:e,emit(d,"mode-change",{isDark:isDark})}),n.innerText=e})();