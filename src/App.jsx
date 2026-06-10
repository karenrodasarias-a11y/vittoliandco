import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── ICONS ─────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, className = "", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const Icons = {
  cart:     "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  heart:    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  search:   "m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  menu:     "M3 12h18M3 6h18M3 18h18",
  x:        "M18 6 6 18M6 6l12 12",
  plus:     "M12 5v14M5 12h14",
  minus:    "M5 12h14",
  trash:    "M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  check:    "M20 6 9 17l-5-5",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  package:  "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  tag:      "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  bar:      "M18 20V10M12 20V4M6 20v-6",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  wa:       "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  upload:   "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  img:      "M21 15l-5-5L5 21M3 3h18v18H3z",
  ticket:   "M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z",
  arrow:    "M5 12h14M12 5l7 7-7 7",
  home:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z",
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  sun:      "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
  moon:     "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  copy:     "M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  chevron:  "M9 18l6-6-6-6",
  filter:   "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  mail:     "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  phone:    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  save:     "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  lock:     "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM17 11V7a5 5 0 0 0-10 0v4",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  alert:    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  refresh:  "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
};

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  white: "#FFFFFF", cream: "#FAFAF8", snow: "#FAFAF8",
  linen: "#F5F2EE", linen2: "#EDE8E2", linen3: "#D8D0C8",
  beige: "#F3EFE9", beigeDark: "#E5DDD4",
  sage: "#899180", sageDark: "#6B7264", sageLight: "#C4C9BE", sagePale: "#EDF0EC",
  rose: "#D4B8B5", rosePale: "#F5EEEC", roseLight: "#F5EEEC", roseDeep: "#9E7470",
  sky: "#B8C8C0", skyLight: "#EDF3F0", sand: "#B8A898", sandLight: "#E8E0D8",
  brown: "#7A6A5C", brownMid: "#5C5048", brownDark: "#2E2820", taupe: "#B5A99A",
  charcoal: "#3D3830", muted: "#7A7068", faint: "#A89888",
  success: "#6A9E78", warning: "#C8A860", danger: "#C07070",
};
const FONT = { serif: '"Cormorant Garamond","Georgia",serif', sans: '"DM Sans",system-ui,sans-serif' };

// ─── INITIAL DATA ──────────────────────────────────────────────────────────
const INIT_CONFIG = {
  /* ── IDENTIDAD ─────────────────────────────────────── */
  storeName: "Venetus Kids",
  tagline: "Pequeños momentos, grandes recuerdos 💛",
  logoImage: "",           // URL base64 del logo
  faviconImage: "",

  /* ── BARRA PROMO ────────────────────────────────────── */
  promoActive: true,
  promoBanner: "🎀 ENVÍO GRATIS en compras mayores a S/. 150 · Código VENETUS20 — 20% OFF",
  promoBannerColor: "#3D3830",
  promoBannerTextColor: "#FAFAF8",

  /* ── NAVBAR ─────────────────────────────────────────── */
  navBgColor: "rgba(250,250,248,0.96)",
  navTextColor: "#3D3830",
  navActiveColor: "#899180",

  /* ── HERO ───────────────────────────────────────────── */
  heroBadgeText: "Nueva Colección · Primavera 2025",
  heroTitle: "Para los primeros momentos\nde tu bebé",
  heroSubtitle: "Ropa y accesorios cómodos, seguros y adorables para acompañar cada etapa de tu bebé.",
  heroBtn1: "Ver colección",
  heroBtn1Color: "#899180",
  heroBtn1TextColor: "#FFFFFF",
  heroBtn2: "Nuestra historia",
  heroBtn2Color: "transparent",
  heroBtn2BorderColor: "#D8D0C8",
  heroBtn2TextColor: "#3D3830",
  heroImage: "",
  heroStat1Number: "5K+", heroStat1Label: "Familias felices",
  heroStat2Number: "200+", heroStat2Label: "Productos",
  heroStat3Number: "4.9", heroStat3Label: "Valoración",
  heroFloatingText: "+500 reseñas verificadas",
  heroFloatingSubtext: "Calificación 4.9 / 5",
  heroBgGradient: "linear-gradient(160deg, #F5EEEC, #F5F2EE, #EDF0EC)",

  /* ── SECCIÓN CATEGORÍAS ─────────────────────────────── */
  catSectionLabel: "Explorar",
  catSectionTitle: "Todo lo que tu bebé necesita",
  catSectionLinkText: "Ver todo →",

  /* ── SECCIÓN PRODUCTOS ──────────────────────────────── */
  prodSectionLabel: "Colección",
  prodSectionTitle: "Más queridos",

  /* ── SECCIÓN ABOUT ──────────────────────────────────── */
  aboutLabel: "Nuestra historia",
  aboutTitle: "Porque cada detalle importa cuando se trata de tu bebé.",
  aboutText: "Somos mamás que entienden la alegría de cada pequeño momento. Por eso creamos Venetus Kids: productos seguros, suaves y adorables para acompañar a tu bebé desde el primer día.",
  aboutSignature: "Con amor, el equipo Venetus Kids",
  aboutImage: "",
  aboutBgColor: "#F5F2EE",

  /* ── SECCIÓN TESTIMONIOS ────────────────────────────── */
  testimonialsLabel: "Testimonios",
  testimonialsTitle: "Lo que dicen nuestras clientas",
  testimonials: [
    { name: "María F.", role: "Mamá de Valentina, 4 meses", text: "La calidad es increíble. Todo llegó perfectamente presentado y mi bebé ama cada prenda.", avatar: "M", bg: "#F5EEEC" },
    { name: "Luciana P.", role: "Mamá primeriza de Mateo", text: "El kit de baby shower superó todas mis expectativas. Una presentación preciosa y materiales de primera.", avatar: "L", bg: "#EDF0EC" },
    { name: "Camila R.", role: "Mamá de Isabella, 8 meses", text: "La manta muslina es lo mejor que he comprado. Ultra suave y la llevamos a todos lados.", avatar: "C", bg: "#F0EBE6" },
  ],

  /* ── SECCIÓN BENEFICIOS ─────────────────────────────── */
  benefitsBgColor: "#3D3830",
  benefits: [
    { icon: "🌿", title: "Materiales seguros", desc: "Certificados y testeados dermatológicamente" },
    { icon: "🚀", title: "Envíos rápidos", desc: "24-48 horas a todo el Perú" },
    { icon: "💬", title: "Atención cercana", desc: "WhatsApp 7 días a la semana" },
    { icon: "↩️", title: "Cambios fáciles", desc: "Sin costo adicional en 15 días" },
  ],

  /* ── NEWSLETTER ─────────────────────────────────────── */
  newsletterBgColor: "#899180",
  newsletterTitle: "Únete a nuestra comunidad",
  newsletterText: "Novedades, descuentos exclusivos y consejos de crianza directo a tu correo.",
  newsletterBtnText: "Suscribirse",
  newsletterBtnColor: "#FFFFFF",
  newsletterBtnTextColor: "#899180",
  newsletterInputPlaceholder: "tu@correo.com",

  /* ── FOOTER ─────────────────────────────────────────── */
  footerBgColor: "#3D3830",
  footerTagline: "Productos seguros, suaves y adorables para acompañar a tu bebé en cada etapa.",
  footerCol1Title: "Tienda",
  footerCol1Links: "Recién nacidos|Conjuntos|Accesorios|Zapatos|Mantas",
  footerCol2Title: "Ayuda",
  footerCol2Links: "Cómo comprar|Envíos|Cambios|Guía de tallas|FAQ",
  footerCopyright: "© 2025 Venetus Kids · Lima, Perú",
  footerPaymentMethods: "Yape|Visa|Mastercard|BCP",

  /* ── COLORES GLOBALES ────────────────────────────────── */
  primaryColor: "#899180",
  accentColor: "#B5A99A",
  buttonColor: "#899180",
  buttonTextColor: "#FFFFFF",
  headingColor: "#3D3830",
  textColor: "#7A7068",
  bgColor: "#FAFAF8",
  cardBgColor: "#FFFFFF",
  borderColor: "#EDE8E2",

  /* ── TIPOGRAFÍA ─────────────────────────────────────── */
  fontHeading: "Cormorant Garamond",
  fontBody: "DM Sans",

  /* ── CONTACTO ───────────────────────────────────────── */
  whatsapp: "51999999999",
  email: "hola@venetuskids.pe",
  address: "Lima, Perú",
  instagram: "https://instagram.com/venetuskids.pe",
  tiktok: "https://tiktok.com/@venetuskids",
  facebook: "https://facebook.com/venetuskids",
  freeShipping: 150,
  currency: "S/.",

  /* ── PAGOS ──────────────────────────────────────────── */
  stripeKey: "", mpKey: "", paypalId: "",
  stripeEnabled: false, mpEnabled: false, paypalEnabled: false,
};

const INIT_CATEGORIES = [
  { id: "cat1", name: "Recién nacidos", slug: "recien-nacidos", emoji: "👼", image: "", color: "#FAE8E8" },
  { id: "cat2", name: "Conjuntos & Outfits", slug: "conjuntos", emoji: "👕", image: "", color: "#D4E8F0" },
  { id: "cat3", name: "Accesorios", slug: "accesorios", emoji: "🎀", image: "", color: "#F0E8D4" },
  { id: "cat4", name: "Zapatos para bebé", slug: "zapatos", emoji: "👟", image: "", color: "#EDE8F5" },
  { id: "cat5", name: "Mantas & Esenciales", slug: "mantas", emoji: "🧸", image: "", color: "#E8F5E8" },
  { id: "cat6", name: "Regalos Baby Shower", slug: "baby-shower", emoji: "🎁", image: "", color: "#F5F0D4" },
];

const INIT_PRODUCTS = [
  { id: "p1", name: "Set Bodysuit Algodón", slug: "set-bodysuit",
    desc: "Pack de 3 bodys ultra suaves de algodón orgánico 100% hipoalergénico.",
    details: "• Material: 100% algodón orgánico certificado\n• Tallas: 0-3m, 3-6m, 6-9m, 9-12m\n• Colores: blanco, rosado, celeste\n• Cierre: botones a presión\n• Lavable a máquina 30°C",
    price: 89.90, oldPrice: null, stock: 50, categoryId: "cat1", badge: "nuevo",
    emoji: "👶", images: [], colors: ["#FFFFFF", "#F5EEEC", "#C8DEE8"], bg: "#FAE8E8",
    featured: true, active: true, rating: 5, reviews: 124, createdAt: Date.now() - 86400000 * 5 },
  { id: "p2", name: "Conjunto Floral Niña", slug: "conjunto-floral",
    desc: "Blusa + shorts florales para niñas de 3 a 24 meses. Tela fresca y cómoda para todo el día.",
    details: "• Composición: 95% algodón, 5% elastano\n• Tallas: 3-6m, 6-12m, 12-18m, 18-24m\n• Estampado: flores tropicales\n• Incluye: blusa + short con elástico",
    price: 125.00, oldPrice: 160.00, stock: 30, categoryId: "cat2", badge: "oferta",
    emoji: "👗", images: [], colors: ["#F2C4C4", "#FFFFFF"], bg: "#F2C4C4",
    featured: true, active: true, rating: 5, reviews: 87, createdAt: Date.now() - 86400000 * 4 },
  { id: "p3", name: "Gorro de Punto Suave", slug: "gorro-punto",
    desc: "Gorro tejido a mano de acrílico premium, suave y transpirable.",
    details: "• Material: acrílico premium antialérgico\n• Tallas: 0-6m, 6-12m\n• Colores: blanco, rosado, beige, azul, lila\n• Tejido a mano",
    price: 45.00, oldPrice: null, stock: 80, categoryId: "cat3", badge: "mas_vendido",
    emoji: "🧢", images: [], colors: ["#FFFFFF", "#F2C4C4", "#D4E8F0", "#E8D5B7", "#EDE8F5"], bg: "#D4E8F0",
    featured: true, active: true, rating: 4.8, reviews: 56, createdAt: Date.now() - 86400000 * 3 },
  { id: "p4", name: "Zapatos Gateo Cuero", slug: "zapatos-gateo",
    desc: "Primeros zapatos de cuero natural. Suela antideslizante y cierre fácil.",
    details: "• Material: cuero natural 100%\n• Suela: goma antideslizante ultrafina\n• Cierre: velcro ajustable\n• Tallas: 11, 12, 13 cm de pie",
    price: 79.90, oldPrice: null, stock: 40, categoryId: "cat4", badge: "mas_vendido",
    emoji: "👟", images: [], colors: ["#C9A97A", "#8B6E52"], bg: "#EDE8F5",
    featured: true, active: true, rating: 4.9, reviews: 203, createdAt: Date.now() - 86400000 * 2 },
  { id: "p5", name: "Manta Muslina Premium", slug: "manta-muslina",
    desc: "100% algodón orgánico GOTS. Doble capa ultra suave, transpirable y termorreguladora.",
    details: "• Material: muslina 100% algodón GOTS\n• Dimensiones: 120cm x 120cm\n• Doble capa, transpirable\n• Usos: arrullo, cobertor, lactancia",
    price: 69.90, oldPrice: 89.90, stock: 60, categoryId: "cat5", badge: "mas_vendido",
    emoji: "🧸", images: [], colors: ["#FFFFFF", "#F5EEEC", "#EDF0EC"], bg: "#E8F5E8",
    featured: true, active: true, rating: 5, reviews: 341, createdAt: Date.now() - 86400000 },
  { id: "p6", name: "Kit Baby Shower Lujo", slug: "kit-baby-shower",
    desc: "Set regalo premium en caja kraft con lazo. Body, gorro, manoplas, medias y manta.",
    details: "• Incluye: body + gorro + manoplas + medias + manta\n• Presentación: caja kraft con lazo\n• Talla: 0-3 meses\n• Personalizable con tarjeta",
    price: 199.00, oldPrice: 250.00, stock: 20, categoryId: "cat6", badge: "oferta",
    emoji: "🎁", images: [], colors: ["#F5EEEC", "#EDF0EC", "#FFFFFF"], bg: "#F5F0D4",
    featured: true, active: true, rating: 5, reviews: 68, createdAt: Date.now() - 3600000 * 5 },
  { id: "p7", name: "Pelele Estampado Oso", slug: "pelele-oso",
    desc: "Pelele de algodón suavísimo con estampado de osito. Con botones a presión.",
    details: "• Material: 100% algodón\n• Estampado: oso bordado\n• Botones a presión\n• Tallas: 0-3m, 3-6m, 6-9m",
    price: 55.00, oldPrice: null, stock: 3, categoryId: "cat1", badge: "nuevo",
    emoji: "🐻", images: [], colors: ["#FAE8E8", "#FFFFFF"], bg: "#FAE8E8",
    featured: false, active: true, rating: 4.7, reviews: 92, createdAt: Date.now() - 3600000 * 2 },
  { id: "p8", name: "Vincha Lazos Artesanal", slug: "vincha-lazos",
    desc: "Hecha a mano con lazo de tela. Sin caucho, no aprieta ni irrita el cuero cabelludo.",
    details: "• Material: tela algodón + goma suave\n• Sin caucho duro\n• Tamaño único ajustable\n• 12 colores disponibles",
    price: 28.00, oldPrice: null, stock: 100, categoryId: "cat3", badge: "mas_vendido",
    emoji: "🎀", images: [], colors: ["#F2C4C4", "#D4E8F0", "#FFFFFF", "#EDE8F5"], bg: "#F2C4C4",
    featured: false, active: true, rating: 4.9, reviews: 178, createdAt: Date.now() - 3600000 },
];

const INIT_COUPONS = [
  { id: "coupon1", code: "VENETUS20", type: "percent", value: 20, minAmount: 100, maxUses: 200, used: 14, active: true, expires: null },
  { id: "coupon2", code: "MAMA10", type: "fixed", value: 10, minAmount: 80, maxUses: 50, used: 3, active: true, expires: null },
];

const INIT_ORDERS = [
  { id: "ord1", orderNumber: "VK-001", customerName: "María García", customerEmail: "maria@example.com", customerPhone: "998765432", address: "Av. Arequipa 1234, Miraflores", items: [{ productId: "p1", name: "Set Bodysuit Algodón", price: 89.90, qty: 1, emoji: "👶" }, { productId: "p3", name: "Gorro de Punto Suave", price: 45.00, qty: 2, emoji: "🧢" }], subtotal: 179.90, discount: 0, shipping: 0, total: 179.90, status: "DELIVERED", paymentStatus: "PAID", paymentMethod: "Yape", coupon: null, createdAt: Date.now() - 86400000 * 7 },
  { id: "ord2", orderNumber: "VK-002", customerName: "Luciana Pérez", customerEmail: "lucy@example.com", customerPhone: "987654321", address: "Jr. Lima 567, San Isidro", items: [{ productId: "p6", name: "Kit Baby Shower Lujo", price: 199.00, qty: 1, emoji: "🎁" }], subtotal: 199.00, discount: 39.80, shipping: 0, total: 159.20, status: "SHIPPED", paymentStatus: "PAID", paymentMethod: "Stripe", coupon: "VENETUS20", createdAt: Date.now() - 86400000 * 2 },
  { id: "ord3", orderNumber: "VK-003", customerName: "Camila Rodriguez", customerEmail: "cami@example.com", customerPhone: "976543210", address: "Calle Las Flores 890, Surco", items: [{ productId: "p2", name: "Conjunto Floral Niña", price: 125.00, qty: 1, emoji: "👗" }, { productId: "p8", name: "Vincha Lazos Artesanal", price: 28.00, qty: 2, emoji: "🎀" }], subtotal: 181.00, discount: 0, shipping: 0, total: 181.00, status: "CONFIRMED", paymentStatus: "PAID", paymentMethod: "MercadoPago", coupon: null, createdAt: Date.now() - 86400000 },
  { id: "ord4", orderNumber: "VK-004", customerName: "Andrea Torres", customerEmail: "andrea@example.com", customerPhone: "965432109", address: "Av. Brasil 234, Breña", items: [{ productId: "p5", name: "Manta Muslina Premium", price: 69.90, qty: 1, emoji: "🧸" }], subtotal: 69.90, discount: 0, shipping: 15, total: 84.90, status: "PENDING", paymentStatus: "PENDING", paymentMethod: null, coupon: null, createdAt: Date.now() - 3600000 * 3 },
  { id: "ord5", orderNumber: "VK-005", customerName: "Sofia Vega", customerEmail: "sofia@example.com", customerPhone: "954321098", address: "Jr. Arequipa 789, Barranco", items: [{ productId: "p4", name: "Zapatos Gateo Cuero", price: 79.90, qty: 1, emoji: "👟" }, { productId: "p7", name: "Pelele Estampado Oso", price: 55.00, qty: 1, emoji: "🐻" }], subtotal: 134.90, discount: 0, shipping: 0, total: 134.90, status: "PREPARING", paymentStatus: "PAID", paymentMethod: "PayPal", coupon: null, createdAt: Date.now() - 3600000 },
];

