---
name: mobile-ux-performance
description: >-
  Best practices for mobile-first touch UX, gesture handling, sound feedback and fluid 60fps performance.
---

# Mobile-First UX & Touch Interaction Design

## 1. Ergonomics & Touch Targets
- Minimum touch target: 48x48px for all interactive elements (buttons, inputs, checkboxes).
- Floating action bar or bottom sheet navigation for quick access to RSVP and Location.
- Native mobile integrations: `maps://` / `https://maps.google.com` navigation, direct WhatsApp sharing link, `.ics` calendar file download.

## 2. Audio & Haptics (Web Audio API)
- Ultra-light procedural audio synthesized in real time (zero heavy MP3 downloads):
  - Gentle wax seal crackle / chime on invitation opening.
  - Golden celebration harp / chord on RSVP submission.
  - Soft paper flip sounds.

## 3. Responsive Breakpoints & Performance
- Smooth scrolling without jank on mobile Safari and Chrome Android.
- Respect `prefers-reduced-motion` media queries.
