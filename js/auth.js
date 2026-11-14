/* EMPLOYEE SIGN-IN, powered by Firebase Authentication (email + password).
   Employees are created by an administrator in the Firebase console (see SETUP-LOGIN.md); nobody can self-register.
   NOTE: this protects the login and portal pages. Static files stay public, so never put confidential data
   in the HTML/JS files themselves; load it from a protected backend (e.g. Firestore with security rules). */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut,setPersistence,browserLocalPersistence,browserSessionPersistence,sendPasswordResetEmail} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
const cfg=window.FIREBASE_CONFIG||{},ok=!!cfg.apiKey&&!/YOUR_/.test(cfg.apiKey);
const MSG={'auth/invalid-credential':'Incorrect email or password.','auth/invalid-login-credentials':'Incorrect email or password.','auth/wrong-password':'Incorrect email or password.','auth/user-not-found':'Incorrect email or password.','auth/invalid-email':'Please enter a valid email address.','auth/user-disabled':'This account has been disabled. Please contact the administrator.','auth/too-many-requests':'Too many attempts. Please wait a few minutes and try again.','auth/network-request-failed':'Network error. Please check your connection.'};
const auth=ok?getAuth(initializeApp(cfg)):null;
const A=window.AUTH={configured:ok,user:null,
  get name(){const u=this.user;if(!u)return '';const n=u.displayName||(u.email||'').split('@')[0].replace(/[._-]+/g,' ');return n.charAt(0).toUpperCase()+n.slice(1)},
  async signIn(email,pass,remember){
    if(!ok)throw new Error('Employee sign-in isn’t set up yet. Please contact the administrator.');
    try{await setPersistence(auth,remember?browserLocalPersistence:browserSessionPersistence);await signInWithEmailAndPassword(auth,email,pass)}
    catch(e){throw new Error(MSG[e.code]||'Sign-in failed. Please try again.')}
  },
  async reset(email){if(ok)await sendPasswordResetEmail(auth,email)},
  async signOut(){if(ok)await signOut(auth)}};
/* "ready" resolves once Firebase has told us whether someone is signed in */
A.ready=new Promise(res=>{
  if(!ok){localStorage.removeItem('rb_session');return res()}
  onAuthStateChanged(auth,u=>{A.user=u;
    if(u)localStorage.setItem('rb_session',JSON.stringify({email:u.email}));else localStorage.removeItem('rb_session'); /* only used to label the menu link */
    res()});
});
dispatchEvent(new Event('rb-auth'));
