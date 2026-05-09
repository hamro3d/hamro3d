# HAMRO3D — Design Schema Option D
## Dusk Violet Memory
> *The color of the hour between day and memory. Where things become precious.*

**Philosophy:** The moment a gift is received — the room is warm, the light is low, the feeling is between joy and something older. This system lives in that hour. Deep plum, dusty violet, aged rose — the palette of emotional depth, of the things we keep because they mean something.

---

# 01. COLOR SCHEMA

## Strategic Color Theory
| Entity | Strategic Requirement | Brand Value |
| :--- | :--- | :--- |
| **Primary Hue(s)** | Core brand identity colors | Deep Plum `#1A0E24` + Dusk Violet `#6B4E8A` + Aged Rose Gold `#C4907A` |
| **Color Harmony** | Relationship between hues | Analogous purple-to-rose arc — emotional, feminine-leaning luxury |
| **Color Mode** | Digital vs Print | Digital: HEX/RGB · Print: CMYK + Pantone 2627 C (Plum) + Pantone 7421 C (Rose) |
| **Color Wheel Position** | Location on the wheel | Red-violet to blue-violet arc · warm-cool tension within a single family |
| **Saturation** | Vibrant vs Subdued | Moderate-low — de-saturated enough to feel aged and precious, not bright or plastic |
| **Value / Depth** | Tints, Shades, and Tones | Deep plum base · mid-violet surface · rose gold for emotion — full tonal range |
| **Temperature** | Warm vs Cool | Warm-leaning cool — purple has warmth; rose gold anchors it in human feeling |
| **Number of Colors** | Total count in core palette | 6 (Deep Plum, Violet Mid, Muted Lavender, Cream, Rose Gold, Deep Burgundy for error) |
| **Aspiration** | Intended class/status | Artisan jewellery. Gifting occasion. The feeling of something held carefully for a long time. |

## Emotional Psychology
| Entity | Positive Emotion (Intended) | Negative Association (To Avoid) |
| :--- | :--- | :--- |
| **Primary Hue (Deep Plum)** | Mystery, depth, the sacred, emotional weight | Heaviness / morbidity — avoid by introducing rose warmth and cream text |
| **Secondary Hue (Dusk Violet)** | Memory, twilight, nostalgia, transition | Generic purple/brand feel — keep it dark and muted, never bright |
| **Accent (Aged Rose Gold)** | Love, intimacy, the human body, precious things | Femininity-only read — rose gold is used at 10%, not as dominant — it's an emotional accent, not a gender signal |

## Core Palette Hierarchy
| Layer | Role / Purpose | HEX / Value |
| :--- | :--- | :--- |
| **Base (Background)** | Deep Plum — the velvet interior of something precious | `#1A0E24` |
| **Surface (Layering)** | Cards, modals, product containers | `#271540` |
| **Primary Text** | Headlines and emotional copy | `#F2EDE8` (warm cream — not white) |
| **Secondary Text** | Descriptions, captions | `#A898B8` (lavender grey) |
| **Neutral Colors** | Borders, dividers, inactive states | `#3A2450` |

## Accent & Functional System
| Component | Strategic Use | Value |
| :--- | :--- | :--- |
| **Primary Accent** | CTAs, highlights, key focus points | `#C4907A` (Aged Rose Gold) |
| **Secondary Accent** | Hover states, secondary interactions | `#A07060` (Deep Rose) |
| **Success State** | Confirmation and completion | `#6B8A70` (Muted Sage — calm and resolved) |
| **Error State** | Critical feedback | `#8B2A3A` (Deep Burgundy — warm, not alarming) |

## Visual Depth & Effects
| Entity | Definition & Intention | Specs |
| :--- | :--- | :--- |
| **Gradients** | Dusk to depth — violet fading into plum below | Radial gradient: `#271540` center → `#1A0E24` edges · creates a "velvet spotlight" effect |
| **Shadow System** | Soft and weighted — like objects in candlelight | `box-shadow: 0 20px 56px rgba(26,14,36,0.95), 0 4px 12px rgba(196,144,122,0.1)` |
| **Blend Modes** | Soft-light overlay — dreamy, not harsh | Soft-light grain/velvet texture at 6–10% opacity on dark surfaces |
| **Transparency** | Warm violet glass — romantic but precise | `backdrop-filter: blur(14px)` · `background: rgba(39,21,64,0.9)` |

## Placement & Usage Ratio
| Category | Usage Purpose | Ratio % |
| :--- | :--- | :--- |
| **Dominant (Deep Plum Base)** | Backgrounds, major sections, atmosphere | 70% |
| **Support (Violet Mid + Lavender)** | Content containers, cards, readable sections | 20% |
| **Emphasis (Aged Rose Gold)** | CTAs, emotional highlights, gifting moments | 10% |

---

