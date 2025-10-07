import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardNav } from "@/components/DashboardNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";

export default function Leaderboard() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
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
      fetchLeaderboard();
    }
  }, [user]);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("total_points", { ascending: false })
      .limit(50);

    if (data) {
      setLeaderboard(data);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500";
    if (rank === 3) return "bg-gradient-to-r from-amber-500 to-amber-700";
    return "";
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="h-10 w-10 text-primary" />
            Campus Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg">
            See how you rank against other eco-warriors
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Eco-Warriors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((profile, index) => {
                const rank = index + 1;
                const isCurrentUser = profile.id === user.id;
                
                return (
                  <div
                    key={profile.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      isCurrentUser
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-card hover:bg-accent"
                    } ${rank <= 3 ? getRankBadgeColor(rank) : ""}`}
                  >
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(rank)}
                    </div>

                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">
                          {profile.username}
                        </h3>
                        {isCurrentUser && (
                          <Badge variant="secondary">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Level {profile.level}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {profile.total_points}
                      </div>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
