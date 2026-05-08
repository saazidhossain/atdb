// ─────────────────────────────────────────────────────────────────────
// ATDB Trade International — Inventory Master List (single source of truth)
// Rewritten 2026-05-08 to match the official Product_Inventory_Master_List
// PDF 1:1. No fabricated SKUs; every ID matches the master list.
// Real photos are only declared where folders exist on disk:
//   CR-002, EX-002, LD-001, RR-004, RR-005, RR-008, SP-004, SP-005
// ─────────────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = "8801712106242";

export function getWhatsAppRentUrl(name: string, id: string, capacity: string) {
  const msg = `Hello ATDB Trade International,\n\nI'd like to rent the ${name} (${id} · ${capacity}).\nProject location: \nDuration (days): \nPlease share availability and a quotation. — ATDB website`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function getWhatsAppQuoteUrl() {
  const msg = `Hello ATDB Trade International,\n\nI'd like to discuss a heavy-equipment rental for an upcoming project. Please share availability and a quotation.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export interface EquipmentVideo {
  src: string;
  poster: string;
  label: string;
  labelBn?: string;
}

export type EquipmentCategorySlug =
  | "rollers" | "cranes" | "excavators" | "loaders" | "support";

export interface EquipmentItem {
  id: string;
  category: EquipmentCategorySlug;
  categoryLabel: string;
  name: string;
  brand: string;
  model: string;
  capacity: string;
  origin: string;
  year: number;
  fuel: string;
  quantity: string;       // master-list quantity (e.g. "01", "02", "03", "05")
  notes: string;
  image: string;          // mockup / catalogue photo
  realPhotos?: string[];  // present only when folder verified on disk
  videos?: EquipmentVideo[];
  featured?: boolean;
  banglaLabel?: string;
}

// Category fallback hero images (used when no brand-specific mockup exists)
const FALLBACK = {
  cranes:     "/assets/eq-crane-liebherr-ByQNLxCP.webp",
  rollers:    "/assets/eq-roller-sakai-Dfx1GNHG.webp",
  excavators: "/assets/eq-excavator-cat-C6cwgueO.webp",
  loaders:    "/assets/loader-detail-C6wUMbjI.webp",
  support:    "/assets/eq-support-BFxzVAyL.webp",
} as const;

export const fleetVideos: EquipmentVideo[] = [
  { src: "/videos/honda-rammer-action.mp4", poster: "/videos/honda-rammer-poster.jpg", label: "Honda 80k-100 Sand Compactor in Action", labelBn: "হোন্ডা ৮০কে স্যান্ড কম্প্যাক্টর — সক্রিয়" },
  { src: "/videos/cat-320bu-action.mp4",    poster: "/videos/cat-320bu-poster.jpg",    label: "CAT 320BU Excavator — Active Site Operation", labelBn: "ক্যাট ৩২০বিইউ এক্সক্যাভেটর — সাইট অপারেশন" },
];

// ── EQUIPMENT (master list, exact) ───────────────────────────────────
export const equipmentData: EquipmentItem[] = [
  // ─── A. CRANE FLEET (7) ────────────────────────────────────────────
  { id: "ATDB-CR-001", category: "cranes", categoryLabel: "Mobile Cranes", name: "Liebherr LTM 1120-5.1", brand: "Liebherr", model: "LTM 1120-5.1", capacity: "120 Tons", origin: "Germany", year: 2005, fuel: "Diesel", quantity: "01", notes: "Telescopic Mobile Crane", image: "/assets/liebherr-ltm-1120-BuAGIUOe.webp", featured: true, banglaLabel: "লিবহার ১২০ টন" },
  { id: "ATDB-CR-002", category: "cranes", categoryLabel: "Mobile Cranes", name: "Liebherr LTM 1070-4.1", brand: "Liebherr", model: "LTM 1070-4.1", capacity: "70 Tons",  origin: "Germany", year: 2005, fuel: "Diesel", quantity: "01", notes: "Telescopic Mobile Crane", image: "/assets/liebherr-ltm-1070-DfjcjeyC.webp", featured: true, banglaLabel: "লিবহার ৭০ টন",
    realPhotos: ["/equipment/ATDB-CR-002/ATDB-CR-002-01.webp", "/equipment/ATDB-CR-002/ATDB-CR-002-02.webp"] },
  { id: "ATDB-CR-003", category: "cranes", categoryLabel: "Mobile Cranes", name: "Kato KR-50H-V (SS-500SP-V)", brand: "Kato", model: "KR-50H-V (SS-500SP-V)", capacity: "50 Tons", origin: "Japan",   year: 2003, fuel: "Diesel", quantity: "01", notes: "Hydraulic Truck Crane", image: "/assets/kato-kr50h-DGZcibeL.webp", featured: true, banglaLabel: "কাটো ৫০ টন" },
  { id: "ATDB-CR-004", category: "cranes", categoryLabel: "Mobile Cranes", name: "Kato KR-35H-III",         brand: "Kato",     model: "KR-35H-III",     capacity: "35 Tons", origin: "Japan",   year: 2012, fuel: "Diesel", quantity: "01", notes: "Hydraulic Truck Crane", image: "/assets/kato-kr50h-DGZcibeL.webp", banglaLabel: "কাটো ৩৫ টন" },
  { id: "ATDB-CR-005", category: "cranes", categoryLabel: "Mobile Cranes", name: "Kato KR-25H-V7",          brand: "Kato",     model: "KR-25H-V7",      capacity: "25 Tons", origin: "Japan",   year: 2017, fuel: "Diesel", quantity: "01", notes: "Hydraulic Truck Crane", image: "/assets/kato-kr25-FmtLzIgv.webp", banglaLabel: "কাটো ২৫ টন" },
  { id: "ATDB-CR-006", category: "cranes", categoryLabel: "Mobile Cranes", name: "Kato KR-150",             brand: "Kato",     model: "KR-150",         capacity: "15 Tons", origin: "Japan",   year: 0,    fuel: "Diesel", quantity: "01", notes: "Lattice Boom Crane",     image: "/assets/kato-kr150-aViKxDv6.webp", banglaLabel: "কাটো ১৫ টন" },
  { id: "ATDB-CR-007", category: "cranes", categoryLabel: "Mobile Cranes", name: "Kato KR-10H",             brand: "Kato",     model: "KR-10H",         capacity: "10 Tons", origin: "Japan",   year: 2002, fuel: "Diesel", quantity: "01", notes: "Hydraulic Truck Crane", image: "/assets/kato-kr150-aViKxDv6.webp", banglaLabel: "কাটো ১০ টন" },

  // ─── B. ROAD ROLLERS (9) ───────────────────────────────────────────
  { id: "ATDB-RR-001", category: "rollers", categoryLabel: "Road Rollers", name: "Sakai SV902335 3-Wheel Steel", brand: "Sakai",   model: "SV902335",      capacity: "10 Ton",   origin: "Japan",  year: 2014, fuel: "Diesel", quantity: "01", notes: "3 Wheel Steel Roller",        image: "/assets/sakai-sv900-CJzZY7Ph.webp", featured: true, banglaLabel: "সাকাই ১০ টন ৩-হুইল" },
  { id: "ATDB-RR-002", category: "rollers", categoryLabel: "Road Rollers", name: "Sakai RS902335 3-Wheel Steel", brand: "Sakai",   model: "RS902335",      capacity: "10 Ton",   origin: "Japan",  year: 2014, fuel: "Diesel", quantity: "01", notes: "3 Wheel Steel Roller",        image: "/assets/sakai-sv900-CJzZY7Ph.webp" },
  { id: "ATDB-RR-003", category: "rollers", categoryLabel: "Road Rollers", name: "Dynapac HP89042ST",            brand: "Dynapac", model: "HP89042ST",     capacity: "10 Ton",   origin: "Sweden", year: 2013, fuel: "Diesel", quantity: "01", notes: "1 Drum & 2 Tier Wheel",       image: "/assets/dynapac-cc20-C2Nvs5Az.webp", banglaLabel: "ডায়নাপ্যাক ১০ টন" },
  { id: "ATDB-RR-004", category: "rollers", categoryLabel: "Road Rollers", name: "Dynapac CC20 Double Drum",     brand: "Dynapac", model: "CC20 (489759)", capacity: "12 Ton",   origin: "Italy",  year: 2012, fuel: "Diesel", quantity: "01", notes: "Double Drum Tandem Roller",   image: "/assets/dynapac-cc20-C2Nvs5Az.webp", featured: true, banglaLabel: "ডায়নাপ্যাক CC20 ডাবল ড্রাম",
    realPhotos: ["/equipment/ATDB-RR-004/ATDB-RR-004-01.webp", "/equipment/ATDB-RR-004/ATDB-RR-004-02.webp"] },
  { id: "ATDB-RR-005", category: "rollers", categoryLabel: "Road Rollers", name: "Bomag BW121.A.C Vibratory",    brand: "Bomag",   model: "BW121.A.C",     capacity: "4/6 Ton",  origin: "Japan",  year: 2015, fuel: "Diesel", quantity: "01", notes: "Vibratory Tandem Roller",     image: "/assets/bomag-bw-C1fM8YJB.webp", banglaLabel: "বোম্যাগ ভাইব্রেটরি",
    realPhotos: ["/equipment/ATDB-RR-005/ATDB-RR-005-01.webp", "/equipment/ATDB-RR-005/ATDB-RR-005-02.webp"] },
  { id: "ATDB-RR-006", category: "rollers", categoryLabel: "Road Rollers", name: "Hawa JV-40-CW1 Vibratory",     brand: "Hawa",    model: "JV-40-CW1",     capacity: "4/6 Ton",  origin: "Japan",  year: 2013, fuel: "Diesel", quantity: "01", notes: "Vibratory Tandem Roller",     image: "/assets/hawa-tandem-CsNlDnh9.webp", banglaLabel: "হাওয়া ভাইব্রেটরি" },
  { id: "ATDB-RR-007", category: "rollers", categoryLabel: "Road Rollers", name: "Advance 3-Wheel Steel Roller", brand: "Advance", model: "GNT 3367",     capacity: "8.5 Ton",  origin: "England", year: 2015, fuel: "Diesel", quantity: "01", notes: "3 Wheel Steel Roller",        image: "/assets/advance-3wheel-AY1qh_Tr.webp", banglaLabel: "অ্যাডভান্স ৩-হুইল" },
  { id: "ATDB-RR-008", category: "rollers", categoryLabel: "Road Rollers", name: "Sakai HV60ST Mini Tandem",     brand: "Sakai",   model: "HV60ST",        capacity: "1/2 Ton",  origin: "Japan",  year: 2015, fuel: "Diesel", quantity: "02", notes: "2 Drum Steel Vibratory (2 units: SI-VHV12-42135 & SI-VHV12-46003)", image: "/assets/sakai-mini-DjZpy-kY.webp", featured: true, banglaLabel: "সাকাই HV60 মিনি ট্যান্ডেম",
    realPhotos: ["/equipment/ATDB-RR-008/ATDB-RR-008-01.webp", "/equipment/ATDB-RR-008/ATDB-RR-008-02.webp", "/equipment/ATDB-RR-008/ATDB-RR-008-03.webp"] },
  { id: "ATDB-RR-009", category: "rollers", categoryLabel: "Road Rollers", name: "Sakai 920 Drum Vibratory",     brand: "Sakai",   model: "920",           capacity: "3.5/5 Ton",origin: "Japan",  year: 2014, fuel: "Diesel", quantity: "01", notes: "Drum Steel Vibratory Roller", image: "/assets/sakai-mini-DjZpy-kY.webp", banglaLabel: "সাকাই ৯২০" },

  // ─── C. EXCAVATORS & HEAVY MACHINERY (3) ───────────────────────────
  { id: "ATDB-EX-001", category: "excavators", categoryLabel: "Excavators & Compactors", name: "Caterpillar CAT 11020 Soil Compactor", brand: "Caterpillar", model: "CAT 11020", capacity: "12/18 Ton", origin: "Japan", year: 2014, fuel: "Diesel", quantity: "01", notes: "Vibratory Soil Compactor", image: "/assets/cat-cs54-BcKNEclD.webp", banglaLabel: "ক্যাট সয়েল কম্প্যাক্টর" },
  { id: "ATDB-EX-002", category: "excavators", categoryLabel: "Excavators & Compactors", name: "Caterpillar 320BU Excavator",         brand: "Caterpillar", model: "320BU",     capacity: "20 Ton",    origin: "Japan", year: 2015, fuel: "Diesel", quantity: "01", notes: "Chain-Wheel Hydraulic Excavator", image: "/assets/cat-320-BDmJ-mZM.webp", featured: true, banglaLabel: "ক্যাট ৩২০বিইউ এক্সক্যাভেটর",
    realPhotos: ["/equipment/ATDB-EX-002/ATDB-EX-002-01.webp", "/equipment/ATDB-EX-002/ATDB-EX-002-02.webp"],
    videos: [{ src: "/videos/cat-320bu-action.mp4", poster: "/videos/cat-320bu-poster.jpg", label: "CAT 320BU in Action", labelBn: "ক্যাট ৩২০বিইউ — অ্যাকশন" }] },
  { id: "ATDB-EX-003", category: "excavators", categoryLabel: "Excavators & Compactors", name: "Komatsu PC40 Mini Excavator",         brand: "Komatsu",     model: "PC40",      capacity: "4 Ton",     origin: "Japan", year: 2017, fuel: "Diesel", quantity: "01", notes: "Chain-Wheel Mini Excavator", image: "/assets/komatsu-pc40-Bi6fnLlz.webp", banglaLabel: "কোমাটসু PC40" },

  // ─── C(ii). LOADERS / BACKHOES (3) ─────────────────────────────────
  { id: "ATDB-LD-001", category: "loaders", categoryLabel: "Loaders & Backhoes", name: "CASE 770EX Magnum Backhoe Loader", brand: "CASE", model: "770EX Magnum", capacity: "Backhoe Loader", origin: "China", year: 2018, fuel: "Diesel", quantity: "01", notes: "NKJ-Series Backhoe Loader", image: "/assets/case-770ex-Bt_b90UZ.webp", featured: true, banglaLabel: "কেস ৭৭০EX ব্যাকহো লোডার",
    realPhotos: ["/equipment/ATDB-LD-001/ATDB-LD-001-01.webp"] },
  { id: "ATDB-LD-002", category: "loaders", categoryLabel: "Loaders & Backhoes", name: "XCMG KMC 950 Pay Loader",          brand: "XCMG", model: "KMC 950",      capacity: "Pay Loader",     origin: "China", year: 2017, fuel: "Diesel", quantity: "01", notes: "TNV-Series Wheel Loader",  image: "/assets/xcmg-loader-CkN5S8NO.webp", banglaLabel: "এক্সসিএমজি পে লোডার" },
  { id: "ATDB-LD-003", category: "loaders", categoryLabel: "Loaders & Backhoes", name: "JCB JC 0.6 Backhoe Loader",        brand: "JCB",  model: "JC 0.6",       capacity: "Backhoe Loader", origin: "India", year: 2014, fuel: "Diesel", quantity: "01", notes: "Backhoe Loader",            image: "/assets/jcb-backhoe-CBqWILB0.webp", banglaLabel: "জেসিবি ব্যাকহো" },

  // ─── D. SUPPORT EQUIPMENT (10 line items, per ATDB Profile) ─────────
  { id: "ATDB-SP-001", category: "support", categoryLabel: "Support Equipment", name: "Honda GQR-350 Cutting Machine",   brand: "Honda",    model: "GQR-350",     capacity: "Concrete Cutter", origin: "Japan", year: 2021, fuel: "Petrol",   quantity: "02", notes: "Asphalt / Concrete Cutting Machine", image: FALLBACK.support, banglaLabel: "হোন্ডা GQR-350 কাটার" },
  { id: "ATDB-SP-002", category: "support", categoryLabel: "Support Equipment", name: "Honda HSP-500C Cutting Machine",  brand: "Honda",    model: "HSP-500C",    capacity: "Concrete Cutter", origin: "Japan", year: 2020, fuel: "Petrol",   quantity: "02", notes: "Heavy-Duty Concrete Cutting Machine", image: FALLBACK.support, banglaLabel: "হোন্ডা HSP-500C কাটার" },
  { id: "ATDB-SP-003", category: "support", categoryLabel: "Support Equipment", name: "Honda HZR-90 Plate Compactor",    brand: "Honda",    model: "HZR-90",      capacity: "Plate Compactor", origin: "Japan", year: 2020, fuel: "Petrol",   quantity: "02", notes: "Forward Plate Compactor", image: "/assets/support-tools-Dnowl7z-.webp", banglaLabel: "হোন্ডা HZR-90 প্লেট কম্প্যাক্টর" },
  { id: "ATDB-SP-004", category: "support", categoryLabel: "Support Equipment", name: "Honda 80k-100 Sand Compactor (Rammer)", brand: "Honda", model: "80k-100", capacity: "Sand Rammer", origin: "Japan", year: 2019, fuel: "Petrol", quantity: "02", notes: "Sand / Soil Tamping Rammer", image: "/assets/support-tools-Dnowl7z-.webp", banglaLabel: "হোন্ডা ৮০কে স্যান্ড কম্প্যাক্টর",
    realPhotos: ["/equipment/ATDB-SP-004/ATDB-SP-004-01.webp", "/equipment/ATDB-SP-004/ATDB-SP-004-02.webp", "/equipment/ATDB-SP-004/ATDB-SP-004-03.webp"],
    videos: [{ src: "/videos/honda-rammer-action.mp4", poster: "/videos/honda-rammer-poster.jpg", label: "Honda Rammer — Sand Compaction", labelBn: "হোন্ডা র‍্যামার — স্যান্ড কম্প্যাকশন" }] },
  { id: "ATDB-SP-005", category: "support", categoryLabel: "Support Equipment", name: "Honda ER2500CX Generator",        brand: "Honda",    model: "ER2500CX",    capacity: "2.5 kVA",         origin: "Japan", year: 2019, fuel: "Petrol",   quantity: "03", notes: "Portable Inverter Generator", image: FALLBACK.support, banglaLabel: "হোন্ডা ER2500CX জেনারেটর",
    realPhotos: ["/equipment/ATDB-SP-005/ATDB-SP-005-01.webp"] },
  { id: "ATDB-SP-006", category: "support", categoryLabel: "Support Equipment", name: "Zhejiang BS-8000WT Generator",    brand: "Zhejiang", model: "BS-8000WT",   capacity: "8 kVA",           origin: "China", year: 2022, fuel: "Diesel",   quantity: "01", notes: "Portable Site Generator", image: FALLBACK.support, banglaLabel: "ঝেজিয়াং জেনারেটর" },
  { id: "ATDB-SP-007", category: "support", categoryLabel: "Support Equipment", name: "Honda 700 RPM Asphalt Core Cutter", brand: "Honda",  model: "700 RPM",     capacity: "Core Cutter",     origin: "Japan", year: 2021, fuel: "Petrol",   quantity: "01", notes: "Asphalt Core Cutting Machine", image: FALLBACK.support, banglaLabel: "হোন্ডা অ্যাসফল্ট কোর কাটার" },
  { id: "ATDB-SP-008", category: "support", categoryLabel: "Support Equipment", name: "Honda GXCR200ST Big Drill Hammer", brand: "Honda",   model: "GXCR200ST",   capacity: "Drill Hammer",    origin: "Japan", year: 2022, fuel: "Petrol",   quantity: "05", notes: "Heavy-Duty Drill Hammer", image: FALLBACK.support, banglaLabel: "হোন্ডা ড্রিল হ্যামার" },
  { id: "ATDB-SP-009", category: "support", categoryLabel: "Support Equipment", name: "TATA T7 Ultra Drum Truck",        brand: "TATA",     model: "T7 Ultra 3900/HSD", capacity: "Drum Truck", origin: "India", year: 2017, fuel: "Diesel",   quantity: "02", notes: "Site Drum / Cargo Truck", image: "/assets/tata-truck-k27qoXaB.webp", banglaLabel: "টাটা T7 আল্ট্রা ড্রাম ট্রাক" },
  { id: "ATDB-SP-010", category: "support", categoryLabel: "Support Equipment", name: "Honda HZRH50 Power Trowel",        brand: "Honda",    model: "HZRH50",      capacity: "Power Trowel",    origin: "Japan", year: 2017, fuel: "Petrol",   quantity: "02", notes: "Floor Finishing Power Trowel Machine", image: FALLBACK.support, banglaLabel: "হোন্ডা পাওয়ার ট্রোয়েল" },
];

// ── CATEGORIES (display metadata; counts computed from data) ─────────
const CATEGORY_META: Array<{
  slug: EquipmentCategorySlug; label: string; bangla: string; image: string; range: string; brands: string;
}> = [
  { slug: "cranes",     label: "Mobile Cranes",            bangla: "ক্রেন বহর",          image: "/assets/liebherr-ltm-1120-BuAGIUOe.webp", range: "10T to 120T",  brands: "Liebherr, Kato" },
  { slug: "rollers",    label: "Road Rollers",             bangla: "রোড রোলার",          image: "/assets/sakai-sv900-CJzZY7Ph.webp",       range: "1T to 12T",    brands: "Sakai, Dynapac, Bomag, Hawa, Advance" },
  { slug: "excavators", label: "Excavators & Compactors",  bangla: "এক্সক্যাভেটর",       image: "/assets/cat-320-BDmJ-mZM.webp",           range: "4T to 20T",    brands: "Caterpillar, Komatsu" },
  { slug: "loaders",    label: "Loaders & Backhoes",       bangla: "লোডার ও ব্যাকহো",    image: "/assets/case-770ex-Bt_b90UZ.webp",        range: "",             brands: "CASE, XCMG, JCB" },
  { slug: "support",    label: "Support Equipment",        bangla: "সাপোর্ট ইকুইপমেন্ট", image: FALLBACK.support,                          range: "",             brands: "Generators, compactors, cutters, drills & TATA trucks" },
];

function countUnits(slug: EquipmentCategorySlug): number {
  return equipmentData
    .filter(e => e.category === slug)
    .reduce((sum, e) => sum + (parseInt(e.quantity, 10) || 1), 0);
}

export const equipmentCategories = CATEGORY_META.map(c => {
  const lineItems = equipmentData.filter(e => e.category === c.slug).length;
  const units = countUnits(c.slug);
  return {
    ...c,
    units: `${units} units`,
    lineItems,
  };
});

export const projectsData = [
  { title: "Jamuna Multipurpose Bridge — Contract 1", titleBn: "যমুনা বহুমুখী সেতু — কন্ট্রাক্ট ১", type: "Infrastructure", typeBn: "অবকাঠামো", location: "Tangail / Sirajganj", locationBn: "টাঙ্গাইল / সিরাজগঞ্জ", description: "Critical site clearance and outstanding remedial civil works on the iconic Jamuna bridge.", descriptionBn: "যমুনা সেতুর গুরুত্বপূর্ণ সাইট ক্লিয়ারেন্স এবং অবশিষ্ট রেমিডিয়াল সিভিল ওয়ার্কস।", image: "/assets/jamuna-bridge-DWAJN5oY.jpg" },
  { title: "RTIP-2 Road Project", titleBn: "RTIP-2 রোড প্রজেক্ট", type: "Infrastructure", typeBn: "অবকাঠামো", location: "Ghatail, Tangail · Ch. 15+800 → 14+800", locationBn: "ঘাটাইল, টাঙ্গাইল · চেইনেজ ১৫+৮০০ → ১৪+৮০০", description: "Roadway construction, repair and maintenance across a 1 km chainage section.", descriptionBn: "১ কি.মি. চেইনেজ অংশজুড়ে সড়ক নির্মাণ, মেরামত ও রক্ষণাবেক্ষণ কাজ।", image: "/assets/rtip2-ghatail-BjyhsUDn.jpg" },
  { title: "BRT Project (Airport → Gazipur)", titleBn: "বিআরটি প্রজেক্ট (এয়ারপোর্ট → গাজীপুর)", type: "Infrastructure", typeBn: "অবকাঠামো", location: "Dhaka–Gazipur Corridor", locationBn: "ঢাকা–গাজীপুর করিডোর", description: "Extensive cleaning, de-watering and pavement repair works along the BRT elevated corridor.", descriptionBn: "বিআরটি এলিভেটেড করিডোরজুড়ে ব্যাপক ক্লিনিং, ডি-ওয়াটারিং এবং পেভমেন্ট মেরামত কাজ।", image: "/assets/brt-airport-gazipur-BHRy-tFc.jpg" },
  { title: "Centeon Pharma — 3-Storey RCC Factory", titleBn: "সেন্টিয়ন ফার্মা — ৩-তলা আর.সি.সি ফ্যাক্টরি", type: "Industrial", typeBn: "শিল্প", location: "Mowna, Sreepur, Gazipur", locationBn: "মাওনা, শ্রীপুর, গাজীপুর", description: "45,000 sq.ft 3-storey RCC factory building, utility structures and 500 m boundary wall.", descriptionBn: "৪৫,০০০ স্কয়ার ফিটের ৩-তলা আর.সি.সি ফ্যাক্টরি বিল্ডিং, ইউটিলিটি স্ট্রাকচার ও ৫০০ মি. সীমানা প্রাচীর।", image: "/assets/centeon-pharma-Docq34Z7.jpg" },
  { title: "Pharmacil Ltd — 3-Storey Factory", titleBn: "ফার্মাসিল লিমিটেড — ৩-তলা ফ্যাক্টরি", type: "Industrial", typeBn: "শিল্প", location: "BSCIC, Tongi", locationBn: "বিসিক, টঙ্গী", description: "Construction of a 33,000 sq.ft 3-storey pharmaceutical factory building.", descriptionBn: "৩৩,০০০ স্কয়ার ফিটের ৩-তলা ফার্মাসিউটিক্যাল ফ্যাক্টরি বিল্ডিং নির্মাণ।", image: "/assets/pharmacil-tongi-CdLmYy7u.jpg" },
  { title: "Pharma Ashia Ltd — Site Development", titleBn: "ফার্মা এশিয়া লিমিটেড — সাইট ডেভেলপমেন্ট", type: "Industrial", typeBn: "শিল্প", location: "Rajendrapur, Gazipur", locationBn: "রাজেন্দ্রপুর, গাজীপুর", description: "General site development, protection-bund works and temporary site offices.", descriptionBn: "সাইট ডেভেলপমেন্ট, সাইট প্রোটেকশন বাঁধ নির্মাণ ও অস্থায়ী সাইট অফিস স্থাপন।", image: "/assets/pharma-ashia-site-BOvJJLGj.jpg" },
  { title: "Pharma Ashia — Bituminous Internal Road", titleBn: "ফার্মা এশিয়া — বিটুমিনাস ইন্টার্নাল রোড", type: "Roadways", typeBn: "সড়ক", location: "Gazipur · 400 m × 6 m", locationBn: "গাজীপুর · ৪০০ মি. × ৬ মি.", description: "Construction of an internal bituminous carpeting road, 400 m long × 6 m wide.", descriptionBn: "৪০০ মি. দৈর্ঘ্য × ৬ মি. প্রস্থের ইন্টার্নাল বিটুমিনাস কার্পেটিং রোড নির্মাণ।", image: "/assets/pharma-ashia-road-CqDGx7wV.jpg" },
  { title: "Centeon Pharma — RCC Internal Road", titleBn: "সেন্টিয়ন ফার্মা — আর.সি.সি ইন্টার্নাল রোড", type: "Roadways", typeBn: "সড়ক", location: "Gazipur · 300 m × 5.5 m", locationBn: "গাজীপুর · ৩০০ মি. × ৫.৫ মি.", description: "Construction of an internal RCC paved road, 300 m long × 5.5 m wide.", descriptionBn: "৩০০ মি. দৈর্ঘ্য × ৫.৫ মি. প্রস্থের ইন্টার্নাল আর.সি.সি পেভড রোড নির্মাণ।", image: "/assets/centeon-rcc-road-CfkOH6rw.jpg" },
  { title: "AMC Knit Composite — RCC Internal Road", titleBn: "এএমসি নিট কম্পোজিট — আর.সি.সি ইন্টার্নাল রোড", type: "Roadways", typeBn: "সড়ক", location: "Bhabanipur, Gazipur · 300 m × 5 m", locationBn: "ভবানীপুর, গাজীপুর · ৩০০ মি. × ৫ মি.", description: "Construction of an internal RCC paved road, 300 m long × 5 m wide.", descriptionBn: "৩০০ মি. দৈর্ঘ্য × ৫ মি. প্রস্থের ইন্টার্নাল আর.সি.সি পেভড রোড নির্মাণ।", image: "/assets/amc-knit-road-DimuXlSt.jpg" },
  { title: "SMC ORS — Underground RCC Reservoir", titleBn: "এসএমসি ওআরএস — ভূগর্ভস্থ আর.সি.সি রিজার্ভার", type: "Civil Works", typeBn: "সিভিল ওয়ার্কস", location: "Bhaluka, Mymensingh · 20 m × 10 m × 3 m", locationBn: "ভালুকা, ময়মনসিংহ · ২০ মি. × ১০ মি. × ৩ মি.", description: "Underground RCC reservoir for raw and treated water.", descriptionBn: "র' এবং ট্রিটেড পানির ভূগর্ভস্থ আর.সি.সি রিজার্ভার নির্মাণ।", image: "/assets/smc-reservoir-oJYMc6N8.jpg" },
  { title: "SMC ORS — 900 mm RCC Drainage Network", titleBn: "এসএমসি ওআরএস — ৯০০ মি.মি. আর.সি.সি ড্রেনেজ নেটওয়ার্ক", type: "Civil Works", typeBn: "সিভিল ওয়ার্কস", location: "Bhaluka, Mymensingh", locationBn: "ভালুকা, ময়মনসিংহ", description: "Internal and external 900 mm RCC pipe drainage installation and excavation.", descriptionBn: "অভ্যন্তরীণ ও বাহ্যিক ড্রেনেজের জন্য ৯০০ মি.মি. ব্যাসের আর.সি.সি পাইপ স্থাপন ও খনন।", image: "/assets/smc-drainage-pipes-ylQ0dxIR.jpg" },
  { title: "Nassa Super Garments — 800 mm RCC Drainage", titleBn: "নাসা সুপার গার্মেন্টস — ৮০০ মি.মি. আর.সি.সি ড্রেনেজ", type: "Civil Works", typeBn: "সিভিল ওয়ার্কস", location: "Ashulia, Savar", locationBn: "আশুলিয়া, সাভার", description: "Comprehensive 800 mm RCC pipe drainage installation and excavation works.", descriptionBn: "ব্যাপক ড্রেনেজ কাজের জন্য ৮০০ মি.মি. ব্যাসের আর.সি.সি পাইপ স্থাপন ও খনন।", image: "/assets/nassa-drainage-CdMrdjeZ.jpg" },
  { title: "Centeon Pharma — Effluent Treatment Plant", titleBn: "সেন্টিয়ন ফার্মা — এফ্লুয়েন্ট ট্রিটমেন্ট প্ল্যান্ট", type: "Civil Works", typeBn: "সিভিল ওয়ার্কস", location: "Gazipur · 12 m × 6 m", locationBn: "গাজীপুর · ১২ মি. × ৬ মি.", description: "12 m × 6 m RCC retaining wall for ETP and site protection.", descriptionBn: "১২ মি. × ৬ মি. ETP এবং সাইট সুরক্ষার জন্য আর.সি.সি রিটেইনিং ওয়াল নির্মাণ।", image: "/assets/centeon-etp-BxgQULpL.jpg" },
  { title: "AMC Knit Composite — RCC Retaining Wall", titleBn: "এএমসি নিট কম্পোজিট — আর.সি.সি রিটেইনিং ওয়াল", type: "Civil Works", typeBn: "সিভিল ওয়ার্কস", location: "Gazipur", locationBn: "গাজীপুর", description: "Robust RCC (Reinforced Concrete) retaining wall construction.", descriptionBn: "মজবুত আর.সি.সি (রিইনফোর্সড কংক্রিট) রিটেইনিং ওয়াল নির্মাণ।", image: "/assets/amc-retaining-wall-m2yZwpx8.jpg" },
];

export const brands = ["Liebherr", "Kato", "Sakai", "Dynapac", "Bomag", "Hawa", "Advance", "Caterpillar", "Komatsu", "CASE", "XCMG", "JCB", "Honda", "Zhejiang", "TATA"];

// ── Dev-only data integrity check ────────────────────────────────────
if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
  const ids = new Set<string>();
  for (const e of equipmentData) {
    if (ids.has(e.id)) console.warn(`[equipment] duplicate id: ${e.id}`);
    ids.add(e.id);
    if (!e.image) console.warn(`[equipment] missing image: ${e.id}`);
  }
}