# 02. TYPOGRAPHY SCHEMA

**Type Direction:** Romantic editorial serif for emotion. Clean humanist sans for clarity. The combination should feel like a beautifully hand-addressed letter in a premium envelope.

## Identity Layer
| Level | Name | Usage | Font Family | Weight / Size |
| :--- | :--- | :--- | :--- | :--- |
| **L0** | Brand Logotype | Main Logo | **EB Garamond** | SemiBold 600 · Tracked +0.12em · Small Caps variant for "HAMRO" |
| **L0-S** | Sub-Brand/Tagline | Under Logo | EB Garamond Italic | Regular 400 · 0.55× logo size |

## Display Layer
| Level | Name | Usage | Font Family | Weight / Size |
| :--- | :--- | :--- | :--- | :--- |
| **H1** | Hero Title | Landing Headlines | **EB Garamond** | Regular 400 · 58–84px · natural letter-spacing |
| **H2** | Section Header | Major transitions | EB Garamond | Regular 400 · 38–50px |
| **Quote** | Emotional Pull | Philosophy / testimonials | EB Garamond Italic | Regular 400 · 22–26px · rose gold tint · centered |

## Structural Layer
| Level | Name | Usage | Font Family | Weight / Size |
| :--- | :--- | :--- | :--- | :--- |
| **H3** | Sub-Section | Feature titles | **Jost** | Medium 500 · 18–22px · Tracked +0.06em |
| **H4** | Card Titles | Product / Blog titles | Jost | Regular 400 · 15–17px |
| **H5** | Detail Label | Specs, categories | Jost | Regular 400 · 11px · ALL CAPS · Tracked +0.2em |

## Content Layer
| Level | Name | Usage | Font Family | Weight / Size |
| :--- | :--- | :--- | :--- | :--- |
| **Lead** | Intro Paragraph | Welcome / opening text | EB Garamond | Regular 400 · 19–21px · line-height 1.8 |
| **Body-L** | Primary Body | Story / descriptions | Jost | Regular 400 · 15px · line-height 1.82 |
| **Body-S** | Secondary Body | Captions / fine print | Jost | Light 300 · 13px |
| **List** | Bulleted Items | Features / options | Jost | Regular 400 · 14px |

## Interaction Layer
| Level | Name | Usage | Font Family | Weight / Size |
| :--- | :--- | :--- | :--- | :--- |
| **Nav** | Menu Link | Navigation bar | Jost | Medium 500 · 13px · Tracked +0.1em |
| **CTA-L** | Primary Button | Main action buttons | Jost | SemiBold 600 · 13px · ALL CAPS · Tracked +0.22em |
| **CTA-S** | Secondary Button | Text links | Jost | Regular 400 · 14px · rose gold on hover |

## Utility Layer
| Level | Name | Usage | Font Family | Weight / Size |
| :--- | :--- | :--- | :--- | :--- |
| **Bread** | Breadcrumbs | Path tracking | Jost | Light 300 · 12px |
| **Form** | Input Text | Labels / inputs | Jost | Regular 400 · 14px |
| **Err** | Status/Error | Feedback | Jost | Regular 400 · 13px · Deep Burgundy |
| **Legal** | Footer Credits | Copyright / privacy | Jost | Light 300 · 11px |

## Asset Layer
| Level | Name | Usage | Font Family | Weight / Size |
| :--- | :--- | :--- | :--- | :--- |
| **Stamp** | Watermark | 3D render overlays | EB Garamond | Italic 400 · 9px · 22% opacity |
| **Label** | Packaging Copy | Physical box text | EB Garamond + Jost | Mixed — display/body hierarchy |

## Experience Layer
| Level | Name | Usage | Font Family | Weight / Size |
| :--- | :--- | :--- | :--- | :--- |
| **Cert** | Authenticity | Certificates | EB Garamond | Italic 400 · 14px · cream on plum |
| **Story** | Memory Note | "The story behind this" | EB Garamond Italic | Regular 400 · 17px · warm cream · centered |
| **Reve** | Reveal Text | Animated loading copy | Jost | Light 300 · 13px · upward fade |

**Devanagari Mapping:**
- Display (H1–H2): **Rozha One** (Devanagari serif — editorial weight, emotional presence)
- Body + Utility: **Noto Sans Devanagari** — clean, neutral, reliable at all sizes

---

# 03. LOGO SCHEMA

**Identity Concept:** A blooming geometric form — a rose-like abstraction within a precise geometric structure. Memory that is both organic (human, emotional) and precise (crafted, intentional).

