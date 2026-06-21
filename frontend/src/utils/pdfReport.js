import jsPDF from 'jspdf';

function formatInrForPdf(price) {
  const amount = Math.round(Number(price));
  if (!amount || Number.isNaN(amount)) return 'Rs. 0';

  const s = amount.toString();
  if (s.length <= 3) return `Rs. ${s}`;

  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const parts = [];
  let r = rest;
  while (r.length > 2) {
    parts.unshift(r.slice(-2));
    r = r.slice(0, -2);
  }
  if (r) parts.unshift(r);
  return `Rs. ${parts.join(',')},${last3}`;
}

export function generatePDF(result) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const priceText = formatInrForPdf(result.predicted_price);

  doc.setFillColor(15, 17, 21);
  doc.rect(0, 0, pageWidth, 297, 'F');

  doc.setTextColor(59, 130, 246);
  doc.setFontSize(22);
  doc.text('ValuAuto - Vehicle Valuation Report', pageWidth / 2, 30, { align: 'center' });

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, 42, { align: 'center' });

  doc.setDrawColor(48, 54, 61);
  doc.line(20, 58, pageWidth - 20, 58);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Estimated Price', 20, 75);
  doc.setFontSize(28);
  doc.setTextColor(59, 130, 246);
  doc.text(priceText, 20, 90);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(12);
  const details = [
    ['Company', result.company],
    ['Model', result.model],
    ['Year', String(result.year)],
    ['Fuel Type', result.fuel_type],
    ['KM Driven', `${Number(result.kms_driven || 0).toLocaleString('en-IN')} km`],
    ['Confidence Score', `${result.confidence_score}%`],
    ['ML Model Used', result.model_used],
  ];

  let y = 110;
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Vehicle Details', 20, y);
  y += 10;

  doc.setFontSize(11);
  details.forEach(([label, value]) => {
    doc.setTextColor(150, 150, 150);
    doc.text(`${label}:`, 25, y);
    doc.setTextColor(220, 220, 220);
    const lines = doc.splitTextToSize(String(value), pageWidth - 95);
    doc.text(lines, 80, y);
    y += Math.max(lines.length * 6, 8);
  });

  y += 10;
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Market Insight', 20, y);
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  const splitInsight = doc.splitTextToSize(result.insight || '', pageWidth - 40);
  doc.text(splitInsight, 25, y);

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This report is for reference only. Prices are model estimates, not guaranteed valuations.', pageWidth / 2, 280, { align: 'center' });

  doc.save(`car-price-report-${Date.now()}.pdf`);
}
