import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart3, ArrowLeft, Calendar, ArrowRight } from "lucide-react";

export default function ProjectsList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase.from("projects").select("id, name, description, sector, overall_score, created_at").order("created_at", { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container flex items-center h-16 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">Projets réalisés</span>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <h1 className="text-2xl font-bold font-display text-foreground mb-2">Tous les projets</h1>
        <p className="text-muted-foreground text-sm mb-8">Découvrez les projets analysés sur Stratify</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">Aucun projet pour le moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="shadow-card hover:shadow-elevated transition-all cursor-pointer group border-border" onClick={() => navigate(`/project/${p.id}`)}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">{p.sector}</Badge>
                      <Badge className={`text-xs ${p.overall_score >= 70 ? "bg-primary" : p.overall_score >= 50 ? "bg-accent" : "bg-destructive"} text-primary-foreground`}>
                        {p.overall_score}/100
                      </Badge>
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(p.created_at).toLocaleDateString("fr-FR")}
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
