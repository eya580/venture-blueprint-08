import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { FeasibilityResult, SWOTAnalysis } from "./analysis";

interface BmcData {
  partners: string;
  activities: string;
  value_prop: string;
  customer_rel: string;
  segments: string;
  resources: string;
  channels: string;
  costs: string;
  revenue: string;
}

interface ExportData {
  projectName: string;
  sector: string;
  feasibility: FeasibilityResult;
  swot: SWOTAnalysis;
  bmc: BmcData;
}

// Sanitize text for jsPDF: replace non-breaking spaces and other invisible Unicode chars
function sanitize(text: string): string {
  return text.replace(/[\u00A0\u202F\u2007\u2009]/g, " ");
}

function formatNum(n: number): string {
  return n.toLocaleString("fr-FR").replace(/[\u00A0\u202F]/g, " ");
}

export function exportProjectPdf(data: ExportData) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  let y = 20;

  const addTitle = (text: string) => {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text(text, 14, y);
    y += 2;
    doc.setDrawColor(30, 64, 175);
    doc.line(14, y, pageW - 14, y);
    y += 8;
  };

  const addText = (text: string, indent = 14) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(text, pageW - indent - 14);
    for (const line of lines) {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.text(line, indent, y);
      y += 5;
    }
  };

  // Header
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageW, 35, "F");
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(sanitize(data.projectName), 14, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(sanitize(`Secteur : ${data.sector || "Non specifie"}  -  Score global : ${data.feasibility.overall_score}/100`), 14, 28);
  y = 45;

  // KPIs
  addTitle("Indicateurs Financiers");
  autoTable(doc, {
    startY: y,
    head: [["Indicateur", "Valeur"]],
    body: [
      ["Score global", `${data.feasibility.overall_score}/100`],
      ["ROI", `${data.feasibility.roi}%`],
      ["VAN (NPV)", `${formatNum(Number(data.feasibility.npv))} TND`],
      ["TRI (IRR)", `${data.feasibility.irr}%`],
      ["Seuil de rentabilite", `${data.feasibility.breakeven_months} mois`],
      ["Score Marche", `${data.feasibility.market_score}/100`],
      ["Score Technique", `${data.feasibility.technical_score}/100`],
      ["Score Financier", `${data.feasibility.financial_score}/100`],
      ["Score Reglementaire", `${data.feasibility.regulatory_score}/100`],
    ],
    theme: "striped",
    headStyles: { fillColor: [30, 64, 175] },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;


  // BMC
  if (y > 200) { doc.addPage(); y = 20; }
  addTitle("Business Model Canvas");
  const bmcBlocks = [
    ["Partenaires Cles", sanitize(data.bmc.partners)],
    ["Activites Cles", sanitize(data.bmc.activities)],
    ["Proposition de Valeur", sanitize(data.bmc.value_prop)],
    ["Relation Client", sanitize(data.bmc.customer_rel)],
    ["Segments Clients", sanitize(data.bmc.segments)],
    ["Ressources Cles", sanitize(data.bmc.resources)],
    ["Canaux", sanitize(data.bmc.channels)],
    ["Structure de Couts", sanitize(data.bmc.costs)],
    ["Sources de Revenus", sanitize(data.bmc.revenue)],
  ];
  autoTable(doc, {
    startY: y,
    head: [["Bloc", "Contenu"]],
    body: bmcBlocks,
    theme: "striped",
    headStyles: { fillColor: [30, 64, 175] },
    columnStyles: { 0: { cellWidth: 45, fontStyle: "bold" }, 1: { cellWidth: "auto" } },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // SWOT
  if (y > 200) { doc.addPage(); y = 20; }
  addTitle("Analyse SWOT");
  const swotRows = [
    ["Forces", sanitize(data.swot.strengths.join("\n"))],
    ["Faiblesses", sanitize(data.swot.weaknesses.join("\n"))],
    ["Opportunites", sanitize(data.swot.opportunities.join("\n"))],
    ["Menaces", sanitize(data.swot.threats.join("\n"))],
  ];
  autoTable(doc, {
    startY: y,
    head: [["Categorie", "Elements"]],
    body: swotRows,
    theme: "striped",
    headStyles: { fillColor: [30, 64, 175] },
    columnStyles: { 0: { cellWidth: 35, fontStyle: "bold" }, 1: { cellWidth: "auto" } },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Recommendations
  if (y > 230) { doc.addPage(); y = 20; }
  addTitle("Recommandations");
  data.feasibility.recommendations.forEach((r, i) => {
    addText(sanitize(`${i + 1}. ${r}`), 18);
    y += 2;
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(sanitize(`${data.projectName} - Rapport de faisabilite  -  Page ${p}/${totalPages}`), 14, 290);
  }

  doc.save(`${data.projectName.replace(/\s+/g, "_")}_rapport.pdf`);
}
