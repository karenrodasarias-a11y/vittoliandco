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
  storeName: "Venetus Kids", tagline: "Pequeños momentos, grandes recuerdos 💛",
  heroTitle: "Para los primeros momentos\nde tu bebé",
  heroSubtitle: "Ropa y accesorios cómodos, seguros y adorables para acompañar cada etapa de tu bebé.",
  promoBanner: "🎀 ENVÍO GRATIS en compras mayores a S/. 150 · Usa el código VENETUS20 para 20% OFF",
  promoActive: true, whatsapp: "51999999999",
  instagram: "https://instagram.com/venetuskids.pe",
  tiktok: "https://tiktok.com/@venetuskids",
  facebook: "https://facebook.com/venetuskids",
  email: "hola@venetuskids.pe",
  address: "Lima, Perú", freeShipping: 150, currency: "S/.",
  primaryColor: "#899180", accentColor: "#B5A99A",
  stripeKey: "", mpKey: "", paypalId: "",
  stripeEnabled: false, mpEnabled: false, paypalEnabled: false,
};

const INIT_CATEGORIES = [
  { id: "cat1", name: "Recién nacidos", slug: "recien-nacidos", emoji: "👼", color: "#FAE8E8", count: 3 },
  { id: "cat2", name: "Conjuntos & Outfits", slug: "conjuntos", emoji: "👕", color: "#D4E8F0", count: 2 },
  { id: "cat3", name: "Accesorios", slug: "accesorios", emoji: "🎀", color: "#F0E8D4", count: 2 },
  { id: "cat4", name: "Zapatos para bebé", slug: "zapatos", emoji: "👟", color: "#EDE8F5", count: 1 },
  { id: "cat5", name: "Mantas & Esenciales", slug: "mantas", emoji: "🧸", color: "#E8F5E8", count: 1 },
  { id: "cat6", name: "Regalos Baby Shower", slug: "baby-shower", emoji: "🎁", color: "#F5F0D4", count: 1 },
];

