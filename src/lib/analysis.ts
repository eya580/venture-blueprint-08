export interface ProjectData {
  name: string;
  description: string;
  sector: string;
  mission: string;
  vision: string;
  value_proposition: string;
  target_customers: string;
  business_model: string;
  market_size: number;
  competitors: string;
  initial_investment: number;
  monthly_costs: number;
  expected_revenue: number;
  product_price: number;
  units_per_month: number;
  growth_rate: number;
  // Champs professionnels additionnels (optionnels)
  team_size?: number;
  funding_source?: string;
  unique_advantage?: string;
  marketing_budget?: number;
  pricing_strategy?: string;
  variable_cost_per_unit?: number;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface FeasibilityResult {
  market_score: number;
  technical_score: number;
  financial_score: number;
  regulatory_score: number;
  overall_score: number;
  roi: number;
  npv: number;
  irr: number;
  breakeven_months: number;
  cash_flows: number[];
  recommendations: string[];
}

export function generateSWOT(data: ProjectData): SWOTAnalysis {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];

  if (data.value_proposition?.length > 30) strengths.push("Proposition de valeur claire et différenciante");
  else weaknesses.push("Proposition de valeur à clarifier et à rendre mesurable");

  if (data.unique_advantage && data.unique_advantage.length > 10)
    strengths.push(`Avantage compétitif identifié : ${data.unique_advantage.slice(0, 80)}`);

  if (data.initial_investment > 0 && data.initial_investment < 50000)
    strengths.push("Investissement initial maîtrisé, accessible à l'autofinancement");
  else if (data.initial_investment >= 200000)
    weaknesses.push("Ticket d'entrée élevé nécessitant un tour de table structuré");

  const monthly_revenue = computeRevenue(data);
  const margin = monthly_revenue - data.monthly_costs;
  const marginRate = monthly_revenue > 0 ? (margin / monthly_revenue) * 100 : 0;
  if (marginRate >= 30) strengths.push(`Marge brute solide (~${marginRate.toFixed(0)}%)`);
  else if (marginRate < 10 && monthly_revenue > 0) weaknesses.push(`Marge brute faible (~${marginRate.toFixed(0)}%) — risque de tension de trésorerie`);

  if (data.target_customers?.length > 30) strengths.push("Segments clients précisément ciblés");
  else weaknesses.push("Persona client à approfondir (besoins, douleurs, parcours d'achat)");

  if (data.team_size && data.team_size >= 3) strengths.push(`Équipe constituée (${data.team_size} personnes)`);
  else if (data.team_size === 1) weaknesses.push("Projet porté par une seule personne — risque de dépendance");

  if (!data.business_model || data.business_model.length < 10)
    weaknesses.push("Modèle économique à formaliser (récurrence, panier moyen, LTV)");

  if (data.market_size > 5000000) opportunities.push("Marché de grande taille (>5M TND) avec fort potentiel d'échelle");
  else if (data.market_size > 1000000) opportunities.push("Marché significatif permettant une croissance durable");
  else opportunities.push("Marché de niche — opportunité de devenir référent rapidement");

  if (data.growth_rate > 15) opportunities.push("Dynamique de croissance forte favorable au scaling");
  else if (data.growth_rate > 5) opportunities.push("Croissance régulière du marché soutenant l'activité");

  const sectorOpps: Record<string, string> = {
    "Technologie": "Adoption accélérée du digital et de l'IA en Tunisie et au Maghreb",
    "Santé": "Vieillissement démographique et demande croissante en services de santé",
    "E-commerce": "Pénétration internet et adoption du paiement en ligne en hausse",
    "Éducation": "Demande croissante en upskilling et formations certifiantes",
    "Finance": "Essor de la fintech et de l'inclusion financière",
    "Restauration": "Développement de la livraison et du dark kitchen",
    "Immobilier": "Urbanisation et besoin en logement intermédiaire",
    "Services": "Externalisation croissante des fonctions support des PME",
    "Agriculture": "Programmes de soutien à l'agritech et export bio",
    "Industrie": "Politiques d'industrialisation et zones franches",
  };
  if (sectorOpps[data.sector]) opportunities.push(sectorOpps[data.sector]);

  if (data.funding_source) opportunities.push(`Financement envisagé : ${data.funding_source} — leviers à activer (BFPME, Smart Capital, business angels)`);

  if (data.competitors && data.competitors.length > 20) threats.push("Concurrence établie — pression sur les prix et l'acquisition");
  else threats.push("Concurrence potentielle non cartographiée — risque de surprise stratégique");

  threats.push("Évolution réglementaire et fiscale du secteur");
  if (data.initial_investment > 100000) threats.push("Exposition financière élevée en cas de retard de revenus");
  if (marginRate < 15 && monthly_revenue > 0) threats.push("Sensibilité forte à la hausse des coûts (énergie, matières, logistique)");
  if (data.growth_rate < 3) threats.push("Faible croissance du marché — risque de saturation");

  return { strengths, weaknesses, opportunities, threats };
}