## Logo Anatomy & Construction
| Component | Definition | Brand Intent |
| :--- | :--- | :--- |
| **Logomark / Symbol** | The visual icon | An abstract radial mark — geometric petals or facets forming a whole — suggesting both a craft object (faceted gem or figurine view from above) and organic growth (memory unfolding). The form is precise but not mechanical. |
| **Wordmark** | Stylized "HAMRO3D" text | EB Garamond · "HAMRO" in regular weight · "3D" in italic — gentle typographic surprise that humanizes the brand |
| **Tagline Integration** | "Memory-to-Object Studio" | Jost Light · ALL CAPS · wide tracking · below wordmark · lavender grey |
| **Clear Space** | Breathing room | 1.25× height of "H" on all sides |
| **Minimum Size** | Smallest legible scale | Web: 110px wide · Print: 28mm |

## Variations & Hierarchy
| Version | Usage Case | Purpose |
| :--- | :--- | :--- |
| **Primary Logo** | Default — deep plum background | Rose gold symbol + cream wordmark + lavender tagline on Plum |
| **Stacked Logo** | Mobile / Social | Symbol above wordmark — no tagline |
| **Horizontal Logo** | Navigation | Symbol left of wordmark |
| **Icon Only** | Favicons / embossing | Radial/bloom symbol alone |
| **Monochrome** | Certificates / packaging foil | Full cream or rose gold |

## Logo Placement & Backgrounds
| Context | Treatment | Value |
| :--- | :--- | :--- |
| **Dark Plum Base** | Rose gold symbol + cream wordmark | Primary — website, social |
| **Light Cream** | Plum on Cream | Certificates, gift cards, packaging inserts |
| **Image Overlay** | Cream at 80% opacity | Corner placement, always with breathing room |
| **Physical Asset** | Rose gold foil or debossed | Packaging lid, tissue paper stamp, gift bag |

## Logo Misuse (The "Don'ts")
| Violation | Reason for Restriction |
| :--- | :--- |
| **Brightening the palette** | Bright purple reads as a tech startup — the brand lives in the dark and muted range |
| **Using the bloom symbol in pure pink** | Rose gold is the accent; pink breaks the premium register |
| **Over-rounding the wordmark** | EB Garamond is already humanist — do not add decorative roundness |
| **Placing on non-dark, non-cream backgrounds** | The logo only works within its palette — no random backgrounds |
| **Using more than 2 colors simultaneously** | Symbol in rose gold, text in cream — that is the complete system |

## Brand Marks & Assets
| Entity | Strategic Use |
| :--- | :--- |
| **The Artisan Seal** | Circular mark: "HAMRO3D · KATHMANDU · HANDCRAFTED" · cream on plum · rose gold border rule |
| **Favicon** | Bloom/radial symbol · 32×32px · rose gold on plum |
| **Social Avatar** | Symbol on deep plum square |
| **Watermark** | 20% opacity on all product renders — bloom in corner |

---

# 04. IMAGERY SCHEMA

**Visual Directive:** Twilight intimacy. The images should feel like the hour before it gets dark — warm, close, and meaningful.

## Photography Style & Composition
| Entity | Strategic Requirement | Brand Value |
| :--- | :--- | :--- |
| **Lighting Style** | Warm candle-adjacent light — soft, directional, intimate | Single warm source (2700–3000K) · long gentle shadows · gold-hour feel |
| **Depth of Field** | Shallow to medium — foreground softness as emotional texture | f/2.8–f/3.5 · foreground elements gently blurred as framing device |
| **Color Grading** | Warm-violet dusk — lift shadows toward deep plum · highlights toward cream | Add violet tone to shadows (+10 purple in HSL) · warm highlights · film grain overlay |
| **Perspective** | Intimate — close, slightly below eye-level for product. Eye-level for people. | Product: 30° angle · Human: eye-level to slightly above — tender, not towering |
| **Texture Focus** | Soft surfaces — velvet, silk, aged wood, dried flowers as props | Product surrounded by emotional texture — fabric folds, botanicals, worn surfaces |

## Subject Hierarchy
| Category | Focus Point | Emotional Intention |
| :--- | :--- | :--- |
| **Product Solo** | Object on velvet or textured surface in warm-violet light | Preciousness — "This is a thing worth keeping, worth preserving" |
| **Human Interaction** | Full gifting moment — emotion on face, object in hands | Love and recognition — the gift lands, the face shows it |
| **Contextual/Lifestyle** | Object in warm Nepali interior — beside candles, on a dresser, near flowers | Intimacy — "This lives in the private spaces of people who love each other" |
| **Behind the Scenes** | Hands at work in warm studio light — paint, finishing, careful detail work | Trust and devotion — "Someone gave their hands to make this" |

## Digital Asset Standards
| Asset Type | Treatment / Filter | Aspect Ratios |
| :--- | :--- | :--- |
| **Website Hero** | Intimate, warm — product emerging from dusk atmosphere | 16:9 · violet-grade |
| **Product Gallery** | Consistent deep plum or velvet background · warm side-lighting | 1:1 · 4:5 (mobile) |
| **Social Media** | Warmer, more personal — the most "human" of all touchpoints | 1:1 (feed) · 9:16 (stories/reels) |
| **3D Renders** | Warm-violet ambient light simulation · soft environment lighting | Match photography grade — no clinical white renders |