const INIT_PRODUCTS = [
  { id: "p1", name: "Set Bodysuit Algodón", slug: "set-bodysuit", desc: "Pack de 3 bodys ultra suaves de algodón orgánico 100% hipoalergénico. Ideales para los primeros meses.", price: 89.90, oldPrice: null, stock: 50, categoryId: "cat1", badge: "nuevo", emoji: "👶", bg: "#FAE8E8", featured: true, active: true, rating: 5, reviews: 124, createdAt: Date.now() - 86400000 * 5 },
  { id: "p2", name: "Conjunto Floral Niña", slug: "conjunto-floral", desc: "Blusa + shorts florales para niñas de 3 a 24 meses. Tela fresca y cómoda para todo el día.", price: 125.00, oldPrice: 160.00, stock: 30, categoryId: "cat2", badge: "oferta", emoji: "👗", bg: "#F2C4C4", featured: true, active: true, rating: 5, reviews: 87, createdAt: Date.now() - 86400000 * 4 },
  { id: "p3", name: "Gorro de Punto Suave", slug: "gorro-punto", desc: "Gorro tejido a mano de acrílico premium, suave y transpirable. Disponible en múltiples colores.", price: 45.00, oldPrice: null, stock: 80, categoryId: "cat3", badge: "mas_vendido", emoji: "🧢", bg: "#D4E8F0", featured: true, active: true, rating: 4.8, reviews: 56, createdAt: Date.now() - 86400000 * 3 },
  { id: "p4", name: "Zapatos Gateo Cuero", slug: "zapatos-gateo", desc: "Primeros zapatos de cuero natural. Suela antideslizante y cierre fácil. Cuida el desarrollo del pie.", price: 79.90, oldPrice: null, stock: 40, categoryId: "cat4", badge: "mas_vendido", emoji: "👟", bg: "#EDE8F5", featured: true, active: true, rating: 4.9, reviews: 203, createdAt: Date.now() - 86400000 * 2 },
  { id: "p5", name: "Manta Muslina Premium", slug: "manta-muslina", desc: "Manta de muslina 100% algodón orgánico certificado. Doble capa, ultra suave y transpirable.", price: 69.90, oldPrice: 89.90, stock: 60, categoryId: "cat5", badge: "mas_vendido", emoji: "🧸", bg: "#E8F5E8", featured: true, active: true, rating: 5, reviews: 341, createdAt: Date.now() - 86400000 },
  { id: "p6", name: "Kit Baby Shower Lujo", slug: "kit-baby-shower", desc: "Set regalo premium: body, gorro, manoplas, medias y manta en caja de regalo con lazo.", price: 199.00, oldPrice: 250.00, stock: 20, categoryId: "cat6", badge: "oferta", emoji: "🎁", bg: "#F5F0D4", featured: true, active: true, rating: 5, reviews: 68, createdAt: Date.now() - 3600000 * 5 },
  { id: "p7", name: "Pelele Estampado Oso", slug: "pelele-oso", desc: "Pelele de algodón suavísimo con estampado de osito. Con botones a presión para fácil cambio.", price: 55.00, oldPrice: null, stock: 3, categoryId: "cat1", badge: "nuevo", emoji: "🐻", bg: "#FAE8E8", featured: false, active: true, rating: 4.7, reviews: 92, createdAt: Date.now() - 3600000 * 2 },
  { id: "p8", name: "Vincha Lazos Artesanal", slug: "vincha-lazos", desc: "Vincha hecha a mano con lazo de tela. Sin caucho, no aprieta ni irrita el cuero cabelludo.", price: 28.00, oldPrice: null, stock: 100, categoryId: "cat3", badge: "mas_vendido", emoji: "🎀", bg: "#F2C4C4", featured: false, active: true, rating: 4.9, reviews: 178, createdAt: Date.now() - 3600000 },
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
function ProductCard({ product, categories, onAddCart, onWishlist, wishlist = [] }) {
  const [hover, setHover] = useState(false);
  const cat = categories.find(c => c.id === product.categoryId);
  const inWish = wishlist.includes(product.id);
  return (
    <motion.div whileHover={{ y: -8 }} onHoverStart={() => setHover(true)} onHoverEnd={() => setHover(false)}
      style={{ background: C.white, borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 20px rgba(139,110,82,0.08)", cursor: "pointer", position: "relative" }}>
      <div style={{ position: "relative", aspectRatio: "1/1.1", background: product.bg || C.roseLight, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <motion.span animate={{ scale: hover ? 1.1 : 1 }} transition={{ duration: 0.4 }} style={{ fontSize: 72, userSelect: "none" }}>{product.emoji}</motion.span>
        {product.badge && <div style={{ position: "absolute", top: 12, left: 12 }}><Badge badge={product.badge} /></div>}
        <motion.button animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.8 }} onClick={e => { e.stopPropagation(); onWishlist(product.id); }}
          style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", color: inWish ? C.roseDeep : C.muted }}>
          <Icon d={Icons.heart} size={16} />
        </motion.button>
        {product.stock <= 5 && product.stock > 0 && (
          <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: C.warning, color: "white", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>⚡ ¡Últimas {product.stock}!</div>
        )}
        {product.stock === 0 && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ background: C.charcoal, color: "white", padding: "8px 20px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>Sin stock</span>
          </div>
        )}
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 11, color: C.roseDeep, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{cat?.name}</div>
        <div style={{ fontFamily: FONT.serif, fontSize: 18, fontWeight: 600, color: C.charcoal, marginBottom: 8, lineHeight: 1.3 }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: 11, color: C.muted }}>({product.reviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 18, color: C.brown }}>{C.currency || "S/."} {product.price.toFixed(2)}</span>
            {product.oldPrice && <span style={{ fontSize: 12, color: C.muted, textDecoration: "line-through", marginLeft: 8 }}>S/. {product.oldPrice.toFixed(2)}</span>}
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => onAddCart(product)} disabled={product.stock === 0}
            style={{ background: product.stock === 0 ? C.beigeDark : `linear-gradient(135deg, ${C.roseDeep}, ${C.sand})`, color: "white", border: "none", padding: "8px 16px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: product.stock === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon d={Icons.cart} size={13} /> Añadir
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── CART SIDEBAR ──────────────────────────────────────────────────────────
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

  const pc = config.primaryColor || C.sage;
  const ac = config.accentColor || C.sand;

  return (
    <div style={{ background: C.white, fontFamily: FONT.sans }}>

      {/* Promo bar */}
      {config.promoActive && (
        <div style={{ background: C.charcoal, color: "rgba(245,242,238,0.75)", textAlign: "center", padding: "9px 20px", fontSize: 11, letterSpacing: "0.3px", fontFamily: FONT.sans }}>
          {config.promoBanner}
        </div>
      )}

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(250,250,248,0.96)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.linen2}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: FONT.serif, fontSize: 20, fontWeight: 300, color: C.charcoal, letterSpacing: "1px" }}>{config.storeName}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {categories.slice(0, 4).map(cat => (
              <button key={cat.id} onClick={() => { setFilterCat(cat.id); productsRef.current?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: FONT.sans, color: filterCat === cat.id ? pc : C.muted, fontWeight: filterCat === cat.id ? 500 : 400, borderBottom: `1px solid ${filterCat === cat.id ? pc : "transparent"}`, padding: "4px 0", transition: "all 0.15s" }}>
                {cat.name}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", padding: 4 }}>
              <Icon d={Icons.cart} size={19} strokeWidth={1.4} />
              {cartCount > 0 && <span style={{ position: "absolute", top: 1, right: 1, background: pc, color: "white", fontSize: 8, fontWeight: 700, width: 13, height: 13, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <HeroSection config={config} onShop={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })} />

      {/* Categories */}
      <section style={{ padding: "72px 0", background: C.linen, borderTop: `1px solid ${C.linen2}`, borderBottom: `1px solid ${C.linen2}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px", fontWeight: 600, fontFamily: FONT.sans }}>{config.categoriesSectionTitle || "Categorías"}</p>
              <h2 style={{ fontFamily: FONT.serif, fontSize: 28, fontWeight: 300, color: C.charcoal, margin: 0 }}>Explorar colección</h2>
            </div>
            <button onClick={() => productsRef.current?.scrollIntoView({ behavior: "smooth" })} style={{ fontSize: 11, color: pc, background: "none", border: "none", cursor: "pointer", fontFamily: FONT.sans, fontWeight: 500 }}>Ver todo →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                onClick={() => { setFilterCat(cat.id); productsRef.current?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ cursor: "pointer" }}>
                <div style={{ aspectRatio: "3/4", borderRadius: 3, overflow: "hidden", background: cat.color || C.linen, marginBottom: 10, border: filterCat === cat.id ? `2px solid ${pc}` : "2px solid transparent", transition: "border-color 0.15s" }}>
                  {cat.image ? <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{cat.emoji}</div>}
                </div>
                <p style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: filterCat === cat.id ? 600 : 400, color: filterCat === cat.id ? pc : C.charcoal, margin: "0 0 2px", textAlign: "center" }}>{cat.name}</p>
                <p style={{ fontSize: 10, color: C.faint, margin: 0, fontFamily: FONT.sans, textAlign: "center" }}>{products.filter(p => p.categoryId === cat.id && p.active).length} productos</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section ref={productsRef} style={{ padding: "72px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 18 }}>
            <div>
              <p style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px", fontWeight: 600, fontFamily: FONT.sans }}>Colección</p>
              <h2 style={{ fontFamily: FONT.serif, fontSize: 28, fontWeight: 300, color: C.charcoal, margin: 0 }}>{config.productsSectionTitle || "Más queridos"}</h2>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[{ id: "all", name: "Todo" }, ...categories].map(cat => (
                  <button key={cat.id} onClick={() => setFilterCat(cat.id)} style={{ padding: "6px 14px", borderRadius: 2, border: `1px solid ${filterCat === cat.id ? pc : C.linen3}`, background: filterCat === cat.id ? pc : "transparent", color: filterCat === cat.id ? "white" : C.muted, fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: FONT.sans, transition: "all 0.15s" }}>
                    {cat.name}
                  </button>
                ))}
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "7px 11px", borderRadius: 2, border: `1px solid ${C.linen3}`, background: C.white, color: C.charcoal, fontSize: 11, fontFamily: FONT.sans, cursor: "pointer", outline: "none" }}>
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
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontFamily: FONT.serif, fontSize: 20, fontWeight: 300, color: C.faint }}>No encontramos productos con esa búsqueda</p>
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section style={{ padding: "72px 0", background: C.linen, borderTop: `1px solid ${C.linen2}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 14px", fontWeight: 600, fontFamily: FONT.sans }}>Nuestra historia</p>
            <h2 style={{ fontFamily: FONT.serif, fontSize: 30, fontWeight: 300, color: C.charcoal, lineHeight: 1.35, marginBottom: 18 }}>"{config.aboutTitle}"</h2>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: 28, fontFamily: FONT.sans }}>{config.aboutText}</p>
            <p style={{ fontFamily: FONT.serif, fontSize: 16, fontStyle: "italic", color: pc, margin: 0 }}>— Con amor, el equipo {config.storeName}</p>
          </div>
          <div style={{ borderRadius: 3, overflow: "hidden" }}>
            {config.aboutImage ? <img src={config.aboutImage} alt="Nosotros" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} /> : <div style={{ aspectRatio: "4/3", background: `linear-gradient(135deg, ${C.sagePale}, ${C.rosePale})`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3 }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 56, marginBottom: 10 }}>🤱</div><p style={{ fontFamily: FONT.serif, fontSize: 15, color: C.muted, fontWeight: 300 }}>Hecho con amor</p></div></div>}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "72px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ fontSize: 10, color: pc, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px", fontWeight: 600, fontFamily: FONT.sans }}>Testimonios</p>
            <h2 style={{ fontFamily: FONT.serif, fontSize: 30, fontWeight: 300, color: C.charcoal, margin: 0 }}>Lo que dicen nuestras clientas</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {(config.testimonials || []).map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                style={{ background: C.snow, borderRadius: 3, padding: "26px 22px", border: `1px solid ${C.linen2}` }}>
                <div style={{ color: "#C9A55A", fontSize: 12, marginBottom: 14, letterSpacing: "1px" }}>★★★★★</div>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: C.muted, fontStyle: "italic", marginBottom: 20, fontFamily: FONT.sans }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.bg || C.rosePale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.muted, fontFamily: FONT.sans }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: C.charcoal, margin: "0 0 1px", fontFamily: FONT.sans }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: C.faint, margin: 0, fontFamily: FONT.sans }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "56px 0", background: C.charcoal }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: `repeat(${(config.benefits || []).length || 4}, 1fr)`, gap: 36 }}>
          {(config.benefits || []).map((b, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{b.icon}</div>
              <p style={{ fontFamily: FONT.serif, fontSize: 15, fontWeight: 400, color: C.linen, marginBottom: 6 }}>{b.title}</p>
              <p style={{ fontSize: 12, color: "rgba(245,242,238,0.42)", margin: 0, fontFamily: FONT.sans, lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: "72px 40px", background: pc, textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FONT.serif, fontSize: 30, fontWeight: 300, color: "white", marginBottom: 10 }}>{config.newsletterTitle}</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 28, fontFamily: FONT.sans, lineHeight: 1.7 }}>{config.newsletterText}</p>
          <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
            <input placeholder="tu@correo.com" style={{ flex: 1, padding: "12px 16px", borderRadius: 2, border: "none", background: "rgba(255,255,255,0.16)", color: "white", fontSize: 13, outline: "none", fontFamily: FONT.sans }} />
            <button onClick={() => toast("¡Suscripción exitosa!")} style={{ padding: "12px 20px", borderRadius: 2, background: "white", color: pc, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: FONT.sans, whiteSpace: "nowrap" }}>Suscribirse</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: C.charcoal, padding: "52px 0 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: 40, marginBottom: 40 }}>
            <div>
              <p style={{ fontFamily: FONT.serif, fontSize: 20, fontWeight: 300, color: C.linen, marginBottom: 12, letterSpacing: "0.5px" }}>{config.storeName}</p>
              <p style={{ fontSize: 12, color: "rgba(245,242,238,0.4)", lineHeight: 1.8, marginBottom: 18, fontFamily: FONT.sans }}>Productos seguros, suaves y adorables para acompañar a tu bebé en cada etapa.</p>
            </div>
            <div>
              <p style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, color: "rgba(245,242,238,0.3)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14 }}>Tienda</p>
              {["Recién nacidos", "Conjuntos", "Accesorios", "Zapatos", "Mantas"].map(l => <p key={l} style={{ fontSize: 12, color: "rgba(245,242,238,0.45)", marginBottom: 8, fontFamily: FONT.sans }}>{l}</p>)}
            </div>
            <div>
              <p style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, color: "rgba(245,242,238,0.3)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14 }}>Ayuda</p>
              {["Cómo comprar", "Envíos", "Cambios", "FAQ"].map(l => <p key={l} style={{ fontSize: 12, color: "rgba(245,242,238,0.45)", marginBottom: 8, fontFamily: FONT.sans }}>{l}</p>)}
            </div>
            <div>
              <p style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 700, color: "rgba(245,242,238,0.3)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14 }}>Contacto</p>
              {[["📍", config.address], ["📱", config.whatsapp], ["📧", config.email]].map(([ic, v]) => (
                <div key={v} style={{ display: "flex", gap: 8, marginBottom: 10 }}><span style={{ fontSize: 12 }}>{ic}</span><span style={{ fontSize: 12, color: "rgba(245,242,238,0.45)", fontFamily: FONT.sans }}>{v}</span></div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 11, color: "rgba(245,242,238,0.28)", margin: 0, fontFamily: FONT.sans }}>© 2025 {config.storeName} · Lima, Perú</p>
            <div style={{ display: "flex", gap: 7 }}>{["Yape", "Visa", "MC", "BCP"].map(m => <span key={m} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", padding: "3px 9px", borderRadius: 2, fontSize: 10, color: "rgba(245,242,238,0.3)", fontFamily: FONT.sans }}>{m}</span>)}</div>
          </div>
        </div>
      </footer>

      {/* WhatsApp */}
      <motion.a href={`https://wa.me/${config.whatsapp}`} target="_blank"
        animate={{ boxShadow: ["0 4px 16px rgba(37,211,102,0.3)", "0 4px 24px rgba(37,211,102,0.55)", "0 4px 16px rgba(37,211,102,0.3)"] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ position: "fixed", bottom: 26, right: 26, width: 50, height: 50, background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, textDecoration: "none", zIndex: 500 }}>
        💬
      </motion.a>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} config={config}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} config={config}
        products={products} coupons={coupons} onComplete={handleCheckoutComplete} />
      <ProductDetailModal product={detailProduct} categories={categories} open={!!detailProduct}
        onClose={() => setDetailProduct(null)} onAddCart={addToCart} onWishlist={toggleWishlist}
        wishlist={wishlist} config={config} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input, select, textarea, button { font-family: inherit; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #D8D0C8; border-radius: 2px; }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ════════════════════════════════════════════════════════════════════════════

// ─── ADMIN DASHBOARD ────────────────────────────────────────────────────────
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

  const openNew = () => { setForm({ name: "", desc: "", price: "", oldPrice: "", stock: "", categoryId: categories[0]?.id || "", badge: "", emoji: "👶", bg: C.roseLight, active: true, featured: false }); setModal("new"); };
  const openEdit = (p) => { setForm({ ...p, price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : "", stock: String(p.stock) }); setModal(p); };

  const save = () => {
    if (!form.name || !form.price || !form.stock) { toast("Completa nombre, precio y stock", "error"); return; }
    const data = { ...form, price: parseFloat(form.price), oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null, stock: parseInt(form.stock), rating: form.rating || 4.8, reviews: form.reviews || 0, createdAt: form.createdAt || Date.now(), slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), active: Boolean(form.active), featured: Boolean(form.featured) };
    if (modal === "new") { setProducts(p => [...p, { ...data, id: "p" + Date.now() }]); toast("✅ Producto creado"); }
    else { setProducts(p => p.map(x => x.id === modal.id ? { ...x, ...data } : x)); toast("✅ Producto actualizado"); }
    setModal(null);
  };

  const del = (id) => { setProducts(p => p.map(x => x.id === id ? { ...x, active: false } : x)); toast("Producto eliminado"); };
  const toggleActive = (id) => setProducts(p => p.map(x => x.id === id ? { ...x, active: !x.active } : x));

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const FormModal = (
    <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "new" ? "Nuevo producto" : "Editar producto"} width={680}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ gridColumn: "1/-1" }}><Field label="Nombre del producto" required><input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Ej: Set Bodysuit Algodón" /></Field></div>
        <div style={{ gridColumn: "1/-1" }}><Field label="Descripción"><textarea value={form.desc || ""} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} placeholder="Descripción del producto..." /></Field></div>
        <Field label="Precio (S/.)" required><input type="number" step="0.01" value={form.price || ""} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inputStyle} placeholder="0.00" /></Field>
        <Field label="Precio anterior (opcional)"><input type="number" step="0.01" value={form.oldPrice || ""} onChange={e => setForm(f => ({ ...f, oldPrice: e.target.value }))} style={inputStyle} placeholder="0.00" /></Field>
        <Field label="Stock" required><input type="number" value={form.stock || ""} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} style={inputStyle} placeholder="0" /></Field>
        <Field label="Categoría"><select value={form.categoryId || ""} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={selectStyle}>{categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}</select></Field>
        <Field label="Badge / Etiqueta"><select value={form.badge || ""} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} style={selectStyle}><option value="">Sin etiqueta</option><option value="nuevo">Nuevo</option><option value="oferta">Oferta</option><option value="mas_vendido">Más vendido</option><option value="favorito">Favorito</option></select></Field>
        <Field label="Emoji del producto"><input value={form.emoji || ""} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} style={inputStyle} placeholder="👶" /></Field>
        <Field label="Color de fondo"><input type="color" value={form.bg || "#FAE8E8"} onChange={e => setForm(f => ({ ...f, bg: e.target.value }))} style={{ ...inputStyle, padding: 6, height: 44, cursor: "pointer" }} /></Field>
        <div style={{ display: "flex", gap: 20, alignItems: "center", gridColumn: "1/-1" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: C.muted }}>
            <input type="checkbox" checked={!!form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: 18, height: 18, accentColor: C.roseDeep }} /> Producto destacado
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: C.muted }}>
            <input type="checkbox" checked={!!form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} style={{ width: 18, height: 18, accentColor: C.roseDeep }} /> Activo (visible en tienda)
          </label>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button onClick={() => setModal(null)} style={{ flex: 1, padding: "13px", borderRadius: 100, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", fontWeight: 600, color: C.muted }}>Cancelar</button>
        <button onClick={save} style={{ flex: 2, padding: "13px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>
          <Icon d={Icons.save} size={14} style={{ display: "inline", marginRight: 6 }} />Guardar producto
        </button>
      </div>
    </Modal>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: FONT.serif, fontSize: 28, color: C.charcoal, margin: "0 0 4px" }}>Productos</h2>
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>{products.filter(p => p.active).length} activos · {products.length} total</p>
        </div>
        <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
          <Icon d={Icons.plus} size={16} /> Nuevo producto
        </button>
      </div>
      <div style={{ position: "relative", marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos..." style={{ ...inputStyle, paddingLeft: 40 }} />
        <Icon d={Icons.search} size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.faint }} />
      </div>
      <div style={{ background: C.white, borderRadius: 20, boxShadow: "0 4px 24px rgba(139,110,82,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: C.linen }}>{["Producto", "Categoría", "Precio", "Stock", "Estado", "Etiqueta", "Acciones"].map(h => <th key={h} style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: "1px", padding: "14px 16px", textAlign: "left" }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(p => {
              const cat = categories.find(c => c.id === p.categoryId);
              return (
                <tr key={p.id} style={{ borderTop: `1px solid ${C.beige}`, opacity: p.active ? 1 : 0.5 }}>
                  <td style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{p.emoji}</div>
                    <div><div style={{ fontWeight: 600, fontSize: 14, color: C.charcoal }}>{p.name}</div>{p.featured && <span style={{ fontSize: 10, color: C.sand, fontWeight: 700 }}>⭐ Destacado</span>}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: C.muted }}>{cat?.emoji} {cat?.name}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.brown }}>S/. {p.price.toFixed(2)}</div>
                    {p.oldPrice && <div style={{ fontSize: 11, color: C.faint, textDecoration: "line-through" }}>S/. {p.oldPrice.toFixed(2)}</div>}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: p.stock <= 5 ? C.warning : C.charcoal }}>{p.stock}</span>
                    {p.stock <= 5 && <span style={{ fontSize: 10, color: C.warning, display: "block" }}>⚠️ Bajo stock</span>}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button onClick={() => toggleActive(p.id)} style={{ background: p.active ? "#D4EDDA" : "#F8D7DA", color: p.active ? "#155724" : "#721C24", border: "none", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                      {p.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td style={{ padding: "14px 16px" }}><Badge badge={p.badge} /></td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(p)} style={{ width: 34, height: 34, borderRadius: 10, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
                        <Icon d={Icons.edit} size={14} />
                      </button>
                      <button onClick={() => setConfirm({ id: p.id, name: p.name })} style={{ width: 34, height: 34, borderRadius: 10, border: `1.5px solid #FFCDD2`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.danger }}>
                        <Icon d={Icons.trash} size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {FormModal}
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm?.id)} title="Eliminar producto" message={`¿Segura que quieres eliminar "${confirm?.name}"? El producto se ocultará de la tienda.`} danger />
    </div>
  );
}

