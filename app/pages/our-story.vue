<script setup lang="ts">
useSeoMeta({
  title: 'Our Story',
  description:
    'How Hamro3D began in Kathmandu as a memory-to-object studio, and why we choose emotion, craft, and meaning in every piece.',
})
</script>

<template>
  <div class="min-h-screen bg-h3d-base text-h3d-text font-h3d-body">
    <!-- Page header -->
    <header
      class="relative overflow-hidden bg-h3d-surface border-b border-h3d-border"
      aria-labelledby="our-story-heading"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_-30%,rgba(196,144,122,0.22),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_90%_50%,rgba(58,36,80,0.55),transparent_65%)]"
        aria-hidden="true"
      />
      <div class="relative z-10 max-w-h3d-max mx-auto w-full px-6 sm:px-10 py-12 sm:py-14 lg:py-16">
        <p
          class="font-h3d-body text-2xs tracking-[0.2em] text-h3d-accent uppercase mb-4"
        >
          OUR STORY · हाम्रो कथा
        </p>
        <div class="w-14 h-px bg-h3d-accent mb-6" aria-hidden="true" />
        <h1
          id="our-story-heading"
          class="font-h3d-display text-3xl sm:text-4xl md:text-5xl font-light text-h3d-text mb-6 max-w-h3d-text leading-tight"
        >
          We turn emotions into objects you can hold.
        </h1>
        <p class="font-h3d-body text-sm sm:text-base text-h3d-muted max-w-h3d-text leading-relaxed">
          Hamro3D is a quiet studio in Kathmandu where memories become something solid — keychains,
          lamps, nameplates, and other pieces made to be gifted, kept, and passed down. Technology
          helps us get there; care is what makes it matter.
        </p>
      </div>
    </header>

    <main>
      <!-- Origin -->
      <section
        class="max-w-h3d-max mx-auto w-full px-6 sm:px-10 py-14 sm:py-16 lg:py-20"
        aria-labelledby="origin-heading"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div class="space-y-6">
            <h2
              id="origin-heading"
              class="font-h3d-display text-2xl sm:text-3xl md:text-4xl font-light text-h3d-text leading-snug"
            >
              A small studio with a large heart
            </h2>
            <div class="space-y-4 font-h3d-body text-sm sm:text-base text-h3d-muted leading-relaxed">
              <p>
                We started in Kathmandu with a simple belief: the moments that shape us should not
                live only on screens or in photo albums. They deserve a place in the room, in a hand,
                on a shelf — something you can touch when words are not enough.
              </p>
              <p>
                The city’s rhythm of family gatherings, festivals, weddings, and quiet remembrance
                taught us what people actually treasure. We listened, and built a practice around
                patience, conversation, and the slow work of turning feeling into form.
              </p>
              <p>
                Today we remain intentionally small — so every commission gets attention, every
                detail carries intention, and nothing leaves the studio unless it feels like a
                memory, not merely an object.
              </p>
            </div>
          </div>
          <div
            class="relative min-h-[280px] lg:min-h-[340px] border border-h3d-border overflow-hidden"
          >
            <NuxtImg
              src="/images/studio/studio-team.png"
              alt="Hamro3D studio team crafting a memory piece"
              class="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
            />
            <!-- subtle vignette so edges melt into the dark layout -->
            <div
              class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(16,8,26,0.55),transparent_65%)]"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <!-- Values -->
      <section
        class="border-y border-h3d-border bg-h3d-base"
        aria-labelledby="values-heading"
      >
        <div class="max-w-h3d-max mx-auto w-full px-6 sm:px-10 py-14 sm:py-16">
          <span class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase block mb-3">Our principles</span>
          <h2 id="values-heading" class="font-h3d-display text-2xl sm:text-3xl font-light text-h3d-text mb-8 sm:mb-10">
            What we stand for
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            <article
              class="border border-h3d-border bg-h3d-surface p-6 sm:p-7 flex gap-5"
            >
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center border border-h3d-accent"
                aria-hidden="true"
              >
                <svg
                  class="w-5 h-5 stroke-h3d-accent fill-none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div>
                <h3 class="font-h3d-display text-lg text-h3d-text mb-2">
                  Emotional authenticity over technical output
                </h3>
                <p class="font-h3d-body text-sm text-h3d-muted leading-relaxed">
                  If a piece does not carry feeling, it does not meet our standard. We refine until
                  the story reads clearly — not until the spec sheet is full.
                </p>
              </div>
            </article>

            <article
              class="border border-h3d-border bg-h3d-surface p-6 sm:p-7 flex gap-5"
            >
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center border border-h3d-accent"
                aria-hidden="true"
              >
                <svg
                  class="w-5 h-5 stroke-h3d-accent fill-none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 16v-5" />
                  <circle cx="12" cy="8" r="0.8" class="fill-h3d-accent stroke-none" />
                </svg>
              </div>
              <div>
                <h3 class="font-h3d-display text-lg text-h3d-text mb-2">
                  Meaning over utility
                </h3>
                <p class="font-h3d-body text-sm text-h3d-muted leading-relaxed">
                  We are not optimizing for speed or volume. We ask what this gift is meant to say,
                  and shape the work around that answer.
                </p>
              </div>
            </article>

            <article
              class="border border-h3d-border bg-h3d-surface p-6 sm:p-7 flex gap-5"
            >
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center border border-h3d-accent"
                aria-hidden="true"
              >
                <svg
                  class="w-5 h-5 stroke-h3d-accent fill-none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              </div>
              <div>
                <h3 class="font-h3d-display text-lg text-h3d-text mb-2">
                  Craft over speed
                </h3>
                <p class="font-h3d-body text-sm text-h3d-muted leading-relaxed">
                  Care takes time: drafting, adjusting, finishing. We protect that rhythm so the
                  piece arrives with weight and warmth, not hurry.
                </p>
              </div>
            </article>

            <article
              class="border border-h3d-border bg-h3d-surface p-6 sm:p-7 flex gap-5"
            >
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center border border-h3d-accent"
                aria-hidden="true"
              >
                <svg
                  class="w-5 h-5 stroke-h3d-accent fill-none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 3l2.09 6.42h6.76l-5.48 3.98 2.09 6.42L12 15.84l-5.46 3.98 2.09-6.42-5.48-3.98h6.76z" />
                </svg>
              </div>
              <div>
                <h3 class="font-h3d-display text-lg text-h3d-text mb-2">
                  Quality over price
                </h3>
                <p class="font-h3d-body text-sm text-h3d-muted leading-relaxed">
                  We choose materials and finishes that honor the story inside the commission — so
                  it can be kept, not replaced.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Process -->
      <section
        class="max-w-h3d-max mx-auto w-full px-6 sm:px-10 py-14 sm:py-16 lg:py-20"
        aria-labelledby="process-heading"
      >
        <h2
          id="process-heading"
          class="font-h3d-display text-2xl sm:text-3xl font-light text-h3d-text mb-8 sm:mb-10"
        >
          How we work with you
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-3 border border-h3d-border">
          <div
            class="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-h3d-border"
          >
            <p class="font-h3d-body text-2xs tracking-widest text-h3d-accent uppercase mb-3">
              01
            </p>
            <h3 class="font-h3d-display text-lg text-h3d-text mb-3">
              You share the memory
            </h3>
            <p class="font-h3d-body text-sm text-h3d-muted leading-relaxed">
              You tell us the person, the occasion, or the moment you want held in something real.
              Photos, notes, and gentle detail all help.
            </p>
          </div>
          <div
            class="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-h3d-border"
          >
            <p class="font-h3d-body text-2xs tracking-widest text-h3d-accent uppercase mb-3">
              02
            </p>
            <h3 class="font-h3d-display text-lg text-h3d-text mb-3">
              We shape it by hand
            </h3>
            <p class="font-h3d-body text-sm text-h3d-muted leading-relaxed">
              We sketch, model, and refine with the feel of the gift in mind — sound judgment, not
              rush, until it feels worthy of the story.
            </p>
          </div>
          <div class="p-6 sm:p-8">
            <p class="font-h3d-body text-2xs tracking-widest text-h3d-accent uppercase mb-3">
              03
            </p>
            <h3 class="font-h3d-display text-lg text-h3d-text mb-3">
              You hold it forever
            </h3>
            <p class="font-h3d-body text-sm text-h3d-muted leading-relaxed">
              Your piece arrives ready to give — a keepsake meant to outlast trends and stay close
              to the heart.
            </p>
          </div>
        </div>
      </section>

      <!-- Studio card -->
      <section class="max-w-h3d-max mx-auto w-full px-6 sm:px-10 pb-14 sm:pb-16" aria-label="Studio">
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-h3d-border bg-h3d-surface"
        >
          <div class="p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-h3d-border">
            <p class="font-h3d-body text-2xs tracking-widest text-h3d-accent uppercase mb-6">
              The studio
            </p>
            <dl class="space-y-5 font-h3d-body text-sm text-h3d-muted">
              <div>
                <dt class="text-2xs tracking-widest uppercase text-h3d-muted mb-1">
                  Location
                </dt>
                <dd class="text-h3d-text text-base">
                  Kathmandu
                </dd>
              </div>
              <div>
                <dt class="text-2xs tracking-widest uppercase text-h3d-muted mb-1">
                  Founded
                </dt>
                <dd class="text-h3d-text text-base">
                  2025
                </dd>
              </div>
              <div>
                <dt class="text-2xs tracking-widest uppercase text-h3d-muted mb-1">
                  Team
                </dt>
                <dd class="text-h3d-text text-base">
                  Small · Dedicated
                </dd>
              </div>
            </dl>
          </div>
          <div
            class="flex flex-col items-center justify-center p-8 sm:p-10 bg-h3d-base/40 min-h-[200px]"
          >
            <div
              class="border-2 border-h3d-accent px-8 py-6 text-center max-w-[240px]"
            >
              <p
                class="font-h3d-body text-2xs tracking-[0.35em] text-h3d-accent uppercase leading-relaxed"
              >
                NEPAL · MEMORY TO OBJECT
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Quote -->
      <section
        class="bg-h3d-surface border-t border-h3d-border py-14 sm:py-16"
        aria-labelledby="quote-heading"
      >
        <div class="max-w-h3d-max mx-auto w-full px-6 sm:px-10 text-center">
          <h2 id="quote-heading" class="sr-only">
            Words from the studio
          </h2>
          <blockquote
            class="font-h3d-display text-xl sm:text-2xl md:text-3xl font-light text-h3d-text leading-snug max-w-h3d-text mx-auto mb-6"
          >
            “We do not sell prints. We safeguard moments — one quiet piece at a time.”
          </blockquote>
          <p class="font-h3d-body text-sm text-h3d-muted">
            — Hamro3D
          </p>
        </div>
      </section>

      <!-- CTA -->
      <section class="max-w-h3d-max mx-auto w-full px-6 sm:px-10 py-16 sm:py-20 text-center" aria-label="Commission a piece">
        <span class="font-h3d-body text-2xs text-h3d-accent tracking-widest uppercase block mb-3">Ready to begin?</span>
        <h2 class="font-h3d-display text-3xl sm:text-4xl font-light text-h3d-text mb-5 leading-tight max-w-xl mx-auto">
          Your story deserves a permanent home.
        </h2>
        <p class="font-h3d-body text-sm text-h3d-muted mb-8 max-w-md mx-auto leading-relaxed">
          Commission a piece that holds the person or moment you never want to forget.
        </p>
        <NuxtLink
          to="/contact#commission-form"
          class="bg-h3d-accent text-h3d-base px-8 py-3 font-h3d-body text-2xs font-semibold tracking-widest uppercase transition-colors hover:bg-h3d-accent-hover inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h3d-accent"
        >
          Begin Your Commission
        </NuxtLink>
      </section>
    </main>
  </div>
</template>
