import{r as s,a as b,j as e}from"./index-Cd-j0Ewk.js";import{u as y}from"./components-J4jkiaDK.js";function v(){y();const[n,m]=s.useState([]),[l,d]=s.useState(!1),[r,p]=s.useState({title:"",description:""}),x=a=>{a.target.files&&m([...n,...Array.from(a.target.files)])},c=a=>{const{name:t,value:u}=a.target;p(i=>({...i,[t]:u}))},[g,f]=s.useState(!1);s.useEffect(()=>{f(!0)},[]);const o=b(),h=async a=>{a.preventDefault(),d(!0);try{const t=new FormData;if(t.append("title",r.title),t.append("description",r.description),n.forEach(i=>t.append("file",i)),!(await fetch("",{method:"POST",body:t})).ok)throw new Error("Failed to upload file or save metadata");alert("File uploaded and metadata saved successfully!"),o("/dash/{$id}/community-operated")}catch(t){console.error("Error:",t),alert("Failed to upload file or save metadata."),o("/404")}finally{d(!1)}};return e.jsx("div",{className:"flex flex-col h-screen p-4",children:e.jsxs("div",{className:`flex flex-col gap-6 bg-gray-50 bg-opacity-90 rounded-3xl shadow-2xl p-8 w-full transition-opacity duration-700 ${g?"opacity-100":"opacity-0"}`,children:[e.jsx("div",{className:"flex items-center justify-between",children:e.jsx("h1",{className:"text-3xl font-bold text-gray-800",children:"Study Material"})}),e.jsxs("form",{onSubmit:h,className:"bg-white rounded-2xl p-6 shadow-md",children:[e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block mb-2 text-sm font-medium text-gray-700",children:"Title"}),e.jsx("input",{type:"text",name:"title",value:r.title,onChange:c,required:!0,className:"block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block mb-2 text-sm font-medium text-gray-700",children:"Description"}),e.jsx("textarea",{name:"description",value:r.description,onChange:c,className:"block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block mb-2 text-sm font-medium text-gray-700",children:"Upload Files"}),e.jsx("input",{type:"file",multiple:!0,accept:"image/*,.pdf",onChange:x,required:!0,className:"block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"})]}),e.jsx("button",{type:"submit",disabled:l,className:`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 
            ${l?"bg-gray-400 cursor-not-allowed text-gray-200":"bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"}`,children:l?e.jsxs(e.Fragment,{children:[e.jsxs("svg",{className:"animate-spin h-5 w-5",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("span",{children:"Uploading..."})]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"h-5 w-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"})}),e.jsx("span",{children:"Upload"})]})})]})]})})}export{v as default};
