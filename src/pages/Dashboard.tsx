import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, Trash2, Edit, LogOut, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface Presentation {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate('/auth');
      } else {
        loadPresentations();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadPresentations = async () => {
    try {
      const { data, error } = await supabase
        .from('presentations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPresentations(data || []);
    } catch (error) {
      console.error('Error loading presentations:', error);
      toast.error('Failed to load presentations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('presentations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Presentation deleted');
      loadPresentations();
    } catch (error) {
      toast.error('Failed to delete presentation');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">SlideCraft AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">My Presentations</h2>
          <p className="text-muted-foreground">Create and manage your AI-powered presentations</p>
        </div>

        {/* Create New Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card
            className="p-6 border-2 border-dashed border-primary/50 hover:border-primary cursor-pointer transition-all hover:shadow-elegant group"
            onClick={() => navigate('/create')}
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Create New</h3>
              <p className="text-sm text-muted-foreground">Start with AI or template</p>
            </div>
          </Card>

          {/* Existing Presentations */}
          {presentations.map((presentation) => (
            <Card
              key={presentation.id}
              className="p-6 hover:shadow-elegant transition-all group cursor-pointer"
              onClick={() => navigate(`/editor/${presentation.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editor/${presentation.id}`);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(presentation.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <h3 className="font-semibold mb-1 line-clamp-1">{presentation.title}</h3>
              {presentation.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {presentation.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Updated {new Date(presentation.updated_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>

        {presentations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No presentations yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first presentation to get started
            </p>
            <Button onClick={() => navigate('/create')} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Presentation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
