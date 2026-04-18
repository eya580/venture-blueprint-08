import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle2, Lightbulb, Target, DollarSign, Users } from "lucide-react";
import type { ProjectData } from "@/lib/analysis";
import { generateSWOT, analyzeFeasibility } from "@/lib/analysis";

const sectors = [
  "Technologie", "Santé", "E-commerce", "Éducation", "Finance",
  "Restauration", "Immobilier", "Services", "Agriculture", "Industrie", "Autre"
];

const stepLabels = [
  { icon: Lightbulb, label: "L'idée" },
  { icon: Target, label: "Vision & Mission" },
  { icon: Users, label: "Marché" },
  { icon: DollarSign, label: "Finances" },
];

const initialData: ProjectData = {
  name: "", description: "", sector: "", mission: "", vision: "",
  value_proposition: "", target_customers: "", business_model: "",
  market_size: 0, competitors: "", initial_investment: 0, monthly_costs: 0,
  expected_revenue: 0, product_price: 0, units_per_month: 0, growth_rate: 5,
  team_size: 1, funding_source: "", unique_advantage: "",
  marketing_budget: 0, pricing_strategy: "", variable_cost_per_unit: 0,
};

export default function ProjectWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ProjectData>(initialData);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field: keyof ProjectData, value: string | number) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Non authentifié");

      const swot = generateSWOT(data);
      const feasibility = analyzeFeasibility(data);

      const { data: project, error } = await supabase.from("projects").insert({
        user_id: userData.user.id,
        name: data.name,
        description: data.description,
        sector: data.sector,
        project_data: data as any,
        swot_analysis: swot as any,
        feasibility_result: feasibility as any,
        overall_score: feasibility.overall_score,
      }).select().single();

      if (error) throw error;
      toast.success("Projet analysé avec succès !");
      navigate(`/project/${project.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return data.name && data.description && data.sector;
    if (step === 1) return data.mission && data.vision && data.value_proposition;
    if (step === 2) return data.target_customers && data.market_size > 0;
    return data.initial_investment > 0 && data.product_price > 0 && data.units_per_month > 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container flex items-center h-16 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded gradient-primary flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">Nouveau Projet</span>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl py-8">
        {/* Progress */}
        <div className="flex items-center justify-between mb-10">
          {stepLabels.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < 3 && <div className={`w-8 md:w-16 h-0.5 mx-2 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl">{stepLabels[step].label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {step === 0 && (
                  <>
                    <div className="space-y-2">
                      <Label>Nom du projet *</Label>
                      <Input placeholder="Ex: FreshMeal" value={data.name} onChange={(e) => update("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Secteur d'activité *</Label>
                      <Select value={data.sector} onValueChange={(v) => update("sector", v)}>
                        <SelectTrigger><SelectValue placeholder="Choisir un secteur" /></SelectTrigger>
                        <SelectContent>
                          {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Description du projet *</Label>
                      <Textarea placeholder="Décrivez votre idée en détail..." value={data.description} onChange={(e) => update("description", e.target.value)} rows={4} />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label>Mission *</Label>
                      <Textarea placeholder="Quelle est la raison d'être de votre projet ?" value={data.mission} onChange={(e) => update("mission", e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Vision *</Label>
                      <Textarea placeholder="Où voyez-vous votre projet dans 5 ans ?" value={data.vision} onChange={(e) => update("vision", e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Proposition de valeur *</Label>
                      <Textarea placeholder="Qu'est-ce qui rend votre offre unique ?" value={data.value_proposition} onChange={(e) => update("value_proposition", e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Modèle économique</Label>
                      <Input placeholder="Ex: Abonnement mensuel, Vente directe..." value={data.business_model} onChange={(e) => update("business_model", e.target.value)} />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label>Segments clients cibles *</Label>
                      <Textarea placeholder="Décrivez vos clients idéaux..." value={data.target_customers} onChange={(e) => update("target_customers", e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Taille du marché estimée (€) *</Label>
                      <Input type="number" placeholder="1000000" value={data.market_size || ""} onChange={(e) => update("market_size", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Concurrents principaux</Label>
                      <Textarea placeholder="Listez vos concurrents et leur positionnement..." value={data.competitors} onChange={(e) => update("competitors", e.target.value)} rows={3} />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Investissement initial (€) *</Label>
                        <Input type="number" placeholder="50000" value={data.initial_investment || ""} onChange={(e) => update("initial_investment", Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Coûts mensuels (€) *</Label>
                        <Input type="number" placeholder="5000" value={data.monthly_costs || ""} onChange={(e) => update("monthly_costs", Number(e.target.value))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Revenus mensuels prévus (€) *</Label>
                        <Input type="number" placeholder="15000" value={data.expected_revenue || ""} onChange={(e) => update("expected_revenue", Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Prix unitaire (€)</Label>
                        <Input type="number" placeholder="50" value={data.product_price || ""} onChange={(e) => update("product_price", Number(e.target.value))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Unités vendues / mois</Label>
                        <Input type="number" placeholder="300" value={data.units_per_month || ""} onChange={(e) => update("units_per_month", Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Taux de croissance annuel (%)</Label>
                        <Input type="number" placeholder="10" value={data.growth_rate || ""} onChange={(e) => update("growth_rate", Number(e.target.value))} />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Précédent
          </Button>
          {step < 3 ? (
            <Button variant="hero" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Suivant <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="hero" onClick={handleSubmit} disabled={loading || !canProceed()}>
              {loading ? "Analyse en cours..." : "Analyser le projet"} <BarChart3 className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
