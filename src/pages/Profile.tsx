import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardNav } from "@/components/DashboardNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calendar, Zap, TrendingUp, Award } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";
import { format } from "date-fns";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // Fetch recent actions with action details
    const { data: actionsData } = await supabase
      .from("user_actions")
      .select(`
        *,
        eco_actions (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (actionsData) {
      setRecentActions(actionsData);
    }

    // Fetch unlocked achievements
    const { data: achievementsData } = await supabase
      .from("user_achievements")
      .select(`
        *,
        achievements (*)
      `)
      .eq("user_id", user.id)
      .order("unlocked_at", { ascending: false });

    if (achievementsData) {
      setAchievements(achievementsData);
    }
  };

  const getLevelProgress = () => {
    if (!profile) return 0;
    const pointsForNextLevel = profile.level * 100;
    const progressInLevel = profile.total_points % pointsForNextLevel;
    return (progressInLevel / pointsForNextLevel) * 100;
  };

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {profile.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-2xl font-bold">{profile.username}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>

              <Badge variant="secondary" className="text-lg px-4 py-2">
                Level {profile.level}
              </Badge>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {profile.level + 1}</span>
                  <span className="font-bold">{Math.round(getLevelProgress())}%</span>
                </div>
                <Progress value={getLevelProgress()} />
              </div>

              <Separator />

              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    <span>Total Points</span>
                  </div>
                  <span className="font-bold text-lg">{profile.total_points}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Member Since</span>
                  </div>
                  <span className="text-sm">
                    {format(new Date(profile.created_at), "MMM yyyy")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No actions logged yet. Start tracking your eco-actions!
                  </p>
                ) : (
                  recentActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-card border hover:bg-accent transition-colors"
                    >
                      <span className="text-3xl">{action.eco_actions.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold">{action.eco_actions.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(action.created_at), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-lg">
                        +{action.eco_actions.points}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Unlocked Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No achievements unlocked yet. Keep logging actions to earn badges!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex flex-col items-center p-4 rounded-lg bg-card border text-center space-y-2 hover:shadow-md transition-shadow"
                    >
                      <span className="text-4xl">{achievement.achievements.icon}</span>
                      <h3 className="font-bold">{achievement.achievements.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Unlocked {format(new Date(achievement.unlocked_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
