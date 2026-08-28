---
name: reactbits-components
description: >-
  Catalogue and implementation recipes for React Bits animated text, components and background effects.
  Includes FoldText, BlurText, ShinyText, SpotlightCard, Magnet, and Particle fields.
---

# ReactBits UI & Animation Library Recipes

## 1. FoldText (3D Unfolding Text Animation)
- Uses Framer Motion / CSS 3D transforms (`perspective`, `rotateX`, `transformOrigin: top/bottom`).
- Staggers letter or word flaps to give the tactile feel of origami and paper invitations.

## 2. ShinyText (Gold Foil Shimmer)
- Background gradient clipping with animated `background-position` for gleaming metallic text.

## 3. BlurText & SplitText
- Character-level or word-level animation with blur-to-focus and subtle scale elasticity.

## 4. Spotlight & Magnet Cards
- Responsive cursor or touch tracking with dynamic radial gradient illumination.
- Spring-based magnetic attraction on interactive CTA buttons (RSVP, Confirmar, Enviar).

## 5. Performance Guidelines
- Favor GPU-accelerated CSS properties: `transform`, `opacity`, `filter`.
- Use `will-change: transform` sparingly on active animations and clean up on completion.
