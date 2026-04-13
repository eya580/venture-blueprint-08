import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart3, Brain, FileText, LineChart, Target, TrendingUp, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Business Plan Guidé",
    desc: "Parcours structuré étape par étape pour construire votre plan d'affaires complet avec auto-génération intelligente.",
  },
  {
    icon: Target,
    title: "Analyse de Faisabilité",
    desc: "Analyse en 4 dimensions : marché, technique, financière et réglementaire pour valider votre projet.",
  },
  {
    icon: LineChart,
    title: "Simulateur Financier",
    desc: "ROI, VAN, TRI calculés automatiquement avec visualisation dynamique et modification en temps réel.",
  },
  {
    icon: FileText,
    title: "Export Professionnel",
    desc: "Exportez en PDF avec mise en forme Investor Pitch Ready pour impressionner vos investisseurs.",
  },
];

const steps = [
  { num: "01", title: "Décrivez votre projet", desc: "Renseignez les informations clés de votre idée" },
  { num: "02", title: "Analyse automatique", desc: "Notre moteur analyse la faisabilité de votre projet" },
  { num: "03", title: "Résultats & Conseils", desc: "Obtenez des insights actionnables et un plan complet" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">Stratify</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>Connexion</Button>
            <Button variant="hero" onClick={() => navigate("/auth")}>Commencer gratuitement</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Plateforme intelligente de business planning
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-display text-foreground leading-tight mb-6">
              Your Vision,{" "}
              <span className="text-gradient">Into Execution</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Transformez vos idées en projets viables. Analyse de faisabilité, business plan complet et simulateur financier — tout en un seul endroit.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="hero" size="lg" onClick={() => navigate("/auth")} className="text-base px-8 py-6">
                Créer mon projet
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <Button variant="hero-outline" size="lg" onClick={() => navigate("/projects")} className="text-base px-8 py-6">
                Voir les projets
              </Button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold font-display text-foreground mb-3">Tout ce qu'il faut pour réussir</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Une suite d'outils puissants pour valider et planifier votre projet entrepreneurial.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 border border-border"
              >
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-card-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-bold font-display text-foreground mb-3">Comment ça marche</h2>
            <p className="text-muted-foreground">Trois étapes simples pour valider votre projet</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="text-5xl font-bold font-display text-primary/15 mb-3">{s.num}</div>
                <h3 className="font-display font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8">
                    <ArrowRight className="w-5 h-5 text-primary/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-hero rounded-2xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(13,148,136,0.2),transparent_70%)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold font-display text-primary-foreground mb-4">
                Prêt à concrétiser votre vision ?
              </h2>
              <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
                Rejoignez des centaines d'entrepreneurs qui ont validé leur projet avec Stratify.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 font-semibold text-base px-8 py-6"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm text-foreground">Stratify</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Stratify. Your vision, into execution.</p>
        </div>
      </footer>
    </div>
  );
}
