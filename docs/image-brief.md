# CLOVE — Image Art-Direction Brief & Generation Prompts

Grounded in the premium preventative-health cohort: **Everlab**, **Function Health**,
**Superpower**, **Oura**. Goal: elevate CLOVE's imagery from "wellness stock" to
clinical-luxury, Apple / ThriveRx tier.

> **Why earlier prompts looked strange:** image models mangle logos, embossed marks,
> on-image text, UI, and data charts. The brands above almost never rely on those in
> their *photography* — they use abstract 3D organic forms, macro material/texture,
> and clean editorial portraits. Every prompt below avoids text/logo/UI rendering and
> leans into what AI does well.

---

## 0. The unifying art-direction system (apply to ALL images)

- **Palette:** warm paper / oat / sand / bone (`#FAF8F2 → #EEE8D8 → #E5DDCA`), soft
  charcoal ink, a SINGLE metallic accent = **brushed champagne-gold**. No teal, no
  cyan "medical blue," no neon, no purple AI-gradient.
- **Light:** one soft directional key, gentle falloff, large soft shadows, dawn/window
  quality. Never hard flash.
- **Finish:** matte surfaces, shallow depth of field, fine 35mm grain, photoreal.
- **Composition:** generous negative space, single clear subject, editorial restraint.
- **Output:** 2400×1600 landscape or 1600×2000 portrait, sRGB, optimized JPG/WebP.
- **Tool flags:** Midjourney → append `--style raw --v 6.1` + the `--ar` noted.
  Flux/DALL·E → drop the flags, keep the prose.
- **Universal negative (where supported):** `--no text, logo, watermark, UI, chart,
  graph, neon, teal, oversaturated, plastic, stocky smiles, distorted hands, extra fingers`

---

## 1. EVERLAB — analysis + per-image prompts

**Aesthetic read:** warm cream/bone canvas, **soft 3D organic "biological" forms**
(rounded translucent blobs, cell-like spheres, flowing matte sculptures) in muted
sand/clay tones, editorial serif headlines, lots of air, calm and premium. Science is
shown as *beautiful abstract organic form*, never as clip-art molecules or charts.

### 1.1 Hero backdrop — organic form
```
A single large soft-rounded organic sculpture, like a smooth translucent cell or
river-worn stone, floating on a seamless warm-bone (#F4EFE6) studio backdrop. Matte
finish with faint subsurface glow, sculpted in muted clay and sand tones. Soft
directional dawn light from upper left, large gentle shadow, shallow depth of field,
fine grain. Calm, premium, biological-abstract, generous empty space at right.
Photoreal 3D render. --ar 16:9 --style raw --v 6.1
```

### 1.2 Cellular cluster (science motif)
```
Macro abstract render of a cluster of soft translucent spheres resembling healthy
cells, gently overlapping, in warm bone and pale-clay tones with a whisper of
champagne-gold rim light. Matte, organic, subsurface scattering, soft focus falloff,
seamless cream background. Serene and premium, no text. Photoreal 3D. --ar 3:2 --style raw --v 6.1
```

### 1.3 Flowing ribbon form (vitality)
```
A smooth flowing matte ribbon sculpture curving through frame like a calm wave of
biology, sand-and-oat gradient surface, soft champagne highlight along one edge,
seamless warm backdrop, soft studio light, large soft shadow, shallow depth of field.
Minimal, elegant, premium wellness-tech. Photoreal 3D render. --ar 16:9 --style raw --v 6.1
```

### 1.4 Editorial founder/clinician portrait
```
Editorial portrait of a calm, intelligent doctor in soft neutral knitwear, natural
window light, looking thoughtfully off-camera, against a warm-oat wall with shallow
depth of field. Authentic and composed, not stock-smiling. Matte skin tones, fine
grain, warm palette, generous negative space. Photoreal, 85mm lens. --ar 3:2 --style raw --v 6.1
```

### 1.5 Lifestyle — quiet vitality
```
Candid editorial photograph of a healthy adult in their 50s walking in soft morning
light through a minimal warm-toned space, relaxed and content, motion-blur subtle,
warm sand palette, shallow depth of field, fine grain. Real and aspirational, not
posed stock. Photoreal, 50mm. --ar 3:2 --style raw --v 6.1
```

### 1.6 Blood / biomarker macro (no charts)
```
Extreme macro of a single suspended droplet on a matte champagne-gold surface,
catching soft light, warm-bone background, shallow focus, scientific yet beautiful,
calm premium tone. No text, no charts. Photoreal. --ar 3:2 --style raw --v 6.1
```

### 1.7 Texture / section divider
```
Soft abstract close-up of rippled matte sand-toned material, like fine sculpted
plaster, raking dawn light revealing gentle texture, warm neutral palette, minimal,
used as a quiet section background with empty space. Photoreal. --ar 16:9 --style raw --v 6.1
```

---

## 2. FUNCTION HEALTH — analysis + per-image prompts

**Aesthetic read:** more **editorial + clinical-credible**. Cream and deep ink/near-
black sections, refined serif/grotesk mix, **biomarker fields shown as elegant dot /
node constellations** (calm, not busy), authentic human portraiture, occasional clean
product-of-the-lab macro. Premium, trustworthy, "100 healthy years."

