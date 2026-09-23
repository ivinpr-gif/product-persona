import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Downloads a structured PDF research report compiled from research data.
 * @param {Object} reportData - Unified report object containing profiles, quotes, themes, sentiment, & adoption scores.
 * @param {HTMLElement} elementToCapture - Optional HTML element reference to render visually.
 */
export async function downloadPdfReport(reportData, elementToCapture = null) {
  if (elementToCapture) {
    try {
      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#09090b',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width mm
      const pageHeight = 297; // A4 height mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `Product_Research_Report_${(reportData?.product_description || 'Summary').slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      pdf.save(fileName);
      return;
    } catch (err) {
      console.warn('html2canvas PDF capture fallback engaged:', err);
    }
  }

  // Fallback: Generate clean text PDF document
  const doc = new jsPDF();
  const title = reportData?.report_title || 'Product Research Report';
  const prodDesc = reportData?.product_description || 'Tested Product';
  const targetAud = reportData?.target_audience || 'Target Consumer Group';
  const score = reportData?.overall_adoption_score ? `${Math.round(reportData.overall_adoption_score)}/100` : 'N/A';

  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129); // Accent primary
  doc.text('ProductPersona AI Research Studio', 14, 20);

  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text(title, 14, 30);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${reportData?.generated_at || new Date().toISOString().slice(0, 10)}`, 14, 38);
  doc.text(`Overall Adoption Score: ${score}`, 14, 44);

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Research Context', 14, 56);
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Product Description: ${prodDesc.slice(0, 90)}`, 14, 64);
  doc.text(`Target Audience: ${targetAud.slice(0, 90)}`, 14, 70);

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Executive Summary', 14, 82);
  doc.setFontSize(9);
  const splitSummary = doc.splitTextToSize(reportData?.executive_summary || 'Synthetic research findings overview.', 180);
  doc.text(splitSummary, 14, 90);

  let yPos = 90 + (splitSummary.length * 6) + 10;

  // Personas Summary
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Evaluated Persona Profiles', 14, yPos);
  yPos += 8;

  doc.setFontSize(9);
  reportData?.persona_profiles?.slice(0, 5).forEach((p) => {
    doc.setTextColor(30, 41, 59);
    doc.text(`• ${p.name} (${p.occupation}, ${p.age}): ${p.psychological_profile.slice(0, 80)}`, 14, yPos);
    yPos += 6;
  });

  doc.save(`Research_Report_${new Date().getTime()}.pdf`);
}
