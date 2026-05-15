<script setup lang="ts">
useSeoMeta({
  title: 'Contact — Hamro3D',
  description:
    'Reach Hamro3D in Kathmandu. Share your story and begin a commission for a piece that holds meaning.',
  ogImage: '/og/contact.jpg',
})

const productOptions = [
  'Personalized Realistic Figurine',
  'Personalized Anime Figurine',
  'Lithophane Portrait Lamp',
  'Moonlight Portrait Lamp',
  'Custom LED Lamp',
  '3D Name Desk Sign',
  'Script Name Sign',
  'Name Pencil Holder',
  'Custom Nameplate',
  'Name Keychain',
  'Character Keychain',
  '3D Dinosaur Puzzle',
  'Not sure — need guidance',
] as const

const occasions = [
  'Dashain/Tihar',
  'Wedding',
  'Anniversary',
  'Birthday',
  'In Memory Of',
  'Just Because',
] as const

const contactMethods = ['Email', 'Instagram DM', 'Phone Call'] as const

const formData = ref({
  name: '',
  phone: '',
  email: '',
  productInterest: '',
  story: '',
})

const selectedOccasions = ref<string[]>([])
const selectedContactMethods = ref<string[]>([])

function toggleChip(
  listRef: Ref<string[]>,
  value: string,
) {
  const arr = listRef.value
  const i = arr.indexOf(value)
  if (i === -1) {
    arr.push(value)
  } else {
    arr.splice(i, 1)
  }
}

function toggleOccasion(occasion: string) {
  toggleChip(selectedOccasions, occasion)
}

function toggleContactMethod(method: string) {
  toggleChip(selectedContactMethods, method)
}

