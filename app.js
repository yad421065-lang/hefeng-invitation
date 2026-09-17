import {createInvitationLink,readInvitationLink,validateInvitation} from './invitation-link.mjs?v=20260917';
const cover=document.getElementById('cover');
const invitation=document.getElementById('invitation');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let isOpening=false;
function openInvitation(){
 if(isOpening)return;
 isOpening=true;
 document.getElementById('open-invitation').disabled=true;
 cover.classList.add('opening');
 setTimeout(()=>cover.classList.add('exit'),reduceMotion?0:2050);
 setTimeout(()=>{
  cover.hidden=true;invitation.hidden=false;invitation.classList.add('entered');
  window.scrollTo(0,0);document.querySelector('h1').setAttribute('tabindex','-1');document.querySelector('h1').focus({preventScroll:true});
 },reduceMotion?40:2850);
}
document.getElementById('open-invitation').addEventListener('click',openInvitation);
document.getElementById('open-hint').addEventListener('click',openInvitation);
document.getElementById('close-invitation').addEventListener('click',()=>{
 invitation.hidden=true;cover.hidden=false;cover.classList.remove('opening','exit');isOpening=false;document.getElementById('open-invitation').disabled=false;window.scrollTo(0,0);document.getElementById('open-invitation').focus({preventScroll:true});
});

const $=id=>document.getElementById(id);
const localDate=new Date();
const today=[localDate.getFullYear(),String(localDate.getMonth()+1).padStart(2,'0'),String(localDate.getDate()).padStart(2,'0')].join('-');
const defaultInvitation={name:'XX',id:'HF2026 001',trait:'［沟通中打动我们的真实特点］',start:'2026-10-23',issue:today};
const initialLink=readInvitationLink(location.href);
const invitationData={...(initialLink.status==='valid'?initialLink.data:defaultInvitation)};
let isPersonalized=initialLink.status==='valid';
let currentSearch=location.search;
const formatDate=(value,style='long')=>{const [y,m,d]=value.split('-');return style==='short'?`${y}.${m}.${d}`:`${y}年${m}月${d}日`;};
$('receipt-date').value=today;$('custom-issue').value=today;
function applyInvitation(){
 document.querySelectorAll('[data-recipient]').forEach(el=>el.textContent=invitationData.name);
 document.querySelectorAll('[data-trait]').forEach(el=>el.textContent=invitationData.trait);
 document.querySelectorAll('[data-start-date]').forEach(el=>el.textContent=formatDate(invitationData.start,'short'));
 document.querySelectorAll('[data-start-date-long]').forEach(el=>el.textContent=formatDate(invitationData.start));
 document.querySelectorAll('[data-issue-date]').forEach(el=>el.textContent=formatDate(invitationData.issue));
 document.querySelectorAll('[data-invitation-id]').forEach(el=>el.textContent=invitationData.id.replace(/\s+/,' · '));
 const nameEl=$('personal-cover-name'),numEl=$('personal-cover-number');
 nameEl.hidden=invitationData.name==='XX';nameEl.textContent=`致 ${invitationData.name}`;
 numEl.hidden=invitationData.id==='HF2026 001';numEl.textContent=invitationData.id;
 document.querySelector('.cover-original').alt=`奶油白烫金信封，致 ${invitationData.name} 的和风传媒主播启程邀请函，邀请编号 ${invitationData.id}`;
 if(invitationData.name!=='XX'&&!$('receipt-name').value)$('receipt-name').value=invitationData.name;
 document.querySelectorAll('[data-share-invitation]').forEach(button=>button.hidden=!isPersonalized);
 document.title=isPersonalized?`致 ${invitationData.name} · 和风传媒启程邀请函`:'和风传媒 · 主播启程邀请函';
}
applyInvitation();
$('invitation-link-error').hidden=initialLink.status!=='invalid';
let toastTimer;
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3000);}
function openCustomize(){
 $('custom-name').value=invitationData.name;$('custom-id').value=invitationData.id;
 $('custom-trait').value=invitationData.trait.startsWith('［')?'':invitationData.trait;
 $('custom-start').value=invitationData.start;$('custom-issue').value=invitationData.issue;
 $('custom-error').textContent='';
 $('customize-dialog').showModal();
}
for(const button of document.querySelectorAll('[data-customize]'))button.addEventListener('click',openCustomize);
for(const button of document.querySelectorAll('[data-close-dialog]'))button.addEventListener('click',()=>button.closest('dialog').close());
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
$('customize-form').addEventListener('submit',event=>{
 event.preventDefault();
 for(const id of ['custom-name','custom-id','custom-trait']){const field=$(id);if(!field.value.trim()){field.setCustomValidity('请填写此项。');field.reportValidity();field.addEventListener('input',()=>field.setCustomValidity(''),{once:true});return;}}
 try{
  const data=validateInvitation({name:$('custom-name').value,id:$('custom-id').value,trait:$('custom-trait').value,start:$('custom-start').value,issue:$('custom-issue').value});
  const link=createInvitationLink(location.href,data);
  history.replaceState(null,'',link);currentSearch=location.search;
  // A new addressee must not inherit the previous recipient's reply or signature.
  if(data.name!==invitationData.name||data.id!==invitationData.id)resetReceipt();
  Object.assign(invitationData,data);isPersonalized=true;
  applyInvitation();$('invitation-link-error').hidden=true;$('customize-dialog').close();openShare();
 }catch(error){$('custom-error').textContent=error.message||'暂时无法生成链接，请重试。';}
});