// ─── ADMIN ORDERS ────────────────────────────────────────────────────────────
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
  const [form, setForm] = useState({});

  const save = () => {
    if (!form.name) { toast("Escribe el nombre", "error"); return; }
    if (modal === "new") { setCategories(c => [...c, { ...form, id: "cat" + Date.now(), slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") }]); toast("✅ Categoría creada"); }
    else { setCategories(c => c.map(x => x.id === modal.id ? { ...x, ...form } : x)); toast("✅ Categoría actualizada"); }
    setModal(null);
  };
  const del = (id) => { setCategories(c => c.filter(x => x.id !== id)); toast("Categoría eliminada"); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h2 style={{ fontFamily: FONT.serif, fontSize: 28, color: C.charcoal, margin: 0 }}>Categorías</h2>
        <button onClick={() => { setForm({ name: "", emoji: "🎀", color: "#FAE8E8" }); setModal("new"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}>
          <Icon d={Icons.plus} size={16} /> Nueva categoría
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background: C.white, borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(139,110,82,0.08)", display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: cat.color || C.roseLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{cat.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.charcoal }}>{cat.name}</div>
              <div style={{ fontSize: 13, color: C.faint }}>{products.filter(p => p.categoryId === cat.id && p.active).length} productos</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setForm({ ...cat }); setModal(cat); }} style={{ width: 34, height: 34, borderRadius: 10, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
                <Icon d={Icons.edit} size={14} />
              </button>
              <button onClick={() => del(cat.id)} style={{ width: 34, height: 34, borderRadius: 10, border: "1.5px solid #FFCDD2", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.danger }}>
                <Icon d={Icons.trash} size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "new" ? "Nueva categoría" : "Editar categoría"} width={480}>
        <Field label="Nombre" required><input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Ej: Recién nacidos" /></Field>
        <Field label="Emoji"><input value={form.emoji || ""} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} style={inputStyle} placeholder="👼" /></Field>
        <Field label="Color de fondo"><input type="color" value={form.color || "#FAE8E8"} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ ...inputStyle, padding: 6, height: 44, cursor: "pointer" }} /></Field>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button onClick={() => setModal(null)} style={{ flex: 1, padding: "12px", borderRadius: 100, border: `1.5px solid ${C.beigeDark}`, background: "transparent", cursor: "pointer", fontWeight: 600, color: C.muted }}>Cancelar</button>
          <button onClick={save} style={{ flex: 2, padding: "12px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Guardar</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── ADMIN COUPONS ───────────────────────────────────────────────────────────
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
function AdminSettings({ config, setConfig }) {
  const toast = useToast();
  const [form, setForm] = useState({ ...config });
  const [activeTab, setActiveTab] = useState("general");

  const save = () => { setConfig({ ...form }); toast("✅ Configuración guardada"); };

  const tabs = [["general", "🏪 General"], ["contact", "📱 Contacto y RRSS"], ["payments", "💳 Pasarelas de pago"], ["content", "🎨 Contenido y diseño"]];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h2 style={{ fontFamily: FONT.serif, fontSize: 28, color: C.charcoal, margin: 0 }}>Configuración</h2>
        <button onClick={save} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 100, background: C.sage, color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>
          <Icon d={Icons.save} size={15} /> Guardar cambios
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 28, borderBottom: `1px solid ${C.beige}`, paddingBottom: 0 }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ padding: "10px 20px", borderRadius: "12px 12px 0 0", border: "none", background: activeTab === id ? C.white : "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: activeTab === id ? C.roseDeep : C.muted, borderBottom: activeTab === id ? "2px solid " + C.roseDeep : "2px solid transparent", marginBottom: -1 }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ background: C.white, borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(139,110,82,0.08)" }}>
        {activeTab === "general" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Field label="Nombre de la tienda"><input value={form.storeName} onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))} style={inputStyle} /></Field>
            <Field label="Slogan / Tagline"><input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} style={inputStyle} /></Field>
            <div style={{ gridColumn: "1/-1" }}><Field label="Texto del hero (título principal)"><textarea value={form.heroTitle} onChange={e => setForm(f => ({ ...f, heroTitle: e.target.value }))} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} /></Field></div>
            <div style={{ gridColumn: "1/-1" }}><Field label="Subtítulo del hero"><textarea value={form.heroSubtitle} onChange={e => setForm(f => ({ ...f, heroSubtitle: e.target.value }))} style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} /></Field></div>
            <div style={{ gridColumn: "1/-1" }}><Field label="Texto del banner promocional"><input value={form.promoBanner} onChange={e => setForm(f => ({ ...f, promoBanner: e.target.value }))} style={inputStyle} /></Field></div>
            <Field label="Umbral de envío gratis (S/.)"><input type="number" value={form.freeShipping} onChange={e => setForm(f => ({ ...f, freeShipping: parseFloat(e.target.value) }))} style={inputStyle} /></Field>
            <Field label="Dirección / Ciudad"><input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={inputStyle} /></Field>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={!!form.promoActive} onChange={e => setForm(f => ({ ...f, promoActive: e.target.checked }))} style={{ width: 20, height: 20, accentColor: C.roseDeep }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: C.muted }}>Mostrar banner promocional en la tienda</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Field label="WhatsApp (solo número con código de país)"><input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} style={inputStyle} placeholder="51999999999" /></Field>
            <Field label="Correo electrónico de contacto"><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} placeholder="hola@venetuskids.pe" /></Field>
            <Field label="Instagram (URL completa)"><input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} style={inputStyle} placeholder="https://instagram.com/..." /></Field>
            <Field label="TikTok (URL completa)"><input value={form.tiktok} onChange={e => setForm(f => ({ ...f, tiktok: e.target.value }))} style={inputStyle} placeholder="https://tiktok.com/@..." /></Field>
            <Field label="Facebook (URL completa)"><input value={form.facebook} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))} style={inputStyle} placeholder="https://facebook.com/..." /></Field>
            <div style={{ gridColumn: "1/-1", background: C.beige, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Vista previa del botón de WhatsApp:</div>
              <div style={{ fontSize: 13, color: C.faint }}>El botón flotante de WhatsApp en la tienda usará el número: <strong style={{ color: C.charcoal }}>{form.whatsapp}</strong></div>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div>
            <div style={{ background: C.sagePale, borderRadius: 16, padding: 20, marginBottom: 28 }}>
              <div style={{ fontWeight: 700, color: C.charcoal, marginBottom: 8 }}>💡 Cómo configurar las pasarelas de pago</div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>Para activar pagos reales, obtén tus claves API de cada plataforma e ingrésalas abajo. Yape y transferencia bancaria siempre están disponibles sin configuración.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
              {[
                { key: "stripe", label: "💳 Stripe", desc: "Acepta tarjetas de crédito/débito internacionales. Ideal para pagos con Visa, Mastercard, Amex.", docs: "https://dashboard.stripe.com/apikeys", keyField: "stripeKey", placeholder: "sk_live_..." },
                { key: "mp", label: "🟡 MercadoPago", desc: "Muy popular en Perú y Latinoamérica. Acepta tarjetas, Yape, Plin y más.", docs: "https://www.mercadopago.com.pe/developers", keyField: "mpKey", placeholder: "APP_USR-..." },
                { key: "paypal", label: "💙 PayPal", desc: "Para clientes internacionales o que prefieren PayPal.", docs: "https://developer.paypal.com", keyField: "paypalId", placeholder: "AXxxxxxxx..." },
              ].map(gw => (
                <div key={gw.key} style={{ border: `1.5px solid ${form[gw.key + "Enabled"] ? C.roseDeep : C.beigeDark}`, borderRadius: 20, padding: 24, transition: "all 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: C.charcoal }}>{gw.label}</div>
                      <div style={{ fontSize: 13, color: C.faint, marginTop: 2 }}>{gw.desc}</div>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <span style={{ fontSize: 13, color: C.muted }}>{form[gw.key + "Enabled"] ? "Activado" : "Desactivado"}</span>
                      <div onClick={() => setForm(f => ({ ...f, [gw.key + "Enabled"]: !f[gw.key + "Enabled"] }))}
                        style={{ width: 48, height: 26, borderRadius: 100, background: form[gw.key + "Enabled"] ? C.roseDeep : C.beigeDark, position: "relative", cursor: "pointer", transition: "all 0.3s", flexShrink: 0 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: form[gw.key + "Enabled"] ? 24 : 4, transition: "all 0.3s", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
                      </div>
                    </label>
                  </div>
                  {form[gw.key + "Enabled"] && (
                    <div>
                      <Field label="Clave API / Client ID">
                        <input type="password" value={form[gw.keyField] || ""} onChange={e => setForm(f => ({ ...f, [gw.keyField]: e.target.value }))} style={inputStyle} placeholder={gw.placeholder} />
                      </Field>
                      <a href={gw.docs} target="_blank" rel="noopener" style={{ fontSize: 12, color: C.roseDeep, textDecoration: "none" }}>📖 Ver documentación →</a>
                    </div>
                  )}
                </div>
              ))}
              <div style={{ border: `1.5px solid ${C.beigeDark}`, borderRadius: 20, padding: 24, background: "#F3E5F5" }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#7B1FA2", marginBottom: 4 }}>💜 Yape / Plin — Siempre disponible</div>
                <div style={{ fontSize: 13, color: "#9C27B0" }}>Se muestra automáticamente con el número: <strong>{form.whatsapp}</strong>. Configúralo en la pestaña Contacto y RRSS.</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Field label="Color principal (botones, badges)">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="color" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))} style={{ width: 50, height: 50, borderRadius: 12, border: `1.5px solid ${C.beigeDark}`, cursor: "pointer", padding: 4 }} />
                <input value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
              </div>
            </Field>
            <Field label="Color de acento (textos, detalles)">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="color" value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))} style={{ width: 50, height: 50, borderRadius: 12, border: `1.5px solid ${C.beigeDark}`, cursor: "pointer", padding: 4 }} />
                <input value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
              </div>
            </Field>
            <div style={{ gridColumn: "1/-1", background: C.beige, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 12 }}>Vista previa de colores:</div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ padding: "10px 24px", borderRadius: 100, background: form.primaryColor, color: "white", fontWeight: 700, fontSize: 14 }}>Botón principal</div>
                <div style={{ padding: "10px 24px", borderRadius: 100, background: "transparent", border: `2px solid ${form.accentColor}`, color: form.accentColor, fontWeight: 700, fontSize: 14 }}>Botón secundario</div>
              </div>
            </div>
            <div style={{ gridColumn: "1/-1", background: "#FFF9F0", border: `1.5px solid ${C.sandLight}`, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.brown, marginBottom: 8 }}>🚀 Próximamente</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                • Subida de imágenes y banners personalizados<br />
                • Editor de testimonios desde el panel<br />
                • Personalización del footer y secciones<br />
                • Logo personalizado de la tienda
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN CLIENTS ────────────────────────────────────────────────────────────
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
    ["dashboard", Icons.grid, "Dashboard"],
    ["products", Icons.package, "Productos"],
    ["orders", Icons.cart, "Pedidos"],
    ["categories", Icons.tag, "Categorías"],
    ["coupons", Icons.ticket, "Cupones"],
    ["reviews", Icons.star, "Reseñas"],
    ["clients", Icons.users, "Clientes"],
    ["settings", Icons.settings, "Configuración"],
  ];
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
          {navItems.map(([id, icon, label]) => (
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
      if (cf) setConfigRaw({ ...INIT_CONFIG, ...cf });
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
