# Guía Maestra de Diseño Cinemático Anti-IA & Mobile-First (Boda Luz & Julio)

Esta guía recopila los principios fundamentales para diseñar una experiencia digital de invitación de boda que se sienta auténtica, humana, cinematográfica y artesanal, evitando por completo los patrones genéricos de plantillas automatizadas o generadas por IA.

---

## 1. Diagnóstico: ¿Por qué los diseños de IA se ven falsos y genéricos?

1. **Card Overload**: Diseños compuestos exclusivamente por cajitas flotantes idénticas con bordes redondeados y sombras predeterminadas.
2. **Textos y Secciones de Relleno (Fluff Content)**: Cronogramas ficticios de 8 pasos, historias de amor genéricas de plantilla, paletas de colores artificiales y cuentas bancarias ficticias.
3. **Colores Plásticos y Sintéticos**: Gradientes fluorescentes de morado a cian o degradados sin contraste cromático natural.
4. **Falta de Tensión y Ritmo Visual**: Todos los elementos tienen el mismo peso jerárquico.
5. **Pistas o Códigos Regalados**: Formularios de acceso que "revelan" su propia clave en la pantalla, destruyendo el sentido de privacidad y misterio.

---

## 2. Los Pilares del Diseño Cinemático Humano (Anti-IA)

### A. Dirección de Arte Editorial & Composición Cinemática
- **Paleta Orgánica de Alta Noche & Oro Champagne**:
  - Base: *Obsidian Velvet* (`#0A0908`), *Deep Bronze* (`#161310`), *Warm Sand* (`#FAF7F2`).
  - Acentos de Luz: *Liquid Gold Foil* (`#E5C378`, `#C5A059`), *Amber Glow* (`#D4AF37`).
- **Jerarquía Tipográfica con Contraste Clásico**:
  - Títulos Principales: Serif clásica de alto contraste (*Playfair Display*, *Cormorant Garamond*).
  - Acentos Emocionales: Caligrafía cursiva pura (*Pinyon Script*, *Great Vibes*) únicamente para el ampersand `&` y frases selectas.
  - Textos de Lectura e Inputs: Sans-serif humanista geométrica limpia (*Montserrat*, *Inter*) con tracking amplio para máxima legibilidad móvil.

### B. Animaciones ReactBits con Propósito
- **Entrada Cinemática Orquestada**:
  - Secuencia de apertura inmersiva con refracción de luz cáustica y monograma grabado que transiciona suavemente hacia la pantalla de acceso.
- **[ReactBits Prism](https://reactbits.dev/backgrounds/prism)**:
  - Fondo vivo que reacciona a la física del tacto en smartphone y al puntero en escritorio, generando rayos cáusticos cálidos como cristal facetado.
- **[ReactBits Pixel Swap](https://reactbits.dev/animations/pixel-swap)**:
  - Revelación de la fotografía real de **Luz & Julio** mediante micro-bloques de píxeles que se permutan y sincronizan con destellos dorados.
- **[ReactBits Gradual Blur](https://reactbits.dev/animations/gradual-blur)**:
  - Capas ópticas anamórficas en los bordes del visor que emulan la profundidad de campo de una cámara de cine de 35mm.
- **[ReactBits FoldText](https://reactbits.dev/text-animations/fold-text)**:
  - Pliegue 3D físico de letras como papel de carta satinado.

### C. Ergonomía Mobile-First Real
- **Touch Targets de 48px a 56px**: Ningún botón o selector es diminuto ni difícil de presionar en pantallas táctiles de cualquier tamaño.
- **Formulario RSVP Fluido e Intuitivo**:
  - Sin pasos innecesarios ni recargas de página.
  - Calculador dinámico de acompañantes con campos automáticos para sus nombres individuales.
  - Dedicatoria o mensaje bonito opcional integrado limpiamente.
  - Envío directo a base de datos y botón de confirmación con 1-tap a WhatsApp.
- **Feedback Háptico & Sonoro (Web Audio API)**:
  - Micro-sonidos procedurales de campanilla, quebrado de sello y acordes de celebración sintetizados en tiempo real (0 descargas de archivos pesados).

### D. Seguridad y Privacidad Real
- Entrada protegida por código de invitación personal o enlace directo (`?code=...`).
- **Cero pistas o spoilers en la interfaz**.
- Código Maestro de Administración: **`f32ZSJNr`** para acceder al panel privado de Luz y Julio (métricas reales, creador de claves, muro de mensajes y exportación CSV).

### E. Infraestructura Firebase & Despliegue en Vercel
- Integración con **Firebase Firestore** con fallback de almacenamiento local instantáneo para garantizar funcionamiento tanto online como offline.
