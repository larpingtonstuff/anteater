const e=require("express"),m=require("multer"),p=require("path"),f=require("fs"),c=require("crypto"),a=e(),u=p.join(__dirname,"u"),w=p.join(__dirname,"p"),x=new Map;
f.mkdirSync(u,{recursive:true});f.mkdirSync(w,{recursive:true});
const z=m({dest:u,limits:{fileSize:536870912},fileFilter:(r,t,n)=>p.extname(t.originalname).toLowerCase()===".zip"?n(null,1):n(Error("zip"))});
a.use(e.static(w));
a.post("/r",z.single("z"),(r,t)=>{
 if(!r.file)return t.status(400).json({e:"zip"});
 let i=c.randomBytes(20).toString("hex"),q=p.join(u,i+".zip"),h=Date.now()+86400000;
 f.renameSync(r.file.path,q);x.set(i,{q,h});t.json({u:"/d/"+i,h});
});
a.get("/d/:i",(r,t)=>{
 let v=x.get(r.params.i);
 if(!v||Date.now()>v.h)return t.status(404).send("gone");
 t.download(v.q,"r.zip");
});
setInterval(()=>{
 for(let[i,v]of x)if(Date.now()>v.h){
  try{f.unlinkSync(v.q)}catch{}
  x.delete(i)
 }
},6e4);
a.listen(3e3);