function openShare(){
 if(!isPersonalized){openCustomize();return;}
 $('share-recipient').textContent=invitationData.name;$('share-number').textContent=invitationData.id;
 $('share-link').value=createInvitationLink(location.href,invitationData);
 $('share-feedback').textContent='';$('share-dialog').showModal();
}
for(const button of document.querySelectorAll('[data-share-invitation]'))button.addEventListener('click',openShare);
$('share-link').addEventListener('click',()=>{$('share-link').select();});
$('copy-invitation-link').addEventListener('click',async()=>{
 try{
  await navigator.clipboard.writeText($('share-link').value);
  $('share-feedback').textContent='专属链接已复制，可以粘贴发送给对方。';
 }catch{
  $('share-link').focus();$('share-link').select();$('share-link').setSelectionRange(0,$('share-link').value.length);
  $('share-feedback').textContent='请长按或使用复制快捷键，复制上方完整链接。';
 }
});

$('receipt-goal').addEventListener('input',()=>{$('goal-count').textContent=`${$('receipt-goal').value.length} / 160`;});
let signatureMode='typed',drawing=false,strokes=[],currentStroke=[];
const pad=$('signature-pad');const pen=pad.getContext('2d');
function resetReceipt(){
 $('receipt-form').reset();$('receipt-date').value=today;$('goal-count').textContent='0 / 160';
 strokes=[];currentStroke=[];drawing=false;renderStrokes();
 signatureMode='typed';$('typed-area').hidden=false;$('drawn-area').hidden=true;$('typed-signature').required=true;
 $('switch-signature').textContent='切换手写签名';$('form-error').textContent='';
 if(receiptUrl){URL.revokeObjectURL(receiptUrl);receiptUrl=undefined;$('receipt-preview').removeAttribute('src');$('download-receipt').removeAttribute('href');}
}
function resizePad(){
 const width=pad.clientWidth;if(!width)return;
 const ratio=window.devicePixelRatio||1;pad.width=Math.round(width*ratio);pad.height=Math.round(145*ratio);pen.setTransform(ratio,0,0,ratio,0,0);renderStrokes();
}
function renderStrokes(){
 const w=pad.clientWidth,h=145;pen.clearRect(0,0,w,h);pen.lineCap='round';pen.lineJoin='round';pen.strokeStyle='#6e4f2e';pen.lineWidth=2.2;
 for(const stroke of strokes){if(!stroke.length)continue;pen.beginPath();pen.moveTo(stroke[0][0]*w,stroke[0][1]*h);for(const p of stroke.slice(1))pen.lineTo(p[0]*w,p[1]*h);pen.stroke();}
}
function point(event){const r=pad.getBoundingClientRect();return [Math.max(0,Math.min(1,(event.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(event.clientY-r.top)/r.height))];}
pad.addEventListener('pointerdown',event=>{drawing=true;pad.setPointerCapture(event.pointerId);currentStroke=[point(event)];strokes.push(currentStroke);});
pad.addEventListener('pointermove',event=>{if(!drawing)return;currentStroke.push(point(event));renderStrokes();});
for(const name of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(name,()=>drawing=false);
$('clear-signature').addEventListener('click',()=>{strokes=[];renderStrokes();});
$('switch-signature').addEventListener('click',()=>{
 signatureMode=signatureMode==='typed'?'drawn':'typed';$('typed-area').hidden=signatureMode!=='typed';$('drawn-area').hidden=signatureMode!=='drawn';$('typed-signature').required=signatureMode==='typed';
 $('switch-signature').textContent=signatureMode==='typed'?'切换手写签名':'切换输入签名';
 if(signatureMode==='drawn')resizePad();else $('typed-signature').focus();$('form-error').textContent='';
});
window.addEventListener('resize',()=>{if(signatureMode==='drawn')resizePad();});

let receiptUrl;
window.addEventListener('popstate',()=>{
 if(currentSearch===location.search)return;
 currentSearch=location.search;const saved=readInvitationLink(location.href);
 isPersonalized=saved.status==='valid';Object.assign(invitationData,isPersonalized?saved.data:defaultInvitation);
 resetReceipt();applyInvitation();$('invitation-link-error').hidden=saved.status!=='invalid';
 for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
});
function drawReceipt(data){
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=2200;
 const ctx=canvas.getContext('2d');
 ctx.fillStyle='#f6f0e5';ctx.fillRect(0,0,1080,2200);
 const text=(value,x,y,size=28,color='#51432f',font='serif')=>{ctx.fillStyle=color;ctx.font=`${size}px ${font==='serif'?'"Songti SC", "Noto Serif CJK SC", serif':'"PingFang SC", sans-serif'}`;ctx.fillText(value,x,y);};
 const line=(y)=>{ctx.strokeStyle='#d1bfa2';ctx.beginPath();ctx.moveTo(90,y);ctx.lineTo(990,y);ctx.stroke();};
 function wrap(value,y,size=27,color='#675a46',lineHeight=47){ctx.font=`${size}px "PingFang SC",sans-serif`;let current='';for(const char of value){if(char==='\n'||ctx.measureText(current+char).width>900){text(current,90,y,size,color,'sans');y+=lineHeight;current=char==='\n'?'':char;}else current+=char;}if(current)text(current,90,y,size,color,'sans');return y+lineHeight;}
 text('HEFENG MEDIA',90,112,23,'#a07c48','sans');text('启程回执',90,212,64,'#77532d');text('THE ACCEPTANCE',90,261,19,'#9b7f58','sans');
 ctx.font='23px sans-serif';const idSize=Math.min(23,23*260/ctx.measureText(invitationData.id).width);text(invitationData.id,730,111,idSize,'#8e7048','sans');line(305);
 let y=365;y=wrap(`我，${data.name}，确认收到和风传媒的正式合作邀请，并愿意在合作启动前保持沟通，按双方确认的安排完成必要的开播准备。`,y,29,'#5a4c39',48);
 y+=30;text('拟选择的合作形式',90,y,24,'#9c7b4e','sans');y+=53;text(data.mode,90,y,34);y+=40;line(y);y+=58;
 text('我想通过直播做到的一件事',90,y,24,'#9c7b4e','sans');y+=52;y=wrap(data.goal.replace(/\s+/g,' '),y,30,'#51432f',46);y+=12;
 y=wrap('如我的时间或计划发生变化，我会提前与对接人说明。',y,23,'#8b7b63',40);y+=30;
 text('主播签名',90,y,24,'#9c7b4e','sans');text('签署日期',650,y,24,'#9c7b4e','sans');y+=52;
 if(signatureMode==='drawn'){const w=pad.clientWidth;ctx.strokeStyle='#6e4f2e';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';for(const stroke of strokes){if(!stroke.length)continue;ctx.beginPath();ctx.moveTo(90+stroke[0][0]*440,y-45+stroke[0][1]*100);for(const p of stroke.slice(1))ctx.lineTo(90+p[0]*440,y-45+p[1]*100);ctx.stroke();}}
 else {ctx.font='40px serif';const size=Math.min(40,40*440/ctx.measureText(data.signature).width);text(data.signature,90,y,size,'#76582e');}
 text(formatDate(data.date,'short'),650,y,28);y+=83;line(y);y+=65;text('和风对接人',90,y,24,'#9c7b4e','sans');text('确认日期',650,y,24,'#9c7b4e','sans');y+=56;
 ctx.strokeStyle='#c5b18f';ctx.beginPath();ctx.moveTo(90,y);ctx.lineTo(480,y);ctx.moveTo(650,y);ctx.lineTo(970,y);ctx.stroke();
 const legalY=Math.max(y+65,1330);const legalEnd=wrap('本邀请函用于表达双方合作意向与前期沟通确认，不替代正式合作协议。具体合作条件、权利义务及启动时间，以双方后续签署或确认的文件为准。',legalY,21,'#968369',36);
 const finalHeight=legalEnd+130;text('A MORE MEANINGFUL TOMORROW, TOGETHER.',90,legalEnd+50,18,'#9d825c','sans');ctx.strokeStyle='#bda27a';ctx.lineWidth=1.5;ctx.strokeRect(35,35,1010,finalHeight-70);ctx.strokeStyle='#dccbb0';ctx.strokeRect(46,46,988,finalHeight-92);const output=document.createElement('canvas');output.width=1080;output.height=finalHeight;output.getContext('2d').drawImage(canvas,0,0);return output;
}
$('receipt-form').addEventListener('submit',async event=>{
 event.preventDefault();$('form-error').textContent='';
 const data={name:$('receipt-name').value.trim(),mode:new FormData($('receipt-form')).get('mode'),goal:$('receipt-goal').value.trim(),signature:$('typed-signature').value.trim(),date:$('receipt-date').value};
 if(!data.name||!data.goal||(signatureMode==='typed'&&!data.signature)){$('form-error').textContent='请完整填写昵称、目标与签名。';return;}
 if(signatureMode==='drawn'&&!strokes.some(s=>s.length>2)){$('form-error').textContent='请先完成手写签名，或切换为输入签名。';return;}
 const canvas=drawReceipt(data);
 canvas.toBlob(blob=>{if(!blob){$('form-error').textContent='回执生成暂未完成，请重试。';return;}if(receiptUrl)URL.revokeObjectURL(receiptUrl);receiptUrl=URL.createObjectURL(blob);$('receipt-preview').src=receiptUrl;$('download-receipt').href=receiptUrl;$('download-receipt').download=`和风传媒-启程回执-${data.name.replace(/[\\/:*?"<>|]/g,'')}.png`;$('receipt-dialog').showModal();},'image/png');
});

if('IntersectionObserver' in window&&!reduceMotion){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}},{threshold:.08});
 for(const element of document.querySelectorAll('.letter-content,.section-intro,.story-card,.journey-heading,.journey-steps,.receipt-intro')){element.classList.add('reveal');observer.observe(element);}
}

