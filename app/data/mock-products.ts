/**
 * Phase 0 mock catalogue — replace with API/CMS when ready.
 */

export interface MockProductProcess {
  title: string
  description: string
}

export interface MockProductSize {
  unit: string
  value: number[]
}

export type MockProductCategory =
  | 'Figurines'
  | 'Keychains'
  | 'Nameplates'
  | 'Lamps'
  | 'Sculptures'
  | 'Puzzles'
  | 'Home Decor'
  | 'Festival Gifts'
  | 'Wearables'
  | 'Bespoke'

export interface MockProductSocialVideo {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook'
  url: string
  label: string
}

export interface MockProduct {
  id: number
  /** Lower = higher prominence (1 = featured first). */
  rank: number
  head: string
  title: string
  subtitle: string
  descriptions: string[]
  processes: MockProductProcess[]
  care: string[]
  price: number
  priceNote: string
  /** Up to 10 still images shown after the gif in the gallery. */
  images: string[]
  /** Optional animated gif shown as the first gallery slide. */
  gif?: string
  material: string[]
  size: MockProductSize
  relatedProductIds: number[]
  /** Primary product category */
  category: MockProductCategory
  /** Searchable / filterable tags */
  tags: string[]
  /** Social media video links featuring this piece */
  socialVideos?: MockProductSocialVideo[]
}

// ─── Shared social video links (mock — point to real reels when available) ───
const IG_REEL = (label: string): MockProductSocialVideo => ({
  platform: 'instagram',
  url: 'https://www.instagram.com/hamro3d/',
  label,
})
const TT_VIDEO = (label: string): MockProductSocialVideo => ({
  platform: 'tiktok',
  url: 'https://www.tiktok.com/@hamro3d',
  label,
})
const YT_SHORT = (label: string): MockProductSocialVideo => ({
  platform: 'youtube',
  url: 'https://www.youtube.com/@hamro3d',
  label,
})
const FB_VIDEO = (label: string): MockProductSocialVideo => ({
  platform: 'facebook',
  url: 'https://www.facebook.com/hamro3d',
  label,
})

// Shared image pools for reuse across mock entries
const FIG = (n: number) => `/images/products/custom-human-figurine/${n}.png`
const KEY = (n: number) => `/images/products/keychain/${n}.png`
const NMP = () => `/images/products/nameplate/1.jpeg`

const figImgs = [FIG(1), FIG(2), FIG(3), FIG(4), FIG(1), FIG(2), FIG(3), FIG(4), FIG(1), FIG(2)]
const keyImgs = [KEY(1), KEY(2), KEY(3), KEY(4), KEY(1), KEY(2), KEY(3), KEY(4), KEY(1), KEY(2)]
const nmpImgs = [NMP(), FIG(1), FIG(2), FIG(3), NMP(), FIG(4), FIG(1), FIG(2), NMP(), FIG(3)]
const mixImgs = [FIG(1), KEY(1), FIG(2), KEY(2), FIG(3), KEY(3), FIG(4), KEY(4), FIG(1), KEY(1)]

const PRICE_NOTE_FULL = '100% prepayment required · Includes gift-ready packaging · Free delivery within Kathmandu'
const PRICE_NOTE_PARTIAL = '25% prepayment required · Includes gift-ready packaging · Free delivery within Kathmandu'

const CARE_FIGURINE = [
  'Keep away from direct sunlight to preserve the finish. Dust gently with a soft dry cloth. Do not expose to moisture or extreme heat.',
  'Your figurine is a precious object — treat it as one. Store on a flat, stable surface.',
]
const CARE_KEYCHAIN = [
  'Keep away from direct sunlight to preserve the finish. Dust gently with a soft dry cloth. Do not expose to moisture or extreme heat.',
]
const CARE_NAMEPLATE = ['Keep away from direct sunlight to prevent fading. Wipe with a soft, damp cloth.']
const CARE_LAMP = ['Avoid direct sunlight. Dust gently with a soft cloth. Do not expose to water or extreme heat. LED warranty covers defects for 1 year.']
const CARE_STONE = ['Stone and bronze are durable. Keep away from direct sunlight to preserve color. Dust gently with a soft cloth. Store safely.']

const DELIVER_STEP = { title: 'Deliver:', description: 'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.' }