## Imagery Misuse
| Violation | Reason for Restriction |
| :--- | :--- |
| **Cold / blue-white editing** | Completely destroys the warmth — this is not a tech or studio brand |
| **White or grey studio backgrounds** | This system demands context and atmosphere — neutral backdrops kill the emotion |
| **Overly posed / commercial stock feel** | The brand is intimate and real — images must feel like personal photography, not advertising |
| **Bright, saturated colours in props** | Props should be muted, natural, aged — bright colours pull focus from the product |
| **Clinical close-ups without warmth** | Macro is allowed only when texture is emotional — not when it feels medical or mechanical |

---

# 05. LAYOUT & DISPLAY SCHEMA

**Spatial Directive:** Intimate editorial. Like a personal art book or a beautifully designed memoir — generous space, warm presence, each page a moment.

## Grid & Spatial Logic
| Entity | Logic / Constraint | Specs |
| :--- | :--- | :--- |
| **Grid System** | Soft 12-column — centered and generous · slight asymmetry for emotional life | 12-col · 24px gutters · max-width 1240px |
| **Whitespace** | Generous and warm — space that invites, not space that intimidates | 100–140px vertical padding between sections |
| **Container Widths** | Comfortable reading width — intimate, not wide-open | Text: max 660px centered · Product grid: max 1100px |
| **Vertical Rhythm** | 8px base unit — moderate warmth | Section gaps: 140–220px |

## Component Display Hierarchy
| Component | Display Style | Purpose |
| :--- | :--- | :--- |
| **Hero Section** | Full-bleed dusk atmosphere — product in warm light, headline in EB Garamond, rose gold rule line beneath | Arrival as occasion — you have entered a gifting space |
| **Product Cards** | Deep plum cards · image fills top 70% · gentle hover with rose gold border glow | Precious and considered — each product is a gift waiting to happen |
| **Text Blocks** | Centered · cream EB Garamond lead · Jost body · generous leading | Emotional reading — the words are part of the gift |
| **CTA** | Rose gold outlined button · cream text · fills on hover with rose gold | An invitation to give — warm, generous, never pressuring |

## Interactive Layout (Experience Flow)
| Phase | Layout Transition | Spec |
| :--- | :--- | :--- |
| **Discovery** | Warm fade-up · 0.7s ease · staggered product reveals | Like gifts appearing under warm light |
| **Selection** | 2-column product grid · hover reveals human-scale context image | Considered choosing — this is a gift, not a purchase |
| **Checkout/Custom** | Single column · intimate guided form · step labels in EB Garamond Italic | Commissioning as act of love — every step feels intentional |
| **Success/Reveal** | Full deep plum screen · cream EB Garamond · centered · rose gold rule · "Your memory is now in our hands" | The most emotional close in the system — this is a gift given |

## Responsive Architecture
| Device | Strategy | Key Constraint |
| :--- | :--- | :--- |
| **Desktop** | Warm editorial · centered layouts · image-forward sections · 1240px | Hero at 100vh · product images at min 500px |
| **Mobile** | Intimate, personal feel · large text · warm full-width imagery · CTAs pinned bottom | Max-width 390px · EB Garamond H1 at 38px · Jost body at 16px · CTAs at 56px height |
| **Tablet** | 2-column product cards · editorial text width · warm atmosphere preserved | 768–1024px · reduce hero to 80vh · 60px section padding |

**Nepal-Specific Optimization:**
- WebP images ≤ 180KB for mobile data sensitivity
- Preload hero image — dusk atmosphere must arrive immediately
- Lazy-load all below-fold product imagery
- No background video — too data-heavy for 4G
- Core gifting CTA accessible within 2 taps from homepage

---

## Option D — Strategic Fit Summary

**Primary Audience Match:**
- Gifters — people buying for spouses, parents, partners, children
- Dashain / Tihar / wedding / anniversary buyers
- Emotionally-motivated purchasers who want the *feeling* of the gift to be premium

**Why this works in Nepal:**
Nepali gift culture is deeply rooted in emotional occasion. This palette — its warmth, depth, and intimacy — speaks directly to the moment of giving. The rose gold accent is not about gender; it is about the feeling of something held carefully and given with love. That is universally Nepali.

**Phase suitability:**
Strong for Phase 0 — gift-occasion products (litholamps, nameplates, keychains as personal gifts). Grows naturally into Phase 2 — the figurine as the ultimate expression of gifted memory.

---

*Option D is the highest-emotional-resonance system for Nepal's gift culture. It is the only option in this set that directly speaks to the act of giving — not just the object received.*
