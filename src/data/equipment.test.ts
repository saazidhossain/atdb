import { describe, it, expect } from "vitest";
import { equipmentData, equipmentCategories, brands } from "./equipment";
import type { EquipmentCategorySlug } from "./equipment";

// ── Allowed values per category ──────────────────────────────────────
const ALLOWED_BRANDS: Record<EquipmentCategorySlug, string[]> = {
  cranes:     ["Liebherr", "Kato"],
  rollers:    ["Sakai", "Dynapac", "Bomag", "Hawa", "Advance"],
  excavators: ["Caterpillar", "Komatsu"],
  loaders:    ["CASE", "XCMG", "JCB"],
  support:    ["Honda", "Zhejiang", "TATA"],
};

const ID_PREFIX: Record<EquipmentCategorySlug, string> = {
  cranes: "ATDB-CR-",
  rollers: "ATDB-RR-",
  excavators: "ATDB-EX-",
  loaders: "ATDB-LD-",
  support: "ATDB-SP-",
};

const VALID_FUELS = ["Diesel", "Petrol", "Electric", "CNG"];

describe("Equipment data integrity", () => {
  it("has no duplicate IDs", () => {
    const ids = equipmentData.map((e) => e.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it("every item has a valid origin (not empty)", () => {
    for (const e of equipmentData) {
      expect(e.origin.trim().length, `${e.id} origin is empty`).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty model", () => {
    for (const e of equipmentData) {
      expect(e.model.trim().length, `${e.id} model is empty`).toBeGreaterThan(0);
    }
  });

  it("year is 0 (unknown) or a realistic 4-digit year", () => {
    for (const e of equipmentData) {
      expect(
        e.year === 0 || (e.year >= 1990 && e.year <= new Date().getFullYear() + 1),
        `${e.id} year ${e.year} is out of range`,
      ).toBe(true);
    }
  });

  it('quantity is a zero-padded string like "01","02",…', () => {
    for (const e of equipmentData) {
      expect(e.quantity, `${e.id} quantity`).toMatch(/^0[1-9]$|^[1-9][0-9]$/);
    }
  });

  it("every item has a non-empty image path", () => {
    for (const e of equipmentData) {
      expect(e.image.length, `${e.id} image missing`).toBeGreaterThan(0);
    }
  });

  it("category counts match actual data", () => {
    for (const cat of equipmentCategories) {
      const items = equipmentData.filter((e) => e.category === cat.slug);
      expect(items.length, `${cat.slug} lineItems`).toBe(cat.lineItems);
    }
  });

  // ── Brand presence & category-brand constraint ─────────────────────

  it("every item has a non-empty brand", () => {
    for (const e of equipmentData) {
      expect(e.brand.trim().length, `${e.id} brand is empty`).toBeGreaterThan(0);
    }
  });

  it("every item's brand exists in the exported brands list", () => {
    for (const e of equipmentData) {
      expect(brands, `${e.id} brand "${e.brand}" not in brands[]`).toContain(e.brand);
    }
  });

  it("every item's brand is allowed for its category", () => {
    for (const e of equipmentData) {
      const allowed = ALLOWED_BRANDS[e.category];
      expect(
        allowed.includes(e.brand),
        `${e.id}: brand "${e.brand}" is not allowed for category "${e.category}". Allowed: ${allowed.join(", ")}`,
      ).toBe(true);
    }
  });

  // ── ID prefix matches category ─────────────────────────────────────

  it("every item's ID prefix matches its category", () => {
    for (const e of equipmentData) {
      const prefix = ID_PREFIX[e.category];
      expect(
        e.id.startsWith(prefix),
        `${e.id} should start with "${prefix}" for category "${e.category}"`,
      ).toBe(true);
    }
  });

  // ── Fuel type validation ───────────────────────────────────────────

  it("every item has a valid fuel type", () => {
    for (const e of equipmentData) {
      expect(
        VALID_FUELS.includes(e.fuel),
        `${e.id} has invalid fuel "${e.fuel}". Allowed: ${VALID_FUELS.join(", ")}`,
      ).toBe(true);
    }
  });

  // ── categoryLabel consistency ──────────────────────────────────────

  it("all items in the same category share the same categoryLabel", () => {
    for (const cat of equipmentCategories) {
      const items = equipmentData.filter((e) => e.category === cat.slug);
      const labels = new Set(items.map((e) => e.categoryLabel));
      expect(labels.size, `${cat.slug} has mixed categoryLabels: ${[...labels]}`).toBe(1);
    }
  });

  // ── Snapshot: expected items per the ATDB Profile PDF ──────────────

  const EXPECTED = {
    cranes: { ids: ["ATDB-CR-001","ATDB-CR-002","ATDB-CR-003","ATDB-CR-004","ATDB-CR-005","ATDB-CR-006","ATDB-CR-007"], count: 7 },
    rollers: { ids: ["ATDB-RR-001","ATDB-RR-002","ATDB-RR-003","ATDB-RR-004","ATDB-RR-005","ATDB-RR-006","ATDB-RR-007","ATDB-RR-008","ATDB-RR-009"], count: 9 },
    excavators: { ids: ["ATDB-EX-001","ATDB-EX-002","ATDB-EX-003"], count: 3 },
    loaders: { ids: ["ATDB-LD-001","ATDB-LD-002","ATDB-LD-003"], count: 3 },
    support: { ids: ["ATDB-SP-001","ATDB-SP-002","ATDB-SP-003","ATDB-SP-004","ATDB-SP-005","ATDB-SP-006","ATDB-SP-007","ATDB-SP-008","ATDB-SP-009","ATDB-SP-010"], count: 10 },
  } as const;

  for (const [slug, spec] of Object.entries(EXPECTED)) {
    it(`${slug}: has exactly ${spec.count} line items with correct IDs`, () => {
      const items = equipmentData.filter((e) => e.category === slug);
      expect(items.length).toBe(spec.count);
      expect(items.map((e) => e.id).sort()).toEqual([...spec.ids].sort());
    });
  }

  // ── Key fields from ATDB Profile (regression guards) ───────────────

  it("RR-007 origin is England, model is GNT 3367", () => {
    const item = equipmentData.find((e) => e.id === "ATDB-RR-007")!;
    expect(item.origin).toBe("England");
    expect(item.model).toBe("GNT 3367");
  });

  it("RR-008 quantity is 02 (two HV60ST units)", () => {
    expect(equipmentData.find((e) => e.id === "ATDB-RR-008")!.quantity).toBe("02");
  });

  it("SP-004 year is 2019", () => {
    expect(equipmentData.find((e) => e.id === "ATDB-SP-004")!.year).toBe(2019);
  });

  it("SP-009 year is 2017, model includes 3900/HSD", () => {
    const item = equipmentData.find((e) => e.id === "ATDB-SP-009")!;
    expect(item.year).toBe(2017);
    expect(item.model).toContain("3900/HSD");
  });

  it("SP-010 (Power Trowel) exists with correct data", () => {
    const item = equipmentData.find((e) => e.id === "ATDB-SP-010")!;
    expect(item).toBeDefined();
    expect(item.brand).toBe("Honda");
    expect(item.model).toBe("HZRH50");
    expect(item.year).toBe(2017);
    expect(item.quantity).toBe("02");
  });
});

// ── Quotation Reference (makeRef) ────────────────────────────────────
import { makeRef } from "../lib/generatePDF";

describe("makeRef – quotation reference format", () => {
  it("produces ATDB-XX-NNN-YYYYMMDD for every equipment ID", () => {
    const ref = makeRef("ATDB-SP-008");
    // Must start with the original ID
    expect(ref).toMatch(/^ATDB-SP-008-\d{8}$/);
  });

  it("date segment is today's date", () => {
    const now = new Date();
    const expected = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    equipmentData.forEach((eq) => {
      const ref = makeRef(eq.id);
      expect(ref).toBe(`${eq.id}-${expected}`);
    });
  });

  it("matches pattern ATDB-*-YYYYMMDD for all equipment IDs", () => {
    const pattern = /^ATDB-[A-Z]{2}-\d{3}-\d{8}$/;
    equipmentData.forEach((eq) => {
      expect(makeRef(eq.id)).toMatch(pattern);
    });
  });
});

// ── Route coverage — every category slug maps to a valid route ────────
describe("Route data integrity", () => {
  const CATEGORY_SLUGS: EquipmentCategorySlug[] = ["cranes", "rollers", "excavators", "loaders", "support"];

  it("every category slug has at least one equipment item", () => {
    for (const slug of CATEGORY_SLUGS) {
      const items = equipmentData.filter((e) => e.category === slug);
      expect(items.length, `no items for category ${slug}`).toBeGreaterThan(0);
    }
  });

  it("equipment routes are derivable (category/id pair is unique)", () => {
    const routes = equipmentData.map((e) => `${e.category}/${e.id}`);
    expect(routes.length).toBe(new Set(routes).size);
  });

  it("every item has a valid image path (starts with /)", () => {
    for (const e of equipmentData) {
      expect(e.image, `${e.id} image`).toMatch(/^\//);
    }
  });

  it("real photos paths start with /equipment/", () => {
    for (const e of equipmentData) {
      if (e.realPhotos) {
        for (const p of e.realPhotos) {
          expect(p, `${e.id} realPhoto`).toMatch(/^\/equipment\//);
        }
      }
    }
  });
});

// ── Language / bilingual coverage ────────────────────────────────────
describe("Bilingual support", () => {
  it("every item with banglaLabel has non-empty Bengali text", () => {
    const withBangla = equipmentData.filter((e) => e.banglaLabel);
    for (const e of withBangla) {
      expect(e.banglaLabel!.length, `${e.id} banglaLabel empty`).toBeGreaterThan(0);
      // Should contain at least one Bengali character
      expect(e.banglaLabel, `${e.id} banglaLabel not Bengali`).toMatch(/[\u0980-\u09FF]/);
    }
  });

  it("equipmentCategories have bangla labels", () => {
    for (const cat of equipmentCategories) {
      expect(cat.bangla, `${cat.slug} missing bangla`).toMatch(/[\u0980-\u09FF]/);
    }
  });
});

// ── PDF generator data requirements ──────────────────────────────────
describe("PDF generator prerequisites", () => {
  it("every item has required fields for PDF generation", () => {
    for (const e of equipmentData) {
      expect(e.name, `${e.id} name`).toBeTruthy();
      expect(e.brand, `${e.id} brand`).toBeTruthy();
      expect(e.model, `${e.id} model`).toBeTruthy();
      expect(e.capacity, `${e.id} capacity`).toBeTruthy();
      expect(e.origin, `${e.id} origin`).toBeTruthy();
      expect(e.fuel, `${e.id} fuel`).toBeTruthy();
      expect(e.quantity, `${e.id} quantity`).toBeTruthy();
    }
  });

  it("quantity is a numeric string", () => {
    for (const e of equipmentData) {
      expect(parseInt(e.quantity, 10), `${e.id} quantity NaN`).not.toBeNaN();
    }
  });
});
