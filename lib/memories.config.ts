export interface Memory {
  id: string
  type: "image" | "audio"
  src: string
  caption: string
  date?: string
  width?: number
  height?: number
}

export const memories: Memory[] = [
  // IMAGES - Sticker/GIF style (numbered)
  { id: "mem1", type: "image", src: "/memories/1.webp", caption: "Memory #1", width: 400, height: 400 },
  { id: "mem2", type: "image", src: "/memories/2.webp", caption: "Memory #2", width: 400, height: 400 },
  { id: "mem3", type: "image", src: "/memories/3.webp", caption: "Memory #3", width: 400, height: 400 },
  { id: "mem4", type: "image", src: "/memories/4.webp", caption: "Memory #4", width: 400, height: 400 },
  { id: "mem5", type: "image", src: "/memories/5.webp", caption: "Memory #5", width: 400, height: 400 },
  { id: "mem6", type: "image", src: "/memories/6.webp", caption: "Memory #6", width: 400, height: 400 },
  { id: "mem7", type: "image", src: "/memories/7.webp", caption: "Memory #7", width: 400, height: 400 },
  { id: "mem8", type: "image", src: "/memories/8.webp", caption: "Memory #8", width: 400, height: 400 },
  { id: "mem9", type: "image", src: "/memories/9.webp", caption: "Memory #9", width: 400, height: 400 },
  { id: "mem10", type: "image", src: "/memories/10.webp", caption: "Memory #10", width: 400, height: 400 },
  { id: "mem11", type: "image", src: "/memories/11.webp", caption: "Memory #11", width: 400, height: 400 },
  { id: "mem12", type: "image", src: "/memories/12.webp", caption: "Memory #12", width: 400, height: 400 },
  { id: "mem13", type: "image", src: "/memories/13.webp", caption: "Memory #13", width: 400, height: 400 },
  { id: "mem14", type: "image", src: "/memories/14.webp", caption: "Memory #14", width: 400, height: 400 },
  { id: "mem15", type: "image", src: "/memories/15.webp", caption: "Memory #15", width: 400, height: 400 },

  // NAMED IMAGES
  { id: "barfi", type: "image", src: "/memories/barfi.jpg", caption: "Barfi", date: "Shared moment", width: 600, height: 600 },
  { id: "sem1", type: "image", src: "/memories/sem1_lastday.jpg", caption: "Semester 1 Last Day", date: "End of an era", width: 600, height: 600 },
  { id: "streak", type: "image", src: "/memories/streak.jpg", caption: "Streak", date: "Consistency wins", width: 600, height: 600 },
  { id: "aapki_taste", type: "image", src: "/memories/Aapki_taste_gaane-prr.jpeg", caption: "Your Taste in Songs", width: 600, height: 600 },
  { id: "food_approach", type: "image", src: "/memories/First_approach_on_food.jpeg", caption: "First Approach on Food", width: 600, height: 600 },
  { id: "manati_dost", type: "image", src: "/memories/Manati_hui_dost.jpeg", caption: "Manati Hui Dost", date: "Cherished friendship", width: 600, height: 600 },
  { id: "mera_invite", type: "image", src: "/memories/Mera_invite.jpeg", caption: "My Invite", width: 600, height: 600 },
  { id: "mittai_paglu", type: "image", src: "/memories/Mittai_paglu.jpeg", caption: "Mittai Paglu", width: 600, height: 600 },
  { id: "my_promise", type: "image", src: "/memories/My_promise.jpeg", caption: "My Promise", date: "A vow", width: 600, height: 600 },
  { id: "never_giveup", type: "image", src: "/memories/Never_give-up.jpeg", caption: "Never Give Up", date: "Motivation", width: 600, height: 600 },
  { id: "roast", type: "image", src: "/memories/roast_pe_roast.jpeg", caption: "Roast pe Roast", date: "Funny times", width: 600, height: 600 },
  { id: "sharmati", type: "image", src: "/memories/sharmati_ladki.jpeg", caption: "Sharmati Ladki", width: 600, height: 600 },
  { id: "thappad", type: "image", src: "/memories/thappad.webp", caption: "Thappad", width: 600, height: 600 },
  { id: "touchwood", type: "image", src: "/memories/touchwood.jpeg", caption: "Touchwood", date: "Lucky charm", width: 600, height: 600 },

  // AUDIO FILES
  { id: "mashup", type: "audio", src: "/memories/MashUp_for_culturals.mp3", caption: "Mashup for Culturals", date: "Epic performance", width: 200, height: 200 },
  { id: "invite_dance", type: "audio", src: "/memories/Invite_for_dance.opus", caption: "Invite for Dance", width: 200, height: 200 },
  { id: "padosi_2", type: "audio", src: "/memories/padosi_gaane_2.opus", caption: "Padosi Gaane 2", width: 200, height: 200 },
  { id: "padosi_3", type: "audio", src: "/memories/padosi_gaane_3.opus", caption: "Padosi Gaane 3", width: 200, height: 200 },
  { id: "padosi_4", type: "audio", src: "/memories/padosi_gaane_4.opus", caption: "Padosi Gaane 4", width: 200, height: 200 },
  { id: "padosi_bf", type: "audio", src: "/memories/padosi_gaane_boyfriend_5.opus", caption: "Padosi Gaane Boyfriend", width: 200, height: 200 },
  { id: "marriage", type: "audio", src: "/memories/padosi_marriage_dancing.opus", caption: "Marriage Dancing", width: 200, height: 200 },
]
