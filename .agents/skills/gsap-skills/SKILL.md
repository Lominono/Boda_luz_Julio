---
name: gsap-skills
description: >-
  Official GSAP animation engine best practices for React, useGSAP hook, timeline sequencing,
  smooth 60fps tweens, and cinematic choreographies.
---

# GSAP Skills & Cinematic Orchestration

## Core Principles
1. **useGSAP Hook**: Use `@gsap/react` `useGSAP()` hook for automatic lifecycle management and cleanups.
2. **Timelines (`gsap.timeline`)**: Use position parameters (`<`, `+=0.2`, `0`) for frame-perfect cinematic sequences rather than disconnected setTimeout or delay chains.
3. **GPU-Accelerated Transforms**: Animate `x`, `y`, `scale`, `rotation`, `opacity`, `filter` with `power2.out`, `power3.out` or `expo.out` eases.
4. **Cinematic Text Reveals**: Staggered character and word animations with optical blur and scaling.
