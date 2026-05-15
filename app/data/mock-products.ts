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
  images: string[]
  material: string[]
  size: MockProductSize
  relatedProductIds: number[]
}

export const mockProducts: MockProduct[] = [
  {
    id: 0,
    rank: 2,
    head: 'FOR YOUR LOVE · PERSONALIZED PIECE',
    title: 'Custom Human Figurine',
    subtitle: 'It is a moment made permanent.',
    descriptions: [
      'A figurine is not a product. It is a moment made permanent — a person you love, rendered in physical form so they are never truly out of reach.',
      'Send us one clear photograph. Our artisans study your image, understand the person, and craft a piece that holds the feeling of them — not just their likeness.',
      'Every figurine is hand-finished and painted. No two are identical. Each arrives in our signature gift packaging with a handwritten commission card.',
    ],
    processes: [
      {
        title: 'Commission:',
        description:
          'Place your order and share your reference photograph and any details about the person.',
      },
      // {
      //   title: 'Sculpt Preview:',
      //   description: 'We share a 3D preview for your approval before production begins.',
      // },
      {
        title: 'Craft:',
        description:
          'Our team prints, refines, and hand-finishes your figurine over 2–3 weeks.',
      },
      {
        title: 'Deliver:',
        description:
          'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.',
      },
    ],
    care: [
      'Keep away from direct sunlight to preserve the finish. Dust gently with a soft dry cloth. Do not expose to moisture or extreme heat.',
      'Your figurine is a precious object — treat it as one. Store on a flat, stable surface.',
    ],
    price: 1950,
    priceNote:
      '25% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
    images: [],
    material: ['PLA'],
    size: { unit: 'cm', value: [10, 15, 17] },
    relatedProductIds: [8, 0, 3, 14],
  },
  // {
  //   id: 1,
  //   rank: 11,
  //   head: 'LET THEM GLOW · AMBIENT MEMORY',
  //   title: 'Portrait Litholamp',
  //   subtitle: 'A face in soft light.',
  //   descriptions: [
  //     'A litholamp transforms a photograph into an etched stone that glows. Place it on a shelf, a desk, a bedside table. Each time someone sees it, they remember.',
  //     'We take your photograph and hand-etch it into natural stone. When lit, the portrait becomes a warm, diffused glow — intimate, never harsh.',
  //     'Each litholamp is individually carved in our studio. The stone varies; the light is always the same: a gentle reminder that they are always there.',
  //   ],
  //   processes: [
  //     {
  //       title: 'Submit Image:',
  //       description: 'Share a clear, well-lit portrait photograph.',
  //     },
  //     {
  //       title: 'Design Approval:',
  //       description: 'We show you a preview of how the etching will appear when lit.',
  //     },
  //     {
  //       title: 'Etch & Craft:',
  //       description: 'Hand-carved stone etching takes 2-3 weeks. Each piece is unique.',
  //     },
  //     {
  //       title: 'Deliver:',
  //       description: 'Arrives with LED base and instructions. Ready to glow.',
  //     },
  //   ],
  //   care: [
  //     'Keep out of direct sunlight. Clean with a soft, dry cloth only. Do not submerge. Store safely on a flat surface. Warranty covers manufacturing defects for 90 days.',
  //   ],
  //   price: 4200,
  // priceNote: '100% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
  //   images: [],
  //   material: ['Natural Stone'],
  // size: { unit: 'cm', value: [10, 15, 17] },
  // relatedProductIds: [8, 0, 3, 14],
  // },
  // {
  //   id: 2,
  //   rank: 13,
  //   head: 'UNDER THE STARS · MOONLIGHT MEMORY',
  //   title: 'Moon Lamp',
  //   subtitle: 'Your moment, illuminated.',
  //   descriptions: [
  //     'A moon lamp is not a light. It is a fragment of a memory, suspended and glowing. Customize it with a date, a name, a moment that matters.',
  //     'We 3D print a detailed moon replica based on the exact phase and date you choose. Finish it with soft LED lighting that makes it feel like holding a piece of the sky.',
  //     'Each moon lamp is hand-finished and tested. It arrives ready to hang, with the date of your chosen moment engraved on the base.',
  //   ],
  //   processes: [
  //     {
  //       title: 'Choose Your Moment:',
  //       description: "Tell us the date and we'll find the exact moon phase.",
  //     },
  //     {
  //       title: 'Personalize:',
  //       description: 'Add a name, date, or message for engraving on the base.',
  //     },
  //     {
  //       title: 'Print & Finish:',
  //       description: 'We print, sand, and finish your lamp over 2-3 weeks.',
  //     },
  //     {
  //       title: 'Ship:',
  //       description: 'Arrives with LED base, power adapter, and a story card.',
  //     },
  //   ],
  //   care: [
  //     'Avoid direct sunlight. Dust gently with a soft cloth. Do not expose to water or extreme heat. Store carefully. LED warranty covers defects for 1 year.',
  //   ],
  //   price: 3800,
  // priceNote: '100% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
  //   images: [],
  //   material: ['PLA', 'Resin'],
  // size: { unit: 'cm', value: [10, 15, 17] },
  // relatedProductIds: [8, 0, 3, 14],
  // },
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
      {
        title: 'Design Choice:',
        description:
          'Select font, and layout from our options or request custom design.',
      },
      {
        title: 'Preview:',
        description: 'We send a digital mockup for your approval before production.',
      },
      {
        title: 'Craft:',
        description: 'Printed and finished over 1-2 weeks. Each piece is unique.',
      },
      {
        title: 'Deliver:',
        description:
          'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.',
      },
    ],
    care: [
      'Keep away from direct sunlight to prevent fading. Wipe with a soft, damp cloth.',
    ],
    price: 1500,
    priceNote: '100% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
    images: [],
    material: ['PLA'],
    size: { unit: 'cm', value: [10, 15, 17] },
    relatedProductIds: [8, 0, 3, 14],
  },
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
      {
        title: 'Share Your Idea:',
        description: 'Send us a photo, sketch, or description of what matters to you.',
      },
      {
        title: 'Design:',
        description: 'We create a 3D model and send it for your approval.',
      },
      {
        title: 'Print & Finish:',
        description: 'We print, sand, paint, and finish your keychain over 1 week.',
      },
      {
        title: 'Deliver:',
        description:
          'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.',
      },
    ],
    care: [
      'Keep away from direct sunlight to preserve the finish. Dust gently with a soft dry cloth. Do not expose to moisture or extreme heat.',
    ],
    price: 1200,
    priceNote: '25% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
    images: [],
    material: ['PLA'],
    size: { unit: 'cm', value: [10, 15, 17] },
    relatedProductIds: [8, 0, 3, 14],
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
      {
        title: 'Share Your Idea:',
        description: 'Send us a photo, sketch, or description of what matters to you.',
      },
      {
        title: 'Design:',
        description: 'We create a 3D model and send it for your approval.',
      },
      {
        title: 'Print & Finish:',
        description: 'We print, sand, paint, and finish your keychain over 1 week.',
      },
      {
        title: 'Deliver:',
        description:
          'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.',
      },
    ],
    care: [
      'Keep away from direct sunlight to preserve the finish. Dust gently with a soft dry cloth. Do not expose to moisture or extreme heat.',
    ],
    price: 350,
    priceNote: '100% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
    images: [],
    material: ['PLA'],
    size: { unit: 'cm', value: [10, 15, 17] },
    relatedProductIds: [8, 0, 3, 14],
  },
  {
    id: 5,
    rank: 6,
    head: 'PUZZLE OF A MOMENT · PIECE BY PIECE',
    title: '3D Dinosaur Puzzle',
    subtitle: 'Build a memory together.',
    descriptions: [
      'A puzzle is a conversation. Building it together is the gift. We create custom 3D puzzles that turn memories into playtime.',
      'Choose a theme — dinosaurs, animals, landmarks, or a custom design. We 3D print each puzzle piece with precision so they fit together perfectly.',
      'Each puzzle arrives in a beautiful box with an illustration of the finished piece and a note about why it matters.',
    ],
    processes: [
      {
        title: 'Choose Theme:',
        description: 'Pick from our designs or request a custom creation.',
      },
      {
        title: 'Customize:',
        description:
          "Tell us who this is for and why it matters. We'll include it in the box.",
      },
      {
        title: 'Print & Prepare:',
        description:
          'We print each piece, sand them smooth, and pack them carefully over 1-2 weeks.',
      },
      {
        title: 'Deliver:',
        description:
          'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.',
      },
    ],
    care: [
      'Store pieces in the provided box. Keep away from moisture and heat. Each piece is durable but handle gently during building. Do not force pieces together.',
    ],
    price: 2500,
    priceNote: '100% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
    images: [],
    material: ['PLA'],
    size: { unit: 'cm', value: [10, 15, 17] },
    relatedProductIds: [8, 0, 3, 14],
  },
  // {
  //   id: 6,
  //   rank: 9,
  //   head: 'HANDS TOGETHER · CAPTURED FOREVER',
  //   title: 'Hand Mold Casting',
  //   subtitle: "Hold your loved one's hand in bronze.",
  //   descriptions: [
  //     'A hand is the first thing a parent holds. A hand is what someone reaches for when they need you. Preserve that touch in lasting bronze.',
  //     'We create a custom mold from two hands pressed together. Then we cast it in bronze — a sculpture that holds the feeling of connection.',
  //     'Each casting is unique. The details of skin, the texture of connection — all preserved. A piece that says: we were here, together.',
  //   ],
  //   processes: [
  //     {
  //       title: 'Schedule Session:',
  //       description: 'Come to our studio for a hand casting session. Takes 30 minutes.',
  //     },
  //     {
  //       title: 'Mold Creation:',
  //       description: 'We make a detailed mold of your hands together.',
  //     },
  //     {
  //       title: 'Bronze Casting:',
  //       description:
  //         'Your mold is cast in bronze over 3-4 weeks. Hand-finished and sealed.',
  //     },
  //     {
  //       title: 'Deliver:',
  //       description:
  //         'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.',
  //     },
  //   ],
  //   care: [
  //     'Handle with care. Bronze develops a natural patina over time — this is part of its beauty. Clean with a soft, dry cloth only. Do not expose to water. Store safely.',
  //   ],
  //   price: 12000,
  //   priceNote:
  //     'Studio session required · 50% prepayment · Includes premium presentation·',
  //   images: [],
  //   material: ['PLA'],
  //   size: { unit: 'cm', value: [10, 15, 17] },
  // relatedProductIds: [8, 0, 3, 14],
  // },
  // {
  //   id: 7,
  //   rank: 7,
  //   head: 'WALL OF MEMORIES · GALLERY IN YOUR HOME',
  //   title: 'Custom Photo Print on Wood',
  //   subtitle: 'Your moment, printed on grain.',
  //   descriptions: [
  //     'Wood holds warmth. A photograph holds memory. Together, they become something precious.',
  //     'We print your photograph directly onto premium wood using a process that makes the image part of the grain itself — not a layer on top.',
  //     'Each print is unique. The color, the grain, the way light hits it — all different. It arrives ready to hang, with mounting hardware.',
  //   ],
  //   processes: [
  //     {
  //       title: 'Submit Photo:',
  //       description: 'Send a high-resolution image in landscape or portrait orientation.',
  //     },
  //     {
  //       title: 'Size & Finish:',
  //       description: 'Choose dimensions and finish (matte or glossy).',
  //     },
  //     {
  //       title: 'Print:',
  //       description: 'We print directly onto sustainably sourced wood over 1 week.',
  //     },
  //     {
  //       title: 'Ship:',
  //       description: 'Arrives ready to hang with mounting hardware and care card.',
  //     },
  //   ],
  //   care: [
  //     'Protect from direct sunlight to prevent fading. Wipe with a soft, dry cloth. Do not expose to moisture. Hang in climate-controlled spaces. Wood naturally expands/contracts slightly with humidity.',
  //   ],
  //   price: 2200,
  //   priceNote: '100% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
  //   images: [],
  //   material: ['PLA'],
  //   size: { unit: 'cm', value: [10, 15, 17] },
  // relatedProductIds: [8, 0, 3, 14],
  // },
  {
    id: 8,
    rank: 1,
    head: 'MILESTONE MARKED · TIME IN PHYSICAL FORM',
    title: 'Anniversary Sculpture',
    subtitle: 'Years together, made tangible.',
    descriptions: [
      'An anniversary is a moment to acknowledge: we chose each other again, and again. We turn that choice into a sculpture.',
      'We design a custom piece that represents your years together — could be years stacked, intertwined lines, or a moment from your story, rendered in stone or bronze.',
      'Each sculpture is hand-carved or cast. It arrives with a certificate explaining its meaning and a space to add your names.',
    ],
    processes: [
      {
        title: 'Share Your Story:',
        description:
          'Tell us how many years, what matters most, any symbols that resonate.',
      },
      {
        title: 'Design:',
        description: 'We sketch 3-4 design options for your approval.',
      },
      {
        title: 'Craft:',
        description:
          'Stone carving or bronze casting takes 3-5 weeks. Hand-finished with care.',
      },
      {
        title: 'Deliver:',
        description:
          'Your piece arrives gift-ready, wrapped with care. Ringroad delivery free of charge.',
      },
    ],
    care: [
      'Stone and bronze are durable. Keep away from direct sunlight to preserve color. Dust gently with a soft cloth. Do not expose to harsh weather if kept outdoors. Store safely.',
    ],
    price: 15000,
    priceNote: '100% prepayment required . Includes gift-ready packaging · Free delivery within Kathmandu·',
    images: [],
    material: ['PLA'],
    size: { unit: 'cm', value: [10, 15, 17] },
    relatedProductIds: [8, 0, 3, 14],
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
