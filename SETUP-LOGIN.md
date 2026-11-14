# Employee login setup (Firebase Authentication)

The website code is ready. These steps happen in your Firebase account (free "Spark" plan is enough). About 10 minutes.

1. **Create a project**: https://console.firebase.google.com → *Add project* (Google Analytics is optional; you can switch it off).
2. **Turn on email sign-in**: *Build → Authentication → Get started → Sign-in method → Email/Password → Enable* (the plain Email/Password option, not "Email link") → Save.
3. **Get your config**: *Project settings (gear icon) → Your apps → Web (</>) → Register app*. Copy the `firebaseConfig` values into **js/firebase-config.js** (apiKey, authDomain, projectId, appId). These values are public by design.
4. **Authorize your domain**: *Authentication → Settings → Authorized domains → Add domain*: add **www.reliableopc.com** (from your CNAME file) and, if you also use it, your `<username>.github.io` address. `localhost` is already there for testing.
5. **Create the employee accounts**: *Authentication → Users → Add user* (work email + temporary password). Employees can then use **Forgot password?** on the login page to set their own.
6. **Block self-registration (important)**: the config in step 3 is public, so without this anyone could create an account through Firebase's API. Go to *Authentication → Settings → User actions* and untick **Enable create (sign-up)**, then Save. In some projects the console shows this option only after upgrading to *Identity Platform* (it prompts you; the free usage tier is generous). Do this before going live. Also keep *Email enumeration protection* ticked.
7. **Test locally**: the login uses JavaScript modules, which browsers block when you double-click the file. In the project folder run `python3 -m http.server 8000` and open http://localhost:8000/login.html. After you deploy, it works on your normal domain.

## Good to know
- To remove an employee who leaves: *Authentication → Users →* disable or delete the account.
- Signing in only unlocks the **portal page**. The website files themselves are public, so **do not paste confidential information into the HTML**. When you're ready to add internal content, store it in a protected database (e.g. Firestore with rules like `allow read: if request.auth != null;`) and have the portal load it after sign-in. Ask me and I'll build that part.