function computeRevenue(data: ProjectData): number {
  if (data.product_price > 0 && data.units_per_month > 0) {
    return data.product_price * data.units_per_month;
  }
  return data.expected_revenue || 0;
}

export function analyzeFeasibility(data: ProjectData): FeasibilityResult {
  const monthly_revenue = computeRevenue(data);

  let market_score = 50;
  if (data.market_size > 5000000) market_score += 25;
  else if (data.market_size > 1000000) market_score += 15;
  if (data.target_customers?.length > 20) market_score += 15;
  if (data.competitors?.length > 10) market_score += 10;
  market_score = Math.min(market_score, 100);

  let technical_score = 60;
  if (data.description?.length > 50) technical_score += 10;
  if (data.business_model?.length > 20) technical_score += 15;
  if (data.team_size && data.team_size >= 2) technical_score += 10;
  if (data.unique_advantage && data.unique_advantage.length > 10) technical_score += 5;
  technical_score = Math.min(technical_score, 100);

  const monthly_profit = monthly_revenue - data.monthly_costs;
  const annual_profit = monthly_profit * 12;
  const marginRate = monthly_revenue > 0 ? (monthly_profit / monthly_revenue) * 100 : 0;
  let financial_score = 25;
  if (monthly_profit > 0) financial_score += 25;
  if (marginRate >= 20) financial_score += 15;
  if (annual_profit > data.initial_investment * 0.3) financial_score += 20;
  if (data.growth_rate > 5) financial_score += 15;
  financial_score = Math.max(0, Math.min(financial_score, 100));

  let regulatory_score = 70;
  if (data.sector) regulatory_score += 10;
  regulatory_score = Math.min(regulatory_score, 100);

  const overall_score = Math.round((market_score + technical_score + financial_score + regulatory_score) / 4);

  const roi = data.initial_investment > 0 ? ((annual_profit - data.initial_investment) / data.initial_investment) * 100 : 0;

  const discount_rate = 0.1;
  const years = 5;
  const cash_flows: number[] = [];
  let npv = -data.initial_investment;
  for (let y = 1; y <= years; y++) {
    const cf = annual_profit * Math.pow(1 + data.growth_rate / 100, y - 1);
    cash_flows.push(Math.round(cf));
    npv += cf / Math.pow(1 + discount_rate, y);
  }

  const breakeven_months = monthly_profit > 0 ? Math.ceil(data.initial_investment / monthly_profit) : 0;

  let irr = 0;
  if (cash_flows.length > 0 && data.initial_investment > 0) {
    for (let r = 0.01; r < 2; r += 0.01) {
      let test_npv = -data.initial_investment;
      for (let y = 0; y < cash_flows.length; y++) {
        test_npv += cash_flows[y] / Math.pow(1 + r, y + 1);
      }
      if (test_npv <= 0) { irr = (r - 0.01) * 100; break; }
    }
  }

  const recommendations: string[] = [];

  if (market_score < 50) {
    recommendations.push("📊 Étude de marché : réalisez 10 à 20 entretiens qualitatifs avec votre cible pour valider le besoin et affiner le positionnement.");
  } else if (market_score < 70) {
    recommendations.push("📊 Renforcez la segmentation : définissez 2 à 3 personas précis avec leurs canaux d'acquisition prioritaires.");
  }

  if (marginRate < 15 && monthly_revenue > 0) {
    recommendations.push(`💰 Marge faible (~${marginRate.toFixed(0)}%) : renégociez les coûts variables, ajustez le prix de +5 à +15%, ou repensez la structure d'offre (bundle, premium).`);
  }
  if (monthly_profit <= 0) {
    const gap = Math.abs(monthly_profit);
    recommendations.push(`⚠️ Déficit mensuel de ${gap.toLocaleString("fr-TN")} TND : l'équation économique n'est pas viable en l'état. Réduisez les coûts fixes ou augmentez le volume cible.`);
  }
  if (breakeven_months > 24) {
    recommendations.push(`⏱️ Seuil de rentabilité à ${breakeven_months} mois : prévoyez un fonds de roulement couvrant 18 mois minimum et envisagez un financement mixte (apport + dette + subvention).`);
  } else if (breakeven_months > 0 && breakeven_months <= 12) {
    recommendations.push(`✅ Seuil de rentabilité court (${breakeven_months} mois) : profil attractif pour un investisseur — préparez un dossier financier solide.`);
  }
  if (roi > 50) {
    recommendations.push(`🚀 ROI élevé (${roi.toFixed(0)}%) : capitalisez sur cette traction pour lever des fonds et accélérer l'acquisition.`);
  } else if (roi < 10 && data.initial_investment > 0) {
    recommendations.push("📉 ROI limité : revoyez l'allocation de l'investissement initial (CapEx vs OpEx) et privilégiez les dépenses génératrices de revenus.");
  }

  if (data.growth_rate > 15) {
    recommendations.push("📈 Croissance forte attendue : sécurisez votre supply chain, automatisez les processus clés et anticipez le recrutement.");
  }

  if (!data.team_size || data.team_size < 2) {
    recommendations.push("👥 Équipe : identifiez un cofondateur ou advisor complémentaire (tech, commercial, finance) pour réduire le risque d'exécution.");
  }

  if (!data.competitors || data.competitors.length < 20) {
    recommendations.push("🎯 Cartographie concurrentielle : listez 5 concurrents directs/indirects et leurs positionnements (prix, cible, canal) pour construire votre différenciation.");
  }

  const sectorReco: Record<string, string> = {
    "Technologie": "🛠️ Construisez un MVP en 8 à 12 semaines et validez avec 5 clients pilotes avant tout investissement lourd.",
    "Santé": "🏥 Anticipez les certifications (ANCSEP, ministère) et nouez un partenariat avec une structure de soins reconnue.",
    "E-commerce": "🛒 Optimisez le coût d'acquisition (CAC) et la valeur vie client (LTV) — visez un ratio LTV/CAC ≥ 3.",
    "Éducation": "🎓 Faites certifier vos formations (CNFCPP, partenariats universitaires) pour augmenter la valeur perçue.",
    "Finance": "💳 Validez le cadre réglementaire BCT et privilégiez un partenariat avec une banque ou un acteur licencié.",
    "Restauration": "🍽️ Travaillez le food cost (≤30%) et testez en pop-up ou dark kitchen avant l'ouverture d'un local.",
    "Immobilier": "🏗️ Sécurisez le foncier et le permis avant la commercialisation ; modélisez plusieurs scénarios de prix de sortie.",
    "Services": "🤝 Construisez 2-3 références clients fortes la 1ère année pour activer le bouche-à-oreille B2B.",
    "Agriculture": "🌱 Sollicitez les dispositifs d'appui (APIA, FOSDAP) et certifiez la production (bio, GAP).",
    "Industrie": "🏭 Étudiez l'éligibilité aux avantages FOPRODI et zones franches pour optimiser le CapEx.",
  };
  if (sectorReco[data.sector]) recommendations.push(sectorReco[data.sector]);

  if (overall_score >= 75) {
    recommendations.push("✨ Faisabilité globale très favorable — passez en phase d'exécution avec un plan à 90 jours structuré.");
  } else if (overall_score >= 60) {
    recommendations.push("👍 Faisabilité globale favorable — renforcez les 1 à 2 dimensions les plus faibles avant le lancement.");
  } else {
    recommendations.push("🔧 Faisabilité globale fragile — itérez sur le modèle (pivot possible) avant tout engagement financier.");
  }

  return {
    market_score, technical_score, financial_score, regulatory_score,
    overall_score, roi: Math.round(roi * 10) / 10, npv: Math.round(npv),
    irr: Math.round(irr * 10) / 10, breakeven_months, cash_flows, recommendations,
  };
}
