import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Target, DollarSign, Shield, Monitor, Download, Lightbulb, Users, Gift, Truck, Handshake, Layers, Heart, Wallet, PenTool } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import type { ProjectData, SWOTAnalysis, FeasibilityResult } from "@/lib/analysis";
import { Slider } from "@/components/ui/slider";
import { analyzeFeasibility } from "@/lib/analysis";

function ScoreCircle({ score, label, icon: Icon }: { score: number; label: string; icon: any }) {
  const color = score >= 70 ? "text-primary" : score >= 50 ? "text-accent" : "text-destructive";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative w-20 h-20 rounded-full border-4 ${score >= 70 ? "border-primary" : score >= 50 ? "border-accent" : "border-destructive"} flex items-center justify-center`}>
        <span className={`text-2xl font-bold font-display ${color}`}>{score}</span>
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
    </div>
  );
}

export default function ProjectResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simData, setSimData] = useState<ProjectData | null>(null);
  const [simResult, setSimResult] = useState<FeasibilityResult | null>(null);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
    if (error || !data) { navigate("/dashboard"); return; }
    setProject(data);
    setSimData(data.project_data as any);
    setSimResult(data.feasibility_result as any);
    setLoading(false);
  };

  const handleSimChange = (field: keyof ProjectData, value: number) => {
    if (!simData) return;
    const updated = { ...simData, [field]: value };
    setSimData(updated);
    setSimResult(analyzeFeasibility(updated));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  const projectData = project.project_data as ProjectData;
  const swot = project.swot_analysis as SWOTAnalysis;
  const feasibility = simResult || (project.feasibility_result as FeasibilityResult);

  const radarData = [
    { dim: "Marché", score: feasibility.market_score },
    { dim: "Technique", score: feasibility.technical_score },
    { dim: "Financier", score: feasibility.financial_score },
    { dim: "Réglementaire", score: feasibility.regulatory_score },
  ];

  const cashFlowData = feasibility.cash_flows.map((cf, i) => ({ year: `Année ${i + 1}`, value: cf }));

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display font-bold text-foreground">{project.name}</h1>
              <p className="text-xs text-muted-foreground">{project.sector}</p>
            </div>
          </div>
          <Badge className={`${feasibility.overall_score >= 70 ? "bg-primary" : feasibility.overall_score >= 50 ? "bg-accent" : "bg-destructive"} text-primary-foreground`}>
            Score: {feasibility.overall_score}/100
          </Badge>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Scores Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Scores de Faisabilité</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
                <ScoreCircle score={feasibility.market_score} label="Marché" icon={Target} />
                <ScoreCircle score={feasibility.technical_score} label="Technique" icon={Monitor} />
                <ScoreCircle score={feasibility.financial_score} label="Financier" icon={DollarSign} />
                <ScoreCircle score={feasibility.regulatory_score} label="Réglementaire" icon={Shield} />
                <div className="col-span-2 md:col-span-1">
                  <div className="w-full h-48">
                    <ResponsiveContainer>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial KPIs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: "ROI", value: `${feasibility.roi}%`, icon: TrendingUp, positive: feasibility.roi > 0 },
              { label: "VAN (NPV)", value: `${feasibility.npv.toLocaleString()} TND`, icon: DollarSign, positive: feasibility.npv > 0 },
              { label: "TRI (IRR)", value: `${feasibility.irr}%`, icon: TrendingUp, positive: feasibility.irr > 10 },
              { label: "Seuil rentabilité", value: `${feasibility.breakeven_months} mois`, icon: Target, positive: feasibility.breakeven_months < 24 },
            ].map((kpi) => (
              <Card key={kpi.label} className="shadow-soft">
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.positive ? "bg-primary/10" : "bg-destructive/10"}`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.positive ? "text-primary" : "text-destructive"}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-lg font-bold font-display text-foreground">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Cash Flow Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display">Prévision Cash Flow (5 ans)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Simulator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display">🎛️ Simulateur Financier Interactif</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {simData && (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Prix unitaire</span><span className="font-semibold text-foreground">{simData.product_price} TND</span></div>
                    <Slider value={[simData.product_price]} min={1} max={500} step={1} onValueChange={([v]) => handleSimChange("product_price", v)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Coûts mensuels</span><span className="font-semibold text-foreground">{simData.monthly_costs.toLocaleString()} TND</span></div>
                    <Slider value={[simData.monthly_costs]} min={500} max={100000} step={500} onValueChange={([v]) => handleSimChange("monthly_costs", v)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Volume mensuel (unités)</span><span className="font-semibold text-foreground">{simData.units_per_month}</span></div>
                    <Slider value={[simData.units_per_month]} min={1} max={10000} step={10} onValueChange={([v]) => handleSimChange("units_per_month", v)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Croissance annuelle</span><span className="font-semibold text-foreground">{simData.growth_rate}%</span></div>
                    <Slider value={[simData.growth_rate]} min={0} max={50} step={1} onValueChange={([v]) => handleSimChange("growth_rate", v)} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* SWOT */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display">Analyse SWOT</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Forces", items: swot.strengths, color: "bg-primary/10 text-primary", icon: CheckCircle2 },
                  { title: "Faiblesses", items: swot.weaknesses, color: "bg-destructive/10 text-destructive", icon: AlertTriangle },
                  { title: "Opportunités", items: swot.opportunities, color: "bg-accent/10 text-accent-foreground", icon: TrendingUp },
                  { title: "Menaces", items: swot.threats, color: "bg-muted text-muted-foreground", icon: TrendingDown },
                ].map((q) => (
                  <div key={q.title} className={`p-4 rounded-xl ${q.color}`}>
                    <div className="flex items-center gap-2 mb-3 font-display font-semibold">
                      <q.icon className="w-4 h-4" /> {q.title}
                    </div>
                    <ul className="space-y-1.5">
                      {q.items.map((item, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="shadow-card border-primary/20">
            <CardHeader><CardTitle className="font-display flex items-center gap-2"><Lightbulb className="w-5 h-5 text-accent" /> Recommandations</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feasibility.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-center">
          <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    </div>
  );
}