// ─── STORAGE HELPERS ───────────────────────────────────────────────────────
const storage = {
  async get(key) {
    try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; }
  },
  async set(key, val) {
    try { await window.storage.set(key, JSON.stringify(val)); return true; } catch { return false; }
  },
};

// ─── TOAST ─────────────────────────────────────────────────────────────────
const ToastCtx = (() => { let fn = () => {}; return { show: (m, t) => fn(m, t), register: (f) => { fn = f; } }; })();
function useToast() { return (msg, type = "success") => ToastCtx.show(msg, type); }

function Toast() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => { ToastCtx.register((msg, type) => { const id = Date.now(); setToasts(t => [...t, { id, msg, type }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200); }); }, []);
  return (
    <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{ background: t.type === "error" ? C.danger : C.charcoal, color: C.cream, padding: "12px 24px", borderRadius: 100, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── MODAL ─────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width = 600 }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
          style={{ background: C.white, borderRadius: 24, width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}>
          <div style={{ padding: "28px 32px", borderBottom: `1px solid ${C.beige}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: FONT.serif, fontSize: 22, color: C.charcoal, margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{ background: C.beige, border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
              <Icon d={Icons.x} size={16} />
            </button>
          </div>
          <div style={{ padding: "28px 32px" }}>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── CONFIRM DIALOG ────────────────────────────────────────────────────────
function ConfirmDialog({ open, onClose, onConfirm, title, message, danger }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={420}>
      <p style={{ color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 100, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", fontWeight: 600, color: C.muted }}>Cancelar</button>
        <button onClick={() => { onConfirm(); onClose(); }} style={{ flex: 1, padding: "12px", borderRadius: 100, border: "none", background: danger ? C.danger : C.roseDeep, color: "white", cursor: "pointer", fontWeight: 600 }}>Confirmar</button>
      </div>
    </Modal>
  );
}

// ─── FIELD COMPONENTS ──────────────────────────────────────────────────────
function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{label}{required && " *"}</label>
      {children}
    </div>
  );
}
const inputStyle = { width: "100%", padding: "11px 16px", borderRadius: 14, border: `1.5px solid ${C.beigeDark}`, background: C.white, color: C.charcoal, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };
const selectStyle = { ...inputStyle, cursor: "pointer" };

// ─── STAT CARD ─────────────────────────────────────────────────────────────
// ─── IMAGE UPLOADER ─────────────────────────────────────────────────────────
function ImageUploader({ images = [], onChange, maxImages = 6, label = "Fotos del producto" }) {
  const ref = useRef();
  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(0, maxImages - images.length);
    files.forEach(file => {
      if (file.size > 2097152) { alert("Máx. 2MB por imagen"); return; }
      const reader = new FileReader();
      reader.onload = ev => onChange(prev => [...(prev || []), ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  const remove = (i) => onChange(images.filter((_, j) => j !== i));
  const move = (i, dir) => {
    const arr = [...images]; const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; onChange(arr);
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#7A7068", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{label}</label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 8 }}>
        {images.map((img, i) => (
          <div key={i} style={{ position: "relative", aspectRatio: "1/1", borderRadius: 8, overflow: "hidden", border: i === 0 ? "2px solid #899180" : "2px solid #E5DDD4", background: "#F5F2EE" }}>
            <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {i === 0 && <div style={{ position: "absolute", top: 4, left: 4, background: "#899180", color: "white", fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 10, letterSpacing: "0.5px" }}>PRINCIPAL</div>}
            <div style={{ position: "absolute", bottom: 3, right: 3, display: "flex", gap: 2 }}>
              {i > 0 && <button onClick={() => move(i, -1)} style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>}
              {i < images.length - 1 && <button onClick={() => move(i, 1)} style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>}
              <button onClick={() => remove(i)} style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(220,50,50,0.85)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={Icons.x} size={10} /></button>
            </div>
          </div>
        ))}
        {images.length < maxImages && (
          <button onClick={() => ref.current?.click()} style={{ aspectRatio: "1/1", borderRadius: 8, border: "2px dashed #D8D0C8", background: "#FAFAF8", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "#A89888" }}>
            <Icon d={Icons.upload} size={20} />
            <span style={{ fontSize: 10, fontWeight: 600 }}>Subir foto</span>
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: "none" }} />
      <p style={{ fontSize: 10, color: "#A89888", margin: 0 }}>Máx. {maxImages} fotos · 2MB c/u · La primera es la imagen principal · Usa ← → para reordenar</p>
    </div>
  );
}

// ─── SINGLE IMAGE UPLOADER ───────────────────────────────────────────────────
function SingleImageUploader({ image, onChange, label = "Imagen", placeholder = "Haz clic para subir" }) {
  const ref = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 3145728) { alert("Máx. 3MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file); e.target.value = "";
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#7A7068", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{label}</label>
      <div onClick={() => ref.current?.click()} style={{ borderRadius: 8, overflow: "hidden", border: "2px dashed #D8D0C8", background: "#FAFAF8", minHeight: 100, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
        {image
          ? <><img src={image} alt="" style={{ width: "100%", height: 150, objectFit: "cover" }} /><button onClick={e => { e.stopPropagation(); onChange(""); }} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(220,50,50,0.85)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={Icons.x} size={12} /></button></>
          : <div style={{ textAlign: "center", padding: 20, color: "#A89888" }}><Icon d={Icons.upload} size={24} /><p style={{ margin: "6px 0 2px", fontSize: 12, fontWeight: 500 }}>{placeholder}</p><p style={{ margin: 0, fontSize: 10 }}>JPG, PNG · Máx. 3MB</p></div>
        }
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}

// ─── COLOR SWATCH INPUT ──────────────────────────────────────────────────────
function ColorSwatchInput({ colors = [], onChange, label = "Colores disponibles" }) {
  const [input, setInput] = useState("");
  const addColor = () => {
    const hex = input.trim();
    if (!hex.match(/^#[0-9A-Fa-f]{6}$/)) { alert("Ingresa un código HEX válido (ej: #FF5733)"); return; }
    if (!colors.includes(hex)) onChange([...colors, hex]);
    setInput("");
  };
  const remove = (i) => onChange(colors.filter((_, j) => j !== i));
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#7A7068", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{label}</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        {colors.map((c, i) => (
          <div key={i} title={c} onClick={() => remove(i)} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: "2px solid #E5DDD4", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ opacity: 0, transition: "opacity 0.15s", fontSize: 12, color: "white" }}>✕</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="color" value={input || "#899180"} onChange={e => setInput(e.target.value)} style={{ width: 40, height: 36, borderRadius: 6, border: "1.5px solid #D8D0C8", cursor: "pointer", padding: 2 }} />
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="#899180" maxLength={7} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #D8D0C8", background: "#FAFAF8", fontSize: 13, fontFamily: "monospace", letterSpacing: "1px", outline: "none" }} onKeyDown={e => e.key === "Enter" && addColor()} />
        <button onClick={addColor} style={{ padding: "8px 14px", borderRadius: 8, background: "#899180", color: "white", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>Agregar</button>
      </div>
      <p style={{ fontSize: 10, color: "#A89888", margin: "6px 0 0" }}>Haz clic en un color para eliminarlo · Presiona Enter o Agregar</p>
    </div>
  );
}

// ─── COLOR INPUT (simple hex + picker) ─────────────────────────────────────
function ColorInput({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#7A7068", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{label}</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="color" value={value || "#899180"} onChange={e => onChange(e.target.value)} style={{ width: 42, height: 38, borderRadius: 8, border: "1.5px solid #D8D0C8", cursor: "pointer", padding: 2 }} />
        <input value={value || ""} onChange={e => onChange(e.target.value)} placeholder="#899180" maxLength={7} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #D8D0C8", background: "#FAFAF8", fontSize: 13, fontFamily: "monospace", letterSpacing: "1px", outline: "none" }} />
        <div style={{ width: 38, height: 38, borderRadius: 8, background: value || "#899180", border: "1.5px solid #D8D0C8", flexShrink: 0 }} />
      </div>
    </div>
  );
}


function StatCard({ icon, label, value, sub, color = C.roseDeep, trend }) {
  return (
    <motion.div whileHover={{ y: -4 }}
      style={{ background: C.white, borderRadius: 20, padding: "24px", boxShadow: "0 4px 24px rgba(139,110,82,0.08)", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", color }}>
          <Icon d={icon} size={20} />
        </div>
        {trend !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 700, color: trend >= 0 ? C.success : C.danger, background: (trend >= 0 ? C.success : C.danger) + "15", padding: "4px 10px", borderRadius: 100 }}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.charcoal, fontFamily: FONT.serif, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: C.roseDeep, marginTop: 2 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

// ─── BADGE COMPONENT ───────────────────────────────────────────────────────
const badgeColors = {
  nuevo: { bg: "#E8F3F8", text: "#2A6A8A" },
  oferta: { bg: "#FFF0E8", text: "#C45000" },
  mas_vendido: { bg: C.roseLight, text: C.roseDeep },
  favorito: { bg: C.sandLight, text: C.brown },
};
const badgeLabels = { nuevo: "Nuevo", oferta: "Oferta", mas_vendido: "Más vendido", favorito: "Favorito" };
function Badge({ badge }) {
  if (!badge || !badgeColors[badge]) return null;
  const { bg, text } = badgeColors[badge];
  return <span style={{ background: bg, color: text, padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{badgeLabels[badge]}</span>;
}

// ─── STATUS BADGE ───────────────────────────────────────────────────────────
const statusConfig = {
  PENDING:   { label: "Pendiente",  bg: "#FFF3CD", color: "#856404" },
  CONFIRMED: { label: "Confirmado", bg: "#D1ECF1", color: "#0C5460" },
  PREPARING: { label: "Preparando", bg: "#E8D5F5", color: "#5A2D82" },
  SHIPPED:   { label: "Enviado",    bg: "#D4EDDA", color: "#155724" },
  DELIVERED: { label: "Entregado",  bg: "#D4EDDA", color: "#0D3E17" },
  CANCELLED: { label: "Cancelado",  bg: "#F8D7DA", color: "#721C24" },
  PAID:      { label: "Pagado",     bg: "#D4EDDA", color: "#155724" },
  FAILED:    { label: "Fallido",    bg: "#F8D7DA", color: "#721C24" },
};
function StatusBadge({ status }) {
  const s = statusConfig[status] || { label: status, bg: C.beige, color: C.muted };
  return <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{s.label}</span>;
}

// ─── STARS ─────────────────────────────────────────────────────────────────
function Stars({ rating, size = 13 }) {
  return (
    <span style={{ color: "#F5A623", fontSize: size, display: "flex", gap: 1 }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ opacity: i <= Math.round(rating) ? 1 : 0.25 }}>★</span>)}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STORE COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

// ─── PRODUCT CARD (store) ──────────────────────────────────────────────────
function ProductCard({ product, categories, onAddCart, onWishlist, wishlist = [], onDetail, config }) {
  const [hovered, setHovered] = useState(false);
  const cat = categories.find(c => c.id === product.categoryId);
  const inWish = wishlist.includes(product.id);
  const thumb = product.images && product.images[0];
  const pc = config?.primaryColor || "#899180";

  return (
    <motion.div whileHover={{ y: -6 }} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(61,56,50,0.07)", cursor: "pointer" }}
      onClick={() => onDetail(product)}>
      <div style={{ position: "relative", aspectRatio: "1/1.1", background: product.bg || "#F5EEEC", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {thumb
          ? <motion.img src={thumb} alt={product.name} animate={{ scale: hovered ? 1.06 : 1 }} transition={{ duration: 0.4 }} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          : <motion.span animate={{ scale: hovered ? 1.1 : 1 }} transition={{ duration: 0.4 }} style={{ fontSize: 66, userSelect: "none" }}>{product.emoji || "🎁"}</motion.span>
        }
        {product.badge && <div style={{ position: "absolute", top: 10, left: 10 }}><Badge badge={product.badge} /></div>}
        <motion.button animate={{ opacity: hovered || inWish ? 1 : 0 }}
          onClick={e => { e.stopPropagation(); onWishlist(product.id); }}
          style={{ position: "absolute", top: 10, right: 10, width: 33, height: 33, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: inWish ? "#9E7470" : "#7A7068" }}>
          <Icon d={Icons.heart} size={14} />
        </motion.button>
        {product.images && product.images.length > 1 && (
          <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(61,56,50,0.55)", color: "white", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>📸 {product.images.length}</div>
        )}
        {product.colors && product.colors.length > 0 && (
          <motion.div animate={{ opacity: hovered ? 1 : 0 }} style={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: 4 }}>
            {product.colors.slice(0, 5).map((c, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: "1.5px solid rgba(255,255,255,0.8)" }} />)}
          </motion.div>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", background: "#C8A860", color: "white", padding: "2px 9px", borderRadius: 20, fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" }}>⚡ ¡Últimas {product.stock}!</div>
        )}
        {product.stock === 0 && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ background: "#3D3830", color: "white", padding: "7px 16px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Agotado</span>
          </div>
        )}
        <motion.div animate={{ opacity: hovered && product.stock > 0 ? 1 : 0, y: hovered && product.stock > 0 ? 0 : 8 }}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 10px", background: "rgba(255,255,255,0.95)" }}
          onClick={e => { e.stopPropagation(); onAddCart(product); }}>
          <button style={{ width: "100%", padding: "9px", background: pc, color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Añadir al carrito</button>
        </motion.div>
      </div>
      <div style={{ padding: "13px 14px 14px" }}>
        {cat && <p style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 4px", fontWeight: 600 }}>{cat.name}</p>}
        <p style={{ fontFamily: `"${config?.fontHeading || "Cormorant Garamond"}", serif`, fontSize: 16, fontWeight: 400, color: config?.headingColor || "#3D3830", marginBottom: 6, lineHeight: 1.3 }}>{product.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
          <Stars rating={product.rating} size={12} />
          <span style={{ fontSize: 10, color: "#A89888" }}>({product.reviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, color: config?.headingColor || "#3D3830" }}>{config?.currency || "S/."} {product.price.toFixed(2)}</span>
            {product.oldPrice && <span style={{ fontSize: 11, color: "#A89888", textDecoration: "line-through", marginLeft: 6 }}>S/. {product.oldPrice.toFixed(2)}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CartSidebar({ open, onClose, cart, setCart, config, onCheckout }) {
  const toast = useToast();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= config.freeShipping ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <>
      <AnimatePresence>
        {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 800 }} />}
      </AnimatePresence>
      <motion.div initial={{ x: "100%" }} animate={{ x: open ? 0 : "100%" }} transition={{ type: "spring", damping: 28, stiffness: 280 }}
        style={{ position: "fixed", top: 0, right: 0, width: 420, height: "100vh", background: C.white, zIndex: 801, display: "flex", flexDirection: "column", padding: 32, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: FONT.serif, fontSize: 24, color: C.charcoal, margin: 0 }}>Mi carrito 🛒</h2>
          <button onClick={onClose} style={{ background: C.beige, border: "none", borderRadius: "50%", width: 38, height: 38, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
            <Icon d={Icons.x} size={16} />
          </button>
        </div>
        {cart.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <span style={{ fontSize: 64 }}>🛍️</span>
            <p style={{ fontFamily: FONT.serif, fontSize: 20, color: C.charcoal, margin: 0 }}>Tu carrito está vacío</p>
            <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>¡Agrega productos para comenzar!</p>
            <button onClick={onClose} style={{ marginTop: 8, padding: "12px 28px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Ver productos</button>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: `1px solid ${C.beige}` }}>
                  <div style={{ width: 64, height: 64, borderRadius: 14, background: item.bg || C.roseLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.charcoal, marginBottom: 3 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>S/. {item.price.toFixed(2)} c/u</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button onClick={() => setCart(c => c.map(x => x.id === item.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}
                          style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
                          <Icon d={Icons.minus} size={12} />
                        </button>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => setCart(c => c.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x))}
                          style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
                          <Icon d={Icons.plus} size={12} />
                        </button>
                      </div>
                      <button onClick={() => setCart(c => c.filter(x => x.id !== item.id))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: C.roseDeep, padding: 4 }}>
                        <Icon d={Icons.trash} size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.beige}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: C.muted, fontSize: 14 }}>Subtotal</span>
                <span style={{ color: C.charcoal, fontWeight: 600 }}>S/. {subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ color: C.muted, fontSize: 14 }}>Envío</span>
                <span style={{ color: shipping === 0 ? C.success : C.charcoal, fontWeight: 600 }}>{shipping === 0 ? "¡GRATIS! 🎉" : `S/. ${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && <div style={{ background: C.roseLight, padding: "10px 14px", borderRadius: 12, fontSize: 12, color: C.roseDeep, marginBottom: 16 }}>🚚 Agrega S/. {(config.freeShipping - subtotal).toFixed(2)} más para envío gratis</div>}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontWeight: 700, fontSize: 18 }}>
                <span style={{ color: C.charcoal }}>Total</span>
                <span style={{ color: C.brown }}>S/. {total.toFixed(2)}</span>
              </div>
              <button onClick={onCheckout} style={{ width: "100%", padding: "15px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 24px rgba(212,137,138,0.35)", marginBottom: 10 }}>
                Ir al pago ✨
              </button>
              <button onClick={onClose} style={{ width: "100%", padding: "13px", borderRadius: 100, background: "transparent", color: C.muted, border: `1.5px solid ${C.beigeDark}`, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}

// ─── CHECKOUT MODAL ────────────────────────────────────────────────────────
function CheckoutModal({ open, onClose, cart, config, products, coupons, onComplete }) {
  const toast = useToast();
  const [step, setStep] = useState(0); // 0: summary, 1: contact, 2: payment, 3: done
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", coupon: "" });
  const [couponResult, setCouponResult] = useState(null);
  const [payMethod, setPayMethod] = useState("yape");
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = couponResult?.discount || 0;
  const shipping = (subtotal - discount) >= config.freeShipping ? 0 : 15;
  const total = subtotal - discount + shipping;

  const validateCoupon = () => {
    const c = coupons.find(c => c.code === form.coupon.toUpperCase() && c.active);
    if (!c) { toast("Cupón no válido", "error"); return; }
    if (c.minAmount && subtotal < c.minAmount) { toast(`Mínimo S/. ${c.minAmount} para este cupón`, "error"); return; }
    const disc = c.type === "percent" ? subtotal * (c.value / 100) : c.value;
    setCouponResult({ code: c.code, discount: parseFloat(disc.toFixed(2)) });
    toast(`🎉 Cupón aplicado: -S/. ${disc.toFixed(2)}`);
  };

  const handlePay = () => {
    if (!form.name || !form.email || !form.address) { toast("Completa todos los campos", "error"); return; }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onComplete({ ...form, coupon: couponResult?.code, payMethod, subtotal, discount, shipping, total, items: cart });

      if (payMethod === "yape") {
        // Build WhatsApp message with order details
        const itemsList = cart.map(i => `  • ${i.name} x${i.qty} = S/. ${(i.price * i.qty).toFixed(2)}`).join("\n");
        const msg = [
          `🛍️ *Nuevo pedido - Venetus Kids*`,
          ``,
          `👤 *Cliente:* ${form.name}`,
          `📧 ${form.email}`,
          form.phone ? `📱 ${form.phone}` : null,
          `📍 ${form.address}`,
          ``,
          `*Productos:*`,
          itemsList,
          ``,
          discount > 0 ? `🎟️ Descuento (${couponResult?.code}): -S/. ${discount.toFixed(2)}` : null,
          `🚚 Envío: ${shipping === 0 ? "GRATIS" : "S/. " + shipping.toFixed(2)}`,
          `💰 *TOTAL A PAGAR: S/. ${total.toFixed(2)}*`,
          ``,
          `💜 Adjunto el comprobante de pago por *Yape*. ¡Gracias! 🎀`,
        ].filter(Boolean).join("\n");

        setTimeout(() => {
          window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
          setStep(3);
        }, 500);
      } else {
        setStep(3);
      }
    }, 2000);
  };

  const steps = ["Resumen", "Datos", "Pago"];

  if (!open) return null;
  if (step === 3) return (
    <Modal open title="¡Pedido confirmado! 🎉" onClose={() => { onClose(); setStep(0); }}>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🎀</div>
        <h3 style={{ fontFamily: FONT.serif, fontSize: 26, color: C.charcoal, marginBottom: 12 }}>¡Gracias por tu compra!</h3>
        <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>Hemos recibido tu pedido. En breve recibirás una confirmación a <strong>{form.email}</strong>.</p>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>Total pagado: <strong style={{ color: C.roseDeep }}>S/. {total.toFixed(2)}</strong></p>
        <button onClick={() => { onClose(); setStep(0); }} style={{ padding: "14px 36px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Volver a la tienda</button>
      </div>
    </Modal>
  );

  return (
    <Modal open onClose={onClose} title="Finalizar compra" width={640}>
      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: i <= step ? C.roseDeep : C.beige, color: i <= step ? "white" : C.muted }}>
                {i < step ? <Icon d={Icons.check} size={14} /> : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: i === step ? C.charcoal : C.muted }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1.5, background: i < step ? C.roseDeep : C.beigeDark, margin: "0 12px" }} />}
          </div>
        ))}
      </div>

      {/* Step 0: Summary */}
      {step === 0 && (
        <div>
          <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 20 }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: `1px solid ${C.beige}` }}>
                <div style={{ fontSize: 32, width: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.charcoal }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: C.muted }}>x{item.qty} · S/. {item.price.toFixed(2)} c/u</div>
                </div>
                <div style={{ fontWeight: 700, color: C.brown }}>S/. {(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.beige, borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input value={form.coupon} onChange={e => setForm(f => ({ ...f, coupon: e.target.value.toUpperCase() }))} placeholder="Código de cupón" style={{ ...inputStyle, flex: 1 }} />
              <button onClick={validateCoupon} style={{ padding: "11px 18px", borderRadius: 12, background: C.brown, color: "white", border: "none", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontSize: 13 }}>Aplicar</button>
            </div>
            {couponResult && <div style={{ fontSize: 13, color: C.success, fontWeight: 600 }}>✅ Cupón {couponResult.code}: -S/. {couponResult.discount.toFixed(2)}</div>}
          </div>
          <div style={{ borderTop: `1px solid ${C.beige}`, paddingTop: 16 }}>
            {[["Subtotal", `S/. ${subtotal.toFixed(2)}`], discount > 0 && ["Descuento", `-S/. ${discount.toFixed(2)}`], ["Envío", shipping === 0 ? "¡GRATIS!" : `S/. ${shipping.toFixed(2)}`]].filter(Boolean).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: C.muted }}><span>{k}</span><span style={{ color: k === "Descuento" ? C.success : C.charcoal }}>{v}</span></div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18, marginTop: 8 }}><span>Total</span><span style={{ color: C.brown }}>S/. {total.toFixed(2)}</span></div>
          </div>
          <button onClick={() => setStep(1)} style={{ width: "100%", marginTop: 20, padding: "14px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Continuar →</button>
        </div>
      )}

      {/* Step 1: Contact */}
      {step === 1 && (
        <div>
          <Field label="Nombre completo" required><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tu nombre" style={inputStyle} /></Field>
          <Field label="Correo electrónico" required><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="tu@correo.com" style={inputStyle} /></Field>
          <Field label="Teléfono / WhatsApp"><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+51 999 999 999" style={inputStyle} /></Field>
          <Field label="Dirección de entrega" required><textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Calle, distrito, ciudad..." style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} /></Field>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(0)} style={{ flex: 1, padding: "13px", borderRadius: 100, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", fontWeight: 600, color: C.muted }}>← Volver</button>
            <button onClick={() => { if (!form.name || !form.email || !form.address) { toast("Completa los campos requeridos", "error"); return; } setStep(2); }} style={{ flex: 2, padding: "13px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Continuar →</button>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Método de pago</div>
            {[
              { id: "yape", label: "💜 Yape / Plin", desc: "Pago inmediato al número: " + config.whatsapp, always: true },
              { id: "transfer", label: "🏦 Transferencia bancaria", desc: "BCP / Interbank / BBVA", always: true },
              config.stripeEnabled && { id: "stripe", label: "💳 Tarjeta crédito/débito", desc: "Visa, Mastercard, Amex (Stripe)" },
              config.mpEnabled && { id: "mercadopago", label: "🟡 MercadoPago", desc: "Paga con tu cuenta MercadoPago" },
              config.paypalEnabled && { id: "paypal", label: "💙 PayPal", desc: "Paga con tu cuenta PayPal" },
            ].filter(Boolean).map(m => (
              <div key={m.id} onClick={() => setPayMethod(m.id)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 16, border: `2px solid ${payMethod === m.id ? C.roseDeep : C.beigeDark}`, marginBottom: 10, cursor: "pointer", background: payMethod === m.id ? C.roseLight : "transparent", transition: "all 0.2s" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${payMethod === m.id ? C.roseDeep : C.beigeDark}`, flexShrink: 0, marginTop: 2, background: payMethod === m.id ? C.roseDeep : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {payMethod === m.id && <Icon d={Icons.check} size={11} className="" style={{ color: "white" }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.charcoal, marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
          {(payMethod === "stripe" && config.stripeEnabled) && (
            <div style={{ background: C.beige, borderRadius: 16, padding: 16, marginBottom: 20, fontSize: 13, color: C.muted }}>
              💳 En producción, aquí aparece el formulario seguro de Stripe con tu clave pública: <strong>{config.stripeKey || "no configurada"}</strong>
            </div>
          )}
          {payMethod === "yape" && (
            <div style={{ background: "linear-gradient(135deg, #F3E5F5, #EDE0F8)", borderRadius: 20, padding: 20, marginBottom: 20, textAlign: "center", border: "1.5px solid #CE93D8" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#7B1FA2", marginBottom: 6 }}>💜 Instrucciones de pago por Yape</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#7B1FA2", letterSpacing: "3px", marginBottom: 6 }}>{config.whatsapp}</div>
              <div style={{ fontSize: 12, color: "#9C27B0", lineHeight: 1.6 }}>
                1. Yapea el monto exacto al número de arriba<br />
                2. Al hacer clic en "Pagar", te redirigimos al WhatsApp<br />
                3. Envía la captura del comprobante por ese chat 📸
              </div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, color: "#7B1FA2", fontWeight: 600 }}>
                <span>💬</span> Validaremos tu pago y confirmaremos el pedido
              </div>
            </div>
          )}
          <div style={{ background: C.beige, borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 17 }}>
              <span style={{ color: C.charcoal }}>Total a pagar:</span>
              <span style={{ color: C.roseDeep }}>S/. {total.toFixed(2)}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", borderRadius: 100, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", fontWeight: 600, color: C.muted }}>← Volver</button>
            <button onClick={handlePay} disabled={processing} style={{ flex: 2, padding: "14px", borderRadius: 100, background: processing ? C.muted : payMethod === "yape" ? "linear-gradient(135deg, #9C27B0, #7B1FA2)" : `linear-gradient(135deg, ${C.roseDeep}, ${C.sand})`, color: "white", border: "none", fontWeight: 700, cursor: processing ? "not-allowed" : "pointer", fontSize: 15 }}>
              {processing ? "Procesando..." : payMethod === "yape" ? `💬 Ir a WhatsApp · S/. ${total.toFixed(2)}` : `🔒 Pagar S/. ${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── HERO SECTION ──────────────────────────────────────────────────────────
function HeroSection({ config, onShop }) {
  const pc = config.primaryColor || "#899180";
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "86vh", alignItems: "center", gap: 64 }}>
      <div>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "2.5px", margin: "0 0 18px", fontWeight: 600, fontFamily: FONT.sans }}>
          {config.heroBadgeText || "Nueva Colección"}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: FONT.serif, fontSize: "clamp(34px, 3.8vw, 54px)", fontWeight: 300, lineHeight: 1.15, color: C.charcoal, margin: "0 0 20px", letterSpacing: "0.3px" }}>
          {(config.heroTitle || "").split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 15, lineHeight: 1.8, color: C.muted, maxWidth: 420, margin: "0 0 34px", fontFamily: FONT.sans }}>
          {config.heroSubtitle}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <button onClick={onShop} style={{ padding: "13px 28px", borderRadius: 2, background: pc, color: "white", border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", letterSpacing: "0.4px", fontFamily: FONT.sans }}>
            {config.heroBtn1 || "Ver colección"}
          </button>
          <button onClick={onShop} style={{ padding: "13px 20px", borderRadius: 2, background: "transparent", color: C.charcoal, border: `1px solid ${C.linen3}`, fontWeight: 400, fontSize: 13, cursor: "pointer", letterSpacing: "0.3px", fontFamily: FONT.sans }}>
            {config.heroBtn2 || "Nuestra historia"}
          </button>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ display: "flex", gap: 36, marginTop: 52, paddingTop: 30, borderTop: `1px solid ${C.linen2}` }}>
          {[["5K+", "Familias"], ["200+", "Productos"], ["4.9", "Valoración"]].map(([n, l]) => (
            <div key={l}>
              <p style={{ fontFamily: FONT.serif, fontSize: 24, fontWeight: 300, color: C.charcoal, margin: "0 0 3px" }}>{n}</p>
              <p style={{ fontSize: 11, color: C.faint, margin: 0, fontFamily: FONT.sans }}>{l}</p>
            </div>
          ))}
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.7 }}
        style={{ height: "74vh", borderRadius: 3, overflow: "hidden", position: "relative" }}>
        {config.heroImage
          ? <img src={config.heroImage} alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg, #F5EEEC, #F5F2EE, #EDF0EC)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 86, marginBottom: 12 }}>👶🏻</div>
                <p style={{ fontFamily: FONT.serif, fontSize: 17, color: C.muted, fontWeight: 300, letterSpacing: "0.5px" }}>{config.storeName}</p>
              </div>
            </div>
        }
        <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: 22, left: 22, background: "rgba(255,255,255,0.93)", backdropFilter: "blur(10px)", borderRadius: 3, padding: "11px 14px", boxShadow: "0 4px 18px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EDF0EC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⭐</div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.charcoal, margin: "0 0 1px", fontFamily: FONT.sans }}>+500 reseñas verificadas</p>
            <p style={{ fontSize: 10, color: C.faint, margin: 0, fontFamily: FONT.sans }}>Calificación 4.9 / 5</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
