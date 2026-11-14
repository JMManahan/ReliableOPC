/* LEAVE SETTINGS: edit to match company policy. (Full guide: SETUP-LEAVE.md, part 2.) */
window.LEAVE_CONFIG={
  /* Yearly leave allowance in days, per type. Only types listed here show a balance; other types are not limited.
     !! These numbers are PLACEHOLDERS. Replace with your real policy. You can also override them without editing code:
        Firestore > settings > leave > allowance (for everyone), or balances > <employee UID> (for one person). */
  allowance:{'Vacation Leave':10,'Sick Leave':10,'Emergency Leave':3},
  /* Email notifications via EmailJS (same account as the contact form). Leave a template id '' to switch that email off. */
  emailService:'service_nrbv6os',
  emailKey:'-h1xGgsYz_QT-iGFFj',
  tplNew:'template_5erbe25',       /* sent to admins when an employee submits a request */
  tplDecision:'template_h405wud'   /* sent to the employee when an admin approves or rejects */
};
