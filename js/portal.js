/* Employee portal: leave requests + balances + team calendar + email notifications.
   Data lives in Firestore via AUTH.leave (js/auth.js); settings are in js/leave-config.js. */
(()=>{const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LC=window.LEAVE_CONFIG||{},YR=new Date().getFullYear();
const TYPES=['Vacation Leave','Sick Leave','Emergency Leave','Maternity / Paternity Leave','Bereavement Leave','Unpaid Leave','Other'];
const LBL={pending:'Pending',approved:'Approved',rejected:'Rejected'},MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
const days=(s,e)=>Math.round((new Date(e)-new Date(s))/864e5)+1,pl=n=>n==1?'':'s';
const fd=d=>new Date(d+'T00:00').toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'});
const ft=t=>t&&t.toDate?t.toDate().toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'}):'just now';
const iso=(y,m,d)=>y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
const toast=(m,e)=>window.RBtoast&&RBtoast(m,e),range=r=>r.start==r.end?fd(r.start):fd(r.start)+' – '+fd(r.end);
const link=location.origin+location.pathname.replace(/[^/]*$/,'')+'portal.html';
const mail=async(tpl,p)=>{if(!window.emailjs||!LC.emailService||!tpl)return;try{emailjs.init({publicKey:LC.emailKey});await emailjs.send(LC.emailService,tpl,{...p,portal_link:link})}catch(e){console.warn('Email not sent',e)}};
const go=async()=>{const root=$('#lv');if(!root)return;await AUTH.ready;if(!AUTH.user||!AUTH.configured)return;
const admin=AUTH.isAdmin,u=AUTH.user;if(admin)$('.ph2 .eyebrow').textContent+=' · Admin';
const cfg=await AUTH.leave.config();let mineL=[],allL=[],ov={},CAL=[],sel='',cm=new Date(YR,new Date().getMonth(),1);const reqs={};
const allow=k=>cfg.own[k]!==undefined?cfg.own[k]:cfg.base[k],tracked=()=>Object.keys(cfg.base).filter(k=>typeof cfg.base[k]=='number');
const sum=(L,k,s)=>L.filter(r=>r.type==k&&r.status==s&&String(r.start).slice(0,4)==YR).reduce((n,r)=>n+r.days,0);
root.innerHTML=`<div class="chips" id="ltabs" style="margin-bottom:28px"><button class="chip on" data-t="mine">Leave requests</button><button class="chip" data-t="cal">Team calendar</button>${admin?'<button class="chip" data-t="admin">Review requests <em id="pc" style="font-style:normal;opacity:.7"></em></button><button class="chip" data-t="bal">Balances</button>':''}</div>
<div class="pn" id="pn-mine"><div class="bal" id="bal"></div><div class="lvg"><form class="form lvform" id="lf"><h3 style="grid-column:1/-1">Request leave</h3>
<div class="fl f"><input id="l-name" placeholder=" " required maxlength="80" value="${esc(u.displayName||'')}"><label for="l-name">Full name</label></div>
<div class="fl f"><select id="l-type" required><option value="" hidden></option>${TYPES.map(t=>`<option>${t}</option>`).join('')}</select><label for="l-type">Type of leave</label></div>
<div class="fl"><input type="date" id="l-start" required><label for="l-start">From</label></div><div class="fl"><input type="date" id="l-end" required><label for="l-end">To</label></div>
<div class="dn f" id="l-days"></div>
<div class="fl f"><textarea id="l-reason" rows="4" placeholder=" " required minlength="5" maxlength="500"></textarea><label for="l-reason">Reason</label></div>
<button class="btn" type="submit">Submit request</button></form>
<div><h3 style="margin-bottom:16px">My requests</h3><div class="lst" id="mine"><p class="mut">Loading…</p></div></div></div></div>
<div class="pn" id="pn-cal" hidden><div class="cal" id="cal"></div></div>
${admin?`<div class="pn" id="pn-admin" hidden><div class="chips" id="afil" style="margin-bottom:22px"></div><div class="lst" id="alist"><p class="mut">Loading…</p></div></div>
<div class="pn" id="pn-bal" hidden><div id="abal"></div></div>`:''}`;
$('#ltabs').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;$$('#ltabs .chip').forEach(x=>x.classList.toggle('on',x==b));$$('.pn').forEach(p=>p.hidden=p.id!='pn-'+b.dataset.t)};
/* ---- my balances ---- */
const drawBal=()=>{$('#bal').innerHTML=tracked().map(k=>{const a=allow(k),used=sum(mineL,k,'approved'),pen=sum(mineL,k,'pending'),rem=a-used;
return `<div class="bc ${rem<0?'neg':''}"><small>${esc(k)}</small><b>${rem}</b><span>of ${a} day${pl(a)} left in ${YR}</span><i><u style="width:${a?Math.min(100,used/a*100):100}%"></u></i>${pen?`<em>${pen} day${pl(pen)} pending</em>`:''}</div>`}).join('')};
/* ---- form ---- */
const st=$('#l-start'),en=$('#l-end'),dn=$('#l-days'),ty=$('#l-type');
const avail=t=>typeof allow(t)=='number'?allow(t)-sum(mineL,t,'approved')-sum(mineL,t,'pending'):null;
const upd=()=>{if(st.value)en.min=st.value;const ok=st.value&&en.value&&en.value>=st.value,d=ok?days(st.value,en.value):0,a=ty.value?avail(ty.value):null;
let m=ok?d+' calendar day'+pl(d):'';if(a!==null)m+=(m?' · ':'')+a+' day'+pl(Math.abs(a))+' available'+(ok&&d>a?' (this request is more than your balance)':'');dn.textContent=m;dn.classList.toggle('warn',ok&&a!==null&&d>a)};
st.onchange=en.onchange=ty.onchange=upd;
$('#lf').onsubmit=async ev=>{ev.preventDefault();const b=$('button',ev.target);if(en.value<st.value)return toast('The end date can’t be before the start date.',1);
const d=days(st.value,en.value),t=ty.value,a=avail(t);if(a!==null&&d>a&&!confirm('This is more than your remaining '+t+' balance ('+a+' day'+pl(Math.abs(a))+'). Submit anyway?'))return;
const rec={name:$('#l-name').value.trim(),type:t,start:st.value,end:en.value,days:d,reason:$('#l-reason').value.trim()};b.disabled=true;b.textContent='Submitting…';
try{await AUTH.leave.submit(rec);ev.target.reset();$('#l-name').value=AUTH.user.displayName||'';dn.textContent='';toast('Leave request submitted.');$('#who').textContent='Welcome, '+AUTH.user.displayName;
cfg.adminEmails.forEach(to=>mail(LC.tplNew,{to_email:to,employee_name:rec.name,employee_email:u.email,leave_type:rec.type,start_date:fd(rec.start),end_date:fd(rec.end),days:rec.days,reason:rec.reason}))}
catch(err){toast(err.code=='permission-denied'?'Couldn’t submit. The database may not be set up yet. Please contact the administrator.':'Couldn’t submit. Please try again.',1)}
b.disabled=false;b.textContent='Submit request'};
/* ---- request cards ---- */
const fail=el=>()=>{el.innerHTML='<p class="mut">Couldn’t load requests. The database may not be set up yet. Please contact the administrator.</p>'};
const by=(a,b)=>((b.createdAt&&b.createdAt.seconds)||9e12)-((a.createdAt&&a.createdAt.seconds)||9e12);
const row=(r,adm)=>`<article class="lr" data-id="${r.id}"><div class="lt"><div><b>${adm?esc(r.name||r.email):esc(r.type)}</b><small>${adm?esc(r.email)+' · '+esc(r.type):'Submitted '+ft(r.createdAt)}</small></div><span class="st st-${r.status}">${LBL[r.status]||r.status}</span></div>
<p class="ld">${range(r)} · ${r.days} day${pl(r.days)}</p><p class="lrs">${esc(r.reason)}</p>${adm?`<small class="mut">Submitted ${ft(r.createdAt)}</small>`:''}
${r.status!='pending'?`<p class="dec">${LBL[r.status]} by ${esc(r.decidedBy||'admin')} on ${ft(r.decidedAt)}${r.adminNote?' · “'+esc(r.adminNote)+'”':''}</p>`:''}
${adm?`<div class="ac" ${r.status!='pending'?'hidden':''}><input class="an" placeholder="Note to employee (optional)" maxlength="300"><button class="btn sm ok" data-a="approved">Approve</button><button class="btn sm no" data-a="rejected">Reject</button></div>${r.status!='pending'?'<button class="cpy" data-chg>Change decision</button>':''}`:(r.status=='pending'?'<button class="cpy" data-cancel>Cancel request</button>':'')}</article>`;
AUTH.leave.mine(L=>{mineL=L;L.forEach(r=>reqs[r.id]=r);$('#mine').innerHTML=L.length?L.slice().sort(by).map(r=>row(r,0)).join(''):'<p class="mut">You haven’t submitted any leave requests yet.</p>';drawBal();upd()},fail($('#mine')));
/* ---- team calendar (approved leave of everyone; admins also see pending as dashed) ---- */
const drawCal=()=>{const y=cm.getFullYear(),m=cm.getMonth(),first=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate(),n=new Date(),today=iso(n.getFullYear(),n.getMonth(),n.getDate());
const evs=CAL.concat(admin?allL.filter(r=>r.status=='pending').map(r=>({name:r.name||r.email,start:r.start,end:r.end,p:1})):[]),on=d=>evs.filter(e=>e.start<=d&&d<=e.end);
let cells='';for(let i=0;i<first;i++)cells+='<div class="cd x"></div>';
for(let d=1;d<=dim;d++){const k=iso(y,m,d),L=on(k),w=new Date(y,m,d).getDay();cells+=`<div class="cd${k==today?' td':''}${w%6==0?' we':''}${sel==k?' sl':''}" data-d="${k}"><span class="dnum">${d}</span>${L.slice(0,3).map(e=>`<span class="ev${e.p?' pd':''}" title="${esc(e.name)}">${esc(String(e.name).split(' ')[0])}</span>`).join('')}${L.length>3?`<span class="mr">+${L.length-3} more</span>`:''}${L.length?`<span class="cnt">${L.length}</span>`:''}</div>`}
const names=L=>L.map(e=>esc(e.name)+(e.p?' (pending)':'')).join(', '),t0=on(today),sl=sel?on(sel):[];
$('#cal').innerHTML=`<div class="ch"><h3>${MON[m]} ${y}</h3><div class="chips"><button class="chip" data-nav="-1">← Prev</button><button class="chip" data-nav="0">Today</button><button class="chip" data-nav="1">Next →</button></div></div>
<p class="who"><b>Out today:</b> ${t0.length?names(t0):'<span class="mut">nobody</span>'}</p>
<div class="cg7">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x=>`<div class="wd">${x}</div>`).join('')}${cells}</div>
${sel?`<p class="who sd"><b>${fd(sel)}:</b> ${sl.length?names(sl):'<span class="mut">nobody out</span>'}</p>`:''}
<p class="mut" style="font-size:13px;margin-top:12px">Shows approved leave${admin?' (dashed = pending)':''}. Only names and dates are shown, never the reason.</p>`};
$('#cal').onclick=e=>{const nv=e.target.closest('[data-nav]'),dc=e.target.closest('.cd[data-d]');
if(nv){const v=+nv.dataset.nav;cm=v?new Date(cm.getFullYear(),cm.getMonth()+v,1):new Date(YR,new Date().getMonth(),1);drawCal()}else if(dc){sel=sel==dc.dataset.d?'':dc.dataset.d;drawCal()}};
AUTH.leave.calendar(L=>{CAL=L;drawCal()},()=>{$('#cal').innerHTML='<p class="mut">Couldn’t load the calendar. The database may not be set up yet.</p>'});drawCal();
/* ---- admin: review + balances ---- */
if(admin){let F='pending';
const drawAdmin=()=>{const n=s=>allL.filter(r=>r.status==s).length;$('#pc').textContent=n('pending')?'('+n('pending')+')':'';
$('#afil').innerHTML=[['pending','Pending'],['approved','Approved'],['rejected','Rejected'],['all','All']].map(([k,l])=>`<button class="chip ${k==F?'on':''}" data-f="${k}">${l} <em style="font-style:normal;opacity:.6">${k=='all'?allL.length:n(k)}</em></button>`).join('');
const L=allL.filter(r=>F=='all'||r.status==F);$('#alist').innerHTML=L.length?L.map(r=>row(r,1)).join(''):'<p class="mut">No requests here.</p>'};
const drawAbal=()=>{const T=tracked(),E={};allL.forEach(r=>{E[r.uid]=E[r.uid]||{name:r.name||r.email,email:r.email,uid:r.uid}});
const rows=Object.values(E).sort((a,b)=>a.name.localeCompare(b.name)).map(p=>`<tr><td><b>${esc(p.name)}</b><br><small class="mut">${esc(p.email)}</small></td>${T.map(k=>{const a=ov[p.uid]&&ov[p.uid][k]!==undefined?ov[p.uid][k]:cfg.base[k],used=sum(allL.filter(r=>r.uid==p.uid),k,'approved'),pen=sum(allL.filter(r=>r.uid==p.uid),k,'pending');return `<td class="${a-used<0?'neg':''}"><b>${a-used}</b> left<br><small class="mut">${used} of ${a} used${pen?' · '+pen+' pending':''}</small></td>`}).join('')}</tr>`).join('');
$('#abal').innerHTML=`<h3 style="margin-bottom:6px">Leave balances · ${YR}</h3><p class="mut" style="margin-bottom:16px">Approved days used this year against each allowance. Employees appear after their first request.</p>${rows?`<div class="tw"><table class="tb"><thead><tr><th>Employee</th>${T.map(k=>`<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`:'<p class="mut">No requests yet.</p>'}`};
AUTH.leave.all(L=>{allL=L;L.forEach(r=>reqs[r.id]=r);drawAdmin();drawAbal();drawCal()},fail($('#alist')));
AUTH.leave.overrides(m=>{ov=m;drawAbal()},()=>{});
$('#afil').onclick=e=>{const b=e.target.closest('[data-f]');if(b){F=b.dataset.f;drawAdmin()}}}
/* ---- card actions ---- */
root.onclick=async e=>{const t=e.target,c=t.closest('.lr');if(!c)return;const id=c.dataset.id,r=reqs[id];
try{if(t.dataset.a){t.disabled=true;const note=$('.an',c).value.trim();await AUTH.leave.decide(r,t.dataset.a,note);toast('Request '+t.dataset.a+'.');
mail(LC.tplDecision,{to_email:r.email,employee_name:r.name||'',status:t.dataset.a,leave_type:r.type,start_date:fd(r.start),end_date:fd(r.end),days:r.days,admin_note:note||'—',decided_by:AUTH.user.email})}
else if(t.dataset.chg!==undefined){$('.ac',c).hidden=false;t.remove()}
else if(t.dataset.cancel!==undefined&&confirm('Cancel this leave request?')){await AUTH.leave.cancel(id);toast('Request cancelled.')}}
catch(err){toast('That didn’t work. Please try again.',1)}};
};
window.AUTH?go():addEventListener('rb-auth',go);
})();