function onSubmit() {
  // Build email subject and body
  const subject = `Commission Inquiry: ${formData.value.productInterest}`
  const body = `
Name: ${formData.value.name}
Email: ${formData.value.email}
Phone: ${formData.value.phone}
Product Interest: ${formData.value.productInterest}
Occasions: ${selectedOccasions.value.join(', ') || 'Not specified'}
Preferred Contact: ${selectedContactMethods.value.join(', ') || 'Not specified'}

Story:
${formData.value.story}
  `.trim()

  // Create mailto link
  const mailtoLink = `mailto:hamro3d@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = mailtoLink

  // Reset form
  formData.value = { name: '', phone: '', email: '', productInterest: '', story: '' }
  selectedOccasions.value = []
  selectedContactMethods.value = []
}

const socialLinks = [
  {
    platform: 'INSTAGRAM',
    name: 'Instagram',
    handle: '@hamro3d',
    description: 'Our main visual portfolio. Products, behind-the-scenes, gifting moments.',
    href: 'https://www.instagram.com/hamro3d/',
    iconStyle: 'background: linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
    barClass: 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]',
  },
  {
    platform: 'TIKTOK',
    name: 'TikTok',
    handle: '@hamro3d',
    description: 'Short craft videos. Process reveals, before & after, gifting reactions.',
    href: 'https://www.tiktok.com/@hamro3d',
    iconStyle: 'background: #010101',
    barClass: 'bg-[#69C9D0]',
  },
  {
    platform: 'FACEBOOK',
    name: 'Facebook',
    handle: 'Hamro3D',
    description: 'Community, longer-form posts, local Kathmandu audience, festival campaigns.',
    href: 'https://www.facebook.com/people/Hamro3D/61572084002623/',
    iconStyle: 'background: #1877F2',
    barClass: 'bg-[#1877F2]',
  },
  {
    platform: 'YOUTUBE',
    name: 'YouTube',
    handle: '@Hamro3d',
    description: 'Longer craft videos, process documentaries, gifting stories, tutorials.',
    href: 'https://www.youtube.com/@Hamro3d',
    iconStyle: 'background: #FF0000',
    barClass: 'bg-[#FF0000]',
  },
]
</script>

<template>
  <div class="bg-h3d-base text-h3d-text font-h3d-body">

    <!-- Page hero -->
    <section
      class="relative overflow-hidden border-b border-h3d-border bg-h3d-surface py-20 px-6 sm:px-10"
      aria-labelledby="contact-hero-heading"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_-30%,rgba(196,144,122,0.18),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_90%_50%,rgba(58,36,80,0.5),transparent_65%)]"
        aria-hidden="true"
      />
      <div class="relative mx-auto max-w-[1160px] lg:flex lg:items-start lg:justify-between">
        <div>
          <p class="font-h3d-body text-2xs tracking-[0.24em] text-h3d-accent uppercase">
            REACH US · FIND US · FOLLOW US
          </p>
          <div class="mt-4 mb-5 h-px w-10 bg-h3d-accent opacity-70" aria-hidden="true" />
          <h1
            id="contact-hero-heading"
            class="font-h3d-display text-5xl sm:text-6xl font-normal text-h3d-text leading-tight max-w-[560px] mb-5"
          >
            Every conversation begins with a memory.
          </h1>
          <p class="font-h3d-body text-sm text-h3d-muted max-w-[420px] leading-relaxed font-light">
            Tell us your story. We'll tell you how we can hold it in physical form.
            Reach us on any platform — we're here.
          </p>
        </div>
        <div class="hidden lg:block text-right mt-1 space-y-4 min-w-[180px]">
          <div>
            <p class="font-h3d-body text-2xs tracking-[0.12em] text-h3d-accent uppercase font-medium mb-1">BASED IN</p>
            <p class="font-h3d-body text-sm text-h3d-muted font-light">Kathmandu, Nepal</p>
          </div>
          <div>
            <p class="font-h3d-body text-2xs tracking-[0.12em] text-h3d-accent uppercase font-medium mb-1">RESPONSE TIME</p>
            <p class="font-h3d-body text-sm text-h3d-muted font-light">Within 24 hours</p>
          </div>
          <div>
            <p class="font-h3d-body text-2xs tracking-[0.12em] text-h3d-accent uppercase font-medium mb-1">COMMISSION OPEN</p>
            <p class="font-h3d-body text-sm text-h3d-muted font-light">Year-round</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Social grid -->
    <div class="mx-auto max-w-[1160px] px-6 sm:px-10 pt-16 pb-4">
      <p class="font-h3d-body text-2xs tracking-[0.22em] text-h3d-accent uppercase mb-7">FOLLOW OUR WORK</p>
      <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 mb-14">
        <a
          v-for="s in socialLinks"
          :key="s.platform"
          :href="s.href"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative flex flex-col overflow-hidden border border-h3d-border bg-h3d-surface p-[22px] transition-colors hover:border-h3d-accent"
        >
          <!-- Platform color bar on hover -->
          <span
            class="absolute inset-x-0 bottom-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            :class="s.barClass"
            aria-hidden="true"
          />
          <!-- Arrow -->
          <span class="absolute top-[18px] right-[18px] text-h3d-border text-sm transition-colors group-hover:text-h3d-accent" aria-hidden="true">↗</span>

          <p class="font-h3d-body text-2xs tracking-[0.2em] text-h3d-muted uppercase mb-2.5">{{ s.platform }}</p>
          <!-- Icon -->
          <div
            class="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
            :style="s.iconStyle"
          >
            <!-- Instagram -->
            <svg v-if="s.platform === 'INSTAGRAM'" viewBox="0 0 24 24" fill="white" class="w-5 h-5">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z"/>
            </svg>
            <!-- TikTok -->
            <svg v-else-if="s.platform === 'TIKTOK'" viewBox="0 0 24 24" fill="white" class="w-5 h-5">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.55a8.27 8.27 0 004.83 1.54V6.62a4.85 4.85 0 01-1.06.07z"/>
            </svg>
            <!-- Facebook -->
            <svg v-else-if="s.platform === 'FACEBOOK'" viewBox="0 0 24 24" fill="white" class="w-5 h-5">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <!-- YouTube -->
            <svg v-else viewBox="0 0 24 24" fill="white" class="w-5 h-5">
              <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
            </svg>
          </div>

          <p class="font-h3d-display text-base font-normal text-h3d-text mb-1">{{ s.name }}</p>
          <p class="font-h3d-body text-xs text-h3d-muted font-light mb-2.5">{{ s.handle }}</p>
          <p class="font-h3d-body text-xs text-h3d-muted leading-relaxed font-light">{{ s.description }}</p>
          <span class="mt-3 inline-block font-h3d-body text-2xs tracking-[0.14em] border border-[#6B8A70] text-[#6B8A70] px-2 py-0.5 rounded-sm">LIVE</span>
        </a>
      </div>

      <!-- Primary Contact Channels -->
      <p class="font-h3d-body text-2xs tracking-[0.22em] text-h3d-accent uppercase mb-7">PRIMARY CONTACT CHANNELS</p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-px bg-h3d-border border border-h3d-border mb-14">

        <!-- Email -->
        <div class="bg-h3d-surface flex flex-col gap-3.5 p-7 transition-colors hover:bg-[#321960]">
          <div class="w-[42px] h-[42px] border border-h3d-accent flex items-center justify-center shrink-0 bg-[rgba(196,144,122,0.06)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="#C4907A" stroke-width="1.5" class="w-[18px] h-[18px]">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
            </svg>
          </div>
          <p class="font-h3d-body text-2xs tracking-[0.22em] text-h3d-accent uppercase">EMAIL</p>
          <p class="font-h3d-display text-lg font-normal text-h3d-text">Gmail</p>
          <p class="font-h3d-body text-xs text-h3d-muted font-light leading-relaxed break-all">hamro3d@gmail.com</p>
          <a href="mailto:hamro3d@gmail.com" class="inline-flex items-center gap-1.5 font-h3d-body text-xs tracking-[0.14em] text-h3d-accent font-medium transition-colors hover:text-h3d-text mt-auto">
            Send us a message
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" class="w-3 h-3"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
          </a>
        </div>

        <!-- WhatsApp -->
        <div class="bg-h3d-surface flex flex-col gap-3.5 p-7 transition-colors hover:bg-[#321960]">
          <div class="w-[42px] h-[42px] border border-h3d-accent flex items-center justify-center shrink-0 bg-[rgba(196,144,122,0.06)]">
            <svg viewBox="0 0 24 24" fill="#25D366" class="w-[18px] h-[18px]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          </div>
          <p class="font-h3d-body text-2xs tracking-[0.22em] text-h3d-accent uppercase">DIRECT MESSAGE</p>
          <p class="font-h3d-display text-lg font-normal text-h3d-text">WhatsApp Business</p>
          <p class="font-h3d-body text-xs text-h3d-muted font-light leading-relaxed">+977 9869666056<br>Send your photo directly in chat</p>
          <a href="https://wa.me/9779869666056?text=Hi%2C%20I%27d%20like%20to%20commission%20a%20piece" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 font-h3d-body text-xs tracking-[0.14em] font-medium transition-colors mt-auto" style="color:#25D366">
            Start a conversation
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" class="w-3 h-3"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
          </a>
        </div>

        <!-- Viber -->
        <div class="bg-h3d-surface flex flex-col gap-3.5 p-7 transition-colors hover:bg-[#321960]">
          <div class="w-[42px] h-[42px] border border-h3d-accent flex items-center justify-center shrink-0 bg-[rgba(196,144,122,0.06)]">
            <svg viewBox="0 0 24 24" fill="#7360F2" class="w-[18px] h-[18px]"><path d="M11.4 0C8.956.012 3.49.245 1.07 2.466-.41 3.946.036 6.097.036 11.97c0 4.832-.753 9.838 3.532 11.013L3.58 24l4.63-1.27c1.57.43 3.181.643 4.802.636 8.493 0 14.986-5.447 14.986-15.868C27.998 3.508 19.893-.041 11.4 0zm8.348 18.02c-.52.99-1.87 1.98-3.049 2.24-.792.17-1.828.305-5.318-1.143-4.468-1.842-7.344-6.383-7.565-6.678-.22-.294-1.853-2.461-1.853-4.694s1.156-3.509 1.566-3.989c.408-.48.89-.6 1.188-.6.296 0 .592.003.851.016.272.014.637-.103.996.76.373.895 1.265 3.093 1.376 3.317.11.223.184.484.037.777-.147.294-.22.477-.44.737-.22.258-.462.578-.661.776-.22.22-.449.46-.192.899.257.44 1.143 1.885 2.451 3.053 1.683 1.5 3.1 1.963 3.54 2.183.44.22.693.184.951-.11.258-.293 1.1-1.283 1.395-1.723.293-.44.587-.367 1.026-.22.44.147 2.784 1.312 3.264 1.55.48.24.8.36.918.563.117.202.117 1.178-.432 2.276z"/></svg>
          </div>
          <p class="font-h3d-body text-2xs tracking-[0.22em] text-h3d-accent uppercase">DIRECT MESSAGE</p>
          <p class="font-h3d-display text-lg font-normal text-h3d-text">Viber</p>
          <p class="font-h3d-body text-xs text-h3d-muted font-light leading-relaxed">+977 9869666056<br>Send your photo directly in chat</p>
          <a href="viber://chat?number=9779869666056" class="inline-flex items-center gap-1.5 font-h3d-body text-xs tracking-[0.14em] font-medium transition-colors mt-auto" style="color:#7360F2">
            Start a conversation
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" class="w-3 h-3"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
          </a>
        </div>

      </div>

      <!-- Contact form -->
      <section id="commission-form" class="scroll-mt-20 mb-14" aria-labelledby="form-heading">
        <p class="font-h3d-body text-2xs tracking-[0.22em] text-h3d-accent uppercase mb-7">SEND US A MESSAGE</p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Left -->
          <div>
            <h2
              id="form-heading"
              class="font-h3d-display text-3xl font-normal text-h3d-text mb-3 leading-snug"
            >
              Start your commission with a conversation.
            </h2>
            <p class="font-h3d-body text-sm text-h3d-muted leading-relaxed mb-6 font-light">
              Tell us who this is for, what moment you want to preserve, and which product
              you have in mind. We'll reply within 24 hours with everything you need to begin.
            </p>
            <aside class="border border-h3d-border p-4 bg-h3d-surface/40" role="note">
              <p class="font-h3d-display text-base font-light text-h3d-muted italic leading-relaxed">
                "Every meaningful piece begins with a story. Tell us yours."
              </p>
              <cite class="font-h3d-body text-2xs tracking-[0.14em] text-h3d-accent not-italic block mt-2">HAMRO3D · HANDCRAFTED IN NEPAL</cite>
            </aside>
          </div>

          <!-- Form -->
          <form class="flex flex-col gap-3.5" @submit.prevent="onSubmit">
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1.5">
                <label for="cf-name" class="font-h3d-body text-2xs tracking-[0.16em] text-h3d-accent uppercase">YOUR NAME</label>
                <input
                  id="cf-name"
                  v-model="formData.name"
                  type="text"
                  placeholder="Aarav Sharma"
                  autocomplete="name"
                  required
                  class="bg-h3d-surface border border-h3d-border text-h3d-text px-3.5 py-3 font-h3d-body text-sm font-light outline-none transition-colors focus:border-h3d-accent placeholder:text-h3d-muted placeholder:opacity-50"
                >
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="cf-phone" class="font-h3d-body text-2xs tracking-[0.16em] text-h3d-accent uppercase">PHONE / WHATSAPP</label>
                <input
                  id="cf-phone"
                  v-model="formData.phone"
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  autocomplete="tel"
                  class="bg-h3d-surface border border-h3d-border text-h3d-text px-3.5 py-3 font-h3d-body text-sm font-light outline-none transition-colors focus:border-h3d-accent placeholder:text-h3d-muted placeholder:opacity-50"
                >
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="cf-email" class="font-h3d-body text-2xs tracking-[0.16em] text-h3d-accent uppercase">EMAIL</label>
              <input
                id="cf-email"
                v-model="formData.email"
                type="email"
                placeholder="your@email.com"
                autocomplete="email"
                required
                class="bg-h3d-surface border border-h3d-border text-h3d-text px-3.5 py-3 font-h3d-body text-sm font-light outline-none transition-colors focus:border-h3d-accent placeholder:text-h3d-muted placeholder:opacity-50"
              >
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="cf-product" class="font-h3d-body text-2xs tracking-[0.16em] text-h3d-accent uppercase">PRODUCT INTEREST</label>
              <select
                id="cf-product"
                v-model="formData.productInterest"
                required
                class="bg-h3d-surface border border-h3d-border text-h3d-text px-3.5 py-3 font-h3d-body text-sm font-light outline-none appearance-none transition-colors focus:border-h3d-accent cursor-pointer"
              >
                <option disabled value="">Select a product</option>
                <option v-for="opt in productOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <fieldset>
              <legend class="font-h3d-body text-2xs tracking-[0.16em] text-h3d-accent uppercase mb-2">OCCASION</legend>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="o in occasions"
                  :key="o"
                  type="button"
                  class="font-h3d-body text-2xs tracking-wide border px-3.5 py-1.5 transition-all"
                  :class="selectedOccasions.includes(o)
                    ? 'border-h3d-accent text-h3d-text bg-[rgba(196,144,122,0.08)]'
                    : 'border-h3d-border text-h3d-muted hover:border-h3d-muted hover:text-h3d-text'"
                  @click="toggleOccasion(o)"
                >{{ o }}</button>
              </div>
            </fieldset>
            <fieldset>
              <legend class="font-h3d-body text-2xs tracking-[0.16em] text-h3d-accent uppercase mb-2">PREFERRED CONTACT METHOD</legend>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="m in contactMethods"
                  :key="m"
                  type="button"
                  class="font-h3d-body text-2xs tracking-wide border px-3.5 py-1.5 transition-all"
                  :class="selectedContactMethods.includes(m)
                    ? 'border-h3d-accent text-h3d-text bg-[rgba(196,144,122,0.08)]'
                    : 'border-h3d-border text-h3d-muted hover:border-h3d-muted hover:text-h3d-text'"
                  @click="toggleContactMethod(m)"
                >{{ m }}</button>
              </div>
            </fieldset>
            <div class="flex flex-col gap-1.5">
              <label for="cf-story" class="font-h3d-body text-2xs tracking-[0.16em] text-h3d-accent uppercase">YOUR STORY</label>
              <textarea
                id="cf-story"
                v-model="formData.story"
                rows="4"
                placeholder="Tell us who this is for and what moment you want to keep forever. The more you share, the better we can serve you."
                class="bg-h3d-surface border border-h3d-border text-h3d-text px-3.5 py-3 font-h3d-body text-sm font-light outline-none resize-y transition-colors focus:border-h3d-accent placeholder:text-h3d-muted placeholder:opacity-50"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-h3d-accent text-h3d-base px-6 py-3.5 font-h3d-body text-2xs font-bold tracking-[0.22em] uppercase transition-colors hover:bg-h3d-accent-hover mt-1"
            >
              SEND MY MESSAGE
            </button>
          </form>
        </div>
      </section>

      <!-- Quote block -->
      <div class="border border-h3d-border bg-h3d-surface px-9 py-9 text-center mb-16">
        <p class="font-h3d-display text-xl font-light text-h3d-text italic leading-relaxed mb-4">
          We are not building a product company. We are building a brand that turns human emotion into something you can hold.
        </p>
        <div class="w-8 h-px bg-h3d-accent mx-auto mb-3" aria-hidden="true" />
        <p class="font-h3d-body text-2xs tracking-[0.14em] text-h3d-muted uppercase">HAMRO3D · BRAND FOUNDATION · 2025</p>
      </div>
    </div>

  </div>
</template>