function stageReceiptDraft(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('请输入回执草稿对象。');
 const allowed=['name','mode','goal','date'];if(Object.keys(input).some(key=>!allowed.includes(key)))throw new Error('不支持此字段。');
 if(input.name!==undefined&&(typeof input.name!=='string'||!input.name.trim()||input.name.length>24))throw new Error('姓名须为 1–24 个字符。');
 if(input.goal!==undefined&&(typeof input.goal!=='string'||!input.goal.trim()||input.goal.length>160))throw new Error('目标须为 1–160 个字符。');
 if(input.mode!==undefined&&!['线上开播','重庆线下开播','待确认'].includes(input.mode))throw new Error('请选择有效的合作形式。');
 if(input.date!==undefined&&(typeof input.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(input.date)||isNaN(Date.parse(input.date))))throw new Error('日期格式应为 YYYY-MM-DD。');
 if(input.name!==undefined)$('receipt-name').value=input.name.trim();if(input.goal!==undefined){$('receipt-goal').value=input.goal.trim();$('receipt-goal').dispatchEvent(new Event('input'));}
 if(input.date!==undefined)$('receipt-date').value=input.date;
 if(input.mode!==undefined){for(const radio of document.querySelectorAll('[name="mode"]'))radio.checked=radio.value===input.mode;}
 return {status:'draft_updated',name:$('receipt-name').value,mode:new FormData($('receipt-form')).get('mode'),goal:$('receipt-goal').value,date:$('receipt-date').value,generated:false,submitted:false};
}
if(document.modelContext?.registerTool){
 const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 const tools=[{name:'read_hefeng_invitation',description:'读取当前邀请姓名、编号和日期。',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:()=>({...invitationData})},{name:'stage_hefeng_receipt_draft',description:'填写可见回执草稿；不签名、不确认意向、不生成或发送回执。',inputSchema:{type:'object',properties:{name:{type:'string',minLength:1,maxLength:24},mode:{type:'string',enum:['线上开播','重庆线下开播','待确认']},goal:{type:'string',minLength:1,maxLength:160},date:{type:'string',format:'date'}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:stageReceiptDraft}];
 for(const tool of tools){try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}}
}
