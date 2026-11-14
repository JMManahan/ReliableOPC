/* Employee portal: leave requests (employee form + admin approval). Data lives in Firestore via AUTH.leave (js/auth.js). */
(()=>{const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TYPES=['Vacation Leave','Sick Leave','Emergency Leave','Maternity / Paternity Leave','Bereavement Leave','Unpaid Leave','Other'];
const LBL={pending:'Pending',approved:'Approved',rejected:'Rejected'};
const days=(s,e)=>Math.round((new Date(e)-new Date(s))/864e5)+1;
const fd=d=>new Date(d+'T00:00').toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'});
const ft=t=>t&&t.toDate?t.toDate().toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'}):'just now';
const toast=(m,e)=>window.RBtoast&&RBtoast(m,e);
const range=r=>r.start==r.end?fd(r.start):fd(r.start)+' – '+fd(r.end);
const go=async()=>{const root=$('#lv');if(!root)return;await AUTH.ready;if(!AUTH.user||!AUTH.configured)return;
const admin=AUTH.isAdmin,u=AUTH.user;if(admin)$('.ph2 .eyebrow').textContent+=' · Admin';
root.innerHTML=`<div class="chips" id="ltabs" style="margin-bottom:28px"><button class="chip on" data-t="mine">Leave requests</button>${admin?'<button class="chip" data-t="admin">Review requests <em id="pc" style="font-style:normal;opacity:.7"></em></button>':''}</div>
<div id="p-mine" class="lvg"><form class="form lvform" id="lf"><h3 style="grid-column:1/-1">Request leave</h3>
<div class="fl f"><input id="l-name" placeholder=" " required maxlength="80" value="${esc(u.displayName||'')}"><label for="l-name">Full name</label></div>
<div class="fl f"><select id="l-type" required><option value="" hidden></option>${TYPES.map(t=>`<option>${t}</option>`).join('')}</select><label for="l-type">Type of leave</label></div>
<div class="fl"><input type="date" id="l-start" required><label for="l-start">From</label></div><div class="fl"><input type="date" id="l-end" required><label for="l-end">To</label></div>
<div class="dn f" id="l-days"></div>
<div class="fl f"><textarea id="l-reason" rows="4" placeholder=" " required minlength="5" maxlength="500"></textarea><label for="l-reason">Reason</label></div>
<button class="btn" type="submit">Submit request</button></form>
<div><h3 style="margin-bottom:16px">My requests</h3><div class="lst" id="mine"><p class="mut">Loading…</p></div></div></div>
${admin?`<div id="p-admin" hidden><div class="chips" id="afil" style="margin-bottom:22px"></div><div class="lst" id="alist"><p class="mut">Loading…</p></div></div>`:''}`;
/* tabs */
$('#ltabs').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;$$('#ltabs .chip').forEach(x=>x.classList.toggle('on',x==b));$('#p-mine').hidden=b.dataset.t!='mine';const pa=$('#p-admin');if(pa)pa.hidden=b.dataset.t!='admin'};
/* form */
const st=$('#l-start'),en=$('#l-end'),dn=$('#l-days'),upd=()=>{if(st.value)en.min=st.value;dn.textContent=st.value&&en.value&&en.value>=st.value?days(st.value,en.value)+' calendar day'+(days(st.value,en.value)==1?'':'s'):''};st.onchange=en.onchange=upd;
$('#lf').onsubmit=async ev=>{ev.preventDefault();const b=$('button',ev.target);if(en.value<st.value)return toast('The end date can’t be before the start date.',1);
b.disabled=true;b.textContent='Submitting…';
try{await AUTH.leave.submit({name:$('#l-name').value.trim(),type:$('#l-type').value,start:st.value,end:en.value,days:days(st.value,en.value),reason:$('#l-reason').value.trim()});
ev.target.reset();$('#l-name').value=AUTH.user.displayName||'';dn.textContent='';toast('Leave request submitted.');$('#who').textContent='Welcome, '+AUTH.user.displayName}
catch(err){toast(err.code=='permission-denied'?'Couldn’t submit. The database may not be set up yet. Please contact the administrator.':'Couldn’t submit. Please try again.',1)}
b.disabled=false;b.textContent='Submit request'};
/* lists */
const fail=el=>()=>{el.innerHTML='<p class="mut">Couldn’t load requests. The database may not be set up yet. Please contact the administrator.</p>'};
const by=(a,b)=>((b.createdAt&&b.createdAt.seconds)||9e12)-((a.createdAt&&a.createdAt.seconds)||9e12);
const row=(r,adm)=>`<article class="lr" data-id="${r.id}"><div class="lt"><div><b>${adm?esc(r.name||r.email):esc(r.type)}</b><small>${adm?esc(r.email)+' · '+esc(r.type):'Submitted '+ft(r.createdAt)}</small></div><span class="st st-${r.status}">${LBL[r.status]||r.status}</span></div>
<p class="ld">${range(r)} · ${r.days} day${r.days==1?'':'s'}</p><p class="lrs">${esc(r.reason)}</p>
${adm?`<small class="mut">Submitted ${ft(r.createdAt)}</small>`:''}
${r.status!='pending'?`<p class="dec">${LBL[r.status]} by ${esc(r.decidedBy||'admin')} on ${ft(r.decidedAt)}${r.adminNote?' · “'+esc(r.adminNote)+'”':''}</p>`:''}
${adm?`<div class="ac" ${r.status!='pending'?'hidden':''}><input class="an" placeholder="Note to employee (optional)" maxlength="300"><button class="btn sm ok" data-a="approved">Approve</button><button class="btn sm no" data-a="rejected">Reject</button></div>${r.status!='pending'?'<button class="cpy" data-chg>Change decision</button>':''}`
:(r.status=='pending'?'<button class="cpy" data-cancel>Cancel request</button>':'')}</article>`;
AUTH.leave.mine(L=>{$('#mine').innerHTML=L.length?L.sort(by).map(r=>row(r,0)).join(''):'<p class="mut">You haven’t submitted any leave requests yet.</p>'},fail($('#mine')));
if(admin){let A=[],F='pending';const draw=()=>{const n=s=>A.filter(r=>r.status==s).length;$('#pc').textContent=n('pending')?'('+n('pending')+')':'';
$('#afil').innerHTML=[['pending','Pending'],['approved','Approved'],['rejected','Rejected'],['all','All']].map(([k,l])=>`<button class="chip ${k==F?'on':''}" data-f="${k}">${l} <em style="font-style:normal;opacity:.6">${k=='all'?A.length:n(k)}</em></button>`).join('');
const L=A.filter(r=>F=='all'||r.status==F);$('#alist').innerHTML=L.length?L.map(r=>row(r,1)).join(''):'<p class="mut">No requests here.</p>'};
AUTH.leave.all(L=>{A=L;draw()},fail($('#alist')));
$('#afil').onclick=e=>{const b=e.target.closest('[data-f]');if(b){F=b.dataset.f;draw()}}}
/* actions */
root.onclick=async e=>{const t=e.target,c=t.closest('.lr');if(!c)return;const id=c.dataset.id;
try{if(t.dataset.a){t.disabled=true;await AUTH.leave.decide(id,t.dataset.a,$('.an',c).value.trim());toast('Request '+t.dataset.a+'.')}
else if(t.dataset.chg!==undefined){$('.ac',c).hidden=false;t.remove()}
else if(t.dataset.cancel!==undefined&&confirm('Cancel this leave request?')){await AUTH.leave.cancel(id);toast('Request cancelled.')}}
catch(err){toast('That didn’t work. Please try again.',1)}};
};
window.AUTH?go():addEventListener('rb-auth',go);
})();