export const mockProducts: MockProduct[] = [
  // ─── FIGURINES ───────────────────────────────────────────────────────────────
  {
    id: 0,
    rank: 2,
    head: 'FOR YOUR LOVE · PERSONALIZED PIECE',
    title: 'Custom Human Figurine',
    subtitle: 'A moment made permanent.',
    descriptions: [
      'A figurine is not a product. It is a moment made permanent — a person you love, rendered in physical form so they are never truly out of reach.',
      'Send us one clear photograph. Our artisans study your image, understand the person, and craft a piece that holds the feeling of them — not just their likeness.',
      'Every figurine is hand-finished and painted. No two are identical. Each arrives in our signature gift packaging with a handwritten commission card.',
    ],
    processes: [
      { title: 'Commission:', description: 'Place your order and share your reference photograph and any details about the person.' },
      { title: 'Craft:', description: 'Our team prints, refines, and hand-finishes your figurine over 2–3 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_FIGURINE,
    price: 1950,
    priceNote: PRICE_NOTE_PARTIAL,
    gif: '/gif/1.gif',
    images: figImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [10, 15, 17] },
    relatedProductIds: [8, 20, 3, 14],
    category: 'Figurines',
    tags: ['figurine', 'custom', 'personalized', 'gift', 'portrait', 'keepsake', 'anniversary', 'birthday'],
    socialVideos: [
      IG_REEL('Watch the making process — Instagram'),
      TT_VIDEO('Timelapse: sculpt to finish — TikTok'),
      YT_SHORT('Unboxing a custom figurine — YouTube'),
    ],
  },
  {
    id: 20,
    rank: 5,
    head: 'TOGETHER · COUPLE KEEPSAKE',
    title: 'Couple Figurine Set',
    subtitle: 'Two people. One piece.',
    descriptions: [
      'Two people who chose each other, made tangible. A couple figurine is not a gift — it is a declaration, held in your hands.',
      'Send us photos of both people. Our artisans craft each figure individually, then pose them together in a way that reflects your relationship.',
      'Delivered as a matched set, gift-boxed with a handwritten card. A piece for your shelf, your desk, your bedside table.',
    ],
    processes: [
      { title: 'Commission:', description: 'Share clear photographs of both people and any posing preferences.' },
      { title: 'Craft:', description: 'Each figure is printed and hand-finished separately before being posed together. Allow 3–4 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_FIGURINE,
    price: 3500,
    priceNote: PRICE_NOTE_PARTIAL,
    gif: '/gif/1.gif',
    images: figImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [12, 8, 18] },
    relatedProductIds: [0, 8, 21, 3],
    category: 'Figurines',
    tags: ['figurine', 'couple', 'wedding', 'anniversary', 'love', 'personalized', 'gift'],
    socialVideos: [
      IG_REEL('Couple figurine reveal — Instagram'),
      FB_VIDEO('Wedding gift unboxing — Facebook'),
    ],
  },
  {
    id: 21,
    rank: 8,
    head: 'FAMILY FOREVER · CHERISHED MEMORY',
    title: 'Family Figurine Set',
    subtitle: 'Everyone you love, in one piece.',
    descriptions: [
      'A family is not just people — it is every ordinary Tuesday, every shared meal, every quiet moment. We hold all of that in a single sculpture.',
      'From 3 to 6 family members, each figure crafted from photographs and posed together naturally. Children, parents, grandparents — all welcome.',
      'Arrives as a unified composition on a single base, gift-boxed with a card listing every name.',
    ],
    processes: [
      { title: 'Commission:', description: 'Share individual photos of each family member. Let us know the ages and any special details.' },
      { title: 'Design Review:', description: 'We share a 3D composition preview for approval before production begins.' },
      { title: 'Craft:', description: 'Printed and hand-finished over 4–5 weeks. No shortcuts.' },
      DELIVER_STEP,
    ],
    care: CARE_FIGURINE,
    price: 5500,
    priceNote: PRICE_NOTE_PARTIAL,
    images: figImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [20, 10, 18] },
    relatedProductIds: [0, 20, 8, 22],
    category: 'Figurines',
    tags: ['figurine', 'family', 'group', 'personalized', 'gift', 'keepsake', 'Dashain'],
    socialVideos: [
      IG_REEL('Family figurine set — Instagram'),
      TT_VIDEO('Crafting a family in miniature — TikTok'),
    ],
  },
  {
    id: 22,
    rank: 14,
    head: 'FOR YOUR PET · BELOVED COMPANION',
    title: 'Pet Figurine',
    subtitle: 'The one who never needs words.',
    descriptions: [
      'A pet is a daily presence — underfoot, curled in the corner, waiting at the door. We preserve that presence in a piece that lasts.',
      'Send us a clear photograph of your pet. Our artisans capture the posture, the fur, the particular way they hold themselves.',
      'Each pet figurine is hand-painted to match your animal\'s markings. It arrives in a velvet-lined box.',
    ],
    processes: [
      { title: 'Commission:', description: 'Share 2–3 photos of your pet from different angles. Note any distinctive markings.' },
      { title: 'Craft:', description: 'Printed and hand-painted over 2–3 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_FIGURINE,
    price: 1750,
    priceNote: PRICE_NOTE_PARTIAL,
    images: figImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [8, 10, 12] },
    relatedProductIds: [0, 20, 14, 3],
    category: 'Figurines',
    tags: ['figurine', 'pet', 'cat', 'dog', 'animal', 'personalized', 'gift'],
    socialVideos: [
      IG_REEL('Pet figurine making — Instagram'),
      TT_VIDEO('Your pet, in miniature — TikTok'),
    ],
  },
  // ─── KEYCHAINS ───────────────────────────────────────────────────────────────
  {
    id: 14,
    rank: 4,
    head: 'IN YOUR POCKET · MEMORY YOU CAN TOUCH',
    title: 'Keychain Figurine',
    subtitle: 'A small piece you carry everywhere.',
    descriptions: [
      'A keychain is the last thing you touch before you leave, and the first thing you touch when you return. Make it meaningful.',
      'We 3D print and hand-finish a custom charm from a photo, a sketch, or a memory. Small enough to carry. Significant enough to matter.',
      'Each keychain is made with durable PLA and attached to a quality metal ring. It arrives in a small velvet pouch, ready to become part of your daily ritual.',
    ],
    processes: [
      { title: 'Share Your Idea:', description: 'Send us a photo, sketch, or description of what matters to you.' },
      { title: 'Design:', description: 'We create a 3D model and send it for your approval.' },
      { title: 'Print & Finish:', description: 'We print, sand, paint, and finish your keychain over 1 week.' },
      DELIVER_STEP,
    ],
    care: CARE_KEYCHAIN,
    price: 1200,
    priceNote: PRICE_NOTE_PARTIAL,
    gif: '/gif/1.gif',
    images: keyImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [4, 3, 1] },
    relatedProductIds: [4, 0, 3, 22],
    category: 'Keychains',
    tags: ['keychain', 'custom', 'personalized', 'pocket', 'gift', 'daily', 'charm'],
    socialVideos: [
      IG_REEL('Keychain figurine — Instagram'),
      TT_VIDEO('Smallest figurine we make — TikTok'),
    ],
  },
  {
    id: 4,
    rank: 12,
    head: 'IN YOUR POCKET · MEMORY YOU CAN TOUCH',
    title: 'Memory Keychain',
    subtitle: 'A small piece you carry everywhere.',
    descriptions: [
      'A keychain is the last thing you touch before you leave, and the first thing you touch when you return. Make it meaningful.',
      'We 3D print and hand-finish a custom charm from a photo, a sketch, or a memory. Small enough to carry. Significant enough to matter.',
      'Each keychain is made with durable PLA and attached to a quality metal ring. It arrives in a small velvet pouch, ready to become part of your daily ritual.',
    ],
    processes: [
      { title: 'Share Your Idea:', description: 'Send us a photo, sketch, or description of what matters to you.' },
      { title: 'Design:', description: 'We create a 3D model and send it for your approval.' },
      { title: 'Print & Finish:', description: 'We print, sand, paint, and finish your keychain over 1 week.' },
      DELIVER_STEP,
    ],
    care: CARE_KEYCHAIN,
    price: 350,
    priceNote: PRICE_NOTE_FULL,
    gif: '/gif/1.gif',
    images: keyImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [4, 3, 1] },
    relatedProductIds: [14, 0, 3, 22],
    category: 'Keychains',
    tags: ['keychain', 'custom', 'pocket', 'gift', 'affordable', 'charm', 'everyday'],
    socialVideos: [
      IG_REEL('Memory keychain unboxing — Instagram'),
    ],
  },
  {
    id: 23,
    rank: 18,
    head: 'FOR EVERY OCCASION · GIFTING ESSENTIAL',
    title: 'Couple Keychain Set',
    subtitle: 'Two charms. One bond.',
    descriptions: [
      'A pair of keychains — each carrying the other\'s miniature. A quiet promise you carry every day.',
      'We craft matched sets based on couple photos. Each charm is unique, painted to match, and packed together in a single gift box.',
    ],
    processes: [
      { title: 'Share Photos:', description: 'Send us a photo of each person.' },
      { title: 'Craft:', description: 'Both charms printed and finished together over 1–2 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_KEYCHAIN,
    price: 800,
    priceNote: PRICE_NOTE_FULL,
    images: keyImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [4, 3, 1] },
    relatedProductIds: [14, 4, 20, 3],
    category: 'Keychains',
    tags: ['keychain', 'couple', 'love', 'pair', 'gift', 'anniversary', 'Valentine'],
    socialVideos: [
      IG_REEL('Couple keychain set — Instagram'),
      FB_VIDEO('Valentine gift idea — Facebook'),
    ],
  },
  // ─── NAMEPLATES ──────────────────────────────────────────────────────────────
  {
    id: 3,
    rank: 3,
    head: 'NAMEPLATE MEANING · CRAFTED IDENTITY',
    title: 'Custom Nameplate',
    subtitle: 'A name, made permanent.',
    descriptions: [
      'A nameplate is more than decoration. It is an acknowledgment — of a person, a place, a moment. We craft custom nameplates in materials that last.',
      'Tell us the name, the style, the space it will occupy. We design it to feel intentional, not mass-made.',
      'Every nameplate is hand-finished and inspected. It arrives ready to mount, with care instructions and a note about why it matters.',
    ],
    processes: [
      { title: 'Design Choice:', description: 'Select font and layout from our options or request a custom design.' },
      { title: 'Preview:', description: 'We send a digital mockup for your approval before production.' },
      { title: 'Craft:', description: 'Printed and finished over 1–2 weeks. Each piece is unique.' },
      DELIVER_STEP,
    ],
    care: CARE_NAMEPLATE,
    price: 1500,
    priceNote: PRICE_NOTE_FULL,
    gif: '/gif/1.gif',
    images: nmpImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [30, 10, 2] },
    relatedProductIds: [24, 0, 14, 8],
    category: 'Nameplates',
    tags: ['nameplate', 'custom', 'Devanagari', 'Nepali', 'wall', 'home', 'identity', 'personalized'],
    socialVideos: [
      IG_REEL('Custom nameplate — Instagram'),
      YT_SHORT('Nameplate: Nepali script in 3D — YouTube'),
    ],
  },
  {
    id: 24,
    rank: 10,
    head: 'YOUR HOME · YOUR NAME',
    title: 'Door Nameplate',
    subtitle: 'The first thing people see.',
    descriptions: [
      'A door nameplate is not just identification. It is a welcome — a statement that this space belongs to someone who cares.',
      'Available in Nepali script (Devanagari), English, or both. Choose your finish — matte, satin, or brushed.',
      'Weather-resistant material suitable for outdoor mounting. Arrives with fixtures and installation guide.',
    ],
    processes: [
      { title: 'Choose Script & Style:', description: 'Provide the name(s) in your preferred script and select a finish.' },
      { title: 'Preview:', description: 'Digital mockup sent for approval within 2 business days.' },
      { title: 'Craft:', description: 'Produced over 1 week.' },
      DELIVER_STEP,
    ],
    care: CARE_NAMEPLATE,
    price: 1800,
    priceNote: PRICE_NOTE_FULL,
    images: nmpImgs,
    material: ['PLA', 'Weather-resistant coating'],
    size: { unit: 'cm', value: [35, 12, 3] },
    relatedProductIds: [3, 25, 0, 14],
    category: 'Nameplates',
    tags: ['nameplate', 'door', 'outdoor', 'home', 'Nepali', 'Devanagari', 'weather-resistant'],
    socialVideos: [
      IG_REEL('Door nameplate install — Instagram'),
    ],
  },
  {
    id: 25,
    rank: 19,
    head: 'DESK IDENTITY · PROFESSIONAL PIECE',
    title: 'Office Desk Nameplate',
    subtitle: 'Your name, on your terms.',
    descriptions: [
      'A desk nameplate says: I am here. I do this work. It matters. We make them worthy of the person behind the desk.',
      'Choose from horizontal stand or angled display formats. Add a title beneath the name for added gravitas.',
    ],
    processes: [
      { title: 'Provide Details:', description: 'Share the name, title, and preferred layout.' },
      { title: 'Craft:', description: 'Produced and finished over 5–7 days.' },
      DELIVER_STEP,
    ],
    care: CARE_NAMEPLATE,
    price: 1200,
    priceNote: PRICE_NOTE_FULL,
    images: nmpImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [25, 8, 5] },
    relatedProductIds: [3, 24, 0, 14],
    category: 'Nameplates',
    tags: ['nameplate', 'desk', 'office', 'professional', 'corporate', 'gift'],
    socialVideos: [
      IG_REEL('Office desk nameplate — Instagram'),
    ],
  },
  // ─── LAMPS ───────────────────────────────────────────────────────────────────
  {
    id: 1,
    rank: 11,
    head: 'LET THEM GLOW · AMBIENT MEMORY',
    title: 'Portrait Litholamp',
    subtitle: 'A face in soft light.',
    descriptions: [
      'A litholamp transforms a photograph into a glowing portrait. Place it on a shelf, a desk, a bedside table. Each time the light is on, they are present.',
      'We etch your photograph into translucent lithophane material. When lit from behind, the portrait emerges in warm, diffused light — intimate, never harsh.',
      'Each litholamp is individually made. Arrives with an LED base, USB cable, and gift packaging.',
    ],
    processes: [
      { title: 'Submit Image:', description: 'Share a clear, well-lit portrait photograph.' },
      { title: 'Design Approval:', description: 'We show you a preview of how the etching will appear when lit.' },
      { title: 'Craft:', description: 'Lithophane etching takes 1–2 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_LAMP,
    price: 4200,
    priceNote: PRICE_NOTE_FULL,
    images: mixImgs,
    material: ['PLA', 'LED base'],
    size: { unit: 'cm', value: [12, 12, 15] },
    relatedProductIds: [2, 26, 8, 0],
    category: 'Lamps',
    tags: ['lamp', 'litholamp', 'portrait', 'light', 'photo', 'glow', 'ambient', 'gift'],
    socialVideos: [
      IG_REEL('Litholamp in the dark — Instagram'),
      YT_SHORT('Portrait litholamp unboxing — YouTube'),
      TT_VIDEO('How a litholamp is made — TikTok'),
    ],
  },
  {
    id: 2,
    rank: 13,
    head: 'UNDER THE STARS · MOONLIGHT MEMORY',
    title: 'Moon Lamp',
    subtitle: 'Your moment, illuminated.',
    descriptions: [
      'A moon lamp is not a light. It is a fragment of a memory, suspended and glowing. Customize it with a date — the night everything changed.',
      'We 3D print a detailed moon replica based on the exact lunar phase for your chosen date. Soft LED lighting gives it the feel of holding a piece of the sky.',
      'Each moon lamp is hand-finished and tested. Arrives with LED base, power adapter, and a card noting your chosen date.',
    ],
    processes: [
      { title: 'Choose Your Moment:', description: "Tell us the date and we'll match the exact moon phase." },
      { title: 'Personalize:', description: 'Add a name, date, or short message engraved on the base.' },
      { title: 'Print & Finish:', description: 'Printed and hand-finished over 2–3 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_LAMP,
    price: 3800,
    priceNote: PRICE_NOTE_FULL,
    images: mixImgs,
    material: ['PLA', 'LED base'],
    size: { unit: 'cm', value: [15, 15, 18] },
    relatedProductIds: [1, 26, 8, 0],
    category: 'Lamps',
    tags: ['lamp', 'moon', 'lunar', 'night', 'date', 'anniversary', 'romantic', 'gift'],
    socialVideos: [
      IG_REEL('Moon lamp — your date in light — Instagram'),
      TT_VIDEO('Moon lamp timelapse — TikTok'),
    ],
  },
  {
    id: 26,
    rank: 20,
    head: 'WARM GLOW · AMBIENT PRESENCE',
    title: 'Name Night Light',
    subtitle: 'Their name in light.',
    descriptions: [
      'A child\'s name, softly lit. A bedside comfort that says: you are known, you are loved.',
      'We craft custom name lamps in Nepali or English script. Each letter is individually made and assembled into a warm-glowing display.',
      'Available in warm white or colour-changing modes. Arrives gift-boxed with USB power cable.',
    ],
    processes: [
      { title: 'Provide the Name:', description: 'Share the name and preferred script.' },
      { title: 'Craft:', description: 'Produced over 1–2 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_LAMP,
    price: 2800,
    priceNote: PRICE_NOTE_FULL,
    images: mixImgs,
    material: ['PLA', 'LED strip'],
    size: { unit: 'cm', value: [40, 8, 10] },
    relatedProductIds: [1, 2, 3, 24],
    category: 'Lamps',
    tags: ['lamp', 'name', 'night light', 'Nepali', 'children', 'bedroom', 'gift', 'glow'],
    socialVideos: [
      IG_REEL('Name night light — Instagram'),
      FB_VIDEO('Name lamp gift for kids — Facebook'),
    ],
  },
  // ─── SCULPTURES & MILESTONE PIECES ──────────────────────────────────────────
  {
    id: 8,
    rank: 1,
    head: 'MILESTONE MARKED · TIME IN PHYSICAL FORM',
    title: 'Anniversary Sculpture',
    subtitle: 'Years together, made tangible.',
    descriptions: [
      'An anniversary is a moment to acknowledge: we chose each other again, and again. We turn that choice into a sculpture.',
      'We design a custom piece that represents your years together — intertwined lines, stacked years, or a moment from your story, rendered in PLA or resin.',
      'Each sculpture is hand-finished. Arrives with a certificate explaining its meaning and space to add your names.',
    ],
    processes: [
      { title: 'Share Your Story:', description: 'Tell us how many years, what matters most, any symbols that resonate.' },
      { title: 'Design:', description: 'We sketch 2–3 design options for your approval.' },
      { title: 'Craft:', description: 'Casting and hand-finishing takes 3–5 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_STONE,
    price: 15000,
    priceNote: PRICE_NOTE_FULL,
    gif: '/gif/1.gif',
    images: figImgs,
    material: ['PLA', 'Resin'],
    size: { unit: 'cm', value: [15, 10, 20] },
    relatedProductIds: [0, 20, 3, 27],
    category: 'Sculptures',
    tags: ['sculpture', 'anniversary', 'milestone', 'couple', 'love', 'premium', 'bespoke'],
    socialVideos: [
      IG_REEL('Anniversary sculpture reveal — Instagram'),
      YT_SHORT('Milestone in physical form — YouTube'),
    ],
  },
  {
    id: 27,
    rank: 15,
    head: 'IN REMEMBRANCE · A LASTING TRIBUTE',
    title: 'Memorial Piece',
    subtitle: 'So they are never truly gone.',
    descriptions: [
      'Grief asks: where do I put this? We answer with an object — a piece that holds the memory of someone who mattered, somewhere you can see it.',
      'We create memorial pieces from photographs — figurines, portrait lamps, or sculptural tributes. You choose the form. We bring them back.',
      'Each memorial piece is handled with the utmost care. Delivered personally within Kathmandu, never left at a doorstep.',
    ],
    processes: [
      { title: 'Tell Us About Them:', description: 'Share photographs and a few words about who they were.' },
      { title: 'Choose the Form:', description: 'Figurine, litholamp, or sculptural tribute — we advise based on your story.' },
      { title: 'Craft:', description: '3–5 weeks. Handled with complete care and discretion.' },
      DELIVER_STEP,
    ],
    care: CARE_FIGURINE,
    price: 4500,
    priceNote: '50% prepayment required · Includes premium gift packaging · Personal delivery within Kathmandu',
    images: figImgs,
    material: ['PLA', 'Resin'],
    size: { unit: 'cm', value: [12, 8, 18] },
    relatedProductIds: [8, 0, 1, 20],
    category: 'Sculptures',
    tags: ['memorial', 'remembrance', 'tribute', 'figurine', 'lamp', 'grief', 'healing'],
    socialVideos: [
      IG_REEL('A tribute, handcrafted — Instagram'),
    ],
  },
  // ─── PUZZLES ─────────────────────────────────────────────────────────────────
  {
    id: 5,
    rank: 6,
    head: 'PUZZLE OF A MOMENT · PIECE BY PIECE',
    title: '3D Dinosaur Puzzle',
    subtitle: 'Build a memory together.',
    descriptions: [
      'A puzzle is a conversation. Building it together is the gift. We create custom 3D puzzles that turn a quiet afternoon into a memory.',
      'Choose a theme — dinosaurs, animals, landmarks, or a custom design. Each piece is precision-printed so they fit together perfectly.',
      'Each puzzle arrives in a beautiful box with an illustration of the finished piece and a personal note.',
    ],
    processes: [
      { title: 'Choose Theme:', description: 'Pick from our designs or request a custom creation.' },
      { title: 'Customize:', description: "Tell us who this is for and why it matters. We'll include it in the box." },
      { title: 'Print & Prepare:', description: 'We print each piece, sand smooth, and pack carefully over 1–2 weeks.' },
      DELIVER_STEP,
    ],
    care: ['Store pieces in the provided box. Keep away from moisture and heat. Handle gently during building.'],
    price: 2500,
    priceNote: PRICE_NOTE_FULL,
    gif: '/gif/1.gif',
    images: [FIG(3), FIG(4), FIG(1), FIG(2), FIG(3), FIG(4), FIG(1), FIG(2), FIG(3), FIG(4)],
    material: ['PLA'],
    size: { unit: 'cm', value: [20, 20, 5] },
    relatedProductIds: [28, 0, 14, 3],
    category: 'Puzzles',
    tags: ['puzzle', '3D', 'dinosaur', 'children', 'gift', 'educational', 'fun', 'activity'],
    socialVideos: [
      IG_REEL('3D dino puzzle build — Instagram'),
      TT_VIDEO('Puzzle assembly timelapse — TikTok'),
    ],
  },
  {
    id: 28,
    rank: 22,
    head: 'PUZZLE OF A MOMENT · PIECE BY PIECE',
    title: 'Custom Photo Puzzle',
    subtitle: 'Your memory, reassembled.',
    descriptions: [
      'Take a photograph that matters and turn it into a puzzle. Assemble it once, frame it, keep it. Or rebuild it every time you need the memory.',
      'We 3D engrave your photograph onto puzzle-cut panels, with each piece cleanly edged and easy to handle.',
    ],
    processes: [
      { title: 'Submit Photo:', description: 'Share a high-resolution image in landscape orientation.' },
      { title: 'Craft:', description: 'Engraved and cut over 1–2 weeks.' },
      DELIVER_STEP,
    ],
    care: ['Store in the provided box. Keep away from moisture. Each piece is durable but handle with care.'],
    price: 1800,
    priceNote: PRICE_NOTE_FULL,
    images: [FIG(1), FIG(2), FIG(3), FIG(4), FIG(1), FIG(2), FIG(3), FIG(4), FIG(1), FIG(2)],
    material: ['PLA'],
    size: { unit: 'cm', value: [20, 15, 1] },
    relatedProductIds: [5, 0, 14, 3],
    category: 'Puzzles',
    tags: ['puzzle', 'photo', 'custom', 'memory', 'gift', 'personalised', 'activity'],
    socialVideos: [
      IG_REEL('Photo puzzle unboxing — Instagram'),
    ],
  },
  // ─── DESK & HOME DECOR ───────────────────────────────────────────────────────
  {
    id: 29,
    rank: 9,
    head: 'ON YOUR DESK · DAILY REMINDER',
    title: 'Custom Desk Sculpture',
    subtitle: 'Art that earns its place.',
    descriptions: [
      'A desk sculpture is the one object on your workspace that is entirely yours. Not functional. Not decorative. Meaningful.',
      'We work with you to design a form that represents something personal — a value, a memory, a person, a milestone.',
      'Compact enough for any desk. Significant enough to notice every morning.',
    ],
    processes: [
      { title: 'Describe Your Meaning:', description: 'Tell us what you want to hold in the piece.' },
      { title: 'Design:', description: 'We propose 2–3 sculptural forms.' },
      { title: 'Craft:', description: 'Produced over 2–3 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_STONE,
    price: 3200,
    priceNote: PRICE_NOTE_PARTIAL,
    images: mixImgs,
    material: ['PLA', 'Resin'],
    size: { unit: 'cm', value: [10, 10, 15] },
    relatedProductIds: [8, 3, 25, 0],
    category: 'Home Decor',
    tags: ['desk', 'sculpture', 'office', 'art', 'meaningful', 'bespoke', 'home'],
    socialVideos: [
      IG_REEL('Desk sculpture — Instagram'),
    ],
  },
  {
    id: 30,
    rank: 23,
    head: 'WALL ART · MEMORY ON DISPLAY',
    title: 'Custom Wall Relief',
    subtitle: 'Memories worth hanging.',
    descriptions: [
      'A wall relief is a photograph made three-dimensional. It has depth, shadow, presence. It changes with the light in the room.',
      'We take your chosen image and render it as a hand-finished relief sculpture, ready to hang.',
    ],
    processes: [
      { title: 'Submit Image:', description: 'Provide a high-resolution photograph or illustration.' },
      { title: 'Craft:', description: 'Relief modelled and finished over 2–3 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_STONE,
    price: 5000,
    priceNote: PRICE_NOTE_FULL,
    images: mixImgs,
    material: ['PLA', 'Resin'],
    size: { unit: 'cm', value: [30, 30, 3] },
    relatedProductIds: [29, 8, 3, 0],
    category: 'Home Decor',
    tags: ['wall art', 'relief', '3D', 'photo', 'home', 'interior', 'gift'],
    socialVideos: [
      IG_REEL('Wall relief in natural light — Instagram'),
      YT_SHORT('Custom wall art process — YouTube'),
    ],
  },
  // ─── FESTIVAL & OCCASION GIFTS ───────────────────────────────────────────────
  {
    id: 31,
    rank: 7,
    head: 'DASHAIN · TIHAR · FESTIVAL GIFT',
    title: 'Festival Gift Set',
    subtitle: 'Crafted for the occasions that matter most.',
    descriptions: [
      'Dashain. Tihar. Weddings. These are the moments that define us as a family, as a culture. We create gifts worthy of them.',
      'Our festival sets combine a keychain figurine, a custom nameplate, and a handwritten story card — curated for the person you are celebrating.',
      'Every set is gift-boxed and arrives with a personal note from our studio in Kathmandu.',
    ],
    processes: [
      { title: 'Commission:', description: 'Share the occasion and the recipient. We advise on the best combination.' },
      { title: 'Craft:', description: 'Each piece made over 1–2 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_KEYCHAIN,
    price: 2200,
    priceNote: PRICE_NOTE_FULL,
    images: mixImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [20, 15, 8] },
    relatedProductIds: [14, 3, 0, 20],
    category: 'Festival Gifts',
    tags: ['festival', 'Dashain', 'Tihar', 'gift set', 'Nepal', 'occasion', 'keychain', 'nameplate'],
    socialVideos: [
      IG_REEL('Festival gift set — Instagram'),
      FB_VIDEO('Dashain gifting idea — Facebook'),
    ],
  },
  {
    id: 32,
    rank: 16,
    head: 'WEDDING GIFT · FOREVER TOGETHER',
    title: 'Wedding Keepsake',
    subtitle: 'The beginning of forever.',
    descriptions: [
      'A wedding gift should last as long as the marriage. We create custom keepsakes that grow more meaningful with every year.',
      'Choose from a couple figurine, a custom anniversary-ready nameplate, or a date-personalized moon lamp.',
      'Each wedding piece arrives in premium packaging with a sealed note for the couple.',
    ],
    processes: [
      { title: 'Choose the Form:', description: 'Figurine, nameplate, or lamp — we advise based on your vision.' },
      { title: 'Personalize:', description: 'Names, dates, and a personal message included.' },
      { title: 'Craft:', description: '2–3 weeks depending on the chosen form.' },
      DELIVER_STEP,
    ],
    care: CARE_FIGURINE,
    price: 4000,
    priceNote: PRICE_NOTE_PARTIAL,
    images: figImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [15, 10, 20] },
    relatedProductIds: [20, 8, 3, 1],
    category: 'Festival Gifts',
    tags: ['wedding', 'couple', 'gift', 'keepsake', 'love', 'anniversary', 'personalized'],
    socialVideos: [
      IG_REEL('Wedding keepsake reveal — Instagram'),
      YT_SHORT('The perfect wedding gift — YouTube'),
    ],
  },
  {
    id: 33,
    rank: 21,
    head: 'NEW ARRIVAL · BIRTH MEMORY',
    title: 'Baby Footprint Frame',
    subtitle: 'The first mark they ever made.',
    descriptions: [
      'A baby\'s footprint is the smallest map of a person who has just arrived. We preserve it in a form that lasts forever.',
      'We cast the footprint (or handprint) in high-detail resin, then frame it with the date, time, and name — a complete record of arrival.',
    ],
    processes: [
      { title: 'Schedule a Session or Submit a Print:', description: 'We can visit your home within Kathmandu, or you can submit an ink impression.' },
      { title: 'Cast & Frame:', description: 'Cast in resin and framed over 1–2 weeks.' },
      DELIVER_STEP,
    ],
    care: ['Display away from direct sunlight. Wipe with a soft, dry cloth. Resin is durable but avoid dropping.'],
    price: 2500,
    priceNote: PRICE_NOTE_FULL,
    images: mixImgs,
    material: ['Resin'],
    size: { unit: 'cm', value: [20, 25, 3] },
    relatedProductIds: [22, 21, 27, 0],
    category: 'Festival Gifts',
    tags: ['baby', 'newborn', 'footprint', 'birth', 'keepsake', 'memory', 'family', 'gift'],
    socialVideos: [
      IG_REEL('Baby footprint frame — Instagram'),
      FB_VIDEO('New arrival keepsake — Facebook'),
    ],
  },
  // ─── JEWELLERY & WEARABLE ────────────────────────────────────────────────────
  {
    id: 34,
    rank: 17,
    head: 'WORN WITH MEANING · WEARABLE MEMORY',
    title: 'Custom Pendant',
    subtitle: 'Carry a moment close.',
    descriptions: [
      'A pendant is the most personal object you can wear. We craft miniature custom pendants — a face, a shape, a symbol — in durable resin with a gold or silver finish.',
      'Small enough to wear every day. Significant enough to notice.',
    ],
    processes: [
      { title: 'Share Your Reference:', description: 'A photo, sketch, or description of what you want to carry.' },
      { title: 'Design:', description: 'We model and share a preview.' },
      { title: 'Craft:', description: 'Printed and finished over 1–2 weeks.' },
      DELIVER_STEP,
    ],
    care: ['Keep away from water and perfume. Store in the provided pouch. Polish gently with a soft cloth.'],
    price: 950,
    priceNote: PRICE_NOTE_FULL,
    images: keyImgs,
    material: ['Resin', 'Gold/Silver finish'],
    size: { unit: 'cm', value: [3, 3, 0.5] },
    relatedProductIds: [14, 4, 23, 0],
    category: 'Wearables',
    tags: ['pendant', 'jewellery', 'wearable', 'custom', 'miniature', 'portrait', 'gift'],
    socialVideos: [
      IG_REEL('Custom pendant close-up — Instagram'),
      TT_VIDEO('Wearable memory — TikTok'),
    ],
  },
  // ─── PREMIUM & BESPOKE ───────────────────────────────────────────────────────
  {
    id: 35,
    rank: 24,
    head: 'BESPOKE · FULLY CUSTOM',
    title: 'Bespoke Commission',
    subtitle: 'If you can imagine it, we can make it.',
    descriptions: [
      'Some pieces do not fit any category. A concept no one has made. A memory no standard form can hold. That is when you commission something truly bespoke.',
      'Tell us what you are imagining. We will tell you honestly what is possible. Then we will make it.',
      'Pricing is discussed after understanding the scope. No surprises.',
    ],
    processes: [
      { title: 'Consultation:', description: 'A brief conversation about your vision, timeline, and budget.' },
      { title: 'Proposal:', description: 'We prepare a design proposal and quote within 3 business days.' },
      { title: 'Commission:', description: 'Upon approval, production begins with regular progress updates.' },
      DELIVER_STEP,
    ],
    care: ['Care instructions provided specific to the materials used in your commission.'],
    price: 8000,
    priceNote: 'Pricing varies by scope · 50% prepayment required · Full consultation included',
    images: figImgs,
    material: ['Varies'],
    size: { unit: 'cm', value: [0, 0, 0] },
    relatedProductIds: [8, 0, 20, 27],
    category: 'Bespoke',
    tags: ['bespoke', 'custom', 'commission', 'one-of-a-kind', 'premium', 'unique', 'luxury'],
    socialVideos: [
      IG_REEL('Our most ambitious commission — Instagram'),
      YT_SHORT('Bespoke piece: from idea to object — YouTube'),
    ],
  },
  {
    id: 36,
    rank: 25,
    head: 'CORPORATE GIFT · MEANINGFUL RECOGNITION',
    title: 'Corporate Recognition Piece',
    subtitle: 'For the people who built something.',
    descriptions: [
      'Years of service. A project milestone. A farewell. These moments deserve more than a plaque from a catalogue.',
      'We create custom recognition pieces for teams, founders, and long-serving colleagues — each one designed around the specific story of the person being honoured.',
      'Bulk commissions available with consistent branding and individual personalisation for each recipient.',
    ],
    processes: [
      { title: 'Brief Us:', description: 'Share the occasion, the recipient(s), and any brand or design guidelines.' },
      { title: 'Design:', description: 'We propose a cohesive design that scales across recipients.' },
      { title: 'Produce:', description: 'Timeline depends on quantity. Minimum 2 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_STONE,
    price: 6000,
    priceNote: 'Per unit pricing · Bulk discounts available · 50% prepayment required',
    images: mixImgs,
    material: ['PLA', 'Resin'],
    size: { unit: 'cm', value: [15, 10, 20] },
    relatedProductIds: [8, 29, 3, 35],
    category: 'Bespoke',
    tags: ['corporate', 'recognition', 'award', 'bulk', 'team', 'office', 'premium', 'gift'],
    socialVideos: [
      IG_REEL('Corporate recognition piece — Instagram'),
    ],
  },
  {
    id: 37,
    rank: 26,
    head: 'GRADUATION · NEXT CHAPTER',
    title: 'Graduation Keepsake',
    subtitle: 'The years behind. The life ahead.',
    descriptions: [
      'Graduation is the end of one story and the beginning of another. We mark it with a piece that holds both.',
      'A custom figurine in graduation attire, a nameplate bearing their name and year, or a sculptural reminder of what they worked towards.',
    ],
    processes: [
      { title: 'Commission:', description: 'Share a photo and the graduation details — year, field, any special meaning.' },
      { title: 'Craft:', description: 'Produced over 2–3 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_FIGURINE,
    price: 2800,
    priceNote: PRICE_NOTE_FULL,
    images: figImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [10, 8, 18] },
    relatedProductIds: [0, 3, 29, 25],
    category: 'Festival Gifts',
    tags: ['graduation', 'achievement', 'figurine', 'keepsake', 'gift', 'milestone'],
    socialVideos: [
      IG_REEL('Graduation keepsake — Instagram'),
      TT_VIDEO('The gift every graduate deserves — TikTok'),
    ],
  },
  {
    id: 38,
    rank: 27,
    head: 'BIRTHDAY · A YEAR REMEMBERED',
    title: 'Birthday Figurine',
    subtitle: 'For the one who deserves to be remembered.',
    descriptions: [
      'A birthday is not just a date. It is evidence that someone has been alive in the world, shaping things, mattering to people.',
      'We craft a custom figurine of the birthday person — from a photograph, in a pose that reflects who they are. A gift they will never forget receiving.',
    ],
    processes: [
      { title: 'Share a Photo:', description: 'Send a clear photograph and a few words about who they are.' },
      { title: 'Craft:', description: 'Printed and finished over 2–3 weeks. Order early for birthdays.' },
      DELIVER_STEP,
    ],
    care: CARE_FIGURINE,
    price: 1950,
    priceNote: PRICE_NOTE_PARTIAL,
    images: figImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [10, 8, 18] },
    relatedProductIds: [0, 14, 31, 20],
    category: 'Festival Gifts',
    tags: ['birthday', 'figurine', 'gift', 'custom', 'personalized', 'celebration'],
    socialVideos: [
      IG_REEL('Birthday figurine surprise — Instagram'),
      FB_VIDEO('Best birthday gift idea — Facebook'),
    ],
  },
  {
    id: 39,
    rank: 28,
    head: 'FOR YOUR FAITH · DEVOTIONAL PIECE',
    title: 'Devotional Figurine',
    subtitle: 'A quiet presence on your altar.',
    descriptions: [
      'Some pieces are made for a specific place — the puja room, the family altar, the space where you begin your day with intention.',
      'We craft devotional figurines of deities, spiritual symbols, and revered figures, treated with the respect they are owed.',
      'Every devotional piece is handled with care from commission to delivery. Each arrives wrapped in cloth, never carelessly packaged.',
    ],
    processes: [
      { title: 'Commission:', description: 'Tell us the deity or figure and any specific iconographic preferences.' },
      { title: 'Review:', description: 'We share a reference for your approval before production.' },
      { title: 'Craft:', description: 'Produced with care over 3–4 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_FIGURINE,
    price: 2500,
    priceNote: PRICE_NOTE_PARTIAL,
    images: figImgs,
    material: ['PLA', 'Resin'],
    size: { unit: 'cm', value: [10, 8, 20] },
    relatedProductIds: [0, 8, 27, 20],
    category: 'Figurines',
    tags: ['devotional', 'deity', 'spiritual', 'puja', 'altar', 'Nepal', 'faith', 'figurine'],
    socialVideos: [
      IG_REEL('Devotional figurine — Instagram'),
    ],
  },
  {
    id: 40,
    rank: 29,
    head: 'CHILDREN · PLAY WITH MEANING',
    title: 'Custom Storybook Figurine',
    subtitle: 'Their favourite character, real.',
    descriptions: [
      'Every child has a character they would give anything to hold in their hands. We make that real.',
      'Send us the character — from a book, a drawing, a story they invented — and we render it in durable PLA, safe and built to last.',
      'A gift that outlives the childhood phase it came from.',
    ],
    processes: [
      { title: 'Share the Character:', description: 'A drawing, screenshot, or description of who they love.' },
      { title: 'Design:', description: 'We model and share a preview for your approval.' },
      { title: 'Craft:', description: 'Printed and finished over 1–2 weeks.' },
      DELIVER_STEP,
    ],
    care: ['Safe for ages 5+. Keep away from moisture. Wipe with a soft dry cloth. Store on a flat surface.'],
    price: 1600,
    priceNote: PRICE_NOTE_FULL,
    images: figImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [8, 6, 14] },
    relatedProductIds: [0, 22, 5, 28],
    category: 'Figurines',
    tags: ['children', 'storybook', 'character', 'figurine', 'gift', 'kids', 'custom', 'imagination'],
    socialVideos: [
      IG_REEL('Storybook character in real life — Instagram'),
      TT_VIDEO('Your child\'s favourite character — TikTok'),
    ],
  },
  {
    id: 41,
    rank: 30,
    head: 'SPORTS · ACHIEVEMENT MARKED',
    title: 'Sports Trophy Figurine',
    subtitle: 'The win they will never stop talking about.',
    descriptions: [
      'Trophies are generic. A figurine of the person who won — in the moment they won — is something else entirely.',
      'We craft custom sports figurines from photographs: a cricketer mid-swing, a footballer at the peak of a jump, a runner crossing the finish line.',
    ],
    processes: [
      { title: 'Share the Moment:', description: 'A photo of the athlete in their sport. The more dynamic the pose, the better.' },
      { title: 'Craft:', description: 'Printed and finished over 2–3 weeks.' },
      DELIVER_STEP,
    ],
    care: CARE_FIGURINE,
    price: 2100,
    priceNote: PRICE_NOTE_FULL,
    images: figImgs,
    material: ['PLA'],
    size: { unit: 'cm', value: [10, 8, 20] },
    relatedProductIds: [0, 37, 8, 36],
    category: 'Figurines',
    tags: ['sports', 'trophy', 'figurine', 'athlete', 'cricket', 'football', 'achievement', 'gift'],
    socialVideos: [
      IG_REEL('Sports trophy figurine — Instagram'),
      YT_SHORT('Better than a trophy — YouTube'),
    ],
  },
]

export function getTopRankedMockProducts(limit: number): MockProduct[] {
  return [...mockProducts].sort((a, b) => a.rank - b.rank).slice(0, limit)
}

export function formatNprPrice(amount: number): string {
  return amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export function getMockProductById(id: string | number): MockProduct | undefined {
  const n = typeof id === 'string' ? Number.parseInt(id, 10) : id
  if (Number.isNaN(n)) return undefined
  return mockProducts.find((p) => p.id === n)
}

export function getRelatedMockProducts(product: MockProduct): MockProduct[] {
  return product.relatedProductIds
    .map((rid) => getMockProductById(rid))
    .filter((p): p is MockProduct => p !== undefined)
}
