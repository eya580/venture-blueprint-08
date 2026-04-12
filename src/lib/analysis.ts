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

  if (data.value_proposition?.length > 30) strengths.push("Proposition de valeur bien définie");
  else weaknesses.push("Proposition de valeur à affiner");

  if (data.initial_investment < 50000) strengths.push("Investissement initial modéré");
  else weaknesses.push("Investissement initial élevé nécessitant un financement");

  if (data.expected_revenue > data.monthly_costs * 1.5) strengths.push("Marge bénéficiaire potentiellement solide");
  else weaknesses.push("Marges serrées nécessitant une optimisation des coûts");

  if (data.target_customers?.length > 20) strengths.push("Segments clients bien identifiés");
  else weaknesses.push("Définition des segments clients à approfondir");

  if (data.market_size > 1000000) opportunities.push("Marché de taille importante avec potentiel de croissance");
  else opportunities.push("Marché de niche — possibilité de devenir leader");

  if (data.growth_rate > 10) opportunities.push("Taux de croissance du marché favorable");

  opportunities.push("Digitalisation croissante du secteur");
  opportunities.push("Potentiel d'expansion géographique");

  threats.push("Concurrence existante sur le marché");
  threats.push("Évolution réglementaire du secteur");
  if (data.initial_investment > 100000) threats.push("Risque financier élevé en cas de retard");

  return { strengths, weaknesses, opportunities, threats };
}

export function analyzeFeasibility(data: ProjectData): FeasibilityResult {
  // Market feasibility
  let market_score = 50;
  if (data.market_size > 5000000) market_score += 25;
  else if (data.market_size > 1000000) market_score += 15;
  if (data.target_customers?.length > 20) market_score += 15;
  if (data.competitors?.length > 10) market_score += 10;
  market_score = Math.min(market_score, 100);

  // Technical feasibility
  let technical_score = 60;
  if (data.description?.length > 50) technical_score += 15;
  if (data.business_model?.length > 20) technical_score += 15;
  technical_score = Math.min(technical_score, 100);

  // Financial feasibility
  const monthly_profit = data.expected_revenue - data.monthly_costs;
  const annual_profit = monthly_profit * 12;
  let financial_score = 30;
  if (monthly_profit > 0) financial_score += 30;
  if (annual_profit > data.initial_investment * 0.3) financial_score += 20;
  if (data.growth_rate > 5) financial_score += 20;
  financial_score = Math.min(financial_score, 100);

  // Regulatory
  let regulatory_score = 70;
  if (data.sector) regulatory_score += 10;

  const overall_score = Math.round((market_score + technical_score + financial_score + regulatory_score) / 4);

  // Financial calcs
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

  // Simple IRR approximation
  let irr = 0;
  if (cash_flows.length > 0 && data.initial_investment > 0) {
    for (let r = 0.01; r < 2; r += 0.01) {
      let test_npv = -data.initial_investment;
      for (let y = 0; y < cash_flows.length; y++) {
        test_npv += cash_flows[y] / Math.pow(1 + r, y + 1);
      }
      if (test_npv <= 0) {
        irr = (r - 0.01) * 100;
        break;
      }
    }
  }

  // Recommendations
  const recommendations: string[] = [];
  if (market_score < 60) recommendations.push("Approfondir l'étude de marché et identifier clairement votre positionnement.");
  if (financial_score < 50) recommendations.push("Revoir la structure des coûts ou augmenter le prix de vente.");
  if (breakeven_months > 24) recommendations.push("Le seuil de rentabilité est éloigné, envisagez un financement adapté.");
  if (monthly_profit > 0) recommendations.push("Le projet est potentiellement rentable, concentrez-vous sur l'acquisition clients.");
  if (data.growth_rate > 15) recommendations.push("Forte croissance attendue — préparez une stratégie de scaling.");
  if (roi > 30) recommendations.push("ROI attractif pour les investisseurs, préparez un pitch solide.");
  if (overall_score >= 70) recommendations.push("Faisabilité globale favorable — passez à la phase d'exécution.");
  else recommendations.push("Renforcez les dimensions faibles avant de lancer le projet.");

  return {
    market_score, technical_score, financial_score, regulatory_score,
    overall_score, roi: Math.round(roi * 10) / 10, npv: Math.round(npv),
    irr: Math.round(irr * 10) / 10, breakeven_months, cash_flows, recommendations,
  };
}