### 2.1 Dark hero — node constellation
```
Cinematic dark charcoal (#10110F) field with a soft, sparse constellation of faint
luminous nodes connected by ultra-thin lines, like a calm map of the body's systems,
a single warm champagne-gold glow low in frame. Very low contrast, lots of dark
negative space for white headline text. Atmospheric, premium, photoreal 3D. --ar 16:9 --style raw --v 6.1
```

### 2.2 Light hero alt — clean canvas
```
Minimal warm-cream seamless canvas with a single soft 3D rounded form resting lower
third, brushed champagne-gold accent, soft dawn light and long gentle shadow,
enormous calm negative space top and right. Editorial, premium, photoreal. --ar 16:9 --style raw --v 6.1
```

### 2.3 Biomarker constellation (light)
```
Elegant abstract field of small soft spheres of varying size arranged like a calm
star map on warm-bone background, a few highlighted in champagne-gold, ultra-thin
connecting lines, generous spacing, no labels or numbers. Refined, scientific, calm.
Photoreal 3D render. --ar 3:2 --style raw --v 6.1
```

### 2.4 Authentic patient portrait (40s–60s)
```
Natural editorial half-body portrait of a real-looking adult in their late 50s, soft
genuine expression, simple neutral clothing, photographed in soft window light against
a warm-greige background, shallow depth of field, fine grain. Honest, warm, premium,
not corporate stock. Photoreal, 85mm. --ar 4:5 --style raw --v 6.1
```

### 2.5 Lab-craft macro (vials, abstracted)
```
Refined macro still-life of slender clear vials standing on a matte bone surface,
soft champagne-gold caps, warm directional light, shallow focus, generous negative
space, clinical yet luxurious. No text, no labels. Photoreal. --ar 3:2 --style raw --v 6.1
```

### 2.6 Clinician review moment
```
Over-the-shoulder editorial photograph of a calm doctor reviewing results on a tablet
in a warm minimal clinic, soft natural light, muted oat and charcoal palette, shallow
depth of field, screen content abstract and unreadable. Trustworthy, premium, photoreal.
--ar 3:2 --style raw --v 6.1
```

### 2.7 Dark section divider — soft fog
```
Moody near-monochrome charcoal landscape at dawn, soft fog, faint warm-gold horizon
glow, extremely low contrast, serene, designed as a dark background for white overlay
text with a calm uncluttered centre. Photoreal, atmospheric, fine grain. --ar 16:9 --style raw --v 6.1
```

### 2.8 Result-card hero object (physical metaphor)
```
A single smooth matte card-like object floating on warm-cream backdrop, softly lit,
champagne edge, large soft shadow, shallow focus, lots of empty space. Minimal Apple-
style product still, no text on the object. Photoreal 3D. --ar 3:2 --style raw --v 6.1
```

---

## 3. SUPERPOWER / OURA — supporting references

**Superpower:** brighter, cleaner, modern; lifestyle imagery + crisp product-of-the-
app feel. **Oura:** authentic real people 40–70, "wellness jewelry" object photography,
warm and human. Use these for the people + product-object shots.

### 3.1 Oura-style product-object macro (for CGM device)
```
Macro product photograph of a small matte-white medical wearable with a brushed
champagne-gold rim, resting on warm sand-toned fabric, soft directional light, long
gentle shadow, shallow depth of field, fine grain. Treated like premium jewelry, calm
and desirable, no text or logos. Photoreal, 100mm macro. --ar 3:2 --style raw --v 6.1
```

### 3.2 Superpower-style bright lifestyle
```
Bright airy editorial photograph of a healthy adult preparing a simple meal in a sunlit
warm-toned kitchen, relaxed candid moment, soft natural light, muted earthy palette,
shallow depth of field. Aspirational but real. Photoreal, 35mm. --ar 3:2 --style raw --v 6.1
```

### 3.3 Oura-style diverse real people set (avatars)
```
Natural candid headshot of a real-looking everyday adult [vary age 30s–70s and
gender], soft genuine half-smile, soft natural light, warm-neutral blurred background,
shallow depth of field, fine grain. Authentic, approachable, not stock. Photoreal,
square crop. --ar 1:1 --style raw --v 6.1
```

---

## 4. Mapping prompts → CLOVE's real file slots

| File slot (`public/landing/…`) | Used in | Best prompt |
|---|---|---|
| `hero-mtn.jpg` + `hero-bg.mp4` poster | Hero | **2.2** (light) or **1.1** (organic) |
| `cgm-device.jpg` | CGM tab | your attached render, or **3.1** |
| `cgm.jpg`, `cgm-therapy.jpg` | Capabilities/Program | **3.1** |
| `dexa.jpg` (used 3×) | Capabilities/Journey/Included | **2.3** (constellation) or **1.2** |
| `meal-planning.jpg` | Bloods tab/nutrition | **3.2** |
| `calm-woman.jpg` | trust/clinician | **1.4** or **2.6** |
| `mtn-fog.jpg` | dark VideoBand | **2.7** |
| `lake-calm / hiker / mtn-light / run-outdoor / salad-bowl` | texture/supporting | **1.7**, **1.3**, **3.2** (or cut — fewer, better) |
| `patients/*.jpg` (new) | testimonials | **3.3** (layout only; use real consented photos at launch) |
| `og-image.jpg` (new, 1200×630) | social share | **2.8** or **3.1** |

**Pro tips for consistency:** generate the device/object shots first, then reuse one as
a style/`--cref` reference for the rest. Generate 4 variations per slot, keep the
calmest. Keep filenames identical → zero code changes. New slots (`patients/`,
`og-image`) need small wiring — say the word.