function ProductDetailModal({ product, categories, open, onClose, onAddCart, onWishlist, wishlist = [], config }) {
  const [curImg, setCurImg] = useState(0);
  const cat = categories.find(c => c.id === product?.categoryId);
  const inWish = product && wishlist.includes(product.id);
  const imgs = product?.images?.length > 0 ? product.images : [];
  const pc = config?.primaryColor || "#899180";
  useEffect(() => { setCurImg(0); }, [product?.id]);
  if (!open || !product) return null;
  const lines = (product.details || "").split("\n").filter(l => l.trim());
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{ position: "fixed", inset: 0, background: "rgba(61,56,50,0.55)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}>
        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
          style={{ background: "#FFFFFF", borderRadius: 16, width: "100%", maxWidth: 860, display: "grid", gridTemplateColumns: "1fr 1fr", boxShadow: "0 24px 80px rgba(0,0,0,0.22)", overflow: "hidden", maxHeight: "92vh" }}>

          {/* Image panel */}
          <div style={{ position: "relative", background: product.bg || "#F5EEEC", minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {imgs.length > 0 ? (
              <>
                <img src={imgs[curImg]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                {imgs.length > 1 && (
                  <>
                    <button onClick={() => setCurImg(i => Math.max(0, i - 1))} disabled={curImg === 0}
                      style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: curImg === 0 ? 0.3 : 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                      <Icon d="M15 18l-6-6 6-6" size={14} />
                    </button>
                    <button onClick={() => setCurImg(i => Math.min(imgs.length - 1, i + 1))} disabled={curImg === imgs.length - 1}
                      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: curImg === imgs.length - 1 ? 0.3 : 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                      <Icon d="M9 18l6-6-6-6" size={14} />
                    </button>
                    {/* Thumbnails */}
                    <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", gap: 6, padding: "0 12px", overflowX: "auto", justifyContent: "center" }}>
                      {imgs.map((img, i) => (
                        <div key={i} onClick={() => setCurImg(i)} style={{ width: 48, height: 48, borderRadius: 6, overflow: "hidden", flexShrink: 0, cursor: "pointer", border: `2px solid ${i === curImg ? "white" : "transparent"}`, opacity: i === curImg ? 1 : 0.55, transition: "all 0.2s" }}>
                          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <span style={{ fontSize: 90, userSelect: "none" }}>{product.emoji || "🎁"}</span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <div style={{ position: "absolute", top: 12, left: 12, background: "#C8A860", color: "white", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>⚡ Solo {product.stock}</div>
            )}
          </div>

          {/* Info panel */}
          <div style={{ padding: "28px 26px", display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: "92vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ flex: 1, paddingRight: 8 }}>
                <p style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 5px", fontWeight: 600 }}>{cat?.name}</p>
                <h2 style={{ fontFamily: `"${config?.fontHeading || "Cormorant Garamond"}", serif`, fontSize: 22, fontWeight: 400, color: "#3D3830", margin: 0, lineHeight: 1.2 }}>{product.name}</h2>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => onWishlist(product.id)} style={{ width: 36, height: 36, borderRadius: "50%", background: inWish ? "#F5EEEC" : "#F5F2EE", border: `1.5px solid ${inWish ? "#9E7470" : "#D8D0C8"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: inWish ? "#9E7470" : "#7A7068" }}>
                  <Icon d={Icons.heart} size={14} />
                </button>
                <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F2EE", border: "1.5px solid #D8D0C8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#7A7068" }}>
                  <Icon d={Icons.x} size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <Stars rating={product.rating} size={12} />
              <span style={{ fontSize: 11, color: "#A89888" }}>({product.reviews} reseñas)</span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #EDE8E2" }}>
              <span style={{ fontFamily: `"${config?.fontHeading || "Cormorant Garamond"}", serif`, fontSize: 28, fontWeight: 600, color: "#3D3830" }}>{config?.currency || "S/."} {product.price.toFixed(2)}</span>
              {product.oldPrice && <span style={{ fontSize: 14, color: "#A89888", textDecoration: "line-through" }}>S/. {product.oldPrice.toFixed(2)}</span>}
              {product.oldPrice && <span style={{ fontSize: 10, fontWeight: 700, color: "#6A9E78", background: "#6A9E7818", padding: "2px 7px", borderRadius: 10 }}>-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
            </div>

            <p style={{ fontSize: 13, lineHeight: 1.8, color: "#7A7068", marginBottom: 14 }}>{product.desc}</p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#7A7068", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Colores disponibles</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.colors.map((c, i) => (
                    <div key={i} title={c} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "2px solid #E5DDD4", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }} />
                  ))}
                </div>
              </div>
            )}

            {/* Details / specs */}
            {lines.length > 0 && (
              <div style={{ background: "#FAFAF8", borderRadius: 10, padding: "12px 14px", marginBottom: 16, border: "1px solid #EDE8E2" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#3D3830", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>Especificaciones</p>
                {lines.map((l, i) => <p key={i} style={{ fontSize: 12, color: "#7A7068", margin: "0 0 5px", lineHeight: 1.6 }}>{l}</p>)}
              </div>
            )}

            <div style={{ marginTop: "auto", paddingTop: 12 }}>
              {product.stock === 0
                ? <div style={{ textAlign: "center", padding: 12, background: "#F5F2EE", borderRadius: 10, color: "#7A7068", fontWeight: 600 }}>Sin stock disponible</div>
                : <button onClick={() => { onAddCart(product); onClose(); }} style={{ width: "100%", padding: "13px", borderRadius: 100, background: pc, color: "white", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Icon d={Icons.cart} size={16} /> Añadir al carrito
                  </button>
              }
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10, fontSize: 11, color: "#A89888" }}>
                <span>🌿 Material seguro</span><span>🚀 Envío 24-48h</span><span>↩️ Cambio fácil</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


function Storefront({ products, categories, config, coupons, cart, setCart, wishlist, setWishlist, orders, setOrders }) {
  const toast = useToast();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const productsRef = useRef(null);
  const [detailProduct, setDetailProduct] = useState(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const filtered = useMemo(() => {
    let p = products.filter(p => p.active);
    if (filterCat !== "all") p = p.filter(p => p.categoryId === filterCat);
    if (search) p = p.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "featured") p = [...p].sort((a, b) => b.featured - a.featured);
    if (sort === "price_asc") p = [...p].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") p = [...p].sort((a, b) => b.price - a.price);
    if (sort === "newest") p = [...p].sort((a, b) => b.createdAt - a.createdAt);
    return p;
  }, [products, filterCat, search, sort]);

  const addToCart = (product) => {
    setCart(c => { const ex = c.find(i => i.id === product.id); return ex ? c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...product, qty: 1 }]; });
    toast(`🛒 ${product.name} añadido al carrito`);
    setCartOpen(true);
  };

  const toggleWishlist = (id) => {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
    toast(wishlist.includes(id) ? "💔 Eliminado de favoritos" : "💕 Añadido a favoritos");
  };

  const handleCheckoutComplete = (orderData) => {
    const newOrder = {
      id: "ord" + Date.now(),
      orderNumber: "VK-" + String(orders.length + 1).padStart(3, "0"),
      customerName: orderData.name,
      customerEmail: orderData.email,
      customerPhone: orderData.phone,
      address: orderData.address,
      items: cart,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shipping: orderData.shipping,
      total: orderData.total,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paymentMethod: orderData.payMethod,
      coupon: orderData.coupon,
      createdAt: Date.now(),
    };
    setOrders(o => [newOrder, ...o]);
    setCart([]);
    setCheckoutOpen(false);
    toast("🎉 ¡Pedido realizado con éxito!");
  };


  const pc  = config.primaryColor  || "#899180";
  const ac  = config.accentColor   || "#B5A99A";
  const bc  = config.buttonColor   || pc;
  const btc = config.buttonTextColor || "#FFFFFF";
  const hc  = config.headingColor  || "#3D3830";
  const tc  = config.textColor     || "#7A7068";
  const bg  = config.bgColor       || "#FAFAF8";
  const brd = config.borderColor   || "#EDE8E2";
  const SERIF = `"${config.fontHeading || "Cormorant Garamond"}", serif`;
  const SANS  = `"${config.fontBody    || "DM Sans"}", system-ui, sans-serif`;

  return (
    <div style={{ background: bg, fontFamily: SANS }}>

      {/* ── PROMO BAR ──────────────────────────────────────────────── */}
      {config.promoActive && (
        <div style={{ background: config.promoBannerColor || "#3D3830", color: config.promoBannerTextColor || "#FAFAF8", textAlign: "center", padding: "9px 20px", fontSize: 11, letterSpacing: "0.3px" }}>
          {config.promoBanner}
        </div>
      )}

      {/* ── NAVBAR ────────────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 200, background: config.navBgColor || "rgba(250,250,248,0.96)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${brd}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {config.logoImage
              ? <img src={config.logoImage} alt={config.storeName} style={{ height: 36, objectFit: "contain" }} />
              : <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: config.navTextColor || hc, letterSpacing: "1px" }}>{config.storeName}</span>
            }
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            {categories.slice(0, 4).map(cat => (
              <button key={cat.id} onClick={() => { setFilterCat(cat.id); productsRef.current?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: SANS, color: filterCat === cat.id ? (config.navActiveColor || pc) : (config.navTextColor || tc), fontWeight: filterCat === cat.id ? 600 : 400, borderBottom: `1px solid ${filterCat === cat.id ? (config.navActiveColor || pc) : "transparent"}`, padding: "4px 0", transition: "all 0.15s" }}>
                {cat.name}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: tc, display: "flex", padding: 4 }}>
              <Icon d={Icons.cart} size={19} strokeWidth={1.4} />
              {cartCount > 0 && <span style={{ position: "absolute", top: 1, right: 1, background: bc, color: btc, fontSize: 8, fontWeight: 700, width: 13, height: 13, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "86vh", alignItems: "center", gap: 64 }}>
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "2.5px", margin: "0 0 18px", fontWeight: 600 }}>
            {config.heroBadgeText}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: SERIF, fontSize: "clamp(34px, 3.8vw, 54px)", fontWeight: 300, lineHeight: 1.15, color: hc, margin: "0 0 20px", letterSpacing: "0.3px" }}>
            {(config.heroTitle || "").split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ fontSize: 15, lineHeight: 1.8, color: tc, maxWidth: 420, margin: "0 0 34px" }}>
            {config.heroSubtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <button onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })}
              style={{ padding: "13px 28px", borderRadius: 2, background: config.heroBtn1Color || bc, color: config.heroBtn1TextColor || btc, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", letterSpacing: "0.4px" }}>
              {config.heroBtn1 || "Ver colección"}
            </button>
            <button onClick={() => document.getElementById("about-vk")?.scrollIntoView({ behavior: "smooth" })}
              style={{ padding: "13px 20px", borderRadius: 2, background: config.heroBtn2Color || "transparent", color: config.heroBtn2TextColor || hc, border: `1px solid ${config.heroBtn2BorderColor || brd}`, fontWeight: 400, fontSize: 13, cursor: "pointer", letterSpacing: "0.3px" }}>
              {config.heroBtn2 || "Nuestra historia"}
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: "flex", gap: 36, marginTop: 52, paddingTop: 30, borderTop: `1px solid ${brd}` }}>
            {[[config.heroStat1Number || "5K+", config.heroStat1Label || "Familias"], [config.heroStat2Number || "200+", config.heroStat2Label || "Productos"], [config.heroStat3Number || "4.9", config.heroStat3Label || "Valoración"]].map(([n, l]) => (
              <div key={l}>
                <p style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 300, color: hc, margin: "0 0 3px" }}>{n}</p>
                <p style={{ fontSize: 11, color: tc, margin: 0, opacity: 0.7 }}>{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.7 }}
          style={{ height: "74vh", borderRadius: 3, overflow: "hidden", position: "relative" }}>
          {config.heroImage
            ? <img src={config.heroImage} alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", background: config.heroBgGradient || "linear-gradient(160deg,#F5EEEC,#F5F2EE,#EDF0EC)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 86, marginBottom: 12 }}>👶🏻</div><p style={{ fontFamily: SERIF, fontSize: 17, color: tc, fontWeight: 300 }}>{config.storeName}</p></div>
              </div>
          }
          <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", bottom: 22, left: 22, background: "rgba(255,255,255,0.93)", backdropFilter: "blur(10px)", borderRadius: 3, padding: "11px 14px", boxShadow: "0 4px 18px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: pc + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⭐</div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: hc, margin: "0 0 1px" }}>{config.heroFloatingText || "+500 reseñas verificadas"}</p>
              <p style={{ fontSize: 10, color: tc, margin: 0, opacity: 0.7 }}>{config.heroFloatingSubtext || "Calificación 4.9 / 5"}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── CATEGORÍAS ────────────────────────────────────────────── */}
      <section style={{ padding: "72px 0", background: config.aboutBgColor || "#F5F2EE", borderTop: `1px solid ${brd}`, borderBottom: `1px solid ${brd}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px", fontWeight: 600 }}>{config.catSectionLabel || "Explorar"}</p>
              <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 300, color: hc, margin: 0 }}>{config.catSectionTitle || "Todo lo que tu bebé necesita"}</h2>
            </div>
            <button onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })} style={{ fontSize: 11, color: pc, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>{config.catSectionLinkText || "Ver todo →"}</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                onClick={() => { setFilterCat(cat.id); productsRef.current?.scrollIntoView({ behavior: "smooth" }); }} style={{ cursor: "pointer" }}>
                <div style={{ aspectRatio: "3/4", borderRadius: 3, overflow: "hidden", background: cat.color || "#F5EEEC", marginBottom: 10, border: filterCat === cat.id ? `2px solid ${pc}` : "2px solid transparent", transition: "border-color 0.15s" }}>
                  {cat.image ? <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{cat.emoji}</div>}
                </div>
                <p style={{ fontSize: 12, fontWeight: filterCat === cat.id ? 600 : 400, color: filterCat === cat.id ? pc : hc, margin: "0 0 2px", textAlign: "center" }}>{cat.name}</p>
                <p style={{ fontSize: 10, color: tc, margin: 0, textAlign: "center", opacity: 0.7 }}>{products.filter(p => p.categoryId === cat.id && p.active).length} productos</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS ─────────────────────────────────────────────── */}
      <section ref={productsRef} style={{ padding: "72px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 18 }}>
            <div>
              <p style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px", fontWeight: 600 }}>{config.prodSectionLabel || "Colección"}</p>
              <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 300, color: hc, margin: 0 }}>{config.prodSectionTitle || "Más queridos"}</h2>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[{ id: "all", name: "Todo" }, ...categories].map(cat => (
                  <button key={cat.id} onClick={() => setFilterCat(cat.id)} style={{ padding: "6px 14px", borderRadius: 2, border: `1px solid ${filterCat === cat.id ? pc : brd}`, background: filterCat === cat.id ? pc : "transparent", color: filterCat === cat.id ? btc : tc, fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>
                    {cat.name}
                  </button>
                ))}
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "7px 11px", borderRadius: 2, border: `1px solid ${brd}`, background: bg, color: hc, fontSize: 11, cursor: "pointer", outline: "none" }}>
                <option value="featured">Destacados</option>
                <option value="newest">Nuevos</option>
                <option value="price_asc">Precio ↑</option>
                <option value="price_desc">Precio ↓</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px 20px" }}>
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ delay: i * 0.03 }}>
                  <ProductCard product={p} categories={categories} onAddCart={addToCart} onWishlist={toggleWishlist} wishlist={wishlist} onDetail={setDetailProduct} config={config} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 0" }}><p style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: tc }}>No encontramos productos con esa búsqueda</p></div>}
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────── */}
      <section id="about-vk" style={{ padding: "72px 0", background: config.aboutBgColor || "#F5F2EE", borderTop: `1px solid ${brd}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 14px", fontWeight: 600 }}>{config.aboutLabel || "Nuestra historia"}</p>
            <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 300, color: hc, lineHeight: 1.35, marginBottom: 18 }}>"{config.aboutTitle}"</h2>
            <p style={{ fontSize: 14, color: tc, lineHeight: 1.85, marginBottom: 28 }}>{config.aboutText}</p>
            <p style={{ fontFamily: SERIF, fontSize: 16, fontStyle: "italic", color: pc, margin: 0 }}>— {config.aboutSignature || "Con amor, el equipo Venetus Kids"}</p>
          </div>
          <div style={{ borderRadius: 3, overflow: "hidden" }}>
            {config.aboutImage
              ? <img src={config.aboutImage} alt="About" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
              : <div style={{ aspectRatio: "4/3", background: `linear-gradient(135deg, ${pc}20, ${ac}30)`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3 }}>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 56, marginBottom: 10 }}>🤱</div><p style={{ fontFamily: SERIF, fontSize: 15, color: tc, fontWeight: 300 }}>Hecho con amor</p></div>
                </div>
            }
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ───────────────────────────────────────────── */}
      <section style={{ padding: "72px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px", fontWeight: 600 }}>{config.testimonialsLabel || "Testimonios"}</p>
            <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 300, color: hc, margin: 0 }}>{config.testimonialsTitle || "Lo que dicen nuestras clientas"}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {(config.testimonials || []).map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                style={{ background: config.cardBgColor || "white", borderRadius: 3, padding: "26px 22px", border: `1px solid ${brd}` }}>
                <div style={{ color: "#C9A55A", fontSize: 12, marginBottom: 14, letterSpacing: "1px" }}>★★★★★</div>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: tc, fontStyle: "italic", marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.bg || pc + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: hc }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: hc, margin: "0 0 1px" }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: tc, margin: 0, opacity: 0.7 }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ────────────────────────────────────────────── */}
      <section style={{ padding: "56px 0", background: config.benefitsBgColor || "#3D3830" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: `repeat(${(config.benefits || []).length || 4}, 1fr)`, gap: 36 }}>
          {(config.benefits || []).map((b, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{b.icon}</div>
              <p style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 400, color: "#F5F2EE", marginBottom: 6 }}>{b.title}</p>
              <p style={{ fontSize: 12, color: "rgba(245,242,238,0.45)", margin: 0, lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────────── */}
      <section style={{ padding: "72px 40px", background: config.newsletterBgColor || pc, textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 300, color: "white", marginBottom: 10 }}>{config.newsletterTitle}</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 28, lineHeight: 1.7 }}>{config.newsletterText}</p>
          <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
            <input placeholder={config.newsletterInputPlaceholder || "tu@correo.com"} style={{ flex: 1, padding: "12px 16px", borderRadius: 2, border: "none", background: "rgba(255,255,255,0.18)", color: "white", fontSize: 13, outline: "none" }} />
            <button onClick={() => toast("¡Suscripción exitosa!")} style={{ padding: "12px 20px", borderRadius: 2, background: config.newsletterBtnColor || "white", color: config.newsletterBtnTextColor || pc, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>{config.newsletterBtnText || "Suscribirse"}</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer style={{ background: config.footerBgColor || "#3D3830", padding: "52px 0 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: 40, marginBottom: 40 }}>
            <div>
              {config.logoImage
                ? <img src={config.logoImage} alt={config.storeName} style={{ height: 36, objectFit: "contain", marginBottom: 12 }} />
                : <p style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: "#F5F2EE", marginBottom: 12, letterSpacing: "0.5px" }}>{config.storeName}</p>
              }
              <p style={{ fontSize: 12, color: "rgba(245,242,238,0.4)", lineHeight: 1.8, marginBottom: 18 }}>{config.footerTagline || config.tagline}</p>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,242,238,0.3)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14 }}>{config.footerCol1Title || "Tienda"}</p>
              {(config.footerCol1Links || "Recién nacidos|Conjuntos|Accesorios|Zapatos|Mantas").split("|").map(l => <p key={l} style={{ fontSize: 12, color: "rgba(245,242,238,0.45)", marginBottom: 8 }}>{l}</p>)}
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,242,238,0.3)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14 }}>{config.footerCol2Title || "Ayuda"}</p>
              {(config.footerCol2Links || "Cómo comprar|Envíos|Cambios|FAQ").split("|").map(l => <p key={l} style={{ fontSize: 12, color: "rgba(245,242,238,0.45)", marginBottom: 8 }}>{l}</p>)}
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(245,242,238,0.3)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14 }}>Contacto</p>
              {[[" 📍", config.address], ["📱", config.whatsapp], ["📧", config.email]].map(([ic, v]) => <div key={v} style={{ display: "flex", gap: 8, marginBottom: 10 }}><span style={{ fontSize: 12 }}>{ic}</span><span style={{ fontSize: 12, color: "rgba(245,242,238,0.45)" }}>{v}</span></div>)}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 11, color: "rgba(245,242,238,0.28)", margin: 0 }}>{config.footerCopyright || `© 2025 ${config.storeName} · Lima, Perú`}</p>
            <div style={{ display: "flex", gap: 7 }}>
              {(config.footerPaymentMethods || "Yape|Visa|MC|BCP").split("|").map(m => <span key={m} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", padding: "3px 9px", borderRadius: 2, fontSize: 10, color: "rgba(245,242,238,0.3)" }}>{m}</span>)}
            </div>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOATING ──────────────────────────────────────── */}
      <motion.a href={`https://wa.me/${config.whatsapp}`} target="_blank"
        animate={{ boxShadow: ["0 4px 16px rgba(37,211,102,0.3)", "0 4px 24px rgba(37,211,102,0.55)", "0 4px 16px rgba(37,211,102,0.3)"] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ position: "fixed", bottom: 26, right: 26, width: 50, height: 50, background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, textDecoration: "none", zIndex: 500 }}>
        💬
      </motion.a>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} config={config} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} config={config} products={products} coupons={coupons} onComplete={handleCheckoutComplete} />
      <ProductDetailModal product={detailProduct} categories={categories} open={!!detailProduct} onClose={() => setDetailProduct(null)} onAddCart={addToCart} onWishlist={toggleWishlist} wishlist={wishlist} config={config} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Playfair+Display:wght@300;400;600&display=swap');
        * { box-sizing: border-box; } body { margin: 0; }
        input, select, textarea, button { font-family: inherit; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #D8D0C8; border-radius: 2px; }
      `}</style>
    </div>
  );
}

function AdminDashboard({ products, orders, categories, config }) {
  const paid = orders.filter(o => o.paymentStatus === "PAID");
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === "PENDING").length;
  const lowStock = products.filter(p => p.stock <= 5 && p.active).length;
  const now = Date.now();
  const thisMonth = paid.filter(o => now - o.createdAt < 30 * 86400000);
  const monthRevenue = thisMonth.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: FONT.serif, fontSize: 28, color: C.charcoal, margin: "0 0 4px" }}>Bienvenida de nuevo 👋</h2>
        <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Aquí está el resumen de tu tienda hoy.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        <StatCard icon={Icons.bar} label="Ingresos totales" value={`S/. ${revenue.toFixed(0)}`} sub={`S/. ${monthRevenue.toFixed(0)} este mes`} color={C.success} trend={12} />
        <StatCard icon={Icons.package} label="Pedidos totales" value={paid.length} sub={`${pending} pendientes`} color={C.roseDeep} trend={8} />
        <StatCard icon={Icons.users} label="Clientes únicos" value={new Set(orders.map(o => o.customerEmail)).size} sub="Registrados" color={C.sand} trend={5} />
        <StatCard icon={Icons.tag} label="Productos activos" value={products.filter(p => p.active).length} sub={lowStock > 0 ? `⚠️ ${lowStock} con poco stock` : "Todo en orden ✅"} color={lowStock > 0 ? C.warning : C.success} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        {/* Recent orders */}
        <div style={{ background: C.white, borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(139,110,82,0.08)" }}>
          <h3 style={{ fontFamily: FONT.serif, fontSize: 20, color: C.charcoal, margin: "0 0 20px" }}>Pedidos recientes</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Pedido", "Cliente", "Total", "Estado"].map(h => <th key={h} style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: "1px", padding: "8px 12px", textAlign: "left", borderBottom: `1px solid ${C.beige}` }}>{h}</th>)}</tr></thead>
            <tbody>
              {orders.slice(0, 6).map(o => (
                <tr key={o.id} style={{ borderBottom: `1px solid ${C.beige}` }}>
                  <td style={{ padding: "12px", fontSize: 13, fontWeight: 700, color: C.charcoal }}>{o.orderNumber}</td>
                  <td style={{ padding: "12px", fontSize: 13, color: C.muted }}>{o.customerName}</td>
                  <td style={{ padding: "12px", fontSize: 13, fontWeight: 600, color: C.brown }}>S/. {o.total.toFixed(2)}</td>
                  <td style={{ padding: "12px" }}><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Top products */}
          <div style={{ background: C.white, borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(139,110,82,0.08)" }}>
            <h3 style={{ fontFamily: FONT.serif, fontSize: 18, color: C.charcoal, margin: "0 0 16px" }}>Top productos ⭐</h3>
            {products.slice(0, 4).map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.beige}` : "none" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.faint, width: 20 }}>#{i+1}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{p.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.faint }}>Stock: {p.stock}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.brown }}>S/. {p.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
          {/* Low stock alert */}
          {lowStock > 0 && (
            <div style={{ background: "#FFF3CD", borderRadius: 20, padding: 20, border: "1px solid #FFEAA7" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Icon d={Icons.alert} size={18} style={{ color: "#856404" }} />
                <span style={{ fontWeight: 700, fontSize: 14, color: "#856404" }}>⚠️ Stock bajo</span>
              </div>
              {products.filter(p => p.stock <= 5 && p.active).map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#856404", padding: "4px 0" }}>
                  <span>{p.emoji} {p.name}</span><span style={{ fontWeight: 700 }}>{p.stock} restantes</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PRODUCTS ─────────────────────────────────────────────────────────
function AdminProducts({ products, setProducts, categories }) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "new" | product
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({});

  const openNew = () => {
    setForm({ name: "", desc: "", details: "", price: "", oldPrice: "", stock: "", categoryId: categories[0]?.id || "", badge: "", emoji: "🎁", images: [], colors: [], bg: "#F5EEEC", active: true, featured: false });
    setModal("new");
  };
  const openEdit = (p) => {
    setForm({ ...p, price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : "", stock: String(p.stock), images: p.images || [], colors: p.colors || [] });
    setModal(p);
  };
  const save = () => {
    if (!form.name || !form.price || !form.stock) { toast("Completa nombre, precio y stock", "error"); return; }
    const data = { ...form, price: parseFloat(form.price), oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null, stock: parseInt(form.stock), rating: form.rating || 4.8, reviews: form.reviews || 0, createdAt: form.createdAt || Date.now(), slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), active: Boolean(form.active), featured: Boolean(form.featured), images: form.images || [], colors: form.colors || [] };
    if (modal === "new") { setProducts(p => [...p, { ...data, id: "p" + Date.now() }]); toast("✓ Producto creado"); }
    else { setProducts(p => p.map(x => x.id === modal.id ? { ...x, ...data } : x)); toast("✓ Producto actualizado"); }
    setModal(null);
  };
  const deactivate = (id) => { setProducts(p => p.map(x => x.id === id ? { ...x, active: false } : x)); toast("Producto desactivado"); };
  const toggle = (id) => setProducts(p => p.map(x => x.id === id ? { ...x, active: !x.active } : x));
  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const iS = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #D8D0C8", background: "#FAFAF8", color: "#3D3830", fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <h2 style={{ fontFamily: "serif", fontSize: 26, color: "#3D3830", margin: "0 0 3px" }}>Productos</h2>
          <p style={{ color: "#A89888", fontSize: 12, margin: 0 }}>{products.filter(p => p.active).length} activos · {products.length} total</p>
        </div>
        <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 100, background: "#899180", color: "white", border: "none", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
          <Icon d={Icons.plus} size={14} /> Nuevo producto
        </button>
      </div>

      <div style={{ position: "relative", marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos..." style={{ ...iS, paddingLeft: 36 }} />
        <Icon d={Icons.search} size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#A89888" }} />
      </div>

      <div style={{ background: "white", borderRadius: 12, border: "1px solid #EDE8E2", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#F5F2EE" }}>
            {["Producto", "Categoría", "Precio", "Stock", "Estado", "Acciones"].map(h => (
              <th key={h} style={{ fontSize: 10, fontWeight: 700, color: "#A89888", textTransform: "uppercase", letterSpacing: "1px", padding: "12px 14px", textAlign: "left" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(p => {
              const cat = categories.find(c => c.id === p.categoryId);
              const thumb = p.images && p.images[0];
              return (
                <tr key={p.id} style={{ borderTop: "1px solid #EDE8E2", opacity: p.active ? 1 : 0.5 }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 44, height: 56, borderRadius: 8, overflow: "hidden", background: p.bg || "#F5EEEC", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                        {thumb ? <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : p.emoji || "🎁"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 13, color: "#3D3830", margin: "0 0 2px" }}>{p.name}</p>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {p.featured && <span style={{ fontSize: 9, color: "#899180" }}>★ Destacado</span>}
                          {p.images?.length > 0 && <span style={{ fontSize: 9, color: "#B5A99A" }}>📸 {p.images.length}</span>}
                          {p.colors?.length > 0 && <div style={{ display: "flex", gap: 2 }}>{p.colors.slice(0, 4).map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, border: "1px solid #D8D0C8" }} />)}</div>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: "#7A7068" }}>{cat?.emoji} {cat?.name}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "#3D3830", margin: "0 0 2px" }}>S/. {p.price.toFixed(2)}</p>
                    {p.oldPrice && <p style={{ fontSize: 11, color: "#A89888", textDecoration: "line-through", margin: 0 }}>S/. {p.oldPrice.toFixed(2)}</p>}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: p.stock <= 5 ? "#C8A860" : "#3D3830" }}>{p.stock}</span>
                    {p.stock <= 5 && <p style={{ fontSize: 9, color: "#C8A860", margin: 0 }}>stock bajo</p>}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <button onClick={() => toggle(p.id)} style={{ background: p.active ? "#EDF0EC" : "#FBE8E8", color: p.active ? "#6B7264" : "#8A2020", border: "none", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                      {p.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #D8D0C8", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#7A7068" }}><Icon d={Icons.edit} size={13} /></button>
                      <button onClick={() => setConfirm({ id: p.id, name: p.name })} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #FFCDD2", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C07070" }}><Icon d={Icons.trash} size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ padding: "32px", textAlign: "center", color: "#A89888", fontSize: 13 }}>No se encontraron productos</p>}
      </div>

      {/* Product Form Modal */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "new" ? "Nuevo producto" : "Editar producto"} width={720}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <Field label="Nombre del producto" required>
              <input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={iS} placeholder="Ej: Set Bodysuit Algodón" />
            </Field>
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <Field label="Descripción corta">
              <textarea value={form.desc || ""} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} style={{ ...iS, resize: "vertical", minHeight: 60 }} placeholder="Descripción breve visible en el catálogo..." />
            </Field>
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <Field label="Detalles / Especificaciones (una por línea)">
              <textarea value={form.details || ""} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} style={{ ...iS, resize: "vertical", minHeight: 90 }} placeholder={"• Material: algodón orgánico\n• Tallas: 0-3m, 3-6m\n• Lavable a máquina"} />
            </Field>
          </div>
          <Field label="Precio (S/.)" required>
            <input type="number" step="0.01" value={form.price || ""} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={iS} placeholder="0.00" />
          </Field>
          <Field label="Precio anterior (tachado)">
            <input type="number" step="0.01" value={form.oldPrice || ""} onChange={e => setForm(f => ({ ...f, oldPrice: e.target.value }))} style={iS} placeholder="0.00" />
          </Field>
          <Field label="Stock disponible" required>
            <input type="number" value={form.stock || ""} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} style={iS} />
          </Field>
          <Field label="Categoría">
            <select value={form.categoryId || ""} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={{ ...iS, cursor: "pointer" }}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </Field>
          <Field label="Badge / Etiqueta">
            <select value={form.badge || ""} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} style={{ ...iS, cursor: "pointer" }}>
              <option value="">Sin etiqueta</option>
              <option value="nuevo">Nuevo</option>
              <option value="oferta">Oferta</option>
              <option value="mas_vendido">Más vendido</option>
              <option value="favorito">Favorito</option>
            </select>
          </Field>
          <Field label="Emoji (respaldo sin fotos)">
            <input value={form.emoji || ""} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} style={iS} placeholder="🎁" />
          </Field>
          <div style={{ gridColumn: "1/-1" }}>
            <ImageUploader
              images={form.images || []}
              onChange={imgs => setForm(f => ({ ...f, images: typeof imgs === "function" ? imgs(f.images || []) : imgs }))}
              maxImages={6}
              label="📸 Fotos del producto (hasta 6 · la primera es la principal)"
            />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <ColorSwatchInput
              colors={form.colors || []}
              onChange={colors => setForm(f => ({ ...f, colors }))}
              label="🎨 Colores disponibles"
            />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <ColorInput label="Color de fondo de la tarjeta (sin fotos)" value={form.bg || "#F5EEEC"} onChange={v => setForm(f => ({ ...f, bg: v }))} />
          </div>
          <div style={{ display: "flex", gap: 20, gridColumn: "1/-1", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, color: "#7A7068" }}>
              <input type="checkbox" checked={!!form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ accentColor: "#899180" }} /> Destacado
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, color: "#7A7068" }}>
              <input type="checkbox" checked={!!form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} style={{ accentColor: "#899180" }} /> Activo en tienda
            </label>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={() => setModal(null)} style={{ flex: 1, padding: "11px", borderRadius: 100, border: "1.5px solid #D8D0C8", background: "transparent", cursor: "pointer", fontWeight: 600, color: "#7A7068" }}>Cancelar</button>
          <button onClick={save} style={{ flex: 2, padding: "11px", borderRadius: 100, background: "#899180", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Guardar producto</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => deactivate(confirm?.id)} title="Desactivar producto" message={`¿Desactivar "${confirm?.name}"? Puedes reactivarlo después.`} danger />
    </div>
  );
}

function AdminOrders({ orders, setOrders }) {
  const toast = useToast();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);

  const filtered = orders.filter(o => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search && !o.orderNumber.includes(search) && !o.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const updateStatus = (id, status) => {
    setOrders(o => o.map(x => x.id === id ? { ...x, status, ...(status === "CONFIRMED" || status === "SHIPPED" ? { paymentStatus: "PAID" } : {}) } : x));
    setDetail(d => d?.id === id ? { ...d, status } : d);
    toast(`✅ Estado actualizado: ${statusConfig[status]?.label}`);
  };

  const exportCSV = () => {
    const rows = [["N°Pedido","Fecha","Cliente","Email","Teléfono","Estado","Pago","Total","Método"], ...orders.map(o => [o.orderNumber, new Date(o.createdAt).toLocaleDateString("es-PE"), o.customerName, o.customerEmail, o.customerPhone, o.status, o.paymentStatus, o.total.toFixed(2), o.paymentMethod || "-"])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = `venetus_pedidos_${Date.now()}.csv`; a.click();
    toast("📥 Pedidos exportados como CSV");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: FONT.serif, fontSize: 28, color: C.charcoal, margin: "0 0 4px" }}>Pedidos</h2>
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>{orders.length} pedidos · {orders.filter(o => o.status === "PENDING").length} pendientes</p>
        </div>
        <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 100, background: C.beige, border: "none", fontWeight: 600, cursor: "pointer", fontSize: 13, color: C.muted }}>
          <Icon d={Icons.download} size={15} /> Exportar CSV
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[["all","Todos"], ["PENDING","Pendientes"], ["CONFIRMED","Confirmados"], ["PREPARING","Preparando"], ["SHIPPED","Enviados"], ["DELIVERED","Entregados"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: "8px 18px", borderRadius: 100, border: `1.5px solid ${filter === v ? C.brown : C.beigeDark}`, background: filter === v ? C.brown : "transparent", color: filter === v ? "white" : C.muted, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{l}</button>
        ))}
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar pedido..." style={{ ...inputStyle, paddingLeft: 36, width: 220 }} />
          <Icon d={Icons.search} size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.faint }} />
        </div>
      </div>
      <div style={{ background: C.white, borderRadius: 20, boxShadow: "0 4px 24px rgba(139,110,82,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: C.linen }}>{["Pedido", "Fecha", "Cliente", "Items", "Total", "Estado", "Pago", "Acciones"].map(h => <th key={h} style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: "1px", padding: "14px 16px", textAlign: "left" }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} style={{ borderTop: `1px solid ${C.beige}` }}>
                <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 14, color: C.charcoal }}>{o.orderNumber}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: C.muted }}>{new Date(o.createdAt).toLocaleDateString("es-PE")}</td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>{o.customerName}</div>
                  <div style={{ fontSize: 11, color: C.faint }}>{o.customerEmail}</div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: C.muted }}>{o.items.map(i => i.emoji).join(" ")} ({o.items.length})</td>
                <td style={{ padding: "14px 16px", fontWeight: 700, color: C.brown }}>S/. {o.total.toFixed(2)}</td>
                <td style={{ padding: "14px 16px" }}><StatusBadge status={o.status} /></td>
                <td style={{ padding: "14px 16px" }}><StatusBadge status={o.paymentStatus} /></td>
                <td style={{ padding: "14px 16px" }}>
                  <button onClick={() => setDetail(o)} style={{ padding: "7px 14px", borderRadius: 100, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", fontSize: 12, color: C.muted, fontWeight: 600 }}>
                    <Icon d={Icons.eye} size={13} style={{ display: "inline", marginRight: 4 }} />Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: "40px", textAlign: "center", color: C.faint }}>No hay pedidos con ese filtro</div>}
      </div>

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Pedido ${detail?.orderNumber}`} width={680}>
        {detail && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div style={{ background: C.beige, borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Cliente</div>
                <div style={{ fontWeight: 700, color: C.charcoal, marginBottom: 4 }}>{detail.customerName}</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 2 }}>📧 {detail.customerEmail}</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 2 }}>📱 {detail.customerPhone}</div>
                <div style={{ fontSize: 13, color: C.muted }}>📍 {detail.address}</div>
              </div>
              <div style={{ background: C.beige, borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Resumen</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Subtotal: <strong>S/. {detail.subtotal?.toFixed(2)}</strong></div>
                {detail.discount > 0 && <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Descuento: <strong style={{ color: C.success }}>-S/. {detail.discount.toFixed(2)}</strong></div>}
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Envío: <strong>{detail.shipping === 0 ? "Gratis" : "S/. " + detail.shipping?.toFixed(2)}</strong></div>
                <div style={{ fontWeight: 800, fontSize: 16, color: C.brown }}>Total: S/. {detail.total.toFixed(2)}</div>
                {detail.coupon && <div style={{ fontSize: 12, color: C.roseDeep, marginTop: 6 }}>🎟️ Cupón: {detail.coupon}</div>}
                {detail.paymentMethod && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>💳 {detail.paymentMethod}</div>}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Productos</div>
              {detail.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: i < detail.items.length - 1 ? `1px solid ${C.beige}` : "none" }}>
                  <span style={{ fontSize: 28 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.charcoal }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: C.faint }}>x{item.qty} · S/. {item.price.toFixed(2)} c/u</div>
                  </div>
                  <div style={{ fontWeight: 700, color: C.brown }}>S/. {(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Cambiar estado del pedido</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["PENDING","CONFIRMED","PREPARING","SHIPPED","DELIVERED","CANCELLED"].map(s => (
                  <button key={s} onClick={() => updateStatus(detail.id, s)} style={{ padding: "8px 16px", borderRadius: 100, border: `2px solid ${detail.status === s ? C.roseDeep : C.beigeDark}`, background: detail.status === s ? C.roseLight : "transparent", color: detail.status === s ? C.roseDeep : C.muted, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                    {statusConfig[s]?.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── ADMIN CATEGORIES ────────────────────────────────────────────────────────
function AdminCategories({ categories, setCategories, products }) {
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({});

  const iS = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #D8D0C8", background: "#FAFAF8", color: "#3D3830", fontSize: 13, outline: "none", boxSizing: "border-box" };

  const save = () => {
    if (!form.name) { toast("Escribe el nombre de la categoría", "error"); return; }
    const data = { ...form, slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") };
    if (modal === "new") { setCategories(c => [...c, { ...data, id: "cat" + Date.now() }]); toast("✓ Categoría creada"); }
    else { setCategories(c => c.map(x => x.id === modal.id ? { ...x, ...data } : x)); toast("✓ Categoría actualizada"); }
    setModal(null);
  };
  const del = (id) => { setCategories(c => c.filter(x => x.id !== id)); toast("Categoría eliminada"); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 style={{ fontFamily: "serif", fontSize: 26, color: "#3D3830", margin: 0 }}>Categorías</h2>
        <button onClick={() => { setForm({ name: "", emoji: "🎀", image: "", color: "#F5EEEC" }); setModal("new"); }}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 100, background: "#899180", color: "white", border: "none", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
          <Icon d={Icons.plus} size={14} /> Nueva categoría
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background: "white", borderRadius: 12, overflow: "hidden", border: "1px solid #EDE8E2" }}>
            <div style={{ height: 110, background: cat.color || "#F5EEEC", position: "relative", overflow: "hidden" }}>
              {cat.image
                ? <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>{cat.emoji}</div>
              }
            </div>
            <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: "#3D3830", margin: "0 0 2px" }}>{cat.name}</p>
                <p style={{ fontSize: 11, color: "#A89888", margin: 0 }}>{products.filter(p => p.categoryId === cat.id && p.active).length} productos</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setForm({ ...cat, image: cat.image || "" }); setModal(cat); }}
                  style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #D8D0C8", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#7A7068" }}><Icon d={Icons.edit} size={13} /></button>
                <button onClick={() => setConfirm({ id: cat.id, name: cat.name })}
                  style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #FFCDD2", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C07070" }}><Icon d={Icons.trash} size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "new" ? "Nueva categoría" : "Editar categoría"} width={500}>
        <Field label="Nombre" required>
          <input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={iS} placeholder="Ej: Recién nacidos" />
        </Field>
        <Field label="Emoji (respaldo sin imagen)">
          <input value={form.emoji || ""} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} style={iS} placeholder="👼" />
        </Field>
        <ColorInput label="Color de fondo" value={form.color || "#F5EEEC"} onChange={v => setForm(f => ({ ...f, color: v }))} />
        <SingleImageUploader image={form.image || ""} onChange={img => setForm(f => ({ ...f, image: img }))} label="📸 Imagen de portada de la categoría" placeholder="Sube una imagen representativa" />
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", borderRadius: 100, border: "1.5px solid #D8D0C8", background: "transparent", cursor: "pointer", fontWeight: 600, color: "#7A7068" }}>Cancelar</button>
          <button onClick={save} style={{ flex: 2, padding: "10px", borderRadius: 100, background: "#899180", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Guardar</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm?.id)} title="Eliminar categoría" message={`¿Eliminar "${confirm?.name}"? Los productos no se eliminarán.`} danger />
    </div>
  );
}

function AdminCoupons({ coupons, setCoupons }) {
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const save = () => {
    if (!form.code || !form.value) { toast("Completa código y valor", "error"); return; }
    const data = { ...form, value: parseFloat(form.value), minAmount: form.minAmount ? parseFloat(form.minAmount) : null, maxUses: form.maxUses ? parseInt(form.maxUses) : null, active: Boolean(form.active), used: form.used || 0 };
    if (modal === "new") { setCoupons(c => [...c, { ...data, id: "coupon" + Date.now(), code: data.code.toUpperCase() }]); toast("✅ Cupón creado"); }
    else { setCoupons(c => c.map(x => x.id === modal.id ? { ...x, ...data } : x)); toast("✅ Cupón actualizado"); }
    setModal(null);
  };
  const toggle = (id) => { setCoupons(c => c.map(x => x.id === id ? { ...x, active: !x.active } : x)); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h2 style={{ fontFamily: FONT.serif, fontSize: 28, color: C.charcoal, margin: 0 }}>Cupones de descuento</h2>
        <button onClick={() => { setForm({ code: "", type: "percent", value: "", minAmount: "", maxUses: "", active: true }); setModal("new"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}>
          <Icon d={Icons.plus} size={16} /> Nuevo cupón
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {coupons.map(c => (
          <div key={c.id} style={{ background: C.white, borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(139,110,82,0.08)", borderLeft: `4px solid ${c.active ? C.roseDeep : C.beigeDark}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: FONT.serif, fontSize: 22, fontWeight: 700, color: C.charcoal, letterSpacing: "1px" }}>{c.code}</div>
                <div style={{ fontSize: 13, color: C.faint, marginTop: 2 }}>
                  {c.type === "percent" ? `${c.value}% de descuento` : `S/. ${c.value} de descuento`}
                  {c.minAmount ? ` · Mín. S/. ${c.minAmount}` : ""}
                </div>
              </div>
              <button onClick={() => toggle(c.id)} style={{ background: c.active ? "#D4EDDA" : "#F8D7DA", color: c.active ? "#155724" : "#721C24", border: "none", padding: "5px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                {c.active ? "Activo" : "Inactivo"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: 12, color: C.faint, marginBottom: 16 }}>
              <span>Usados: <strong>{c.used || 0}</strong>{c.maxUses ? ` / ${c.maxUses}` : ""}</span>
              {c.expires && <span>Vence: <strong>{c.expires}</strong></span>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setForm({ ...c, value: String(c.value), minAmount: c.minAmount ? String(c.minAmount) : "", maxUses: c.maxUses ? String(c.maxUses) : "" }); setModal(c); }} style={{ flex: 1, padding: "9px", borderRadius: 100, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.muted }}>
                ✏️ Editar
              </button>
              <button onClick={() => { navigator.clipboard?.writeText(c.code); toast("📋 Código copiado: " + c.code); }} style={{ flex: 1, padding: "9px", borderRadius: 100, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.muted }}>
                📋 Copiar
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "new" ? "Nuevo cupón" : "Editar cupón"} width={500}>
        <Field label="Código del cupón" required><input value={form.code || ""} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} style={inputStyle} placeholder="Ej: VENETUS20" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Tipo"><select value={form.type || "percent"} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={selectStyle}><option value="percent">Porcentaje (%)</option><option value="fixed">Monto fijo (S/.)</option></select></Field>
          <Field label="Valor" required><input type="number" value={form.value || ""} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} style={inputStyle} placeholder={form.type === "percent" ? "20" : "10.00"} /></Field>
          <Field label="Compra mínima (S/.)"><input type="number" value={form.minAmount || ""} onChange={e => setForm(f => ({ ...f, minAmount: e.target.value }))} style={inputStyle} placeholder="100" /></Field>
          <Field label="Máximo de usos"><input type="number" value={form.maxUses || ""} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} style={inputStyle} placeholder="Sin límite" /></Field>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: C.muted, marginBottom: 20 }}>
          <input type="checkbox" checked={!!form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} style={{ width: 18, height: 18, accentColor: C.roseDeep }} /> Cupón activo
        </label>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setModal(null)} style={{ flex: 1, padding: "12px", borderRadius: 100, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", fontWeight: 600, color: C.muted }}>Cancelar</button>
          <button onClick={save} style={{ flex: 2, padding: "12px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Guardar</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── ADMIN SETTINGS ──────────────────────────────────────────────────────────
function AdminPageEditor({ config, setConfig }) {
  const toast = useToast();
  const [form, setForm] = useState({ ...config });
  const [tab, setTab] = useState("hero");
  const save = () => { setConfig({ ...form }); toast("✅ Cambios guardados — visibles en la tienda ahora mismo"); };

  const iS = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #D8D0C8", background: "#FAFAF8", color: "#3D3830", fontSize: 13, outline: "none", boxSizing: "border-box" };
  const tf = (k) => <input value={form[k] || ""} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} style={iS} />;
  const ta = (k, rows = 3) => <textarea value={form[k] || ""} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} style={{ ...iS, resize: "vertical", minHeight: rows * 28 }} />;
  const updT = (i, k, v) => setForm(f => ({ ...f, testimonials: f.testimonials.map((t, j) => j === i ? { ...t, [k]: v } : t) }));
  const updB = (i, k, v) => setForm(f => ({ ...f, benefits: f.benefits.map((b, j) => j === i ? { ...b, [k]: v } : b) }));

  const TABS = [
    ["hero", "🏠 Hero"], ["promo", "📢 Promo"], ["sections", "📝 Textos"],
    ["testimonials", "💬 Testimonios"], ["benefits", "⭐ Beneficios"],
    ["footer", "🔗 Footer"], ["images", "🖼️ Imágenes"], ["contact", "📞 Contacto"],
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "serif", fontSize: 26, color: "#3D3830", margin: "0 0 3px" }}>Editor de Página</h2>
          <p style={{ color: "#A89888", fontSize: 12, margin: 0 }}>Todo lo que editas aquí se refleja en la tienda al instante al guardar.</p>
        </div>
        <button onClick={save} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 24px", borderRadius: 100, background: "#899180", color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          <Icon d={Icons.save} size={14} /> Guardar cambios
        </button>
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 22, borderBottom: "1px solid #EDE8E2", flexWrap: "wrap" }}>
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "9px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: tab === id ? 700 : 400, color: tab === id ? "#899180" : "#7A7068", borderBottom: tab === id ? "2px solid #899180" : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: 12, padding: 26, border: "1px solid #EDE8E2" }}>

        {/* ── HERO ── */}
        {tab === "hero" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1/-1", background: "#EDF0EC", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#6B7264" }}>
              💡 Edita todos los textos del bloque principal de tu página de inicio.
            </div>
            <div style={{ gridColumn: "1/-1" }}><Field label="Badge / etiqueta superior del hero">{tf("heroBadgeText")}</Field></div>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Título principal (Enter = salto de línea)">{ta("heroTitle", 3)}</Field>
            </div>
            <div style={{ gridColumn: "1/-1" }}><Field label="Subtítulo">{ta("heroSubtitle", 2)}</Field></div>
            <Field label="Texto botón principal">{tf("heroBtn1")}</Field>
            <Field label="Texto botón secundario">{tf("heroBtn2")}</Field>
            <div style={{ gridColumn: "1/-1" }}><hr style={{ border: "none", borderTop: "1px solid #EDE8E2", margin: "6px 0 14px" }} /></div>
            <Field label="Estadística 1 — Número">{tf("heroStat1Number")}</Field>
            <Field label="Estadística 1 — Etiqueta">{tf("heroStat1Label")}</Field>
            <Field label="Estadística 2 — Número">{tf("heroStat2Number")}</Field>
            <Field label="Estadística 2 — Etiqueta">{tf("heroStat2Label")}</Field>
            <Field label="Estadística 3 — Número">{tf("heroStat3Number")}</Field>
            <Field label="Estadística 3 — Etiqueta">{tf("heroStat3Label")}</Field>
            <div style={{ gridColumn: "1/-1" }}><hr style={{ border: "none", borderTop: "1px solid #EDE8E2", margin: "6px 0 14px" }} /></div>
            <Field label="Texto badge flotante (sobre imagen)">{tf("heroFloatingText")}</Field>
            <Field label="Subtexto badge flotante">{tf("heroFloatingSubtext")}</Field>
          </div>
        )}

        {/* ── PROMO ── */}
        {tab === "promo" && (
          <div>
            <div style={{ background: "#EDF0EC", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#6B7264", marginBottom: 18 }}>
              💡 La barra de promoción aparece en la parte superior del sitio.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div onClick={() => setForm(f => ({ ...f, promoActive: !f.promoActive }))} style={{ width: 44, height: 24, borderRadius: 100, background: form.promoActive ? "#899180" : "#D8D0C8", position: "relative", cursor: "pointer", flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: form.promoActive ? 22 : 4, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
              </div>
              <span style={{ fontSize: 13, color: "#7A7068" }}>{form.promoActive ? "Barra activa y visible" : "Barra oculta"}</span>
            </div>
            <Field label="Texto de la barra promocional">{ta("promoBanner", 2)}</Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <ColorInput label="Color de fondo de la barra" value={form.promoBannerColor || "#3D3830"} onChange={v => setForm(f => ({ ...f, promoBannerColor: v }))} />
              <ColorInput label="Color del texto de la barra" value={form.promoBannerTextColor || "#FAFAF8"} onChange={v => setForm(f => ({ ...f, promoBannerTextColor: v }))} />
            </div>
            <div style={{ background: form.promoBannerColor || "#3D3830", color: form.promoBannerTextColor || "#FAFAF8", textAlign: "center", padding: "9px 20px", fontSize: 11, borderRadius: 8, marginTop: 8 }}>
              Vista previa: {form.promoBanner || "(sin texto)"}
            </div>
          </div>
        )}

        {/* ── SECCIONES / TEXTOS ── */}
        {tab === "sections" && (
          <div>
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#899180", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px" }}>🏷️ Sección Categorías</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <Field label="Etiqueta superior">{tf("catSectionLabel")}</Field>
                <Field label="Título principal">{tf("catSectionTitle")}</Field>
                <Field label="Texto del enlace">{tf("catSectionLinkText")}</Field>
              </div>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #EDE8E2", margin: "0 0 22px" }} />
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#899180", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px" }}>🛍️ Sección Productos</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Etiqueta superior">{tf("prodSectionLabel")}</Field>
                <Field label="Título principal">{tf("prodSectionTitle")}</Field>
              </div>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #EDE8E2", margin: "0 0 22px" }} />
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#899180", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px" }}>💛 Nuestra Historia</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Etiqueta superior">{tf("aboutLabel")}</Field>
                <Field label="Firma / Cierre">{tf("aboutSignature")}</Field>
              </div>
              <Field label="Título / cita principal">{ta("aboutTitle", 2)}</Field>
              <Field label="Texto descriptivo">{ta("aboutText", 4)}</Field>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #EDE8E2", margin: "0 0 22px" }} />
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#899180", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px" }}>💬 Testimonios — Encabezados</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Etiqueta superior">{tf("testimonialsLabel")}</Field>
                <Field label="Título de la sección">{tf("testimonialsTitle")}</Field>
              </div>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #EDE8E2", margin: "0 0 22px" }} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#899180", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px" }}>💌 Newsletter</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Título">{tf("newsletterTitle")}</Field>
                <Field label="Subtítulo">{tf("newsletterText")}</Field>
                <Field label="Texto del botón">{tf("newsletterBtnText")}</Field>
                <Field label="Placeholder del input">{tf("newsletterInputPlaceholder")}</Field>
              </div>
            </div>
          </div>
        )}

        {/* ── TESTIMONIOS ── */}
        {tab === "testimonials" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "#7A7068", margin: 0 }}>{(form.testimonials || []).length} testimonios</p>
              <button onClick={() => setForm(f => ({ ...f, testimonials: [...(f.testimonials || []), { name: "Nueva clienta", role: "Mamá feliz", text: "Excelente calidad y atención...", avatar: "N", bg: "#F5EEEC" }] }))}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", borderRadius: 100, background: "#899180", color: "white", border: "none", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
                <Icon d={Icons.plus} size={13} /> Agregar testimonio
              </button>
            </div>
            {(form.testimonials || []).map((t, i) => (
              <div key={i} style={{ background: "#FAFAF8", borderRadius: 10, padding: 18, marginBottom: 14, border: "1px solid #EDE8E2" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#A89888", textTransform: "uppercase", letterSpacing: "1px" }}>Testimonio #{i + 1}</span>
                  <button onClick={() => setForm(f => ({ ...f, testimonials: f.testimonials.filter((_, j) => j !== i) }))} style={{ background: "none", border: "none", cursor: "pointer", color: "#C07070", display: "flex" }}><Icon d={Icons.x} size={14} /></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Field label="Nombre"><input value={t.name} onChange={e => updT(i, "name", e.target.value)} style={{ ...iS }} /></Field>
                  <Field label="Rol / Descripción"><input value={t.role} onChange={e => updT(i, "role", e.target.value)} style={{ ...iS }} /></Field>
                  <Field label="Inicial del avatar (1-2 chars)"><input value={t.avatar} onChange={e => updT(i, "avatar", e.target.value)} style={{ ...iS }} maxLength={2} /></Field>
                  <ColorInput label="Color de fondo" value={t.bg || "#F5EEEC"} onChange={v => updT(i, "bg", v)} />
                  <div style={{ gridColumn: "1/-1" }}><Field label="Texto del testimonio"><textarea value={t.text} onChange={e => updT(i, "text", e.target.value)} style={{ ...iS, resize: "vertical", minHeight: 60 }} /></Field></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── BENEFICIOS ── */}
        {tab === "benefits" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "#7A7068", margin: 0 }}>{(form.benefits || []).length} beneficios</p>
              <button onClick={() => setForm(f => ({ ...f, benefits: [...(f.benefits || []), { icon: "✨", title: "Nuevo beneficio", desc: "Descripción breve" }] }))}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 16px", borderRadius: 100, background: "#899180", color: "white", border: "none", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
                <Icon d={Icons.plus} size={13} /> Agregar
              </button>
            </div>
            <Field label="Color de fondo de la sección">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <ColorInput label="" value={form.benefitsBgColor || "#3D3830"} onChange={v => setForm(f => ({ ...f, benefitsBgColor: v }))} />
              </div>
            </Field>
            {(form.benefits || []).map((b, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr 2fr auto", gap: 10, alignItems: "center", background: "#FAFAF8", borderRadius: 10, padding: "12px 16px", marginBottom: 10, border: "1px solid #EDE8E2" }}>
                <Field label="Emoji"><input value={b.icon} onChange={e => updB(i, "icon", e.target.value)} style={{ ...iS, fontSize: 20, textAlign: "center" }} /></Field>
                <Field label="Título"><input value={b.title} onChange={e => updB(i, "title", e.target.value)} style={iS} /></Field>
                <Field label="Descripción"><input value={b.desc} onChange={e => updB(i, "desc", e.target.value)} style={iS} /></Field>
                <button onClick={() => setForm(f => ({ ...f, benefits: f.benefits.filter((_, j) => j !== i) }))} style={{ width: 30, height: 30, borderRadius: 8, background: "none", border: "1.5px solid #FFCDD2", cursor: "pointer", color: "#C07070", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4 }}><Icon d={Icons.trash} size={13} /></button>
              </div>
            ))}
          </div>
        )}

        {/* ── FOOTER ── */}
        {tab === "footer" && (
          <div>
            <div style={{ background: "#EDF0EC", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#6B7264", marginBottom: 18 }}>
              💡 Las columnas del footer, los métodos de pago y el copyright son totalmente editables.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ gridColumn: "1/-1" }}><Field label="Tagline / descripción bajo el logo">{ta("footerTagline", 2)}</Field></div>
              <Field label="Título columna 1 (Tienda)">{tf("footerCol1Title")}</Field>
              <Field label="Título columna 2 (Ayuda)">{tf("footerCol2Title")}</Field>
              <Field label="Links columna 1 (separados por |)"><textarea value={form.footerCol1Links || ""} onChange={e => setForm(f => ({ ...f, footerCol1Links: e.target.value }))} style={{ ...iS, resize: "vertical", minHeight: 55 }} placeholder="Recién nacidos|Conjuntos|Accesorios" /></Field>
              <Field label="Links columna 2 (separados por |)"><textarea value={form.footerCol2Links || ""} onChange={e => setForm(f => ({ ...f, footerCol2Links: e.target.value }))} style={{ ...iS, resize: "vertical", minHeight: 55 }} placeholder="Cómo comprar|Envíos|Cambios|FAQ" /></Field>
              <Field label="Texto de copyright">{tf("footerCopyright")}</Field>
              <Field label="Métodos de pago (separados por |)"><input value={form.footerPaymentMethods || ""} onChange={e => setForm(f => ({ ...f, footerPaymentMethods: e.target.value }))} style={iS} placeholder="Yape|Visa|Mastercard|BCP" /></Field>
              <ColorInput label="Color de fondo del footer" value={form.footerBgColor || "#3D3830"} onChange={v => setForm(f => ({ ...f, footerBgColor: v }))} />
            </div>
          </div>
        )}

        {/* ── IMÁGENES ── */}
        {tab === "images" && (
          <div>
            <div style={{ background: "#EDF0EC", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#6B7264", marginBottom: 20 }}>
              💡 Sube imágenes reales para personalizar visualmente tu tienda. JPG o PNG, máx. 3MB cada una.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <SingleImageUploader image={form.logoImage || ""} onChange={img => setForm(f => ({ ...f, logoImage: img }))} label="🏷️ Logo de la tienda" placeholder="PNG con fondo transparente · Máx. 3MB" />
              <SingleImageUploader image={form.heroImage || ""} onChange={img => setForm(f => ({ ...f, heroImage: img }))} label="🏠 Imagen del Hero (lado derecho)" placeholder="Foto de bebé o producto · Se recomienda vertical" />
              <SingleImageUploader image={form.aboutImage || ""} onChange={img => setForm(f => ({ ...f, aboutImage: img }))} label="💛 Imagen sección Nuestra Historia" placeholder="Foto del equipo o proceso" />
              <div>
                <Field label="Gradiente de fondo del hero (cuando no hay imagen)">
                  <input value={form.heroBgGradient || ""} onChange={e => setForm(f => ({ ...f, heroBgGradient: e.target.value }))} style={iS} placeholder="linear-gradient(160deg, #F5EEEC, #F5F2EE, #EDF0EC)" />
                </Field>
                <div style={{ height: 80, borderRadius: 8, background: form.heroBgGradient || "linear-gradient(160deg, #F5EEEC, #F5F2EE, #EDF0EC)", marginTop: 8, border: "1px solid #EDE8E2" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── CONTACTO ── */}
        {tab === "contact" && (
          <div>
            <div style={{ background: "#EDF0EC", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#6B7264", marginBottom: 18 }}>
              💡 Esta información aparece en el footer, el botón de WhatsApp y los correos automáticos.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Nombre de la tienda"><input value={form.storeName || ""} onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))} style={iS} /></Field>
              <Field label="Tagline / Eslogan"><input value={form.tagline || ""} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} style={iS} /></Field>
              <Field label="WhatsApp (con código de país)"><input value={form.whatsapp || ""} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} style={iS} placeholder="51999999999" /></Field>
              <Field label="Correo electrónico"><input value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={iS} /></Field>
              <Field label="Dirección"><input value={form.address || ""} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={iS} /></Field>
              <Field label="Monto para envío gratis (S/.)"><input type="number" value={form.freeShipping || ""} onChange={e => setForm(f => ({ ...f, freeShipping: parseFloat(e.target.value) }))} style={iS} /></Field>
              <Field label="Instagram (URL completa)"><input value={form.instagram || ""} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} style={iS} /></Field>
              <Field label="TikTok (URL completa)"><input value={form.tiktok || ""} onChange={e => setForm(f => ({ ...f, tiktok: e.target.value }))} style={iS} /></Field>
              <Field label="Facebook (URL completa)"><input value={form.facebook || ""} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))} style={iS} /></Field>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function AdminVisualEditor({ config, setConfig }) {
  const toast = useToast();
  const [form, setForm] = useState({ ...config });
  const save = () => { setConfig({ ...form }); toast("✅ Diseño actualizado — visible en la tienda ahora mismo"); };

  const iS = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #D8D0C8", background: "#FAFAF8", color: "#3D3830", fontSize: 13, outline: "none", boxSizing: "border-box" };

  const PREVIEW_SERIF = `"${form.fontHeading || "Cormorant Garamond"}", serif`;
  const PREVIEW_SANS  = `"${form.fontBody    || "DM Sans"}", system-ui, sans-serif`;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "serif", fontSize: 26, color: "#3D3830", margin: "0 0 3px" }}>Diseño Visual</h2>
          <p style={{ color: "#A89888", fontSize: 12, margin: 0 }}>Cambia colores, fuentes y estilos de toda la tienda sin tocar código.</p>
        </div>
        <button onClick={save} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 24px", borderRadius: 100, background: "#899180", color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          <Icon d={Icons.save} size={14} /> Guardar diseño
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* LEFT: Colors */}
        <div>
          <div style={{ background: "white", borderRadius: 12, padding: 22, border: "1px solid #EDE8E2", marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#899180", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px" }}>🎨 Colores principales</p>
            <ColorInput label="Color primario (navbar, badges, acentos)" value={form.primaryColor || "#899180"} onChange={v => setForm(f => ({ ...f, primaryColor: v }))} />
            <ColorInput label="Color de acento (detalles, gradientes)" value={form.accentColor || "#B5A99A"} onChange={v => setForm(f => ({ ...f, accentColor: v }))} />
          </div>

          <div style={{ background: "white", borderRadius: 12, padding: 22, border: "1px solid #EDE8E2", marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#899180", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px" }}>🔘 Botones</p>
            <ColorInput label="Color de fondo de botones" value={form.buttonColor || form.primaryColor || "#899180"} onChange={v => setForm(f => ({ ...f, buttonColor: v }))} />
            <ColorInput label="Color del texto en botones" value={form.buttonTextColor || "#FFFFFF"} onChange={v => setForm(f => ({ ...f, buttonTextColor: v }))} />
            <ColorInput label="Color botón hero (principal)" value={form.heroBtn1Color || form.buttonColor || "#899180"} onChange={v => setForm(f => ({ ...f, heroBtn1Color: v }))} />
            <ColorInput label="Color texto botón hero" value={form.heroBtn1TextColor || "#FFFFFF"} onChange={v => setForm(f => ({ ...f, heroBtn1TextColor: v }))} />
            <ColorInput label="Borde botón secundario hero" value={form.heroBtn2BorderColor || "#D8D0C8"} onChange={v => setForm(f => ({ ...f, heroBtn2BorderColor: v }))} />
            <ColorInput label="Color texto botón secundario hero" value={form.heroBtn2TextColor || "#3D3830"} onChange={v => setForm(f => ({ ...f, heroBtn2TextColor: v }))} />
          </div>

          <div style={{ background: "white", borderRadius: 12, padding: 22, border: "1px solid #EDE8E2" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#899180", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px" }}>📝 Tipografía y fondos</p>
            <ColorInput label="Color de encabezados / títulos" value={form.headingColor || "#3D3830"} onChange={v => setForm(f => ({ ...f, headingColor: v }))} />
            <ColorInput label="Color de texto general" value={form.textColor || "#7A7068"} onChange={v => setForm(f => ({ ...f, textColor: v }))} />
            <ColorInput label="Color de fondo del sitio" value={form.bgColor || "#FAFAF8"} onChange={v => setForm(f => ({ ...f, bgColor: v }))} />
            <ColorInput label="Color de fondo de tarjetas" value={form.cardBgColor || "#FFFFFF"} onChange={v => setForm(f => ({ ...f, cardBgColor: v }))} />
            <ColorInput label="Color de bordes / líneas divisoras" value={form.borderColor || "#EDE8E2"} onChange={v => setForm(f => ({ ...f, borderColor: v }))} />
            <ColorInput label="Color de fondo navbar" value={form.navBgColor?.replace("rgba(250,250,248,0.96)", "#FAFAF8") || "#FAFAF8"} onChange={v => setForm(f => ({ ...f, navBgColor: v }))} />
            <ColorInput label="Color de texto navbar" value={form.navTextColor || "#3D3830"} onChange={v => setForm(f => ({ ...f, navTextColor: v }))} />
            <ColorInput label="Color activo navbar" value={form.navActiveColor || "#899180"} onChange={v => setForm(f => ({ ...f, navActiveColor: v }))} />
          </div>
        </div>

        {/* RIGHT: Typography + Preview + Payments */}
        <div>
          <div style={{ background: "white", borderRadius: 12, padding: 22, border: "1px solid #EDE8E2", marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#899180", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px" }}>🔤 Tipografía</p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#7A7068", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Fuente para títulos y headings</label>
              <select value={form.fontHeading || "Cormorant Garamond"} onChange={e => setForm(f => ({ ...f, fontHeading: e.target.value }))} style={{ ...iS, cursor: "pointer" }}>
                <option value="Cormorant Garamond">Cormorant Garamond — elegante y delicada</option>
                <option value="Playfair Display">Playfair Display — clásica y refinada</option>
                <option value="Georgia">Georgia — serif tradicional</option>
                <option value="DM Sans">DM Sans — moderna y limpia</option>
                <option value="Inter">Inter — profesional y neutral</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#7A7068", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Fuente para texto y párrafos</label>
              <select value={form.fontBody || "DM Sans"} onChange={e => setForm(f => ({ ...f, fontBody: e.target.value }))} style={{ ...iS, cursor: "pointer" }}>
                <option value="DM Sans">DM Sans — moderna y legible</option>
                <option value="Inter">Inter — profesional y limpia</option>
                <option value="Lato">Lato — amigable y suave</option>
                <option value="Open Sans">Open Sans — muy legible</option>
                <option value="Nunito">Nunito — redondeada y cálida</option>
              </select>
            </div>
          </div>

          {/* Live Preview */}
          <div style={{ background: "white", borderRadius: 12, padding: 22, border: "1px solid #EDE8E2", marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#899180", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 14px" }}>👁️ Vista previa en tiempo real</p>
            <div style={{ background: form.bgColor || "#FAFAF8", borderRadius: 10, padding: 20, border: "1px solid #EDE8E2" }}>
              <div style={{ background: form.promoBannerColor || "#3D3830", color: form.promoBannerTextColor || "#FAFAF8", textAlign: "center", padding: "6px 12px", borderRadius: 6, marginBottom: 12, fontSize: 11 }}>Barra de promoción</div>
              <p style={{ fontSize: 10, color: form.primaryColor || "#899180", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px", fontWeight: 600, fontFamily: PREVIEW_SANS }}>Etiqueta de sección</p>
              <h3 style={{ fontFamily: PREVIEW_SERIF, fontSize: 24, fontWeight: 300, color: form.headingColor || "#3D3830", margin: "0 0 8px" }}>Título de ejemplo</h3>
              <p style={{ fontFamily: PREVIEW_SANS, color: form.textColor || "#7A7068", fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>Este es un texto de ejemplo para ver cómo quedará el contenido de tu tienda con la configuración visual actual.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={{ padding: "9px 20px", borderRadius: 2, background: form.buttonColor || form.primaryColor || "#899180", color: form.buttonTextColor || "white", border: "none", fontSize: 12, fontWeight: 600, fontFamily: PREVIEW_SANS }}>Botón principal</button>
                <button style={{ padding: "9px 18px", borderRadius: 2, background: "transparent", color: form.heroBtn2TextColor || form.headingColor || "#3D3830", border: `1px solid ${form.heroBtn2BorderColor || "#D8D0C8"}`, fontSize: 12, fontFamily: PREVIEW_SANS }}>Botón secundario</button>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ background: (form.primaryColor || "#899180") + "20", color: form.primaryColor || "#899180", padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>Badge</span>
                <span style={{ color: form.textColor || "#7A7068", fontSize: 11, fontFamily: PREVIEW_SANS, opacity: 0.7 }}>Texto secundario</span>
              </div>
            </div>
          </div>

          {/* Payments */}
          <div style={{ background: "white", borderRadius: 12, padding: 22, border: "1px solid #EDE8E2" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#899180", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 14px" }}>💳 Métodos de pago</p>
            <div style={{ background: "#EDF0EC", borderRadius: 8, padding: "9px 13px", marginBottom: 14, fontSize: 12, color: "#6B7264" }}>Yape siempre disponible. Activa pasarelas adicionales aquí.</div>
            {[
              { key: "stripe", label: "💳 Stripe — Tarjetas de crédito/débito", kf: "stripeKey", ph: "sk_live_..." },
              { key: "mp", label: "🟡 MercadoPago — Perú y Latinoamérica", kf: "mpKey", ph: "APP_USR-..." },
              { key: "paypal", label: "💙 PayPal — Internacional", kf: "paypalId", ph: "AXxxxxxxx..." },
            ].map(gw => (
              <div key={gw.key} style={{ border: `1.5px solid ${form[gw.key + "Enabled"] ? "#899180" : "#EDE8E2"}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: form[gw.key + "Enabled"] ? 12 : 0 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: "#3D3830" }}>{gw.label}</span>
                  <div onClick={() => setForm(f => ({ ...f, [gw.key + "Enabled"]: !f[gw.key + "Enabled"] }))} style={{ width: 44, height: 24, borderRadius: 100, background: form[gw.key + "Enabled"] ? "#899180" : "#D8D0C8", position: "relative", cursor: "pointer", flexShrink: 0 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: form[gw.key + "Enabled"] ? 22 : 4, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
                  </div>
                </div>
                {form[gw.key + "Enabled"] && (
                  <Field label="Clave API">
                    <input type="password" value={form[gw.kf] || ""} onChange={e => setForm(f => ({ ...f, [gw.kf]: e.target.value }))} style={{ ...iS }} placeholder={gw.ph} />
                  </Field>
                )}
              </div>
            ))}
            <div style={{ background: "linear-gradient(135deg, #F5EEF8, #EDE0F8)", borderRadius: 10, padding: 14, border: "1.5px solid #CE93D8" }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: "#7B1FA2", margin: "0 0 3px" }}>💜 Yape — Siempre activo</p>
              <p style={{ fontSize: 12, color: "#9C27B0", margin: 0 }}>Al pagar con Yape el cliente va a WhatsApp con el número: <strong>{form.whatsapp}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminSettings({ config, setConfig }) {
  return <AdminVisualEditor config={config} setConfig={setConfig} />;
}

function AdminClients({ orders, setOrders }) {
  const toast = useToast();
  const [blockedEmails, setBlockedEmails] = useState([]);
  const [confirm, setConfirm] = useState(null); // { type: "delete"|"block"|"unblock", email, name }
  const [showBlocked, setShowBlocked] = useState(false);

  // Load blocked list from storage on mount
  useEffect(() => {
    storage.get("vk_blocked_clients").then(v => { if (v) setBlockedEmails(v); });
  }, []);

  const saveBlocked = async (list) => {
    setBlockedEmails(list);
    await storage.set("vk_blocked_clients", list);
  };

  const handleBlock = (email) => {
    const next = blockedEmails.includes(email) ? blockedEmails.filter(e => e !== email) : [...blockedEmails, email];
    saveBlocked(next);
    toast(blockedEmails.includes(email) ? "✅ Cliente desbloqueado" : "🚫 Cliente bloqueado");
  };

  const handleDelete = (email) => {
    setOrders(o => o.filter(x => x.customerEmail !== email));
    saveBlocked(blockedEmails.filter(e => e !== email));
    toast("🗑️ Historial del cliente eliminado");
  };

  const clients = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      if (!map[o.customerEmail]) map[o.customerEmail] = { email: o.customerEmail, name: o.customerName, phone: o.customerPhone, orders: 0, spent: 0, lastOrder: 0 };
      map[o.customerEmail].orders++;
      map[o.customerEmail].spent += o.total;
      if (o.createdAt > map[o.customerEmail].lastOrder) map[o.customerEmail].lastOrder = o.createdAt;
    });
    return Object.values(map).sort((a, b) => b.spent - a.spent);
  }, [orders]);

  const visibleClients = showBlocked ? clients : clients.filter(c => !blockedEmails.includes(c.email));
  const blockedCount = blockedEmails.length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: FONT.serif, fontSize: 28, color: C.charcoal, margin: "0 0 4px" }}>Clientes</h2>
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>{clients.length} registrados · {blockedCount > 0 ? `${blockedCount} bloqueados` : "ninguno bloqueado"}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {blockedCount > 0 && (
            <button onClick={() => setShowBlocked(v => !v)} style={{ padding: "10px 20px", borderRadius: 100, border: `1.5px solid ${C.beigeDark}`, background: showBlocked ? C.charcoal : "transparent", color: showBlocked ? "white" : C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {showBlocked ? "Ocultar bloqueados" : `Ver bloqueados (${blockedCount})`}
            </button>
          )}
          <div style={{ background: C.beige, padding: "10px 20px", borderRadius: 100, fontSize: 13, color: C.muted, fontWeight: 600 }}>{clients.length} clientes</div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, fontSize: 12, color: C.muted }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: "#F8D7DA" }} />
          <span>Bloqueado — no puede comprar en la tienda</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon d={Icons.trash} size={12} style={{ color: C.danger }} />
          <span>Eliminar — borra todo el historial de pedidos</span>
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: 20, boxShadow: "0 4px 24px rgba(139,110,82,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.linen }}>
              {["#", "Cliente", "Email", "Teléfono", "Pedidos", "Total gastado", "Último pedido", "Acciones"].map(h => (
                <th key={h} style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: "1px", padding: "14px 16px", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleClients.map((c, i) => {
              const isBlocked = blockedEmails.includes(c.email);
              return (
                <tr key={c.email} style={{ borderTop: `1px solid ${C.beige}`, background: isBlocked ? "#FFF5F5" : "transparent", opacity: isBlocked ? 0.75 : 1 }}>
                  <td style={{ padding: "14px 16px" }}>
                    {i < 3 && !isBlocked && <span style={{ fontSize: 18 }}>{["🥇","🥈","🥉"][i]}</span>}
                    {(i >= 3 || isBlocked) && <span style={{ fontSize: 14, color: C.faint, fontWeight: 700 }}>#{i+1}</span>}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: isBlocked ? "#F8D7DA" : C.roseLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: isBlocked ? C.danger : C.roseDeep }}>
                        {isBlocked ? "🚫" : c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: 14, color: C.charcoal }}>{c.name}</span>
                        {isBlocked && <div style={{ fontSize: 10, color: C.danger, fontWeight: 700 }}>BLOQUEADO</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: C.muted }}>{c.email}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: C.muted }}>{c.phone || "-"}</td>
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <span style={{ background: C.roseLight, color: C.roseDeep, padding: "4px 12px", borderRadius: 100, fontSize: 13, fontWeight: 700 }}>{c.orders}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: 700, color: C.brown }}>S/. {c.spent.toFixed(2)}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: C.faint }}>{new Date(c.lastOrder).toLocaleDateString("es-PE")}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {/* Block / Unblock */}
                      <button
                        onClick={() => setConfirm({ type: isBlocked ? "unblock" : "block", email: c.email, name: c.name })}
                        title={isBlocked ? "Desbloquear cliente" : "Bloquear cliente"}
                        style={{ width: 34, height: 34, borderRadius: 10, border: `1.5px solid ${isBlocked ? C.success : "#FFB0B0"}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: isBlocked ? C.success : C.warning, fontSize: 14 }}>
                        {isBlocked ? "✅" : "🚫"}
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => setConfirm({ type: "delete", email: c.email, name: c.name })}
                        title="Eliminar historial del cliente"
                        style={{ width: 34, height: 34, borderRadius: 10, border: "1.5px solid #FFCDD2", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.danger }}>
                        <Icon d={Icons.trash} size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visibleClients.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: C.faint }}>No hay clientes para mostrar</div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={
          confirm?.type === "delete" ? "🗑️ Eliminar historial" :
          confirm?.type === "block" ? "🚫 Bloquear cliente" : "✅ Desbloquear cliente"
        }
        message={
          confirm?.type === "delete"
            ? `¿Segura que quieres eliminar TODOS los pedidos de "${confirm?.name}"? Esta acción no se puede deshacer.`
            : confirm?.type === "block"
            ? `¿Bloquear a "${confirm?.name}"? Su historial se conserva pero quedará marcado.`
            : `¿Desbloquear a "${confirm?.name}"? Podrá volver a comprar con normalidad.`
        }
        danger={confirm?.type === "delete"}
        onConfirm={() => {
          if (confirm?.type === "delete") handleDelete(confirm.email);
          else handleBlock(confirm.email);
        }}
      />
    </div>
  );
}

// ─── ADMIN REVIEWS ────────────────────────────────────────────────────────────
function AdminReviews({ products }) {
  const sampleReviews = [
    { id: "r1", productId: "p1", productName: "Set Bodysuit Algodón", author: "María García", rating: 5, text: "Increíblemente suave, mi bebé lo ama.", date: Date.now() - 86400000 * 3, approved: true },
    { id: "r2", productId: "p2", productName: "Conjunto Floral Niña", author: "Luciana Pérez", rating: 5, text: "Exactamente como en las fotos. Llegó rápido.", date: Date.now() - 86400000 * 2, approved: true },
    { id: "r3", productId: "p5", productName: "Manta Muslina Premium", author: "Camila R.", rating: 5, text: "La mejor manta que he comprado. Ultra suave.", date: Date.now() - 86400000, approved: false },
  ];
  const [reviews, setReviews] = useState(sampleReviews);
  const toast = useToast();

  return (
    <div>
      <h2 style={{ fontFamily: FONT.serif, fontSize: 28, color: C.charcoal, margin: "0 0 28px" }}>Reseñas de clientes</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {reviews.map(r => (
          <div key={r.id} style={{ background: C.white, borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(139,110,82,0.08)", display: "flex", gap: 20, alignItems: "flex-start", borderLeft: `4px solid ${r.approved ? C.success : C.warning}` }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.roseLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: C.roseDeep, fontSize: 16, flexShrink: 0 }}>{r.author[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: C.charcoal }}>{r.author}</span>
                  <span style={{ fontSize: 12, color: C.faint, marginLeft: 10 }}>en <strong>{r.productName}</strong></span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Stars rating={r.rating} />
                  <span style={{ fontSize: 11, color: C.faint }}>{new Date(r.date).toLocaleDateString("es-PE")}</span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: "0 0 12px" }}>"{r.text}"</p>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: r.approved ? "#D4EDDA" : "#FFF3CD", color: r.approved ? "#155724" : "#856404" }}>
                  {r.approved ? "✅ Aprobada" : "⏳ Pendiente"}
                </span>
                <button onClick={() => { setReviews(rv => rv.map(x => x.id === r.id ? { ...x, approved: !x.approved } : x)); toast(r.approved ? "Reseña ocultada" : "✅ Reseña aprobada"); }}
                  style={{ padding: "4px 14px", borderRadius: 100, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 600, color: C.muted }}>
                  {r.approved ? "Ocultar" : "Aprobar"}
                </button>
                <button onClick={() => { setReviews(rv => rv.filter(x => x.id !== r.id)); toast("Reseña eliminada"); }}
                  style={{ padding: "4px 14px", borderRadius: 100, border: "1.5px solid #FFCDD2", background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 600, color: C.danger }}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast("Completa todos los campos", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (form.password === "admin123") { onLogin(); toast("¡Bienvenida al panel! 👋"); }
      else toast("Contraseña incorrecta. Usa: admin123", "error");
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.linen, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ background: C.white, borderRadius: 28, padding: 48, width: "100%", maxWidth: 440, boxShadow: "0 32px 80px rgba(139,110,82,0.15)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
          <h1 style={{ fontFamily: FONT.serif, fontSize: 32, color: C.charcoal, margin: "0 0 8px" }}>Panel Admin</h1>
          <p style={{ color: C.faint, fontSize: 14, margin: 0 }}>Venetus Kids — Acceso administrativo</p>
        </div>
        <form onSubmit={submit}>
          <Field label="Correo electrónico"><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} placeholder="admin@venetuskids.pe" /></Field>
          <Field label="Contraseña">
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} placeholder="••••••••" />
          </Field>
          <div style={{ background: C.beige, borderRadius: 12, padding: "10px 16px", marginBottom: 20, fontSize: 12, color: C.muted }}>
            💡 Demo: usa cualquier email y contraseña <strong>admin123</strong>
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "15px", borderRadius: 100, background: loading ? C.muted : `linear-gradient(135deg, ${C.roseDeep}, ${C.sand})`, color: "white", border: "none", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 8px 24px rgba(212,137,138,0.35)" }}>
            {loading ? "Verificando..." : "🔐 Ingresar al panel"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ products, setProducts, categories, setCategories, orders, setOrders, coupons, setCoupons, config, setConfig, onExitAdmin }) {
  const [section, setSection] = useState("dashboard");
  const navItems = [
    { id: "dashboard",  icon: Icons.grid,     label: "Dashboard" },
    { id: "products",   icon: Icons.package,  label: "Productos" },
    { id: "orders",     icon: Icons.cart,     label: "Pedidos" },
    { id: "categories", icon: Icons.tag,      label: "Categorías" },
    { id: "coupons",    icon: Icons.ticket,   label: "Cupones" },
    { id: "reviews",    icon: Icons.star,     label: "Reseñas" },
    { id: "clients",    icon: Icons.users,    label: "Clientes" },
    { id: "pageeditor", icon: Icons.save,     label: "📝 Editor de Página", badge: "CMS" },
    { id: "visual",     icon: Icons.sun,      label: "🎨 Diseño Visual",    badge: "CMS" },
    { id: "settings",   icon: Icons.settings, label: "⚙️ Config. Técnica" },
  ]
  const pendingOrders = orders.filter(o => o.status === "PENDING").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.linen }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: C.charcoal, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
        <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 20, fontWeight: 600, color: C.cream }}>Venetus <span style={{ color: C.rose }}>Kids</span></div>
          <div style={{ fontSize: 11, color: "rgba(250,246,240,0.4)", marginTop: 2 }}>Panel Administrador</div>
        </div>
        <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
          {navItems.map(({ id, icon, label, badge }) => (
            <button key={id} onClick={() => setSection(id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 14, border: "none", background: section === id ? "rgba(255,255,255,0.12)" : "transparent", color: section === id ? "white" : "rgba(250,246,240,0.55)", fontWeight: section === id ? 600 : 400, fontSize: 13, cursor: "pointer", marginBottom: 2, position: "relative", textAlign: "left" }}>
              <Icon d={icon} size={16} />
              {label}
              {id === "orders" && pendingOrders > 0 && <span style={{ position: "absolute", right: 12, background: C.roseDeep, color: "white", fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 100 }}>{pendingOrders}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={onExitAdmin} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 14, border: "none", background: "transparent", color: "rgba(250,246,240,0.5)", cursor: "pointer", fontSize: 13 }}>
            <Icon d={Icons.home} size={16} /> Ver tienda
          </button>
          <button onClick={onExitAdmin} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 14, border: "none", background: "transparent", color: "rgba(250,246,240,0.4)", cursor: "pointer", fontSize: 13 }}>
            <Icon d={Icons.logout} size={16} /> Salir del admin
          </button>
        </div>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "auto" }}>
        <div style={{ padding: "32px" }}>
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              {section === "dashboard" && <AdminDashboard products={products} orders={orders} categories={categories} config={config} />}
              {section === "products" && <AdminProducts products={products} setProducts={setProducts} categories={categories} />}
              {section === "orders" && <AdminOrders orders={orders} setOrders={setOrders} />}
              {section === "categories" && <AdminCategories categories={categories} setCategories={setCategories} products={products} />}
              {section === "coupons" && <AdminCoupons coupons={coupons} setCoupons={setCoupons} />}
              {section === "reviews" && <AdminReviews products={products} />}
              {section === "clients" && <AdminClients orders={orders} setOrders={setOrders} />}
              {section === "pageeditor" && <AdminPageEditor config={config} setConfig={setConfig} />}
        {section === "visual" && <AdminVisualEditor config={config} setConfig={setConfig} />}
        {section === "settings" && <AdminSettings config={config} setConfig={setConfig} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("store"); // "store" | "admin" | "admin-login"
  const [products, setProductsRaw] = useState(INIT_PRODUCTS);
  const [categories, setCategoriesRaw] = useState(INIT_CATEGORIES);
  const [orders, setOrdersRaw] = useState(INIT_ORDERS);
  const [coupons, setCouponsRaw] = useState(INIT_COUPONS);
  const [config, setConfigRaw] = useState(INIT_CONFIG);
  const [cart, setCartRaw] = useState([]);
  const [wishlist, setWishlistRaw] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Persist helpers
  const makeSetter = (key, setter) => useCallback(async (val) => {
    const v = typeof val === "function" ? val(await storage.get(key) || []) : val;
    setter(typeof val === "function" ? val : val);
    await storage.set(key, typeof val === "function" ? v : val);
  }, []);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      const [p, c, o, cp, cf, cart, wl] = await Promise.all([
        storage.get("vk_products"), storage.get("vk_categories"),
        storage.get("vk_orders"), storage.get("vk_coupons"),
        storage.get("vk_config"), storage.get("vk_cart"), storage.get("vk_wishlist"),
      ]);
      if (p) setProductsRaw(p);
      if (c) setCategoriesRaw(c);
      if (o) setOrdersRaw(o);
      if (cp) setCouponsRaw(cp);
      if (cf) setConfigRaw({
          ...INIT_CONFIG,
          ...cf,
          testimonials: cf.testimonials?.length ? cf.testimonials : INIT_CONFIG.testimonials,
          benefits: cf.benefits?.length ? cf.benefits : INIT_CONFIG.benefits,
        });
      if (cart) setCartRaw(cart);
      if (wl) setWishlistRaw(wl);
      setLoaded(true);
    })();
  }, []);

  // Setters that also persist
  const setProducts = async (val) => { const v = typeof val === "function" ? val(products) : val; setProductsRaw(v); await storage.set("vk_products", v); };
  const setCategories = async (val) => { const v = typeof val === "function" ? val(categories) : val; setCategoriesRaw(v); await storage.set("vk_categories", v); };
  const setOrders = async (val) => { const v = typeof val === "function" ? val(orders) : val; setOrdersRaw(v); await storage.set("vk_orders", v); };
  const setCoupons = async (val) => { const v = typeof val === "function" ? val(coupons) : val; setCouponsRaw(v); await storage.set("vk_coupons", v); };
  const setConfig = async (val) => { const v = typeof val === "function" ? val(config) : val; setConfigRaw(v); await storage.set("vk_config", v); };
  const setCart = async (val) => { const v = typeof val === "function" ? val(cart) : val; setCartRaw(v); await storage.set("vk_cart", v); };
  const setWishlist = async (val) => { const v = typeof val === "function" ? val(wishlist) : val; setWishlistRaw(v); await storage.set("vk_wishlist", v); };

  if (!loaded) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.white }}>
      <div style={{ textAlign: "center" }}>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: 64, marginBottom: 20 }}>👶🏻</motion.div>
        <p style={{ fontFamily: FONT.serif, fontSize: 20, color: C.muted }}>Cargando Venetus Kids...</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: FONT.sans, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input, select, textarea, button { font-family: inherit; }
        input:focus, select:focus, textarea:focus { border-color: ${C.roseDeep} !important; box-shadow: 0 0 0 3px ${C.roseDeep}22; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${C.beige}; } ::-webkit-scrollbar-thumb { background: ${C.beigeDark}; border-radius: 3px; }
      `}</style>

      {/* Admin button (floating, store only) */}
      {view === "store" && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setView("admin-login")}
          style={{ position: "fixed", bottom: 32, left: 32, zIndex: 600, background: C.charcoal, color: "white", border: "none", borderRadius: 100, padding: "12px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
          <Icon d={Icons.settings} size={15} /> Panel Admin
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {view === "store" && (
          <motion.div key="store" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Storefront products={products} categories={categories} config={config} coupons={coupons} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} orders={orders} setOrders={setOrders} />
          </motion.div>
        )}
        {view === "admin-login" && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AdminLogin onLogin={() => setView("admin")} />
            <button onClick={() => setView("store")} style={{ position: "fixed", top: 20, left: 20, background: "rgba(255,255,255,0.8)", border: "none", borderRadius: 100, padding: "10px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.muted, backdropFilter: "blur(10px)" }}>← Volver a la tienda</button>
          </motion.div>
        )}
        {view === "admin" && (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AdminPanel products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} orders={orders} setOrders={setOrders} coupons={coupons} setCoupons={setCoupons} config={config} setConfig={setConfig} onExitAdmin={() => setView("store")} />
          </motion.div>
        )}
      </AnimatePresence>

      <Toast />
    </div>
  );
}
