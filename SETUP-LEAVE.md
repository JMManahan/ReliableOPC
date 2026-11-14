# Leave requests setup (Firestore database)

Leave requests are stored in Firebase's **Firestore** database. Do these steps once, in the same Firebase project you used for the login. About 5 minutes.

1. **Create the database**: *Build → Firestore Database → Create database*. Choose **production mode** and a nearby location (e.g. Singapore, `asia-southeast1`).
2. **Publish the security rules** (this is what keeps requests private): *Firestore Database → Rules* tab → delete everything there → paste the full contents of **firestore.rules** from this project → **Publish**.
   - Employees can only create requests for themselves and read their own. They can cancel a request only while it is pending.
   - Only admins can approve or reject, and approving/rejecting can't change anything else on the request.
3. **Choose your admins**: in *Authentication → Users*, copy the admin's **User UID**. Then *Firestore Database → Start collection* → Collection ID: `admins` → Document ID: *paste the UID* → add any one field (e.g. `role` = `admin`) → Save. Repeat for each admin. An admin sees a **Review requests** tab in the portal.
   - Nobody can make themselves an admin from the website; this can only be done here in the console.
4. **Test**: sign in as an employee → submit a request → sign in as an admin → open *Review requests* → Approve or Reject. The employee sees the new status immediately.

## Good to know
- Days are counted as **calendar days** (every day from start to end, inclusive).
- The first time an employee submits, their full name is saved to their account and shown in the portal greeting.
- To remove an admin, delete their document in the `admins` collection.
- Not included yet (can be added): email notifications to admins, leave balances, a calendar view.
