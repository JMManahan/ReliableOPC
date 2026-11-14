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


---
# Part 2: email notifications, leave balances, team calendar

## A. Update your security rules (required)
Firestore Database → Rules → select everything, paste the new contents of **firestore.rules**, Publish. (It adds read-only `settings` and `balances`, and the `calendar`.) If the editor shows a parse error, type the first line `rules_version = '2';` by hand and paste the rest.

## B. Team calendar (no extra setup)
Approving a request adds the person's **name and dates only** to a shared calendar that every signed-in employee can see (never the reason or type of leave); rejecting or changing the decision removes it. Requests you approved *before* this update are not on the calendar yet: open them in *Review requests → Change decision* and Approve again.

## C. Leave balances
- Allowances are set in **js/leave-config.js** (`allowance`). **The numbers there are placeholders: change them to your real policy.** Only types listed there are limited; others (unpaid, maternity/paternity, etc.) are unlimited.
- Change them without editing code (optional): Firestore → collection `settings` → document `leave` → field `allowance` (type *map*), e.g. `Vacation Leave` = 12. This overrides the file.
- One person with a different allowance (e.g. a new hire): Firestore → collection `balances` → document ID = that employee's **UID** → fields like `Vacation Leave` = 6 (type *number*).
- Used days = **approved** requests whose start date is in the current year. Pending days are shown separately. Submitting more than the remaining balance asks the employee to confirm; admins still decide.
- Admins get a **Balances** tab listing everyone who has submitted a request.

## D. Email notifications (EmailJS)
Uses the same EmailJS account as your contact form (js/leave-config.js already has the service and key). Create **two new templates** in EmailJS → Email Templates → Create:

**Template 1: new request (to admins)** — *To Email:* `{{to_email}}` · *Subject:* `New leave request from {{employee_name}}`
```
{{employee_name}} ({{employee_email}}) submitted a leave request.

Type: {{leave_type}}
Dates: {{start_date}} to {{end_date}} ({{days}} day(s))
Reason: {{reason}}

Review it here: {{portal_link}}
```
**Template 2: decision (to the employee)** — *To Email:* `{{to_email}}` · *Subject:* `Your leave request was {{status}}`
```
Hi {{employee_name}},

Your {{leave_type}} request for {{start_date}} to {{end_date}} ({{days}} day(s)) was {{status}} by {{decided_by}}.

Note: {{admin_note}}

View it here: {{portal_link}}
```
Then copy each template's ID into **js/leave-config.js** (`tplNew` and `tplDecision`).

**Who gets the "new request" email?** Firestore → collection `settings` → document ID `leave` → field `adminEmails` (type *array*) → add each admin's email as a string. Only signed-in employees can read this list, so it is not public.

**Limits to know:** emails are sent from the browser through EmailJS (free plan has a monthly cap), so if someone closes the tab the instant they click, an email could be missed. The request itself is always saved. If emails ever fail, nothing breaks. For guaranteed delivery you would move this to a server (Firebase Cloud Functions, which needs a paid Blaze plan).
