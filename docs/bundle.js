function createBarChart(e,t){let n=Math.min(400,window.innerWidth),i=350,l=n-20,a=50,r=20,o=6,s=10*n/400,c=t.columns[0].slice(1),u={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},h=Math.round(c.length/s/6),m=svgEl("svg",{viewBox:`0 0 ${n} ${i+r}`}),f=createCanvas(n,i),{preview:g,previewContainer:v}=function(){let t=el("div","preview-container"),n=createCanvas(l,a);return add(t,n,createSlider(c,e)),{previewContainer:t,preview:n}}(),{selectedPointInfo:x,pointChartValues:p,pointDate:y}=createSelectedPointInfo(u),{xAxes:C,xAxesHidden:w}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:E,yAxesGroupHidden:M}=function(){let e=svgEl("g",{},"y-axes"),t=svgEl("g",{},"y-axes","hidden");return[e,t].forEach(e=>{for(let t=0;t<o;t++)add(e,K("",5,0))}),{yAxesGroupShown:e,yAxesGroupHidden:t}}(),A=el("div","charts");add(A,f,m,v,x),add(m,function(){let e=svgEl("g",{},"y-axes"),t=Math.ceil(i/o);for(let l=0;l<o;l++){let a=svgEl("line",{x1:10,y1:i-t*l,x2:n-10,y2:i-t*l,fill:"gray",stroke:"gray","stroke-width":.3});add(e,a)}return e}(),E,M,C,w),add(e,A);let b=0,T=c.length,S=-1,B=0,k=u.columns,D=_(),L=X(c,n),N=F(k),O=J(k.reduce((e,t)=>e.concat(t.data),[]));let P=W(b,T),G=q(P),I=null;function H(e,t){if(t===e)return;let n=Math.ceil(t/o),l=Array.apply(null,Array(o)).map((e,t)=>t*n),a=z(l,t,i),r=M.childNodes;a.reverse().forEach((e,t)=>{let n=r[t];n.textContent=l[l.length-t-1],svgAttrs(n,{x:5,y:i-e-5})}),removeClass(M,"m-down","m-up"),removeClass(E,"m-down","m-up"),addClass(M,t>e?"m-up":"m-down","pending"),addClass(E,t>e?"m-down":"m-up","pending");let s=M;M=E,E=s,setTimeout(()=>{removeClass(E,"hidden","pending"),removeClass(M,"pending"),addClass(M,"hidden")},0)}function $(){if(-1===S||S<b||S>T)return void(x.style.display="none");let e=c[S],t=n*(e-c[b])/(c[T]-c[b]);Y(u.columns,(e,t)=>{p[t].innerText=e[S],p[t].parentElement.style.display="flex"}),y.innerText=new Date(e).toString().slice(0,15);let i=t>n/2;x.style.transform="translateX("+(i?t-180:t)+"px)",x.style.display="block"}function F(e){return J(e.reduce((e,t)=>e.concat(t.data.slice(b,T+1)),[]))}function R(e=!1){Y(k,(t,r)=>{!function(e,t){let l=z(t.slice(b,T+1),N,i),a=n/D.length;if(-1===S)return void j(e.color,D,l,a);if(S>=b&&S<=T)return j("#8cbef5",D.slice(0,S-b),l.slice(0,S-b),a),j("#8cbef5",D.slice(S-b+1),l.slice(S-b+1),a),void j("#558DED",[D[S-b]],[l[S-b]],a);j("#8cbef5",D,l,a)}(u.lines[r],t),e&&function(e,t,n){let i=z(t,O,a);r=e,o=L,s=i,drawBars(g,o,s,r.color,l/o.length);var r,o,s}(u.lines[r],t)})}function _(){return X(c.slice(b,T+1),n)}function X(e,t){let n=e[0],i=e[e.length-1],l=Math.abs(i-n);return e.map(e=>t*(e-n)/l)}function z(e,t,n,i=0){return e.map(e=>t?n*e/t+i:i)}function j(e,t,n,i){drawBars(f,t,n,e,i)}function W(e,t){let n=Math.round(10*(t-e)/c.length);return Math.round(Math.log2(n))}function V(e){return Math.ceil(h*Math.pow(2,e))}function q(e){let t=[],n=V(e);for(let e=0;e<c.length;e+=n)t.push(U(c[e]));return t}function U(e){let t=new Date(e).toString().slice(4,10);return"0"===t[4]?`${t.slice(0,4)}${t[5]}`:t}function Y(e,t){e.forEach(e=>t(e.data,e.name))}function J(e){return Math.max(...e)}function K(e,t,n){let i=svgEl("text",{x:t,y:n,"font-size":13});return i.textContent=e,i}Y(k,(e,t)=>{let n=u.colors[t];u.lines[t]={color:n}}),R(!0),H(B,N),B=N,on(e,"border-changed",({detail:{start:e,end:t}})=>{let l=W(e,t);if(l!==P&&(G=q(l),function(e,t,n,i,l,a){let r=l!==a;if(n===i||!r){let n=C;C=w,w=n,addClass(C,"pending",r?"right":"",t>e?"even":""),removeClass(C,r?"":"right",t>e?"":"even"),addClass(w,r?"right":""),removeClass(w,"even",t>e?"pending":"",r?"":"right"),setTimeout(()=>{removeClass(C,"hidden"),addClass(w,"hidden")},0)}}(P,l,b,e,T,t),P=l),clearCanvas(f),b=e,T=t,D=_(),N=F(k),R(),!I){let e=B;I=setTimeout(()=>{H(e,N),I=null},250)}B=N,function(){!function(e){for(;e.firstChild;)e.removeChild(e.firstChild)}(C);let e=V(P),t=1;for(;(b+t)%e!=0;)t++;if((b+t)%(2*e)!=0){let l=(b+t-e)/(2*e),a=n*(c[l]-c[b])/(c[T]-c[b]),o=K(G[l],a,i+r-5);add(C,o)}for(let n=t;n<D.length-1;n+=e){let t=K(G[(b+n)/e],D[n],i+r-5);add(C,t)}}(),$()}),on(m,"click",e=>{let t=n/D.length,i=b+Math.max(0,D.findIndex(n=>n+t>e.offsetX));i!==S&&(S=i,clearCanvas(f),R(),$())}),on(d,"click",t=>{e.contains(t.target)||(S=-1,clearCanvas(f),R(),$())})}function createDoubleYLineChart(e,t){let n=Math.min(400,window.innerWidth),i=350,l=n-20,a=50,r=2,o=1,s=250,c=20,u=6,h=10*n/400,m=t.columns[0].slice(1),f={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},g=Math.round(m.length/h/6),v=svgEl("svg",{viewBox:`0 0 ${n} ${i+c}`}),x=createCanvas(n,i),{preview:p,previewContainer:y}=function(){let t=el("div","preview-container"),n=createCanvas(l,a);return add(t,n,createSlider(m,e)),{previewContainer:t,preview:n}}(),{buttons:C,visibilityMap:w}=createButtons(f,e),{selectedPointInfo:E,pointChartValues:M,pointDate:A}=createSelectedPointInfo(f),{xAxes:b,xAxesHidden:T}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:S,yAxesGroupHidden:B,yAxesRightGroupShown:k,yAxesRightGroupHidden:D}=function(){let e=svgEl("g",{},"y-axes"),n=svgEl("g",{},"y-axes","hidden");[e,n].forEach(e=>{for(let n=0;n<u;n++){let n=oe("",5,0);svgAttrs(n,{fill:t.colors.y0}),add(e,n)}});let i=svgEl("g",{},"y-axes","m-right"),l=svgEl("g",{},"y-axes","m-right","hidden");return[i,l].forEach(e=>{for(let n=0;n<u;n++){let n=oe("",5,0);svgAttrs(n,{fill:t.colors.y1}),add(e,n)}}),{yAxesGroupShown:e,yAxesGroupHidden:n,yAxesRightGroupShown:i,yAxesRightGroupHidden:l}}(),L=function(){let e=svgEl("g",{},"y-axes"),t=Math.ceil(i/u);for(let l=0;l<u;l++){let a=re(10,n-10,i-t*l,i-t*l);add(e,a)}return e}(),N=re(0,0,0,i),O=el("div","charts");add(O,x,v,y,E),add(v,N,L,S,B,k,D,b,T),add(e,O,C);let P=0,G=m.length,I=-1,H=f.columns,$=U(),F=Y(m,n),R={y0:{min:0,max:0},y1:{min:0,max:0}},_=q(H);H.forEach(e=>e.yMax={max:le(e.data),min:ae(e.data)});let X=Z(P,G),z=te(X),j=null;function W(e,t,l){ie(f.columns,(a,r)=>{let o="y1"===r,s=o?D:B,d=o?k:S;if(!w[r])return void addClass(d,"hidden","m-down");if(t[r].max===e[r].max&&t[r].min===e[r].min&&l[r]&&w[r])return;let c=Math.ceil((t[r].max-t[r].min)/u),h=Array.apply(null,Array(u)).map((e,n)=>t[r].min+n*c),m=J(h,t[r].max,i,0,t[r].min).reverse(),f=B.childNodes,g=D.childNodes;if(m.forEach((e,t)=>{let l=o?g[t]:f[t];l.textContent=h[h.length-t-1],svgAttrs(l,{x:o?n-7*(l.textContent.length+1):5,y:i-e-5})}),removeClass(s,"m-down","m-up"),removeClass(d,"m-down","m-up"),addClass(s,t[r].max>e[r].max?"m-up":"m-down","pending"),addClass(d,t[r].max>e[r].max?"m-down":"m-up","pending"),o){let e=D;D=k,k=e}else{B=S,S=s}setTimeout(()=>{removeClass(s,"hidden","pending"),removeClass(d,"pending"),addClass(d,"hidden")},0)})}function V(){if(-1===I||I<P||I>G)return N.style.display="none",E.style.display="none",void ie(f.columns,(e,t)=>{f.lines[t].chartPoint.style.animationName="exit"});let e=m[I],t=n*(e-m[P])/(m[G]-m[P]);svgAttrs(N,{x1:t,x2:t}),ie(f.columns,(e,n)=>{let l=J([e[I]],R[n].max,i,c,R[n].min)[0],a=f.lines[n].chartPoint;a.style.animationName=w[n]?"enter":"exit",svgAttrs(a,{cx:t});let r=a.firstChild;svgAttrs(r,{from:r.getAttribute("to"),to:l}),r.beginElement(),M[n].innerText=e[I],M[n].parentElement.style.display=w[n]?"flex":"none"}),A.innerText=new Date(e).toString().slice(0,15);let l=t>n/2;E.style.transform="translateX("+(l?t-180:t)+"px)",E.style.display="block",N.style.display="block"}function q(e){return e.reduce((e,t)=>{let n=t.data.slice(P,G+1);return e[t.name]={max:le(n),min:ae(n)},e},{})}function U(){return Y(m.slice(P,G+1),n)}function Y(e,t){let n=e[0],i=e[e.length-1],l=Math.abs(i-n);return e.map(e=>t*(e-n)/l)}function J(e,t,n,i=0,l=0){return e.map(e=>t?n*(e-l)/(t-l)+i:i)}function K(e,t,n,i=1){drawLine(x,t,n,e.color,i,r)}function Q(e,t,n,i=1){drawLine(p,t,n,e.color,i,o)}function Z(e,t){let n=Math.round(10*(t-e)/m.length);return Math.round(Math.log2(n))}function ee(e){return Math.ceil(g*Math.pow(2,e))}function te(e){let t=[],n=ee(e);for(let e=0;e<m.length;e+=n)t.push(ne(m[e]));return t}function ne(e){let t=new Date(e).toString().slice(4,10);return"0"===t[4]?`${t.slice(0,4)}${t[5]}`:t}function ie(e,t){e.forEach(e=>t(e.data,e.name,e))}function le(e){return Math.max(...e)}function ae(e){return Math.min(...e)}function re(e,t,n,i){return svgEl("line",{x1:e,y1:n,x2:t,y2:i,fill:"gray",stroke:"gray","stroke-width":.3})}function oe(e,t,n){let i=svgEl("text",{x:t,y:n,"font-size":13});return i.textContent=e,i}ie(H,(e,t)=>{let n=f.colors[t],i=svgEl("circle",{r:6,fill:"white",stroke:n,"stroke-width":r});i.style.animationName="exit",f.lines[t]={chartPoint:i,color:n},add(i,function(e="points"){return svgEl("animate",{attributeName:e,repeatCount:1,dur:"250ms",fill:"freeze",from:0,to:0})}("cy")),add(v,i)}),ie(H,(e,t,n)=>{!function(e,t,n,i){let l=J(t,n.max,a,0,n.min);Q(e,F,l,i)}(f.lines[t],e,n.yMax)}),on(e,"visibility-updated",({detail:e})=>{let t=w;w=e;let n=f.columns.filter(e=>w[e.name]);_=q(f.columns),function(e,t,n){let l=e.length>=H.length?e:t;scheduleAnimation(e=>{clearCanvas(x),clearCanvas(p),ie(l,(l,r,o)=>{let s=f.lines[r],d=1,c=a,u=i,h=!t.find(e=>e.name===r),m=!w[r];h?(d=Math.min(1,2*e),c*=1-e+1,u*=1-e+1):m&&(d=Math.max(0,1-2*e),u+=u*e,c+=c*e);let g=l.slice(P,G+1),v=J(g,n[r].max,u,0,n[r].min);K(s,$,v,d);let x=J(l,o.yMax.max,c,0,o.yMax.min);Q(s,F,x,d)})},s)}(n,H,R),W(R,_,t),R=_,H=n,V()}),on(e,"border-changed",({detail:{start:e,end:t}})=>{let l=Z(e,t);if(l!==X&&(z=te(l),function(e,t,n,i,l,a){let r=l!==a;if(n===i||!r){let n=b;b=T,T=n,addClass(b,"pending",r?"right":"",t>e?"even":""),removeClass(b,r?"":"right",t>e?"":"even"),addClass(T,r?"right":""),removeClass(T,"even",t>e?"pending":"",r?"":"right"),setTimeout(()=>{removeClass(b,"hidden"),addClass(T,"hidden")},0)}}(X,l,P,e,G,t),X=l),clearCanvas(x),P=e,G=t,$=U(),_=q(H),ie(H,(e,t,n)=>{!function(e,t,n,l){let a=J(t.slice(P,G+1),n.max,i,0,n.min);K(e,$,a,l)}(f.lines[t],e,_[t])}),!j){let e=R;j=setTimeout(()=>{W(e,_,w),j=null},s)}R=_,function(){!function(e){for(;e.firstChild;)e.removeChild(e.firstChild)}(b);let e=ee(X),t=1;for(;(P+t)%e!=0;)t++;if((P+t)%(2*e)!=0){let l=(P+t-e)/(2*e),a=n*(m[l]-m[P])/(m[G]-m[P]),r=oe(z[l],a,i+c-5);add(b,r)}for(let n=t;n<$.length-1;n+=e){let t=oe(z[(P+n)/e],$[n],i+c-5);add(b,t)}}(),V()}),on(v,"click",e=>{let t=$[1]/2,n=P+Math.max(0,$.findIndex(n=>n+t>e.offsetX));n!==I&&(I=n,V())}),on(d,"click",t=>{e.contains(t.target)||(I=-1,V())})}function createLineChart(e,t){let n=Math.min(400,window.innerWidth),i=350,l=n-20,a=50,r=2,o=1,s=250,c=20,u=6,h=10*n/400,m=t.columns[0].slice(1),f={...t,columns:t.columns.slice(1).map(e=>({name:e[0],data:e.slice(1)})),lines:{}},g=Math.round(m.length/h/6),v=svgEl("svg",{viewBox:`0 0 ${n} ${i+c}`}),x=createCanvas(n,i),{preview:p,previewContainer:y}=function(){let t=el("div","preview-container"),n=createCanvas(l,a);return add(t,n,createSlider(m,e)),{previewContainer:t,preview:n}}(),{buttons:C,visibilityMap:w}=createButtons(f,e),{selectedPointInfo:E,pointChartValues:M,pointDate:A}=createSelectedPointInfo(f),{xAxes:b,xAxesHidden:T}={xAxes:svgEl("g",{},"x-axes"),xAxesHidden:svgEl("g",{},"x-axes","hidden")},{yAxesGroupShown:S,yAxesGroupHidden:B}=function(){let e=svgEl("g",{},"y-axes"),t=svgEl("g",{},"y-axes","hidden");return[e,t].forEach(e=>{for(let t=0;t<u;t++)add(e,ue("",5,0))}),{yAxesGroupShown:e,yAxesGroupHidden:t}}(),k=ce(0,0,0,i),D=el("div","charts");add(D,x,v,y,E),add(v,k,function(){let e=svgEl("g",{},"y-axes1"),t=Math.ceil(i/u);for(let l=0;l<u;l++){let a=ce(10,n-10,i-t*l,i-t*l);add(e,a)}return e}(),S,B,b,T),add(e,D,C);let L=0,N=m.length,O=-1,P=0,G=0,I=0,H=0,$=f.columns,F=Q(),R=Z(m,n),{max:_,min:X}=K($),{max:z,min:j}=J($),W=ie(L,N),V=ae(W),q=null;function U(e,t,n,l){if(t===e&&n===l)return;let a=Math.ceil((t-l)/u),r=Array.apply(null,Array(u)).map((e,t)=>l+t*a),o=ee(r,t,i,0,l),s=B.childNodes;o.reverse().forEach((e,t)=>{let n=s[t];n.textContent=r[r.length-t-1],svgAttrs(n,{x:5,y:i-e-5})}),removeClass(B,"m-down","m-up"),removeClass(S,"m-down","m-up"),addClass(B,t>e?"m-up":"m-down","pending"),addClass(S,t>e?"m-down":"m-up","pending");let d=B;B=S,S=d,setTimeout(()=>{removeClass(S,"hidden","pending"),removeClass(B,"pending"),addClass(B,"hidden")},0)}function Y(){if(-1===O||O<L||O>N)return k.style.display="none",E.style.display="none",void oe(f.columns,(e,t)=>{f.lines[t].chartPoint.style.animationName="exit"});let e=m[O],t=n*(e-m[L])/(m[N]-m[L]);svgAttrs(k,{x1:t,x2:t}),oe(f.columns,(e,n)=>{let l=ee([e[O]],G,i,c,P)[0],a=f.lines[n].chartPoint;a.style.animationName=w[n]?"enter":"exit",svgAttrs(a,{cx:t});let r=a.firstChild;svgAttrs(r,{from:r.getAttribute("to"),to:l}),r.beginElement(),M[n].innerText=e[O],M[n].parentElement.style.display=w[n]?"flex":"none"}),A.innerText=new Date(e).toString().slice(0,15);let l=t>n/2;E.style.transform="translateX("+(l?t-180:t)+"px)",E.style.display="block",k.style.display="block"}function J(e){let t=e.reduce((e,t)=>e.concat(t.data),[]);return{max:se(t),min:de(t)}}function K(e){let t=e.reduce((e,t)=>e.concat(t.data.slice(L,N+1)),[]);return{max:se(t),min:de(t)}}function Q(){return Z(m.slice(L,N+1),n)}function Z(e,t){let n=e[0],i=e[e.length-1],l=Math.abs(i-n);return e.map(e=>t*(e-n)/l)}function ee(e,t,n,i=0,l=0){return e.map(e=>t?n*(e-l)/(t-l)+i:i)}function te(e,t,n,i=1){drawLine(x,t,n,e.color,i,r)}function ne(e,t,n,i=1){drawLine(p,t,n,e.color,i,o)}function ie(e,t){let n=Math.round(10*(t-e)/m.length);return Math.round(Math.log2(n))}function le(e){return Math.ceil(g*Math.pow(2,e))}function ae(e){let t=[],n=le(e);for(let e=0;e<m.length;e+=n)t.push(re(m[e]));return t}function re(e){let t=new Date(e).toString().slice(4,10);return"0"===t[4]?`${t.slice(0,4)}${t[5]}`:t}function oe(e,t){e.forEach(e=>t(e.data,e.name))}function se(e){return Math.max(...e)}function de(e){return Math.min(...e)}function ce(e,t,n,i){return svgEl("line",{x1:e,y1:n,x2:t,y2:i,fill:"gray",stroke:"gray","stroke-width":.3})}function ue(e,t,n){let i=svgEl("text",{x:t,y:n,"font-size":13});return i.textContent=e,i}oe($,(e,t)=>{let n=f.colors[t],i=svgEl("circle",{r:6,fill:"white",stroke:n,"stroke-width":r});i.style.animationName="exit",f.lines[t]={chartPoint:i,color:n},add(i,function(e="points"){return svgEl("animate",{attributeName:e,repeatCount:1,dur:"250ms",fill:"freeze",from:0,to:0})}("cy")),add(v,i)}),oe($,(e,t)=>{!function(e,t,n){let i=ee(t,z,a,0,j);ne(e,R,i,n)}(f.lines[t],e)}),H=z,I=j,on(e,"visibility-updated",({detail:e})=>{w=e;let t=f.columns.filter(e=>w[e.name]),{max:n,min:l}=K(t),{max:r,min:o}=J(t);!function(e,t,n,l,a,r){let o=n-l,d=a-r,c=e.length>=$.length?e:t;scheduleAnimation(e=>{clearCanvas(x),oe(c,(n,a)=>{let s=f.lines[a],c=1;t.find(e=>e.name===a)?w[a]||(c=Math.max(0,1-2*e)):c=Math.min(1,2*e);let u=n.slice(L,N+1),h=ee(u,l+o*e,i,0,r+d*e);te(s,F,h,c)})},s)}(t,$,n,G,l,P),function(e,t,n,i,l,r){let o=n-i,d=l-r,c=e.length>=$.length?e:t;scheduleAnimation(e=>{clearCanvas(p),oe(c,(n,l)=>{let s=f.lines[l],c=1;t.find(e=>e.name===l)?w[l]||(c=Math.max(0,1-2*e)):c=Math.min(1,2*e);let u=ee(n,i+o*e,a,0,r+d*e);ne(s,R,u,c)})},s)}(t,$,r,H,o,I),U(G,n,P,l),G=n,P=l,H=r,I=o,$=t,Y()}),on(e,"border-changed",({detail:{start:e,end:t}})=>{let l=ie(e,t);l!==W&&(V=ae(l),function(e,t,n,i,l,a){let r=l!==a;if(n===i||!r){let n=b;b=T,T=n,addClass(b,"pending",r?"right":"",t>e?"even":""),removeClass(b,r?"":"right",t>e?"":"even"),addClass(T,r?"right":""),removeClass(T,"even",t>e?"pending":"",r?"":"right"),setTimeout(()=>{removeClass(b,"hidden"),addClass(T,"hidden")},0)}}(W,l,L,e,N,t),W=l),clearCanvas(x),L=e,N=t,F=Q();let a=K($);if(X=a.min,_=a.max,oe($,(e,t)=>{!function(e,t,n){let l=ee(t.slice(L,N+1),_,i,0,X);te(e,F,l,n)}(f.lines[t],e)}),!q){let e=G,t=P;q=setTimeout(()=>{U(e,_,t,X),q=null},s)}G=_,P=X,function(){!function(e){for(;e.firstChild;)e.removeChild(e.firstChild)}(b);let e=le(W),t=1;for(;(L+t)%e!=0;)t++;if((L+t)%(2*e)!=0){let l=(L+t-e)/(2*e),a=n*(m[l]-m[L])/(m[N]-m[L]),r=ue(V[l],a,i+c-5);add(b,r)}for(let n=t;n<F.length-1;n+=e){let t=ue(V[(L+n)/e],F[n],i+c-5);add(b,t)}}(),Y()}),on(v,"click",e=>{let t=F[1]/2,n=L+Math.max(0,F.findIndex(n=>n+t>e.offsetX));n!==O&&(O=n,Y())}),on(d,"click",t=>{e.contains(t.target)||(O=-1,Y())})}function scheduleAnimation(e,t){let n=performance.now();requestAnimationFrame(function i(l){let a=Math.min(1,Math.max(0,l-n)/t);a<1&&requestAnimationFrame(i),e(a)})}function createCanvas(e,t){let n=el("canvas");return n.width=e,n.height=t,n.getContext("2d").setTransform(1,0,0,-1,0,t),n}function clearCanvas(e){e.getContext("2d").clearRect(0,0,e.width,e.height)}function drawLine(e,t,n,i,l=1,a=1){let r=e.getContext("2d");r.beginPath(),r.globalAlpha=l,r.strokeStyle=i,r.lineWidth=a,r.moveTo(Math.round(t[0]),Math.round(n[0]));for(let e=1;e<t.length;e++)r.lineTo(Math.round(t[e]),Math.round(n[e]));r.stroke()}function drawBars(e,t,n,i,l){let a=e.getContext("2d");a.beginPath(),a.fillStyle=i;for(let e=0;e<t.length;e++)a.rect(t[e],0,Math.ceil(l),Math.round(n[e]));a.fill()}function createSelectedPointInfo(e){let n=el("div","point-info"),i=el("div","charts-info"),l=el("div");return add(n,l,i),{selectedPointInfo:n,pointChartValues:Object.entries(e.names).reduce((n,[l,a])=>{let r=el("div","info"),o=el("span");return o.style.color=TOOLTIP_COLORS[e.colors[l]],n[l]=o,add(r,t(a),o),add(i,r),n},{}),pointDate:l}}const BUTTON_COLORS={"#FE3C30":"#E65850","#4BD964":"#5FB641","#108BE3":"#3497ED","#E8AF14":"#F5BD25"},TOOLTIP_COLORS={"#FE3C30":"#F34C44","#4BD964":"#3CC23F","#108BE3":"#108BE3","#E8AF14":"#E4AE1B","#64ADED":"#3896E8"};function isTouchDevice(){return"ontouchstart"in d.documentElement}let d=document;function el(e,...t){return addClass(d.createElement(e),...t)}function t(e){return d.createTextNode(e)}function svgEl(e,t,...n){let i=d.createElementNS("http://www.w3.org/2000/svg",e);return svgAttrs(i,t),addClass(i,...n)}function svgAttrs(e,t={}){Object.entries(t).forEach(([t,n])=>{e.setAttributeNS(null,t,n)})}function addClass(e,...t){return e.classList.add(...t.filter(e=>e)),e}function removeClass(e,...t){e.classList.remove(...t.filter(e=>e))}function add(e,...t){t.filter(e=>!!e).forEach(t=>e.appendChild(t))}function on(e,t,n){e.addEventListener(t,n)}function off(e,t,n){e.removeEventListener(t,n)}function emit(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n}))}function applyAnimation(e,t){e.style.animationName=null,e.offsetWidth,e.style.animationName=t}function createButtons(e,n){let i=300,l=null,a=el("div","buttons");on(a,isTouchDevice()?"touchstart":"mousedown",function(e){let t=e.target.dataset.chart;if(!t)return;on(a,isTouchDevice()?"touchend":"mouseup",o),l=setTimeout(()=>{!function(e){l=null,r={[e]:!0},[...a.childNodes].forEach(e=>r[e.dataset.chart]?removeClass(e,"m-hidden"):addClass(e,"m-hidden")),emit(n,"visibility-updated",r)}(t)},i)});let r=Object.keys(e.names).reduce((e,t)=>({...e,[t]:!0}),{});function o(e){off(a,isTouchDevice()?"touchend":"mouseup",o),l&&(clearTimeout(l),l=null,function(e){let t=e.target,i=t.dataset.chart;if(!i)return;let l={...r,[i]:!r[i]};if(!Object.values(l).some(e=>e))return void applyAnimation(t,"shake");e.target.classList.toggle("m-hidden"),emit(n,"visibility-updated",r=l)}(e))}return Object.keys(e.names).forEach(n=>{let i=el("button"),l=el("div");add(i,l);const r=BUTTON_COLORS[e.colors[n]];i.style.borderColor=r,l.style.background=r;let o=svgEl("svg",{width:"18",height:"18",viewBox:"0 0 24 24"});add(o,svgEl("path",{d:"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"}));let s=el("span");s.style.color=r,add(s,t(e.names[n])),add(i,o,s),i.dataset.chart=n,add(a,i)}),{buttons:a,visibilityMap:r}}function createChart(e,n){let i=d.getElementById("charts-container"),l=el("div","chart-wrapper"),a=el("div","chart-info"),r=el("h1"),o=el("div","selected-range"),s=el("div","range-from"),c=el("span","range-to");add(o,s,t(" - "),c),add(r,t("Chart #"+n)),add(a,r,o),add(l,a),e.y_scaled?createDoubleYLineChart(l,e):"bar"===e.types.y0?createBarChart(l,e):createLineChart(l,e),add(i,l);let u=null,h=e.columns[0].slice(1),m=-1,f=-1,g=-1,v=-1;function x(e){return new Date(e).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}on(l,"border-changed",({detail:{start:e,end:t}})=>{g=e,v=t,u||(u=setTimeout(()=>{u=null,g!==m&&(m=g,s.textContent=x(h[m]),applyAnimation(s,"time-change")),v!==f&&(f=v,c.textContent=x(h[f]),applyAnimation(c,"time-change"))},250))})}function createSlider(e,t){let n,i=50,{slider:l,leftBar:a,rightBar:r}=function(){let e=el("div","slider"),t=el("div","slider__bar","left"),n=el("div","slider__bar","right");return{slider:e,leftBar:t,rightBar:n}}(),o=el("div","shadow","left"),s=el("div","shadow","right");on(t,"mousedown",v),on(t,"touchstart",v);let c,u,h,m=0,f=0,g={start:-1,end:-1};function v(e){let n=e.target,i=n===l?x:n===a||n===r?e=>(function(e,t){e.preventDefault();let n=y(e),i=h-n,l=t?Math.max(0,c-i):u,a=t?f:Math.max(0,m+i);C(l,a)&&(t?w(l):E(a),A())})(e,n===a):void 0;if(!i)return;h=y(e);let o=()=>{p(),off(t,"mousemove",i),off(t,"touchmove",i),off(d,"mouseup",o),off(d,"touchend",o)};on(t,"mousemove",i),on(t,"touchmove",i),on(d,"mouseup",o),on(d,"touchend",o)}function x(e){e.preventDefault();let t=y(e),n=h-t,i=c-n,l=m+n;C(i,l)&&(w(i),E(l),A())}function p(){C(u,f)&&(c=u,m=f)}function y(e){return e.touches?e.touches[0].clientX:e.clientX}function C(e,t){return e>=0&&t>=0&&n-e-t>=i}function w(e){u=e,M(o,e)}function E(e){f=e,M(s,e)}function M(e,t){e.style.width=`${t}px`}function A(){let i={start:Math.max(0,Math.round(u*e.length/n)),end:Math.min(e.length-1,Math.round((n-f)*(e.length-1)/n))};g.start===i.start&&g.end===i.end||(g=i,emit(t,"border-changed",i))}requestAnimationFrame(()=>{n=l.parentElement.getBoundingClientRect().width,u=n-i,E(f),w(u),p(),A()});let b=el("div","slider-container");return add(b,o,a,l,r,s),b}(()=>{let e="Switch to Night Mode",t="Switch to Day Mode",n=!1,i=d.getElementById("mode-switcher");on(i,"click",function(){d.body.classList.toggle("dark"),n=!n,i.innerText=n?t:e}),i.innerText=e})();