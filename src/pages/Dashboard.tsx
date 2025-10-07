import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardNav } from "@/components/DashboardNav";
import { StatsCard } from "@/components/StatsCard";
import { ActionCard } from "@/components/ActionCard";
import { AchievementBadge } from "@/components/AchievementBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Zap, TrendingUp, Award } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPoints: 0,
    level: 1,
    totalActions: 0,
    streak: 0,
  });
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
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setStats(prev => ({
        ...prev,
        totalPoints: profileData.total_points,
        level: profileData.level,
      }));
    }

    // Fetch actions
    const { data: actionsData } = await supabase
      .from("eco_actions")
      .select("*")
      .order("points", { ascending: false });

    if (actionsData) {
      setActions(actionsData);
    }

    // Fetch user actions for stats
    const { data: userActionsData } = await supabase
      .from("user_actions")
      .select("*")
      .eq("user_id", user.id);

    if (userActionsData) {
      setStats(prev => ({
        ...prev,
        totalActions: userActionsData.length,
      }));
    }

    // Fetch achievements
    const { data: achievementsData } = await supabase
      .from("achievements")
      .select("*")
      .order("requirement_value", { ascending: true });

    if (achievementsData) {
      setAchievements(achievementsData);
    }

    // Fetch user achievements
    const { data: userAchievementsData } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", user.id);

    if (userAchievementsData) {
      setUserAchievements(userAchievementsData);
    }
  };

  const handleActionLogged = () => {
    fetchData();
  };

  const actionsByCategory = actions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, any[]>);

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {profile.username}! 🌱
          </h1>
          <p className="text-muted-foreground text-lg">
            Keep up the great work protecting our planet
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Points"
            value={stats.totalPoints}
            icon={Target}
            gradient
          />
          <StatsCard
            title="Level"
            value={stats.level}
            icon={TrendingUp}
          />
          <StatsCard
            title="Actions Completed"
            value={stats.totalActions}
            icon={Zap}
          />
          <StatsCard
            title="Achievements"
            value={userAchievements.length}
            icon={Award}
          />
        </div>

        {/* Tabs for Actions and Achievements */}
        <Tabs defaultValue="actions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="actions">Log Actions</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-6">
            {Object.entries(actionsByCategory).map(([category, categoryActions]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold mb-4 capitalize flex items-center gap-2">
                  <span className="bg-primary/10 px-3 py-1 rounded-full text-primary">
                    {category}
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(categoryActions as any[]).map((action: any) => (
                    <ActionCard
                      key={action.id}
                      {...action}
                      userId={user.id}
                      onActionLogged={handleActionLogged}
                    />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {achievements.map((achievement) => {
                const isUnlocked = userAchievements.some(
                  (ua) => ua.achievement_id === achievement.id
                );
                const unlockedItem = userAchievements.find(
                  (ua) => ua.achievement_id === achievement.id
                );

                return (
                  <AchievementBadge
                    key={achievement.id}
                    name={achievement.name}
                    description={achievement.description}
                    icon={achievement.icon}
                    badgeColor={achievement.badge_color}
                    unlocked={isUnlocked}
                    unlockedAt={unlockedItem?.unlocked_at}
                  />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
