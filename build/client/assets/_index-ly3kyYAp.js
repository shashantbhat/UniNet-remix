import{r,j as o,a}from"./index-Cd-j0Ewk.js";import{g as c}from"./index-DjKJqAo0.js";/* empty css                */const f=()=>{const i=r.useRef(null);return r.useEffect(()=>{var l;const e=i.current;if(e){const n=(l=e.textContent)==null?void 0:l.split("");e.textContent="",n==null||n.forEach(t=>{const s=document.createElement("span");s.textContent=t===" "?" ":t,s.style.display="inline-block",s.style.opacity="0",e.appendChild(s)}),c.fromTo(e.children,{opacity:0,y:20},{opacity:1,y:0,duration:.5,stagger:.1})}},[]),o.jsx("div",{style:{textAlign:"center",fontFamily:"cursive",fontSize:"4rem",color:"#000"},children:o.jsx("span",{ref:i,children:"Hello!"})})},u=()=>{const i=r.useRef(null),e=r.useRef(null),l=a();return r.useEffect(()=>{const n=i.current,t=e.current;return!n||!t?void 0:(c.set(t,{opacity:0,display:"none"}),c.timeline().to(n,{opacity:0,duration:1,delay:2}).to(n,{display:"none"}).set(t,{display:"flex"}).to(t,{opacity:1,duration:2,delay:1}).to(t,{opacity:0,duration:2,delay:1,onComplete:()=>{l("/sign-in")}}),()=>{})},[l]),o.jsxs("div",{className:"bg-gradient-animation",style:{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"},children:[o.jsx("div",{ref:i,children:o.jsx(f,{})}),o.jsx("div",{ref:e,className:"flex justify-center items-center h-screen  font-mono w-full whitespace-nowrap overflow-hidden",style:{fontFamily:"cursive",fontSize:"4rem"},children:"Welcome to UniNet!"})]})};export{u as default};
