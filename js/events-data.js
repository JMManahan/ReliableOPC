/* ADD / EDIT EVENTS HERE. One block per event.
   id   = unique, no spaces (used in the link: event.html?id=...)
   c    = category (any name works: new categories appear as filter chips automatically)
   d    = date YYYY-MM-DD (sorting + year filter); dp = optional display text, e.g. 'March 2024'
   feat = true to show it in the "Event highlight" banner on the events page (several = rotating)
   desc = short summary (cards + highlight); body = optional list of paragraphs for the details page
   hl   = optional bullet list of key points; img = cover photo; gal = photos for the gallery
   Entries with sample:true show a "Sample" badge: delete them when you add real ones. */
const EV='img/events/';
const EVENTS=[
 {id:'brainlab-aspac-2024',feat:true,t:'Brainlab ASPAC Distributor Meeting',c:'Conventions',d:'2024-03-01',dp:'March 2024',loc:'',
  desc:'Reliable OPC joined Brainlab’s ASPAC distributor meeting, strengthening our partnership and our knowledge of the latest surgical technology.',
  img:'img/800x400/showcase1.png',gal:['img/800x400/showcase1.png']},
 {id:'sample-convention',sample:1,t:'Sample Convention Title',c:'Conventions',d:'2025-02-15',loc:'City, Philippines',
  desc:'Replace this with a short description of the event: what happened, who attended and what we showcased.',
  body:['Replace this with the full story of the event: the background, what the team presented and the people we met.','Add a second paragraph for outcomes, partnerships or follow-ups.'],
  hl:['Key point one','Key point two','Key point three'],img:EV+'sample-convention.png',gal:[EV+'sample-convention.png',EV+'sample-convention-2.png',EV+'sample-convention-3.png']},
 {id:'sample-workshop',feat:true,sample:1,t:'Sample Workshop Title',c:'Workshops',d:'2025-05-20',loc:'Hospital / Venue',
  desc:'Replace this with a short description of the workshop and the products or techniques covered.',
  body:['Replace this with the full description of the workshop: topics, hands-on sessions and who took part.'],
  hl:['Hands-on demonstration','Q&A with specialists'],img:EV+'sample-workshop.png',gal:[EV+'sample-workshop.png',EV+'sample-workshop-2.png']},
 {id:'sample-training',sample:1,t:'Sample Product Training',c:'Trainings',d:'2025-09-10',loc:'Reliable OPC Office',
  desc:'Replace this with a short description of the training: topic, trainer and attendees.',
  body:['Replace this with the full description of the training.'],img:EV+'sample-training.png',gal:[EV+'sample-training.png']},
 {id:'sample-training-2',sample:1,t:'Sample Technical Training',c:'Trainings',d:'2024-11-05',loc:'Cebu City',
  desc:'Replace this with a short description of the training: topic, trainer and attendees.',img:EV+'sample-training-2.png',gal:[EV+'sample-training-2.png']}
];
