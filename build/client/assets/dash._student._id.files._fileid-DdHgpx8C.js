import{r,j as e}from"./index-TckX4F0b.js";import{u as h,F as b}from"./components-D27kuvza.js";function u(){const{fileDetails:a,comments:i,summary:d}=h(),[t,m]=r.useState(0),[n,c]=r.useState({}),x=(s,l)=>{c(o=>({...o,[s]:l}))};return e.jsxs("div",{className:"p-6",children:[e.jsx("h1",{className:"text-2xl font-bold mb-6",children:"File Details"}),e.jsxs("div",{className:"bg-white p-4 rounded-lg shadow mb-6",children:[e.jsx("h2",{className:"text-3xl mb-2",children:e.jsx("b",{children:a.name})}),e.jsx("p",{className:"mb-2",children:a.description}),e.jsxs("p",{className:"mb-1",children:[e.jsx("b",{children:"Uploaded by:"})," ",a.uploadedBy]}),e.jsxs("p",{className:"mb-1",children:[e.jsx("b",{children:"Date:"})," ",a.uploadDate]}),e.jsxs("p",{className:"mb-1",children:[e.jsx("b",{children:"Tags:"}),a.tags.map(s=>e.jsxs("span",{className:"bg-gray-200 m-1 text-gray-700 px-3 py-1 rounded-full",children:[s.name," (",s.relevanceScore," ★)"]},s.name))]}),e.jsxs("p",{className:"mb-1",children:[e.jsx("b",{children:"AI File Sentiment Analysis:"}),e.jsx("br",{}),d]}),e.jsx("div",{className:"mt-5 mb-2",children:e.jsx("a",{href:a.downloadUrl,className:"border border-black bg-white text-black px-4 py-2 rounded-3xl hover:bg-black hover:text-white transition mr-1.5 w-full mt-2",download:!0,children:"Download File"})})]}),e.jsxs("div",{className:"bg-white p-4 rounded-lg shadow",children:[e.jsx("h2",{className:"text-xl mb-4",children:"Previous Comments"}),i.map(s=>e.jsxs("div",{className:"border-b py-3",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("strong",{children:s.user}),e.jsxs("span",{className:"text-black-400",children:["★".repeat(s.rating)," (",s.rating,"/5)"]})]}),e.jsx("p",{className:"mt-2",children:s.comment})]},s.id))]}),e.jsxs(b,{method:"post",className:"bg-white p-4 rounded-lg shadow mt-6",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block mb-2",children:"Rating:"}),e.jsx("div",{className:"flex gap-2",children:[1,2,3,4,5].map(s=>e.jsx("button",{type:"button",onClick:()=>m(s),className:`text-2xl ${t>=s?"text-black-400":"text-gray-300"}`,children:"★"},s))})]}),e.jsx("hr",{}),e.jsx("br",{}),a.tags.map(s=>e.jsxs("div",{className:"mb-2 flex items-center",children:[e.jsxs("span",{className:"bg-gray-200 mb-1 text-gray-700 px-3 py-1 rounded-full",children:[s.name," (",s.relevanceScore," ★)"]}),e.jsx("div",{className:"flex gap-2 ml-2 mt-1",children:[0,.25,.5,.75,1].map(l=>e.jsx("button",{type:"button",onClick:()=>x(s.name,l),className:`text-xl ${n[s.name]>=l?"text-black-400":"text-gray-300"}`,children:"★"},l))})]},s.name)),e.jsx("input",{type:"hidden",name:"rating",value:t}),e.jsx("textarea",{name:"comment",className:"w-full border p-2 rounded",placeholder:"Write your comment...",rows:3}),a.tags.map(s=>e.jsx("input",{type:"hidden",name:"tagRating",value:JSON.stringify({tagName:s.name,rating:n[s.name]||0})},s.name)),e.jsx("button",{type:"submit",className:"border border-black bg-white text-black px-4 py-2 rounded-3xl hover:bg-black hover:text-white transition mr-1.5 mt-2",children:"Submit Review"})]})]})}export{u as default};
