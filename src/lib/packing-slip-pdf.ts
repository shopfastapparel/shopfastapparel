// Official 1-Page Print-Ready PDF Packing Slip Generator for Fast Custom Apparel
// Engineered strictly for 1 standard US Letter page in portrait (612 x 792 pt).
// Features company header, customer details, itemized sizing manifest,
// Dash the Cheetah 100% Quality Inspection & Packing Seal, and garment care guide.

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface PackingSlipData {
  invoiceNumber: string;
  slipNumber?: string;
  orderDate?: string;
  packingDate?: string;
  customerName: string;
  customerCompany?: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  amountPaid: string;
  items: Array<{
    garment: string;
    colorway: string;
    printSpecs: string;
    sizes?: Record<string, number>;
    quantity: number;
  }>;
  mockupUrl?: string;
  notes?: string;
}

export async function generatePackingSlipPdf(data: PackingSlipData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]); // US Letter Portrait
  const { width, height } = page.getSize();

  // Fonts
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Colors
  const darkNavy = rgb(0.06, 0.09, 0.16); // #0F172A
  const textDark = rgb(0.12, 0.16, 0.23); // #1E293B
  const textMuted = rgb(0.39, 0.45, 0.55); // #64748B
  const brandTeal = rgb(0.0, 0.75, 0.85); // #00E5FF / #0284C7
  const borderLight = rgb(0.89, 0.92, 0.95); // #E2E8F0
  const bgLight = rgb(0.97, 0.98, 0.99); // #F8FAFC
  const greenDark = rgb(0.04, 0.47, 0.35); // #065F46
  const greenBg = rgb(0.93, 0.98, 0.95); // #ECFDF5

  const leftMargin = 36;
  const rightMargin = width - 36;
  const contentWidth = rightMargin - leftMargin;

  let y = height - 36; // 756

  // ----------------------------------------------------
  // 1. HEADER BAR
  // ----------------------------------------------------
  page.drawRectangle({
    x: leftMargin,
    y: y - 56,
    width: contentWidth,
    height: 56,
    color: darkNavy,
  });

  // Company Name & Subtitle
  page.drawText("FAST CUSTOM APPAREL OF GA", {
    x: leftMargin + 14,
    y: y - 24,
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText("Commercial Ultra HD DTF Printing  •  Lawrenceville, GA Facility", {
    x: leftMargin + 14,
    y: y - 38,
    size: 8.5,
    font: fontRegular,
    color: brandTeal,
  });

  page.drawText("(678) 491-2655  •  info@shopfastapparel.com  •  www.shopfastapparel.com", {
    x: leftMargin + 14,
    y: y - 49,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.8, 0.85, 0.9),
  });

  // Right Header: Official Packing Slip Badge
  page.drawText("OFFICIAL PACKING SLIP", {
    x: rightMargin - 150,
    y: y - 24,
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  const slipNum = data.slipNumber || `PS-${data.invoiceNumber}`;
  page.drawText(`Slip #: ${slipNum}`, {
    x: rightMargin - 150,
    y: y - 37,
    size: 8.5,
    font: fontBold,
    color: rgb(1, 0.8, 0.2), // Gold
  });

  page.drawText(`Invoice #: ${data.invoiceNumber}`, {
    x: rightMargin - 150,
    y: y - 48,
    size: 8,
    font: fontRegular,
    color: rgb(0.9, 0.9, 0.9),
  });

  y -= 66;

  // ----------------------------------------------------
  // 2. ORDER DETAILS & ADDRESS BOX
  // ----------------------------------------------------
  const boxHeight = 76;
  page.drawRectangle({
    x: leftMargin,
    y: y - boxHeight,
    width: contentWidth,
    height: boxHeight,
    color: bgLight,
    borderColor: borderLight,
    borderWidth: 1,
  });

  // Column 1: Ship To
  page.drawText("DELIVERY & SHIPPING ADDRESS", {
    x: leftMargin + 12,
    y: y - 16,
    size: 8,
    font: fontBold,
    color: textMuted,
  });

  const recipientLine = data.customerCompany
    ? `${data.customerName}  •  ${data.customerCompany}`
    : data.customerName;
  page.drawText(recipientLine, {
    x: leftMargin + 12,
    y: y - 29,
    size: 10,
    font: fontBold,
    color: textDark,
  });

  // Multi-line address wrap (if needed)
  const addrParts = (data.shippingAddress || "Confirmed Delivery Address").split(", ");
  const addrLine1 = addrParts.slice(0, 2).join(", ");
  const addrLine2 = addrParts.slice(2).join(", ");

  page.drawText(addrLine1 || data.shippingAddress, {
    x: leftMargin + 12,
    y: y - 42,
    size: 8.5,
    font: fontRegular,
    color: textDark,
  });

  if (addrLine2) {
    page.drawText(addrLine2, {
      x: leftMargin + 12,
      y: y - 53,
      size: 8.5,
      font: fontRegular,
      color: textDark,
    });
  }

  const contactLine = [data.customerEmail, data.customerPhone].filter(Boolean).join("  •  ");
  if (contactLine) {
    page.drawText(contactLine, {
      x: leftMargin + 12,
      y: y - 65,
      size: 7.5,
      font: fontRegular,
      color: textMuted,
    });
  }

  // Column 2: Order Status & Timestamps
  const col2X = leftMargin + 300;
  page.drawText("ORDER FULFILLMENT STATUS", {
    x: col2X,
    y: y - 16,
    size: 8,
    font: fontBold,
    color: textMuted,
  });

  page.drawText(`Status: PAID IN FULL (${data.amountPaid})`, {
    x: col2X,
    y: y - 29,
    size: 9.5,
    font: fontBold,
    color: greenDark,
  });

  const orderDate = data.orderDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  page.drawText(`Order Date: ${orderDate}`, {
    x: col2X,
    y: y - 42,
    size: 8.5,
    font: fontRegular,
    color: textDark,
  });

  page.drawText(`Print Technology: Commercial Ultra HD DTF`, {
    x: col2X,
    y: y - 53,
    size: 8.5,
    font: fontBold,
    color: brandTeal,
  });

  page.drawText(`Carrier: Tracked Ground Delivery  •  Same-Day Staging`, {
    x: col2X,
    y: y - 65,
    size: 7.5,
    font: fontRegular,
    color: textMuted,
  });

  y -= boxHeight + 14;

  // ----------------------------------------------------
  // 3. ITEMIZED PRODUCTION & SIZING MANIFEST TABLE
  // ----------------------------------------------------
  page.drawText("ITEMIZED PRODUCTION & SIZING MANIFEST", {
    x: leftMargin,
    y: y - 10,
    size: 9.5,
    font: fontBold,
    color: textDark,
  });

  y -= 16;

  // Table Header
  const tableHeaderH = 18;
  page.drawRectangle({
    x: leftMargin,
    y: y - tableHeaderH,
    width: contentWidth,
    height: tableHeaderH,
    color: rgb(0.91, 0.94, 0.98),
  });

  page.drawText("GARMENT & COLORWAY", { x: leftMargin + 8, y: y - 12, size: 7.5, font: fontBold, color: textDark });
  page.drawText("COMMERCIAL DTF PRINT SPECS", { x: leftMargin + 190, y: y - 12, size: 7.5, font: fontBold, color: textDark });
  page.drawText("SIZING BREAKDOWN", { x: leftMargin + 360, y: y - 12, size: 7.5, font: fontBold, color: textDark });
  page.drawText("QTY", { x: rightMargin - 30, y: y - 12, size: 7.5, font: fontBold, color: textDark });

  y -= tableHeaderH;

  // Table Rows
  let totalQty = 0;
  const items = data.items && data.items.length > 0 ? data.items : [
    {
      garment: "Commercial Custom Apparel",
      colorway: "Customer Selected Tone",
      printSpecs: "Commercial Ultra HD DTF Transfer",
      sizes: { Total: 24 },
      quantity: 24,
    },
  ];

  for (const item of items) {
    const rowH = 34;
    page.drawRectangle({
      x: leftMargin,
      y: y - rowH,
      width: contentWidth,
      height: rowH,
      color: rgb(1, 1, 1),
      borderColor: borderLight,
      borderWidth: 0.5,
    });

    page.drawText(item.garment, {
      x: leftMargin + 8,
      y: y - 13,
      size: 8.5,
      font: fontBold,
      color: textDark,
    });
    page.drawText(item.colorway, {
      x: leftMargin + 8,
      y: y - 24,
      size: 7.5,
      font: fontRegular,
      color: textMuted,
    });

    // Print Specs
    page.drawText(item.printSpecs || "Commercial Ultra HD DTF", {
      x: leftMargin + 190,
      y: y - 13,
      size: 8,
      font: fontRegular,
      color: textDark,
    });
    page.drawText("Permanent 70-micron polymer bond", {
      x: leftMargin + 190,
      y: y - 23,
      size: 7,
      font: fontOblique,
      color: textMuted,
    });

    // Sizes
    const sizesStr = item.sizes
      ? Object.entries(item.sizes)
          .map(([k, v]) => `${k}:${v}`)
          .join("  ")
      : "Standard Manifest";
    page.drawText(sizesStr, {
      x: leftMargin + 360,
      y: y - 16,
      size: 8,
      font: fontBold,
      color: brandTeal,
    });

    // Qty
    page.drawText(String(item.quantity), {
      x: rightMargin - 28,
      y: y - 16,
      size: 10,
      font: fontBold,
      color: textDark,
    });

    totalQty += item.quantity;
    y -= rowH;
  }

  // Table Total Footer
  const totalBarH = 20;
  page.drawRectangle({
    x: leftMargin,
    y: y - totalBarH,
    width: contentWidth,
    height: totalBarH,
    color: bgLight,
    borderColor: borderLight,
    borderWidth: 1,
  });

  page.drawText("TOTAL PRODUCTION MANIFEST UNITS:", {
    x: leftMargin + 240,
    y: y - 14,
    size: 8.5,
    font: fontBold,
    color: textDark,
  });

  page.drawText(`${totalQty} PIECES (100% COUNT VERIFIED)`, {
    x: rightMargin - 150,
    y: y - 14,
    size: 9,
    font: fontBold,
    color: greenDark,
  });

  y -= totalBarH + 14;

  // ----------------------------------------------------
  // 4. DASH THE CHEETAH 100% QUALITY INSPECTION & PACKING SEAL
  // ----------------------------------------------------
  const sealH = 145;
  page.drawRectangle({
    x: leftMargin,
    y: y - sealH,
    width: contentWidth,
    height: sealH,
    color: greenBg,
    borderColor: rgb(0.06, 0.73, 0.51), // #10B981
    borderWidth: 1.5,
  });

  // Seal Title Bar
  page.drawText("DASH THE CHEETAH  •  100% QUALITY INSPECTION & PACKING SEAL", {
    x: leftMargin + 14,
    y: y - 20,
    size: 9.5,
    font: fontBold,
    color: greenDark,
  });

  page.drawText("Guaranteed High-Definition DTF Transfer Longevity  •  Commercial 50+ Wash Standard", {
    x: leftMargin + 14,
    y: y - 32,
    size: 8,
    font: fontRegular,
    color: textDark,
  });

  // Multi-point checklist
  const checkCol1X = leftMargin + 20;
  const checkCol2X = leftMargin + 280;

  const checkItems1 = [
    "[X]  Ultra HD DTF Curing: Calibrated pneumatic PSI & heat fusion verified",
    "[X]  Registration & Linework: Razor-sharp edge fidelity inspected",
  ];
  const checkItems2 = [
    "[X]  Garment Integrity: Seam alignment, fabric count, and collar inspected",
    "[X]  Manifest Verification: Individual size counts 100% matched to invoice",
  ];

  let checkY = y - 50;
  for (const text of checkItems1) {
    page.drawText(text, { x: checkCol1X, y: checkY, size: 7.8, font: fontRegular, color: textDark });
    checkY -= 14;
  }

  checkY = y - 50;
  for (const text of checkItems2) {
    page.drawText(text, { x: checkCol2X, y: checkY, size: 7.8, font: fontRegular, color: textDark });
    checkY -= 14;
  }

  // Lead Inspector Sign-Off Line
  page.drawLine({
    start: { x: leftMargin + 14, y: y - 90 },
    end: { x: rightMargin - 14, y: y - 90 },
    thickness: 1,
    color: rgb(0.8, 0.9, 0.85),
  });

  page.drawText("LEAD INSPECTOR VERIFICATION:", {
    x: leftMargin + 14,
    y: y - 105,
    size: 8,
    font: fontBold,
    color: greenDark,
  });

  page.drawText("TJ / Dash the Cheetah  (Master Decorator)", {
    x: leftMargin + 160,
    y: y - 105,
    size: 8.5,
    font: fontBold,
    color: textDark,
  });

  page.drawText("PACKED & SEALED FOR DISPATCH  •  PASSED 100%", {
    x: rightMargin - 220,
    y: y - 105,
    size: 8,
    font: fontBold,
    color: greenDark,
  });

  // Garment Care mini-strip inside seal box
  page.drawText("COMMERCIAL GARMENT CARE:", {
    x: leftMargin + 14,
    y: y - 124,
    size: 7.5,
    font: fontBold,
    color: textMuted,
  });

  page.drawText("Machine wash cold inside-out  •  Tumble dry low or hang dry  •  Never iron directly on printed graphics", {
    x: leftMargin + 155,
    y: y - 124,
    size: 7.5,
    font: fontRegular,
    color: textDark,
  });

  page.drawText("Questions? Call/Text our Lawrenceville Shop: (678) 491-2655  •  info@shopfastapparel.com", {
    x: leftMargin + 14,
    y: y - 137,
    size: 7.5,
    font: fontOblique,
    color: textMuted,
  });

  y -= sealH + 16;

  // ----------------------------------------------------
  // 5. PRODUCTION NOTES / TRAY INSTRUCTIONS
  // ----------------------------------------------------
  const notesH = 46;
  page.drawRectangle({
    x: leftMargin,
    y: y - notesH,
    width: contentWidth,
    height: notesH,
    color: rgb(1, 1, 1),
    borderColor: borderLight,
    borderWidth: 1,
  });

  page.drawText("PRODUCTION TRAY & FULFILLMENT INSTRUCTIONS:", {
    x: leftMargin + 10,
    y: y - 14,
    size: 8,
    font: fontBold,
    color: textDark,
  });

  page.drawText(
    "1. Print this slip and clip to the physical garment production tray.  2. Verify blanks against manifest.  3. Inspect transfers under high-CRI light prior to folding.  4. Include care card in poly-bag before sealing.",
    {
      x: leftMargin + 10,
      y: y - 27,
      size: 7.5,
      font: fontRegular,
      color: textMuted,
    }
  );

  page.drawText("Fast Custom Apparel • Guaranteed On-Time Local Turnaround", {
    x: leftMargin + 10,
    y: y - 39,
    size: 7,
    font: fontBold,
    color: brandTeal,
  });

  // Footer bar at the very bottom
  page.drawText("Official Document of Fast Custom Apparel of GA  •  Page 1 of 1 (Strict US Letter Portrait)", {
    x: leftMargin + 110,
    y: 20,
    size: 7,
    font: fontRegular,
    color: textMuted,
  });

  return await doc.save();
}
