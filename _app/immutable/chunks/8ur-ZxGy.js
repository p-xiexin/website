import{g as q,n as F,l as E,p as l,o as I,b as N,c as R}from"./BF-J9cDl.js";import{i as G,s as M,a as C}from"./zNkHYMoe.js";import{h as r,i as S,q as k,j as O,E as U,k as V,a3 as X,B as D,U as H,X as A,A as W,v as J,o as K,a4 as L,P as Q,p as Y,t as T,b as Z,c as $,s as ee,r as te,T as ae,f as se,g as z}from"./pZVbErGv.js";import{e as re,i as oe}from"./DeJ9YskI.js";import{a as P}from"./BA5s0PBG.js";function ne(g,a,_,m,v,w){let d=r;r&&S();var o,i,e=null;r&&k.nodeType===1&&(e=k,S());var h=r?k:g,s;O(()=>{const t=a()||null;var c=_||t==="svg"?X:null;t!==o&&(s&&(t===null?K(s,()=>{s=null,i=null}):t===i?L(s):(Q(s),P(!1))),t&&t!==i&&(s=V(()=>{if(e=r?e:c?document.createElementNS(c,t):document.createElement(t),q(e,e),m){r&&F(t)&&e.append(document.createComment(""));var f=r?D(e):e.appendChild(H());r&&(f===null?A(!1):W(f)),m(e,f)}J.nodes_end=e,h.before(e)})),o=t,o&&(i=o),P(!0))},U),d&&(A(!0),W(h))}/**
 * @license lucide-svelte v0.486.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 */const ie={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var le=I("<svg><!><!></svg>");function he(g,a){const _=E(a,["children","$$slots","$$events","$$legacy"]),m=E(_,["name","color","size","strokeWidth","absoluteStrokeWidth","iconNode"]);Y(a,!1);let v=l(a,"name",8,void 0),w=l(a,"color",8,"currentColor"),d=l(a,"size",8,24),o=l(a,"strokeWidth",8,2),i=l(a,"absoluteStrokeWidth",8,!1),e=l(a,"iconNode",24,()=>[]);const h=(...u)=>u.filter((n,b,p)=>!!n&&p.indexOf(n)===b).join(" ");G();var s=le();let t;var c=$(s);re(c,1,e,oe,(u,n)=>{let b=()=>z(n)[0],p=()=>z(n)[1];var y=R(),j=se(y);ne(j,b,!0,(B,de)=>{let x;T(()=>x=C(B,x,{...p()}))}),N(u,y)});var f=ee(c);M(f,a,"default",{}),te(s),T((u,n)=>t=C(s,t,{...ie,...m,width:d(),height:d(),stroke:w(),"stroke-width":u,class:n}),[()=>i()?Number(o())*24/Number(d()):o(),()=>h("lucide-icon","lucide",v()?`lucide-${v()}`:"",_.class)],ae),N(g,s),Z()}export{he as I,ne as e};
