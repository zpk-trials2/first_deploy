import { domeEmojis } from './emoji-data'

export interface MemoryItem {
  id: string
  type: 'image' | 'audio' | 'emoji'
  src?: string
  emoji?: string
  caption: string
  date?: string
  width?: number
  height?: number
  alt?: string
  duration?: number
}

// All memories: images (15 webp + 22 jpg/jpeg), audio (8), emojis (8)
export const allMemories: MemoryItem[] = [
  // WEBP IMAGES (15)
  { id: 'img1', type: 'image', src: '/memories/1.webp', caption: 'Memory #1', width: 400, height: 400, alt: 'Memory 1' },
  { id: 'img2', type: 'image', src: '/memories/2.webp', caption: 'Memory #2', width: 400, height: 400, alt: 'Memory 2' },
  { id: 'img3', type: 'image', src: '/memories/3.webp', caption: 'Memory #3', width: 400, height: 400, alt: 'Memory 3' },
  { id: 'img4', type: 'image', src: '/memories/4.webp', caption: 'Memory #4', width: 400, height: 400, alt: 'Memory 4' },
  { id: 'img5', type: 'image', src: '/memories/5.webp', caption: 'Memory #5', width: 400, height: 400, alt: 'Memory 5' },
  { id: 'img6', type: 'image', src: '/memories/6.webp', caption: 'Memory #6', width: 400, height: 400, alt: 'Memory 6' },
  { id: 'img7', type: 'image', src: '/memories/7.webp', caption: 'Memory #7', width: 400, height: 400, alt: 'Memory 7' },
  { id: 'img8', type: 'image', src: '/memories/8.webp', caption: 'Memory #8', width: 400, height: 400, alt: 'Memory 8' },
  { id: 'img9', type: 'image', src: '/memories/9.webp', caption: 'Memory #9', width: 400, height: 400, alt: 'Memory 9' },
  { id: 'img10', type: 'image', src: '/memories/10.webp', caption: 'Memory #10', width: 400, height: 400, alt: 'Memory 10' },
  { id: 'img11', type: 'image', src: '/memories/11.webp', caption: 'Memory #11', width: 400, height: 400, alt: 'Memory 11' },
  { id: 'img12', type: 'image', src: '/memories/12.webp', caption: 'Memory #12', width: 400, height: 400, alt: 'Memory 12' },
  { id: 'img13', type: 'image', src: '/memories/13.webp', caption: 'Memory #13', width: 400, height: 400, alt: 'Memory 13' },
  { id: 'img14', type: 'image', src: '/memories/14.webp', caption: 'Memory #14', width: 400, height: 400, alt: 'Memory 14' },
  { id: 'img15', type: 'image', src: '/memories/15.webp', caption: 'Memory #15', width: 400, height: 400, alt: 'Memory 15' },

  // JPEG/JPG IMAGES (22)
  { id: 'imgJ1', type: 'image', src: '/memories/Aapki_taste_gaane-prr.jpeg', caption: 'Aapki Taste Gaane', width: 400, height: 400 },
  { id: 'imgJ2', type: 'image', src: '/memories/First_approach_on_food.jpeg', caption: 'First Approach on Food', width: 400, height: 400 },
  { id: 'imgJ3', type: 'image', src: '/memories/God_finally_we_got_the_diva_out.jpeg', caption: 'God Finally We Got The Diva Out', width: 400, height: 400 },
  { id: 'imgJ4', type: 'image', src: '/memories/Heading_towards_Dehradun.jpeg', caption: 'Heading Towards Dehradun', width: 400, height: 400 },
  { id: 'imgJ5', type: 'image', src: '/memories/Highlight_of_our_Trip_Naagi.jpeg', caption: 'Highlight of Our Trip Naagi', width: 400, height: 400 },
  { id: 'imgJ6', type: 'image', src: '/memories/I_just_realized_this_is_your_version_of_groom_prep.jpeg', caption: 'I Just Realized This Is Your Version', width: 400, height: 400 },
  { id: 'imgJ7', type: 'image', src: '/memories/Its_a_small_world_after_all.jpeg', caption: "It's a Small World After All", width: 400, height: 400 },
  { id: 'imgJ8', type: 'image', src: '/memories/Last_moment_of_your_girlhood_captured.jpeg', caption: 'Last Moment of Your Girlhood', width: 400, height: 400 },
  { id: 'imgJ9', type: 'image', src: '/memories/Looks_like_she_finally_won_something.jpeg', caption: 'Looks Like She Finally Won Something', width: 400, height: 400 },
  { id: 'imgJ10', type: 'image', src: '/memories/Making_memories_with_my_best_friend.jpeg', caption: 'Making Memories With My Best Friend', width: 400, height: 400 },
  { id: 'imgJ11', type: 'image', src: '/memories/OG_Travellers.jpeg', caption: 'OG Travellers', width: 400, height: 400 },
  { id: 'imgJ12', type: 'image', src: '/memories/Picture_Perfect_Moment.jpeg', caption: 'Picture Perfect Moment', width: 400, height: 400 },
  { id: 'imgJ13', type: 'image', src: '/memories/Say_Cheese_Diksha.jpeg', caption: 'Say Cheese Diksha', width: 400, height: 400 },
  { id: 'imgJ14', type: 'image', src: '/memories/Serious_Gyan_Session.jpeg', caption: 'Serious Gyan Session', width: 400, height: 400 },
  { id: 'imgJ15', type: 'image', src: '/memories/So_this_happened.jpeg', caption: 'So This Happened', width: 400, height: 400 },
  { id: 'imgJ16', type: 'image', src: '/memories/The_groom_found_the_bride_finally.jpeg', caption: 'The Groom Found The Bride Finally', width: 400, height: 400 },
  { id: 'imgJ17', type: 'image', src: '/memories/This_is_what_family_feels_like.jpeg', caption: 'This Is What Family Feels Like', width: 400, height: 400 },
  { id: 'imgJ18', type: 'image', src: '/memories/This_is_what_we_came_for.jpeg', caption: 'This Is What We Came For', width: 400, height: 400 },
  { id: 'imgJ19', type: 'image', src: '/memories/Vibe_Check_PASSED.jpeg', caption: 'Vibe Check PASSED', width: 400, height: 400 },
  { id: 'imgJ20', type: 'image', src: '/memories/We_will_always_have_Paris.jpeg', caption: 'We Will Always Have Paris', width: 400, height: 400 },
  { id: 'imgJ21', type: 'image', src: '/memories/When_your_bestie_becomes_wifey_the_journey_happens_with_your_gang.jpeg', caption: 'When Your Bestie Becomes Wifey', width: 400, height: 400 },
  { id: 'imgJ22', type: 'image', src: '/memories/Your_pre_marital_glow_is_unmissable.jpeg', caption: 'Your Pre Marital Glow Is Unmissable', width: 400, height: 400 },

  // AUDIO FILES (8)
  { id: 'audio1', type: 'audio', src: '/memories/Invite_for_dance.opus', caption: 'Invite for Dance', duration: 45 },
  { id: 'audio2', type: 'audio', src: '/memories/MashUp_for_culturals.mp3', caption: 'MashUp for Culturals', duration: 420 },
  { id: 'audio3', type: 'audio', src: '/memories/padosi_gaane_2.opus', caption: 'Padosi Gaane 2', duration: 60 },
  { id: 'audio4', type: 'audio', src: '/memories/Roast_version_bollywood_insaane.opus', caption: 'Roast Version Bollywood Insaane', duration: 120 },
  { id: 'audio5', type: 'audio', src: '/memories/Roasting_isha_dance.opus', caption: 'Roasting Isha Dance', duration: 90 },
  { id: 'audio6', type: 'audio', src: '/memories/Roasting_version_of_diksha_personality.opus', caption: 'Roasting Version of Diksha', duration: 75 },
  { id: 'audio7', type: 'audio', src: '/memories/The_dumpling_tale.opus', caption: 'The Dumpling Tale', duration: 180 },
  { id: 'audio8', type: 'audio', src: '/memories/We_will_Rohit.opus', caption: 'We Will Rohit', duration: 150 },

  // EMOJI TILES (8 - from WhatsApp analysis)
  ...domeEmojis.map((em, idx) => ({
    id: `emoji${idx + 1}`,
    type: 'emoji' as const,
    emoji: em.emoji,
    caption: em.label,
    width: 150,
    height: 150,
  })),
]
