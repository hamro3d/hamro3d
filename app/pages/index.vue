<template>
  <div class="space-y-0">
    <!-- Hero Section -->
    <section class="min-h-screen md:min-h-[calc(100vh-68px)] bg-h3d-surface border-b border-h3d-border relative overflow-hidden flex items-center px-6 sm:px-10 py-20 sm:py-20" aria-labelledby="hero-heading">
      <!-- Atmosphere -->
      <div class="absolute inset-0 bg-gradient-to-br from-h3d-border via-h3d-surface to-h3d-base opacity-50 pointer-events-none" aria-hidden="true"></div>
      
      <!-- Hero Content -->
      <div class="relative z-2 max-w-lg">
        <div class="w-12 h-px bg-h3d-accent mb-5" aria-hidden="true"></div>
        <p class="font-h3d-body text-2xs tracking-widest uppercase text-h3d-accent mb-5">For the people you cannot forget</p>
        <h1 class="font-h3d-display text-4xl sm:text-5xl md:text-6xl font-light text-h3d-text mb-5 leading-tight" id="hero-heading">
          Where emotions<br/>take tangible form.
        </h1>
        <p class="font-h3d-body text-sm sm:text-base text-h3d-muted mb-8 leading-relaxed max-w-md">
          We turn meaningful human moments into objects you can keep forever. Give someone the gift of being remembered.
        </p>
        <div class="flex gap-3 flex-wrap">
          <NuxtLink
            to="/contact#commission-form"
            class="bg-h3d-accent text-h3d-base px-6 sm:px-8 py-3 font-h3d-body text-2xs font-semibold tracking-widest uppercase transition-colors hover:bg-h3d-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
          >
            Begin Your Commission
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="border border-h3d-border text-h3d-muted px-6 sm:px-8 py-3 font-h3d-body text-2xs tracking-widest uppercase transition-colors hover:border-h3d-accent hover:text-h3d-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
          >
            See Collection →
          </NuxtLink>
        </div>
      </div>

      <!-- Occasions (Hidden on mobile) -->
      <div class="hidden lg:block absolute right-20 top-1/2 transform -translate-y-1/2 z-2">
        <p class="font-h3d-body text-2xs text-h3d-accent mb-3 tracking-widest">Perfect for</p>
        <div class="space-y-2.5 font-h3d-body text-sm text-h3d-muted">
          <div class="pb-2.5 border-b border-h3d-border hover:text-h3d-text transition-colors">Family Rituals</div>
          <div class="pb-2.5 border-b border-h3d-border hover:text-h3d-text transition-colors">Valentine's Day</div>
          <div class="pb-2.5 border-b border-h3d-border hover:text-h3d-text transition-colors">Wedding Gifts</div>
          <div class="pb-2.5 border-b border-h3d-border hover:text-h3d-text transition-colors">Anniversaries</div>
          <div class="pb-2.5 border-b border-h3d-border hover:text-h3d-text transition-colors">Remembrance</div>
          <div class="pb-2.5 border-b border-h3d-border hover:text-h3d-text transition-colors">Birthdays</div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <button 
        class="hidden sm:flex absolute bottom-8 left-10 items-center gap-3 z-2 animate-scroll-pulse cursor-pointer bg-transparent border-none p-0"
        @click="scrollToMarquee"
        aria-label="Scroll to marquee section"
      >
        <span class="block w-9 h-px bg-h3d-accent origin-center animate-scroll-line"></span>
        <span class="font-h3d-body text-2xs tracking-widest uppercase text-h3d-muted">Scroll to explore</span>
      </button>
    </section>

    <!-- Marquee Strip -->
    <div id="marquee-section" class="border-y border-h3d-border bg-h3d-surface-alt overflow-hidden py-3" aria-hidden="true">
      <div class="flex gap-0 whitespace-nowrap animate-marquee">
        <span v-for="i in 4" :key="i" class="flex items-center gap-0">
          <span class="inline-flex items-center gap-7 px-7">
            <span class="font-h3d-body text-2xs text-h3d-muted tracking-widest uppercase"><span class="inline-block w-1 h-1 bg-h3d-accent rounded-full mr-2"></span>Handcrafted in Nepal</span>
            <span class="font-h3d-body text-2xs text-h3d-muted tracking-widest uppercase"><span class="inline-block w-1 h-1 bg-h3d-accent rounded-full mr-2"></span>Memory to Object</span>
            <span class="font-h3d-body text-2xs text-h3d-muted tracking-widest uppercase"><span class="inline-block w-1 h-1 bg-h3d-accent rounded-full mr-2"></span>Custom Figurines</span>
            <span class="font-h3d-body text-2xs text-h3d-muted tracking-widest uppercase"><span class="inline-block w-1 h-1 bg-h3d-accent rounded-full mr-2"></span>Premium Craft Studio</span>
          </span>
        </span>
      </div>
    </div>

    <!-- Products Section -->
    <section class="max-w-h3d-max mx-auto px-6 sm:px-10 py-20 sm:py-20 scroll-mt-24">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 sm:gap-4 mb-10">
        <div>
          <span class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase block mb-3">Gifts they will never throw away</span>
          <h2 class="font-h3d-display text-3xl sm:text-4xl md:text-5xl font-light text-h3d-text">Our Collection</h2>
        </div>
        <NuxtLink to="/products" class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase hover:gap-2 transition-all inline-flex gap-0.5 items-center">
          View All <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <H3dProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          variant="collection"
        />
      </div>
    </section>

    <!-- How It Works -->
    <section class="bg-h3d-surface border-y border-h3d-border py-20 sm:py-20">
      <div class="max-w-h3d-max mx-auto px-6 sm:px-10">
        <span class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase block mb-3">Our process</span>
        <h2 class="font-h3d-display text-3xl sm:text-4xl font-light text-h3d-text mb-10 max-w-md">How we make it meaningful</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div class="bg-h3d-base border border-h3d-border p-7 flex gap-5 hover:border-h3d-accent transition-colors">
            <div class="w-11 h-11 border border-h3d-accent flex items-center justify-center bg-h3d-surface flex-shrink-0">
              <svg viewBox="0 0 24 24" class="w-5 h-5 stroke-h3d-accent fill-none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            </div>
            <div>
              <h3 class="font-h3d-display text-base text-h3d-text font-light mb-1.5">Tell Us Your Story</h3>
              <p class="font-h3d-body text-xs text-h3d-muted leading-relaxed">Share the memory. Our artisans will decide the best way to hold it in physical form.</p>
            </div>
          </div>

          <div class="bg-h3d-base border border-h3d-border p-7 flex gap-5 hover:border-h3d-accent transition-colors">
            <div class="w-11 h-11 border border-h3d-accent flex items-center justify-center bg-h3d-surface flex-shrink-0">
              <svg viewBox="0 0 24 24" class="w-5 h-5 stroke-h3d-accent fill-none"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <div>
              <h3 class="font-h3d-display text-base text-h3d-text font-light mb-1.5">Photo to Object</h3>
              <p class="font-h3d-body text-xs text-h3d-muted leading-relaxed">One photograph. One person. One piece that holds them close when they're far.</p>
            </div>
          </div>

          <div class="bg-h3d-base border border-h3d-border p-7 flex gap-5 hover:border-h3d-accent transition-colors">
            <div class="w-11 h-11 border border-h3d-accent flex items-center justify-center bg-h3d-surface flex-shrink-0">
              <svg viewBox="0 0 24 24" class="w-5 h-5 stroke-h3d-accent fill-none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </div>
            <div>
              <h3 class="font-h3d-display text-base text-h3d-text font-light mb-1.5">Occasion Gifting</h3>
              <p class="font-h3d-body text-xs text-h3d-muted leading-relaxed">Weddings, Babyshower, Dashain, Anniversaries, Birthdays, Valentine's Day, Remembrance — we craft for the moments that matter.</p>
            </div>
          </div>

          <div class="bg-h3d-base border border-h3d-border p-7 flex gap-5 hover:border-h3d-accent transition-colors">
            <div class="w-11 h-11 border border-h3d-accent flex items-center justify-center bg-h3d-surface flex-shrink-0">
              <svg viewBox="0 0 24 24" class="w-5 h-5 stroke-h3d-accent fill-none"><path d="M21 10H3M21 6H3M21 14H3M21 18H3"/></svg>
            </div>
            <div>
              <h3 class="font-h3d-display text-base text-h3d-text font-light mb-1.5">Gift Ready Packaging</h3>
              <p class="font-h3d-body text-xs text-h3d-muted leading-relaxed">The presentation is part of the gift. Every piece arrives wrapped with intention.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote Section -->
    <section class="max-w-h3d-max mx-auto px-6 sm:px-10 py-20 sm:py-20">
      <div class="border border-h3d-border bg-h3d-surface p-12 sm:p-16 text-center relative">
        <span class="absolute top-4 left-8 font-h3d-display text-7xl text-h3d-accent opacity-15 leading-none">"</span>
        <p class="font-h3d-display text-2xl sm:text-3xl font-light text-h3d-text mb-4 relative z-1">A gift they will never throw away.</p>
        <div class="w-12 h-px bg-h3d-accent opacity-30 mx-auto mb-4"></div>
        <p class="font-h3d-body text-2xs text-h3d-muted tracking-widest uppercase">Hamro3D · Kathmandu · Est. 2025</p>
      </div>
    </section>

    <!-- Occasions Section -->
    <section class="bg-h3d-surface-alt border-y border-h3d-border py-20 sm:py-20">
      <div class="max-w-h3d-max mx-auto px-6 sm:px-10">
        <span class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase block mb-3">We craft for</span>
        <h2 class="font-h3d-display text-3xl sm:text-4xl font-light text-h3d-text mb-10">Every meaningful occasion</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-h3d-border border border-h3d-border">
          <div class="bg-h3d-base p-7 sm:p-10 text-center hover:bg-h3d-surface transition-colors">
            <div class="font-h3d-serif text-2xl text-h3d-accent opacity-60 mb-2">✦</div>
            <div class="font-h3d-body text-xs text-h3d-text tracking-widest uppercase mb-1.5">Weddings</div>
            <div class="font-h3d-body text-2xs text-h3d-muted leading-relaxed">The couple, forever in miniature</div>
          </div>
          <div class="bg-h3d-base p-7 sm:p-10 text-center hover:bg-h3d-surface transition-colors">
            <div class="font-h3d-serif text-2xl text-h3d-accent opacity-60 mb-2">✦</div>
            <div class="font-h3d-body text-xs text-h3d-text tracking-widest uppercase mb-1.5">Dashain & Tihar</div>
            <div class="font-h3d-body text-2xs text-h3d-muted leading-relaxed">Gifts that carry meaning home</div>
          </div>
          <div class="bg-h3d-base p-7 sm:p-10 text-center hover:bg-h3d-surface transition-colors">
            <div class="font-h3d-serif text-2xl text-h3d-accent opacity-60 mb-2">✦</div>
            <div class="font-h3d-body text-xs text-h3d-text tracking-widest uppercase mb-1.5">Anniversaries</div>
            <div class="font-h3d-body text-2xs text-h3d-muted leading-relaxed">Mark the years with something real</div>
          </div>
          <div class="bg-h3d-base p-7 sm:p-10 text-center hover:bg-h3d-surface transition-colors">
            <div class="font-h3d-serif text-2xl text-h3d-accent opacity-60 mb-2">✦</div>
            <div class="font-h3d-body text-xs text-h3d-text tracking-widest uppercase mb-1.5">Remembrance</div>
            <div class="font-h3d-body text-2xs text-h3d-muted leading-relaxed">Because some people must be kept close</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-h3d-max mx-auto px-6 sm:px-10 py-20 sm:py-20 text-center">
      <span class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase block mb-3">Ready to preserve a memory?</span>
      <h2 class="font-h3d-display text-3xl sm:text-4xl md:text-5xl font-light text-h3d-text mb-5 leading-tight max-w-2xl mx-auto">Your story deserves to take shape.</h2>
      <p class="font-h3d-body text-sm sm:text-base text-h3d-muted mb-8 max-w-lg mx-auto">Commission a piece made entirely for the person you cannot forget.</p>
      <NuxtLink to="/contact#commission-form" class="bg-h3d-accent text-h3d-base px-8 py-3 font-h3d-body text-2xs font-semibold tracking-widest uppercase transition-colors hover:bg-h3d-accent-hover inline-block">
        Begin Your Commission
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from 'nuxt/app'
import { computed } from 'vue'
import { getTopRankedMockProducts } from '~/data/mock-products'

useSeoMeta({
  title: 'Crafted with Care',
  description: 'Meaningful keepsakes handcrafted in Kathmandu. Preserve moments in tangible form.',
  ogImage: '/og/home.jpg',
  ogType: 'website',
})

const products = computed(() => getTopRankedMockProducts(3))

const scrollToMarquee = () => {
  const marqueeSection = document.getElementById('marquee-section')
  if (marqueeSection) {
    const navbar = document.querySelector('nav')
    const navbarHeight = navbar ? navbar.offsetHeight : 68
    const targetPosition = marqueeSection.offsetTop - navbarHeight
    window.scrollTo({ top: targetPosition, behavior: 'smooth' })
  }
}
</script>

<style scoped>
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 28s linear infinite;
}
</style>
