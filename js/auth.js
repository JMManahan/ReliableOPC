/* EMPLOYEE SIGN-IN, powered by Firebase Authentication (email + password).
   Employees are created by an administrator in the Firebase console (see SETUP-LOGIN.md); nobody can self-register.
   NOTE: this protects the login and portal pages. Static files stay public, so never put confidential data
   in the HTML/JS files themselves; load it from a protected backend (e.g. Firestore with security rules). */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut,setPersistence,browserLocalPersistence,browserSessionPersistence,sendPasswordResetEmail,updateProfile} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import {getFirestore,collection,addDoc,query,where,orderBy,onSnapshot,doc,getDoc,updateDoc,deleteDoc,writeBatch,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
const cfg=window.FIREBASE_CONFIG||{},ok=!!cfg.apiKey&&!/YOUR_/.test(cfg.apiKey);
const MSG={'auth/invalid-credential':'Incorrect email or password.','auth/invalid-login-credentials':'Incorrect email or password.','auth/wrong-password':'Incorrect email or password.','auth/user-not-found':'Incorrect email or password.','auth/invalid-email':'Please enter a valid email address.','auth/user-disabled':'This account has been disabled. Please contact the administrator.','auth/too-many-requests':'Too many attempts. Please wait a few minutes and try again.','auth/network-request-failed':'Network error. Please check your connection.'};
const app=ok?initializeApp(cfg):null,auth=ok?getAuth(app):null,db=ok?getFirestore(app):null;
const A=window.AUTH={configured:ok,user:null,isAdmin:false,
  get name(){const u=this.user;if(!u)return '';const n=u.displayName||(u.email||'').split('@')[0].replace(/[._-]+/g,' ');return n.charAt(0).toUpperCase()+n.slice(1)},
  async signIn(email,pass,remember){
    if(!ok)throw new Error('Employee sign-in isn’t set up yet. Please contact the administrator.');
    try{await setPersistence(auth,remember?browserLocalPersistence:browserSessionPersistence);await signInWithEmailAndPassword(auth,email,pass)}
    catch(e){throw new Error(MSG[e.code]||'Sign-in failed. Please try again.')}
  },
  async reset(email){if(ok)await sendPasswordResetEmail(auth,email)},
  async signOut(){if(ok)await signOut(auth)},
  /* leave requests (Firestore collection "leaveRequests", protected by firestore.rules) */
  leave:{
    async submit(d){const u=A.user;if(d.name&&d.name!==u.displayName)await updateProfile(u,{displayName:d.name});
      await addDoc(collection(db,'leaveRequests'),{uid:u.uid,email:u.email,name:d.name,type:d.type,start:d.start,end:d.end,days:d.days,reason:d.reason,status:'pending',createdAt:serverTimestamp()})},
    mine(cb,er){return onSnapshot(query(collection(db,'leaveRequests'),where('uid','==',A.user.uid)),s=>cb(s.docs.map(x=>({id:x.id,...x.data()}))),er)},
    all(cb,er){return onSnapshot(query(collection(db,'leaveRequests'),orderBy('createdAt','desc')),s=>cb(s.docs.map(x=>({id:x.id,...x.data()}))),er)},
    /* approving also writes a privacy-safe entry (name + dates only, no reason/type) to the team calendar; rejecting removes it */
    async decide(r,status,note){const b=writeBatch(db),c=doc(db,'calendar',r.id);
      b.update(doc(db,'leaveRequests',r.id),{status,adminNote:note||'',decidedBy:A.user.email,decidedAt:serverTimestamp()});
      if(status=='approved')b.set(c,{uid:r.uid,name:r.name||r.email,start:r.start,end:r.end,requestId:r.id});else b.delete(c);
      await b.commit()},
    async config(){let s={},o={};
      try{s=(await getDoc(doc(db,'settings','leave'))).data()||{}}catch(e){}
      try{o=(await getDoc(doc(db,'balances',A.user.uid))).data()||{}}catch(e){}
      return{adminEmails:s.adminEmails||[],base:{...((window.LEAVE_CONFIG||{}).allowance||{}),...(s.allowance||{})},own:o}},
    overrides(cb,er){return onSnapshot(collection(db,'balances'),s=>{const m={};s.docs.forEach(x=>m[x.id]=x.data());cb(m)},er)},
    calendar(cb,er){return onSnapshot(collection(db,'calendar'),s=>cb(s.docs.map(x=>({id:x.id,...x.data()}))),er)},
    cancel(id){return deleteDoc(doc(db,'leaveRequests',id))}}};
/* "ready" resolves once Firebase has told us whether someone is signed in */
A.ready=new Promise(res=>{
  if(!ok){localStorage.removeItem('rb_session');return res()}
  onAuthStateChanged(auth,async u=>{A.user=u;A.isAdmin=false;
    if(u){localStorage.setItem('rb_session',JSON.stringify({email:u.email})); /* only used to label the menu link */
      try{A.isAdmin=(await getDoc(doc(db,'admins',u.uid))).exists()}catch(e){}}   /* admins = documents in the "admins" collection, see SETUP-LEAVE.md */
    else localStorage.removeItem('rb_session');
    res()});
});
dispatchEvent(new Event('rb-auth'));
