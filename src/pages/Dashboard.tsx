import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BarChart3, Plus, LogOut, FolderOpen, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadProjects();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) navigate("/auth");
  };

  const loadProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">Stratify</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/projects")}>Tous les projets</Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">Tableau de bord</h1>
            <p className="text-muted-foreground text-sm">Gérez et analysez vos projets</p>
          </div>
          <Button variant="hero" onClick={() => navigate("/new-project")}>
            <Plus className="w-4 h-4 mr-1" /> Nouveau projet
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-16 text-center">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">Aucun projet encore</h3>
              <p className="text-muted-foreground text-sm mb-6">Créez votre premier projet pour commencer l'analyse</p>
              <Button variant="hero" onClick={() => navigate("/new-project")}>
                <Plus className="w-4 h-4 mr-1" /> Créer mon premier projet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="shadow-card hover:shadow-elevated transition-all cursor-pointer group border-border"
                  onClick={() => navigate(`/project/${p.id}`)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">{p.sector}</Badge>
                      <Badge className={`text-xs ${
                        p.overall_score >= 70 ? "bg-primary" : p.overall_score >= 50 ? "bg-accent" : "bg-destructive"
                      } text-primary-foreground`}>
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
