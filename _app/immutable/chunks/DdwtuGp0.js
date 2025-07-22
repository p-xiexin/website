import{b as F,k as I,l as N,p as l,n as R,a as E,c as q}from"./BDn-tyun.js";import{b as G,d as C}from"./C_mLuD7F.js";import{h as r,a as S,e as k,b as L,E as M,d as O,ak as Q,o as V,L as D,Q as W,m as A,i as H,p as J,T as K,a4 as U,a6 as X,t as T,aa as Y,c as Z,s as $,r as ee,N as te,f as ae,g as z}from"./CdabQ3V7.js";import{e as se,i as re}from"./BBGRdzae.js";import{a as P}from"./DZJ0-oot.js";import{i as oe}from"./HJkB6Z_v.js";function ne(g,a,m,_,v,w){let d=r;r&&S();var o,i,e=null;r&&k.nodeType===1&&(e=k,S());var h=r?k:g,s;L(()=>{const t=a()||null;var c=m||t==="svg"?Q:null;t!==o&&(s&&(t===null?J(s,()=>{s=null,i=null}):t===i?K(s):(U(s),P(!1))),t&&t!==i&&(s=O(()=>{if(e=r?e:c?document.createElementNS(c,t):document.createElement(t),F(e,e),_){r&&I(t)&&e.append(document.createComment(""));var f=r?V(e):e.appendChild(D());r&&(f===null?W(!1):A(f)),_(e,f)}H.nodes_end=e,h.before(e)})),o=t,o&&(i=o),P(!0))},M),d&&(W(!0),A(h))}/**
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
 */const ie={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var le=R("<svg><!><!></svg>");function ge(g,a){const m=N(a,["children","$$slots","$$events","$$legacy"]),_=N(m,["name","color","size","strokeWidth","absoluteStrokeWidth","iconNode"]);X(a,!1);let v=l(a,"name",8,void 0),w=l(a,"color",8,"currentColor"),d=l(a,"size",8,24),o=l(a,"strokeWidth",8,2),i=l(a,"absoluteStrokeWidth",8,!1),e=l(a,"iconNode",24,()=>[]);const h=(...u)=>u.filter((n,b,p)=>!!n&&p.indexOf(n)===b).join(" ");oe();var s=le();let t;var c=Z(s);se(c,1,e,re,(u,n)=>{let b=()=>z(n)[0],p=()=>z(n)[1];var y=q(),j=ae(y);ne(j,b,!0,(B,de)=>{let x;T(()=>x=C(B,x,{...p()}))}),E(u,y)});var f=$(c);G(f,a,"default",{}),ee(s),T((u,n)=>t=C(s,t,{...ie,..._,width:d(),height:d(),stroke:w(),"stroke-width":u,class:n}),[()=>i()?Number(o())*24/Number(d()):o(),()=>h("lucide-icon","lucide",v()?`lucide-${v()}`:"",m.class)],te),E(g,s),Y()}export{ge as I,ne as e};
