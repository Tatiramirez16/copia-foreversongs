import { useState } from "react";

const BRAND = "Melody of Us";
const PRIMARY = "#1e3a5f";
const ACCENT = "#c8974f";
const ACCENT2 = "#e8b86d";
const BG = "#f9f6f1";
const WHITE = "#ffffff";
const DARK = "#1a1a2e";
const GRAY = "#6b7280";
const LIGHT_GRAY = "#f3f0eb";
const SUCCESS = "#22c55e";
const STAR_COLOR = "#f59e0b";

const packages = [
  {
    id: "basic",
    name: "Esencial",
    price: 29.99,
    originalPrice: 49.99,
    badge: null,
    color: "#4a90d9",
    features: [
      { icon: "🎵", text: "Canción personalizada (MP3)" },
      { icon: "📝", text: "Letra personalizada" },
      { icon: "✉️", text: "Entrega por email" },
    ],
    notIncluded: [
      "Portada tipo Spotify",
      "Código QR personalizado",
      "Letra en PDF imprimible",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 49.99,
    originalPrice: 89.99,
    badge: "MÁS POPULAR",
    color: ACCENT,
    features: [
      { icon: "🎵", text: "Canción personalizada (MP3)" },
      { icon: "📝", text: "Letra personalizada" },
      { icon: "🎨", text: "Portada tipo Spotify personalizada" },
      { icon: "📄", text: "Letra en PDF lista para imprimir" },
      { icon: "✉️", text: "Entrega por email" },
    ],
    notIncluded: ["Código QR personalizado"],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: 69.99,
    originalPrice: 119.99,
    badge: "TODO INCLUIDO",
    color: PRIMARY,
    features: [
      { icon: "🎵", text: "Canción personalizada (MP3)" },
      { icon: "📝", text: "Letra personalizada" },
      { icon: "🎨", text: "Portada tipo Spotify personalizada" },
      { icon: "📱", text: "Código QR para escuchar la canción" },
      { icon: "📄", text: "Letra en PDF lista para imprimir" },
      { icon: "✉️", text: "Entrega por email + descarga directa" },
      { icon: "🎁", text: "Tarjeta de regalo digital incluida" },
    ],
    notIncluded: [],
  },
];

const genres = [
  "Pop romántico", "Balada acústica", "R&B suave", "Country", "Jazz íntimo",
  "Folk acústico", "Indie", "Clásico orquestal"
];

const occasions = [
  "Aniversario 💑", "Boda 💍", "Cumpleaños 🎂", "Día de la Madre 🌷",
  "Día del Padre 👨", "Bebé recién nacido 👶", "San Valentín ❤️", "Memorial 🕊️"
];

const reviews = [
  { name: "María G.", rating: 5, text: "¡Increíble! Mi pareja lloró cuando escuchó la canción. Perfectamente capturaron nuestra historia.", occasion: "Aniversario 10 años", avatar: "M" },
  { name: "Carlos R.", rating: 5, text: "La portada tipo Spotify quedó espectacular. La enmarqué y está en nuestra sala. ¡Gracias!", occasion: "Boda", avatar: "C" },
  { name: "Sofía L.", rating: 5, text: "El código QR fue un toque mágico. Mis padres no podían creer que era real. 100% recomendado.", occasion: "Aniversario bodas de oro", avatar: "S" },
  { name: "Juan P.", rating: 5, text: "Compré el paquete Ultimate y valió cada centavo. El PDF de la letra quedó hermoso.", occasion: "Cumpleaños de mi mamá", avatar: "J" },
];

const steps = ["Tu historia", "Personalizar", "Paquete", "Pago"];

const STEP_STORY = 0;
const STEP_CUSTOMIZE = 1;
const STEP_PACKAGE = 2;
const STEP_PAYMENT = 3;

export default function App() {
  const [currentStep, setCurrentStep] = useState(STEP_STORY);
  const [selectedPackage, setSelectedPackage] = useState("premium");
  const [hoveredPackage, setHoveredPackage] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: "",
    senderName: "",
    occasion: "",
    story: "",
    genre: "",
    email: "",
    coupon: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
  });

  const [errors, setErrors] = useState({});
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const pkg = packages.find((p) => p.id === selectedPackage);
  const discount = couponApplied ? pkg.price * 0.1 : 0;
  const total = pkg.price - discount;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === STEP_STORY) {
      if (!formData.recipientName.trim()) newErrors.recipientName = "Campo requerido";
      if (!formData.senderName.trim()) newErrors.senderName = "Campo requerido";
      if (!formData.occasion) newErrors.occasion = "Selecciona una ocasión";
      if (formData.story.trim().length < 30) newErrors.story = "Cuéntanos más (mínimo 30 caracteres)";
    }
    if (currentStep === STEP_CUSTOMIZE) {
      if (!formData.genre) newErrors.genre = "Selecciona un género";
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email válido requerido";
    }
    if (currentStep === STEP_PAYMENT) {
      if (!formData.cardName.trim()) newErrors.cardName = "Campo requerido";
      if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, "").length < 16) newErrors.cardNumber = "Número de tarjeta inválido";
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = "Campo requerido";
      if (!formData.cardCvc.trim() || formData.cardCvc.length < 3) newErrors.cardCvc = "CVC inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < STEP_PAYMENT) setCurrentStep((s) => s + 1);
      else handleOrder();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleOrder = () => {
    setOrderComplete(true);
    setShowCart(false);
  };

  const applyCoupon = () => {
    if (formData.coupon.toUpperCase() === "MELODY10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Cupón inválido");
      setCouponApplied(false);
    }
  };

  const formatCard = (val) => {
    return val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  };

  const formatExpiry = (val) => {
    return val.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);
  };

  // ── STYLES ──
  const s = {
    app: {
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: BG,
      minHeight: "100vh",
      color: DARK,
    },
    nav: {
      background: WHITE,
      borderBottom: `1px solid #e5e0d8`,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    },
    navInner: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 64,
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      textDecoration: "none",
      cursor: "pointer",
    },
    logoIcon: {
      width: 38,
      height: 38,
      background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
    },
    logoText: {
      fontSize: 20,
      fontWeight: 700,
      color: PRIMARY,
      letterSpacing: "-0.5px",
    },
    navLinks: {
      display: "flex",
      gap: 8,
      alignItems: "center",
    },
    navLink: {
      padding: "8px 14px",
      borderRadius: 8,
      border: "none",
      background: "transparent",
      color: GRAY,
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    navLinkActive: {
      background: LIGHT_GRAY,
      color: PRIMARY,
    },
    ctaBtn: {
      background: `linear-gradient(135deg, ${PRIMARY}, #2d5a9e)`,
      color: WHITE,
      border: "none",
      padding: "10px 22px",
      borderRadius: 25,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: "0 4px 12px rgba(30,58,95,0.3)",
    },
    hero: {
      background: `linear-gradient(135deg, ${PRIMARY} 0%, #2d5a9e 50%, #1a3352 100%)`,
      padding: "80px 20px 100px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    heroOverlay: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(circle at 30% 50%, rgba(200,151,79,0.15) 0%, transparent 60%)",
      pointerEvents: "none",
    },
    heroTitle: {
      fontSize: "clamp(2rem, 5vw, 3.5rem)",
      fontWeight: 800,
      color: WHITE,
      lineHeight: 1.2,
      marginBottom: 16,
      position: "relative",
    },
    heroAccent: {
      color: ACCENT2,
    },
    heroSub: {
      fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
      color: "rgba(255,255,255,0.85)",
      marginBottom: 40,
      maxWidth: 600,
      margin: "0 auto 40px",
      position: "relative",
    },
    heroBtns: {
      display: "flex",
      gap: 16,
      justifyContent: "center",
      flexWrap: "wrap",
      position: "relative",
    },
    heroBtnPrimary: {
      background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
      color: WHITE,
      border: "none",
      padding: "16px 36px",
      borderRadius: 50,
      fontSize: 17,
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: `0 8px 24px rgba(200,151,79,0.4)`,
      transition: "all 0.3s",
      letterSpacing: "0.3px",
    },
    heroBtnSecondary: {
      background: "rgba(255,255,255,0.12)",
      color: WHITE,
      border: "2px solid rgba(255,255,255,0.4)",
      padding: "14px 32px",
      borderRadius: 50,
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s",
    },
    statsBar: {
      background: WHITE,
      borderBottom: `3px solid ${ACCENT}`,
      padding: "20px",
    },
    statsInner: {
      maxWidth: 900,
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
      gap: "clamp(24px, 5vw, 60px)",
      flexWrap: "wrap",
    },
    statItem: {
      textAlign: "center",
    },
    statNum: {
      fontSize: "clamp(1.5rem, 4vw, 2rem)",
      fontWeight: 800,
      color: PRIMARY,
    },
    statLabel: {
      fontSize: 13,
      color: GRAY,
      marginTop: 2,
    },
    section: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "60px 20px",
    },
    sectionTitle: {
      fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
      fontWeight: 800,
      color: PRIMARY,
      textAlign: "center",
      marginBottom: 12,
    },
    sectionSub: {
      textAlign: "center",
      color: GRAY,
      fontSize: 16,
      marginBottom: 48,
    },
    productsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 24,
      marginBottom: 40,
    },
    productCard: {
      background: WHITE,
      borderRadius: 20,
      padding: "28px 24px",
      border: "2px solid #e5e0d8",
      transition: "all 0.3s",
      position: "relative",
      overflow: "hidden",
    },
    productCardFeatured: {
      border: `2px solid ${ACCENT}`,
      transform: "scale(1.02)",
      boxShadow: `0 12px 40px rgba(200,151,79,0.2)`,
    },
    badge: {
      position: "absolute",
      top: 16,
      right: 16,
      background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
      color: WHITE,
      fontSize: 10,
      fontWeight: 700,
      padding: "4px 10px",
      borderRadius: 20,
      letterSpacing: "0.5px",
    },
    badgeBlue: {
      background: `linear-gradient(135deg, ${PRIMARY}, #2d5a9e)`,
    },
    productName: {
      fontSize: 22,
      fontWeight: 700,
      color: PRIMARY,
      marginBottom: 4,
    },
    productPrice: {
      fontSize: 32,
      fontWeight: 800,
      color: DARK,
      marginBottom: 4,
    },
    productOriginalPrice: {
      fontSize: 16,
      color: "#9ca3af",
      textDecoration: "line-through",
      marginBottom: 16,
    },
    featureList: {
      listStyle: "none",
      padding: 0,
      margin: "16px 0",
    },
    featureItem: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 0",
      fontSize: 14,
      color: DARK,
    },
    featureItemNot: {
      color: "#9ca3af",
      textDecoration: "line-through",
    },
    selectPkgBtn: {
      width: "100%",
      padding: "12px",
      borderRadius: 12,
      border: "none",
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.3s",
      marginTop: 8,
    },
    // Form
    formContainer: {
      maxWidth: 640,
      margin: "0 auto",
      background: WHITE,
      borderRadius: 24,
      padding: "clamp(24px, 5vw, 48px)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
    },
    stepIndicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
      marginBottom: 36,
    },
    stepDot: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      fontWeight: 700,
      transition: "all 0.3s",
      flexShrink: 0,
    },
    stepLine: {
      flex: 1,
      height: 3,
      transition: "background 0.3s",
      maxWidth: 80,
    },
    stepLabel: {
      fontSize: 11,
      marginTop: 4,
      textAlign: "center",
      fontWeight: 600,
      letterSpacing: "0.3px",
    },
    formTitle: {
      fontSize: 22,
      fontWeight: 700,
      color: PRIMARY,
      marginBottom: 24,
      textAlign: "center",
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      display: "block",
      fontSize: 13,
      fontWeight: 600,
      color: PRIMARY,
      marginBottom: 6,
      letterSpacing: "0.3px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: 12,
      border: "2px solid #e5e0d8",
      fontSize: 15,
      color: DARK,
      background: WHITE,
      outline: "none",
      transition: "border-color 0.2s",
      boxSizing: "border-box",
    },
    inputError: {
      borderColor: "#ef4444",
    },
    errorMsg: {
      color: "#ef4444",
      fontSize: 12,
      marginTop: 4,
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: 12,
      border: "2px solid #e5e0d8",
      fontSize: 15,
      color: DARK,
      background: WHITE,
      outline: "none",
      transition: "border-color 0.2s",
      resize: "vertical",
      minHeight: 100,
      boxSizing: "border-box",
      fontFamily: "inherit",
    },
    tagGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 4,
    },
    tag: {
      padding: "8px 14px",
      borderRadius: 20,
      border: "2px solid #e5e0d8",
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s",
      background: WHITE,
      color: DARK,
    },
    tagSelected: {
      background: PRIMARY,
      border: `2px solid ${PRIMARY}`,
      color: WHITE,
    },
    navBtns: {
      display: "flex",
      gap: 12,
      marginTop: 32,
    },
    btnSecondary: {
      flex: 1,
      padding: "14px",
      borderRadius: 12,
      border: `2px solid ${PRIMARY}`,
      background: WHITE,
      color: PRIMARY,
      fontSize: 15,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    btnPrimary: {
      flex: 2,
      padding: "14px",
      borderRadius: 12,
      border: "none",
      background: `linear-gradient(135deg, ${PRIMARY}, #2d5a9e)`,
      color: WHITE,
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.3s",
      boxShadow: "0 4px 16px rgba(30,58,95,0.3)",
    },
    // Cart / Order Summary
    summaryBox: {
      background: LIGHT_GRAY,
      borderRadius: 16,
      padding: "20px",
      marginBottom: 24,
      border: `1px solid #e5e0d8`,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: PRIMARY,
      marginBottom: 12,
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
      fontSize: 14,
    },
    summaryTotal: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 12,
      borderTop: `2px solid #e5e0d8`,
      marginTop: 8,
      fontSize: 18,
      fontWeight: 800,
      color: PRIMARY,
    },
    couponRow: {
      display: "flex",
      gap: 8,
      marginTop: 12,
    },
    couponInput: {
      flex: 1,
      padding: "10px 14px",
      borderRadius: 10,
      border: "2px solid #e5e0d8",
      fontSize: 14,
      outline: "none",
      boxSizing: "border-box",
    },
    couponBtn: {
      padding: "10px 16px",
      borderRadius: 10,
      border: "none",
      background: ACCENT,
      color: WHITE,
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
    },
    // Package step cards
    pkgCard: {
      border: "2px solid #e5e0d8",
      borderRadius: 16,
      padding: "20px",
      cursor: "pointer",
      marginBottom: 12,
      transition: "all 0.25s",
      position: "relative",
      background: WHITE,
    },
    pkgCardSelected: {
      border: `2px solid ${ACCENT}`,
      boxShadow: `0 4px 20px rgba(200,151,79,0.2)`,
    },
    pkgCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    pkgCardName: {
      fontSize: 18,
      fontWeight: 700,
      color: PRIMARY,
    },
    pkgCardPrice: {
      fontSize: 22,
      fontWeight: 800,
      color: ACCENT,
    },
    // Success
    successContainer: {
      maxWidth: 560,
      margin: "80px auto",
      padding: "48px 32px",
      background: WHITE,
      borderRadius: 28,
      textAlign: "center",
      boxShadow: "0 12px 60px rgba(0,0,0,0.1)",
    },
    successIcon: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 36,
      margin: "0 auto 24px",
      boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
    },
    successTitle: {
      fontSize: 28,
      fontWeight: 800,
      color: PRIMARY,
      marginBottom: 12,
    },
    successSub: {
      color: GRAY,
      fontSize: 16,
      marginBottom: 32,
      lineHeight: 1.6,
    },
    deliverables: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 32,
    },
    deliverable: {
      background: LIGHT_GRAY,
      borderRadius: 14,
      padding: "16px 12px",
      textAlign: "center",
    },
    deliverableIcon: {
      fontSize: 28,
      marginBottom: 6,
    },
    deliverableText: {
      fontSize: 12,
      fontWeight: 600,
      color: PRIMARY,
    },
    // Reviews
    reviewsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 20,
    },
    reviewCard: {
      background: WHITE,
      borderRadius: 16,
      padding: "24px",
      border: "1px solid #e5e0d8",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    },
    reviewHeader: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    reviewAvatar: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: WHITE,
      fontWeight: 700,
      fontSize: 16,
      flexShrink: 0,
    },
    reviewName: {
      fontWeight: 700,
      color: DARK,
      fontSize: 15,
    },
    reviewOccasion: {
      fontSize: 12,
      color: GRAY,
    },
    reviewStars: {
      color: STAR_COLOR,
      fontSize: 16,
      marginBottom: 8,
    },
    reviewText: {
      fontSize: 14,
      color: "#374151",
      lineHeight: 1.6,
    },
    // How it works
    stepsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 24,
    },
    howStep: {
      textAlign: "center",
      padding: "24px 16px",
    },
    howStepNum: {
      width: 56,
      height: 56,
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${PRIMARY}, #2d5a9e)`,
      color: WHITE,
      fontSize: 22,
      fontWeight: 800,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px",
      boxShadow: "0 6px 20px rgba(30,58,95,0.25)",
    },
    howStepTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: PRIMARY,
      marginBottom: 8,
    },
    howStepDesc: {
      fontSize: 14,
      color: GRAY,
      lineHeight: 1.6,
    },
    // Spotify preview
    spotifyCard: {
      background: "#121212",
      borderRadius: 16,
      padding: "24px",
      maxWidth: 320,
      margin: "0 auto",
      boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
    },
    spotifyAlbum: {
      width: "100%",
      paddingBottom: "100%",
      borderRadius: 12,
      background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT}, #e8b86d)`,
      position: "relative",
      marginBottom: 16,
    },
    spotifyAlbumContent: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: WHITE,
    },
    spotifyTitle: {
      color: WHITE,
      fontWeight: 700,
      fontSize: 16,
      marginBottom: 4,
    },
    spotifyArtist: {
      color: "#b3b3b3",
      fontSize: 14,
      marginBottom: 16,
    },
    spotifyBar: {
      background: "#282828",
      borderRadius: 4,
      height: 4,
      marginBottom: 8,
    },
    spotifyProgress: {
      width: "35%",
      height: "100%",
      background: "#1db954",
      borderRadius: 4,
    },
    footer: {
      background: PRIMARY,
      color: "rgba(255,255,255,0.75)",
      padding: "48px 20px 24px",
      textAlign: "center",
    },
    footerLogo: {
      fontSize: 24,
      fontWeight: 800,
      color: WHITE,
      marginBottom: 16,
    },
    footerLinks: {
      display: "flex",
      justifyContent: "center",
      gap: 24,
      flexWrap: "wrap",
      marginBottom: 24,
      fontSize: 14,
    },
    footerCopy: {
      fontSize: 13,
      borderTop: "1px solid rgba(255,255,255,0.1)",
      paddingTop: 24,
      marginTop: 8,
    },
    trust: {
      display: "flex",
      justifyContent: "center",
      gap: 24,
      flexWrap: "wrap",
      marginTop: 20,
    },
    trustItem: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 13,
      color: "rgba(255,255,255,0.85)",
    },
  };

  // ── MAIN VIEWS ──

  if (orderComplete) {
    const deliverables = pkg.features;
    return (
      <div style={s.app}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <span style={{ ...s.logoText, fontSize: 24 }}>🎵 {BRAND}</span>
        </div>
        <div style={s.successContainer}>
          <div style={s.successIcon}>🎉</div>
          <h1 style={s.successTitle}>¡Tu canción está en camino!</h1>
          <p style={s.successSub}>
            Hemos recibido tu pedido. En menos de <strong>48 horas</strong> recibirás tu canción personalizada en{" "}
            <strong>{formData.email}</strong>
          </p>
          <div style={s.deliverables}>
            {deliverables.map((f, i) => (
              <div key={i} style={s.deliverable}>
                <div style={s.deliverableIcon}>{f.icon}</div>
                <div style={s.deliverableText}>{f.text}</div>
              </div>
            ))}
          </div>
          <div style={{ background: LIGHT_GRAY, borderRadius: 14, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: GRAY, marginBottom: 4 }}>Número de pedido</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: PRIMARY }}>
              #{Math.floor(Math.random() * 900000 + 100000)}
            </div>
          </div>
          <button
            style={{ ...s.heroBtnPrimary, width: "100%", fontSize: 15 }}
            onClick={() => { setOrderComplete(false); setCurrentStep(STEP_STORY); setActiveTab("inicio"); setFormData({ recipientName: "", senderName: "", occasion: "", story: "", genre: "", email: "", coupon: "", cardNumber: "", cardExpiry: "", cardCvc: "", cardName: "" }); setCouponApplied(false); }}
          >
            Crear otra canción 🎵
          </button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    if (currentStep === STEP_STORY) {
      return (
        <>
          <h2 style={s.formTitle}>Cuéntanos tu historia 💌</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={s.formGroup}>
              <label style={s.label}>¿Para quién es? *</label>
              <input
                style={{ ...s.input, ...(errors.recipientName ? s.inputError : {}) }}
                placeholder="Nombre del destinatario"
                value={formData.recipientName}
                onChange={(e) => updateField("recipientName", e.target.value)}
              />
              {errors.recipientName && <p style={s.errorMsg}>{errors.recipientName}</p>}
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>¿De parte de? *</label>
              <input
                style={{ ...s.input, ...(errors.senderName ? s.inputError : {}) }}
                placeholder="Tu nombre"
                value={formData.senderName}
                onChange={(e) => updateField("senderName", e.target.value)}
              />
              {errors.senderName && <p style={s.errorMsg}>{errors.senderName}</p>}
            </div>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Ocasión *</label>
            <div style={s.tagGrid}>
              {occasions.map((o) => (
                <button
                  key={o}
                  style={{ ...s.tag, ...(formData.occasion === o ? s.tagSelected : {}) }}
                  onClick={() => updateField("occasion", o)}
                >
                  {o}
                </button>
              ))}
            </div>
            {errors.occasion && <p style={s.errorMsg}>{errors.occasion}</p>}
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Tu historia *</label>
            <textarea
              style={{ ...s.textarea, ...(errors.story ? s.inputError : {}) }}
              placeholder="Cuéntanos momentos especiales, recuerdos, qué hace única a esta persona, frases que les son especiales... ¡Cada detalle importa!"
              value={formData.story}
              onChange={(e) => updateField("story", e.target.value)}
              rows={5}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {errors.story ? <p style={s.errorMsg}>{errors.story}</p> : <span />}
              <span style={{ fontSize: 12, color: formData.story.length >= 30 ? SUCCESS : GRAY }}>
                {formData.story.length} caracteres
              </span>
            </div>
          </div>
        </>
      );
    }

    if (currentStep === STEP_CUSTOMIZE) {
      return (
        <>
          <h2 style={s.formTitle}>Personaliza el estilo 🎸</h2>
          <div style={s.formGroup}>
            <label style={s.label}>Género musical *</label>
            <div style={s.tagGrid}>
              {genres.map((g) => (
                <button
                  key={g}
                  style={{ ...s.tag, ...(formData.genre === g ? s.tagSelected : {}) }}
                  onClick={() => updateField("genre", g)}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.genre && <p style={s.errorMsg}>{errors.genre}</p>}
          </div>

          {/* Spotify-style preview */}
          <div style={{ marginBottom: 24 }}>
            <label style={s.label}>Vista previa de portada tipo Spotify</label>
            <div style={s.spotifyCard}>
              <div style={s.spotifyAlbum}>
                <div style={s.spotifyAlbumContent}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>🎵</div>
                  <div style={{ fontWeight: 800, fontSize: 18, textAlign: "center", padding: "0 16px" }}>
                    {formData.recipientName || "Tu nombre aquí"}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                    {formData.occasion || "Ocasión especial"}
                  </div>
                </div>
              </div>
              <div style={s.spotifyTitle}>{formData.recipientName ? `Para ${formData.recipientName}` : "Tu canción personalizada"}</div>
              <div style={s.spotifyArtist}>{BRAND} • {formData.genre || "Género musical"}</div>
              <div style={s.spotifyBar}><div style={s.spotifyProgress}></div></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#b3b3b3", marginBottom: 16 }}>
                <span>1:23</span><span>3:45</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, fontSize: 22 }}>
                <span style={{ cursor: "pointer" }}>⏮</span>
                <span style={{ width: 44, height: 44, background: WHITE, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>▶️</span>
                <span style={{ cursor: "pointer" }}>⏭</span>
              </div>
            </div>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Tu email (para recibir la canción) *</label>
            <input
              style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            {errors.email && <p style={s.errorMsg}>{errors.email}</p>}
          </div>
        </>
      );
    }

    if (currentStep === STEP_PACKAGE) {
      return (
        <>
          <h2 style={s.formTitle}>Elige tu paquete 🎁</h2>
          {packages.map((p) => (
            <div
              key={p.id}
              style={{ ...s.pkgCard, ...(selectedPackage === p.id ? s.pkgCardSelected : {}) }}
              onClick={() => setSelectedPackage(p.id)}
            >
              {p.badge && (
                <div style={{ ...s.badge, ...(p.id === "ultimate" ? s.badgeBlue : {}), position: "static", display: "inline-block", marginBottom: 8 }}>
                  {p.badge}
                </div>
              )}
              <div style={s.pkgCardHeader}>
                <div>
                  <div style={s.pkgCardName}>{p.name}</div>
                  <div style={{ fontSize: 13, color: "#9ca3af", textDecoration: "line-through" }}>€{p.originalPrice}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={s.pkgCardPrice}>€{p.price}</div>
                  <div style={{ ...s.badge, position: "static", display: "inline-block", fontSize: 10, background: "#dcfce7", color: "#16a34a" }}>
                    -{Math.round((1 - p.price / p.originalPrice) * 100)}% OFF
                  </div>
                </div>
              </div>
              <ul style={s.featureList}>
                {p.features.map((f, i) => (
                  <li key={i} style={s.featureItem}>
                    <span>{f.icon}</span>
                    <span>{f.text}</span>
                  </li>
                ))}
                {p.notIncluded.map((f, i) => (
                  <li key={`n${i}`} style={{ ...s.featureItem, ...s.featureItemNot }}>
                    <span>✗</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", border: `2px solid ${selectedPackage === p.id ? ACCENT : "#d1d5db"}`,
                  background: selectedPackage === p.id ? ACCENT : WHITE,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {selectedPackage === p.id && <span style={{ color: WHITE, fontSize: 12 }}>✓</span>}
                </div>
                <span style={{ fontSize: 14, fontWeight: selectedPackage === p.id ? 700 : 400, color: selectedPackage === p.id ? ACCENT : GRAY }}>
                  {selectedPackage === p.id ? "Paquete seleccionado" : "Seleccionar este paquete"}
                </span>
              </div>
            </div>
          ))}
        </>
      );
    }

    if (currentStep === STEP_PAYMENT) {
      return (
        <>
          <h2 style={s.formTitle}>Pago seguro 🔒</h2>

          {/* Order Summary */}
          <div style={s.summaryBox}>
            <div style={s.summaryTitle}>Resumen del pedido</div>
            <div style={s.summaryRow}>
              <span>Paquete {pkg.name}</span>
              <span>€{pkg.price}</span>
            </div>
            <div style={s.summaryRow}>
              <span style={{ fontSize: 13, color: GRAY }}>Para: {formData.recipientName || "—"}</span>
              <span style={{ fontSize: 13, color: GRAY }}>{formData.occasion || ""}</span>
            </div>
            {couponApplied && (
              <div style={{ ...s.summaryRow, color: SUCCESS }}>
                <span>Descuento 10% (MELODY10)</span>
                <span>-€{discount.toFixed(2)}</span>
              </div>
            )}
            <div style={s.summaryTotal}>
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <div style={s.couponRow}>
              <input
                style={s.couponInput}
                placeholder="Cupón de descuento"
                value={formData.coupon}
                onChange={(e) => { updateField("coupon", e.target.value); setCouponError(""); }}
              />
              <button style={s.couponBtn} onClick={applyCoupon}>Aplicar</button>
            </div>
            {couponError && <p style={{ ...s.errorMsg, marginTop: 6 }}>{couponError}</p>}
            {couponApplied && <p style={{ fontSize: 12, color: SUCCESS, marginTop: 6 }}>✓ Cupón aplicado correctamente</p>}
            <p style={{ fontSize: 11, color: GRAY, marginTop: 8 }}>Prueba: MELODY10 para 10% de descuento</p>
          </div>

          {/* Payment Form */}
          {/* TODO: Reemplazar con Stripe Elements para pagos reales */}
          <div style={s.formGroup}>
            <label style={s.label}>Nombre en la tarjeta *</label>
            <input
              style={{ ...s.input, ...(errors.cardName ? s.inputError : {}) }}
              placeholder="Nombre completo"
              value={formData.cardName}
              onChange={(e) => updateField("cardName", e.target.value)}
            />
            {errors.cardName && <p style={s.errorMsg}>{errors.cardName}</p>}
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Número de tarjeta *</label>
            <input
              style={{ ...s.input, ...(errors.cardNumber ? s.inputError : {}) }}
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => updateField("cardNumber", formatCard(e.target.value))}
              maxLength={19}
            />
            {errors.cardNumber && <p style={s.errorMsg}>{errors.cardNumber}</p>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={s.formGroup}>
              <label style={s.label}>Caducidad *</label>
              <input
                style={{ ...s.input, ...(errors.cardExpiry ? s.inputError : {}) }}
                placeholder="MM/AA"
                value={formData.cardExpiry}
                onChange={(e) => updateField("cardExpiry", formatExpiry(e.target.value))}
                maxLength={5}
              />
              {errors.cardExpiry && <p style={s.errorMsg}>{errors.cardExpiry}</p>}
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>CVC *</label>
              <input
                style={{ ...s.input, ...(errors.cardCvc ? s.inputError : {}) }}
                placeholder="123"
                value={formData.cardCvc}
                onChange={(e) => updateField("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
              />
              {errors.cardCvc && <p style={s.errorMsg}>{errors.cardCvc}</p>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>🔒</span>
            <span style={{ fontSize: 12, color: GRAY }}>Pago 100% seguro con cifrado SSL. No almacenamos tus datos.</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {["💳 Visa", "💳 MC", "💳 Amex", "💳 PayPal"].map((m) => (
              <div key={m} style={{ background: LIGHT_GRAY, borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600, color: GRAY }}>
                {m}
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  const renderCheckoutFlow = () => (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(24px, 5vw, 60px) 20px" }}>
      <div style={s.formContainer}>
        {/* Step Indicator */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 8 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  ...s.stepDot,
                  background: i <= currentStep ? `linear-gradient(135deg, ${PRIMARY}, #2d5a9e)` : "#e5e0d8",
                  color: i <= currentStep ? WHITE : GRAY,
                  boxShadow: i === currentStep ? `0 4px 12px rgba(30,58,95,0.35)` : "none",
                  transform: i === currentStep ? "scale(1.15)" : "scale(1)",
                }}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ ...s.stepLine, background: i < currentStep ? PRIMARY : "#e5e0d8" }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32, padding: "0 4px" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <span style={{ ...s.stepLabel, color: i === currentStep ? PRIMARY : GRAY }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {renderStepContent()}

        <div style={s.navBtns}>
          {currentStep > 0 && (
            <button style={s.btnSecondary} onClick={prevStep}>
              ← Atrás
            </button>
          )}
          <button
            style={{ ...s.btnPrimary, flex: currentStep > 0 ? 2 : 1 }}
            onClick={nextStep}
          >
            {currentStep === STEP_PAYMENT ? `Pagar €${total.toFixed(2)} 🎵` : "Continuar →"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <>
      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroOverlay} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "8px 16px", marginBottom: 24, backdropFilter: "blur(10px)" }}>
            <span>⭐</span>
            <span style={{ color: WHITE, fontSize: 14, fontWeight: 600 }}>+11,500 reseñas 5 estrellas</span>
          </div>
          <h1 style={s.heroTitle}>
            Convierte tus recuerdos<br />
            en <span style={s.heroAccent}>música para siempre</span>
          </h1>
          <p style={s.heroSub}>
            Canciones personalizadas creadas con amor. El regalo más único y emotivo que jamás existirá.
          </p>
          <div style={s.heroBtns}>
            <button style={s.heroBtnPrimary} onClick={() => setActiveTab("crear")}>
              🎵 Crear mi canción
            </button>
            <button style={s.heroBtnSecondary} onClick={() => setActiveTab("paquetes")}>
              Ver paquetes
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={s.statsBar}>
        <div style={s.statsInner}>
          {[
            { num: "11,500+", label: "Reseñas ⭐⭐⭐⭐⭐" },
            { num: "48h", label: "Tiempo de entrega" },
            { num: "50+", label: "Géneros musicales" },
            { num: "100%", label: "Satisfacción garantizada" },
          ].map((stat) => (
            <div key={stat.num} style={s.statItem}>
              <div style={s.statNum}>{stat.num}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>Qué incluye tu regalo</h2>
        <p style={s.sectionSub}>Cada paquete incluye una experiencia completa e irrepetible</p>
        <div style={s.productsGrid}>
          {[
            { icon: "🎵", title: "Canción personalizada", desc: "Una canción única creada desde cero con tu historia, en el género que elijas. Formato MP3 de alta calidad." },
            { icon: "🎨", title: "Portada tipo Spotify", desc: "Arte visual personalizado estilo Spotify con los nombres y la ocasión especial. Lista para compartir." },
            { icon: "📱", title: "Código QR único", desc: "Un código QR que lleva directamente a tu canción. Imprímelo en tarjetas, marcos o cualquier detalle físico." },
            { icon: "📄", title: "Letra en PDF", desc: "La letra completa de la canción en un diseño elegante y listo para imprimir o enmarcar como recuerdo." },
          ].map((item) => (
            <div key={item.title} style={{ ...s.productCard, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: PRIMARY, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: WHITE, padding: "60px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={s.sectionTitle}>¿Cómo funciona?</h2>
          <p style={s.sectionSub}>Tan fácil como contar una historia</p>
          <div style={s.stepsGrid}>
            {[
              { n: "1", title: "Cuéntanos tu historia", desc: "Comparte los momentos, recuerdos y detalles especiales de la persona que quieres sorprender." },
              { n: "2", title: "Elige estilo y paquete", desc: "Selecciona el género musical y el paquete que mejor se adapta a lo que quieres regalar." },
              { n: "3", title: "Nuestros artistas crean", desc: "Músicos y compositores profesionales crean tu canción única en menos de 48 horas." },
              { n: "4", title: "Recibe y sorprende", desc: "Recibes tu canción, portada, QR y PDF por email. ¡El regalo que nunca olvidarán!" },
            ].map((step) => (
              <div key={step.n} style={s.howStep}>
                <div style={s.howStepNum}>{step.n}</div>
                <h3 style={s.howStepTitle}>{step.title}</h3>
                <p style={s.howStepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button style={s.heroBtnPrimary} onClick={() => setActiveTab("crear")}>
              Empezar ahora ✨
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>Lo que dicen nuestros clientes</h2>
        <p style={s.sectionSub}>Historias reales de personas que convirtieron recuerdos en música</p>
        <div style={s.reviewsGrid}>
          {reviews.map((r, i) => (
            <div key={i} style={s.reviewCard}>
              <div style={s.reviewHeader}>
                <div style={s.reviewAvatar}>{r.avatar}</div>
                <div>
                  <div style={s.reviewName}>{r.name}</div>
                  <div style={s.reviewOccasion}>{r.occasion}</div>
                </div>
              </div>
              <div style={s.reviewStars}>{"⭐".repeat(r.rating)}</div>
              <p style={s.reviewText}>"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const renderPackages = () => (
    <section style={s.section}>
      <h2 style={s.sectionTitle}>Elige tu paquete</h2>
      <p style={s.sectionSub}>Todos los paquetes incluyen entrega en 48 horas y garantía de satisfacción</p>
      <div style={s.productsGrid}>
        {packages.map((p) => (
          <div
            key={p.id}
            style={{
              ...s.productCard,
              ...(p.badge && p.id === "premium" ? s.productCardFeatured : {}),
              ...(hoveredPackage === p.id ? { transform: "translateY(-6px)", boxShadow: "0 16px 48px rgba(0,0,0,0.12)" } : {}),
            }}
            onMouseEnter={() => setHoveredPackage(p.id)}
            onMouseLeave={() => setHoveredPackage(null)}
          >
            {p.badge && (
              <div style={{ ...s.badge, ...(p.id === "ultimate" ? s.badgeBlue : {}) }}>
                {p.badge}
              </div>
            )}
            <h3 style={s.productName}>{p.name}</h3>
            <div style={s.productPrice}>€{p.price}</div>
            <div style={s.productOriginalPrice}>€{p.originalPrice}</div>
            <div style={{ ...s.badge, position: "static", display: "inline-block", background: "#dcfce7", color: "#16a34a", marginBottom: 16 }}>
              Ahorra €{(p.originalPrice - p.price).toFixed(2)}
            </div>
            <ul style={s.featureList}>
              {p.features.map((f, i) => (
                <li key={i} style={s.featureItem}>
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </li>
              ))}
              {p.notIncluded.map((f, i) => (
                <li key={`n${i}`} style={{ ...s.featureItem, ...s.featureItemNot }}>
                  <span style={{ fontSize: 12 }}>✗</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              style={{
                ...s.selectPkgBtn,
                background: p.id === "premium"
                  ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`
                  : p.id === "ultimate"
                  ? `linear-gradient(135deg, ${PRIMARY}, #2d5a9e)`
                  : "#f3f0eb",
                color: p.id === "basic" ? PRIMARY : WHITE,
                boxShadow: p.id !== "basic" ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
              }}
              onClick={() => { setSelectedPackage(p.id); setActiveTab("crear"); setCurrentStep(STEP_PACKAGE); }}
            >
              Elegir {p.name}
            </button>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: WHITE, borderRadius: 12, padding: "12px 20px", border: "1px solid #e5e0d8" }}>
          <span>🔒</span>
          <span style={{ fontSize: 14, color: GRAY }}>Pago seguro · Satisfacción garantizada · Entrega en 48h</span>
        </div>
      </div>
    </section>
  );

  return (
    <div style={s.app}>
      {/* Navigation */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={s.logo} onClick={() => setActiveTab("inicio")}>
            <div style={s.logoIcon}>🎵</div>
            <span style={s.logoText}>{BRAND}</span>
          </div>
          <div style={{ ...s.navLinks, display: "flex" }}>
            {[
              { id: "inicio", label: "Inicio" },
              { id: "paquetes", label: "Paquetes" },
              { id: "crear", label: "Crear canción" },
            ].map((tab) => (
              <button
                key={tab.id}
                style={{
                  ...s.navLink,
                  ...(activeTab === tab.id ? s.navLinkActive : {}),
                }}
                onClick={() => { setActiveTab(tab.id); if (tab.id === "crear") setCurrentStep(STEP_STORY); }}
              >
                {tab.label}
              </button>
            ))}
            <button style={s.ctaBtn} onClick={() => { setActiveTab("crear"); setCurrentStep(STEP_STORY); }}>
              🎵 Crear regalo
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      {activeTab === "inicio" && renderHome()}
      {activeTab === "paquetes" && renderPackages()}
      {activeTab === "crear" && renderCheckoutFlow()}

      {/* Footer */}
      <footer style={s.footer}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={s.footerLogo}>🎵 {BRAND}</div>
          <p style={{ fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
            Convirtiendo recuerdos en música desde 2021.<br />
            El regalo más único y emotivo que puedes dar.
          </p>
          <div style={s.footerLinks}>
            {["Inicio", "Paquetes", "Cómo funciona", "Reseñas", "Contacto", "Política de privacidad"].map((l) => (
              <span key={l} style={{ cursor: "pointer", color: "rgba(255,255,255,0.75)" }}>{l}</span>
            ))}
          </div>
          <div style={s.trust}>
            {["🔒 Pago seguro", "⭐ +11,500 reseñas", "⚡ Entrega 48h", "💯 Garantía de satisfacción"].map((t) => (
              <div key={t} style={s.trustItem}>{t}</div>
            ))}
          </div>
          <div style={s.footerCopy}>
            © 2024 {BRAND}. Todos los derechos reservados. Hecho con ❤️ para tus momentos especiales.
          </div>
        </div>
      </footer>
    </div>
  );
}