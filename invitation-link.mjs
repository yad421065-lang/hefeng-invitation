// Each URL carries one complete invitation, independent of browser storage.
const limits={name:12,id:18,trait:100};
const keys=['name','id','trait','start','issue'];
function validDate(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<'1000-01-01')return false;
 const date=new Date(`${value}T00:00:00Z`);
 return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}
export function validateInvitation(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('邀请内容无效，请重新定制。');
 const data={};
 for(const key of keys){
  const value=input[key];
  if(key in limits){
   if(typeof value!=='string'||!value.trim()||value.trim().length>limits[key])throw new Error('请检查称呼、编号与特点的填写长度。');
   data[key]=value.trim();
  }else{
   if(!validDate(value))throw new Error('请填写有效日期，年份须为四位数。');
   data[key]=value;
  }
 }
 return data;
}
export function createInvitationLink(base,input){
 const data=validateInvitation(input);
 const bytes=new TextEncoder().encode(JSON.stringify([1,...keys.map(key=>data[key])]));
 const token=btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 const url=new URL(base);url.search='';url.hash='';url.searchParams.set('invite',token);
 return url.href;
}
export function readInvitationLink(href){
 try{
  const params=new URL(href).searchParams;
  if(!params.has('invite'))return {status:'empty'};
  const token=params.get('invite');
  if(params.getAll('invite').length!==1||!token||token.length>2048||!/^[\w-]+$/.test(token))throw new Error();
  const base64=token.replace(/-/g,'+').replace(/_/g,'/');
  const bytes=Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length/4)*4,'=')),char=>char.charCodeAt(0));
  const payload=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  if(!Array.isArray(payload)||payload.length!==6||payload[0]!==1)throw new Error();
  const data=validateInvitation(Object.fromEntries(keys.map((key,index)=>[key,payload[index+1]])));
  return {status:'valid',data};
 }catch{return {status:'invalid'};}
}
