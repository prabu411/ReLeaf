import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface ActionCardProps {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: string;
  category: string;
  userId: string;
  onActionLogged?: () => void;
}

export const ActionCard = ({
  id,
  name,
  description,
  points,
  icon,
  category,
  userId,
  onActionLogged,
}: ActionCardProps) => {
  const [isLogging, setIsLogging] = useState(false);
  const { toast } = useToast();

  const handleLogAction = async () => {
    setIsLogging(true);
    try {
      const { error } = await supabase
        .from("user_actions")
        .insert({
          user_id: userId,
          action_id: id,
        });

      if (error) throw error;

      toast({
        title: "Action logged! 🎉",
        description: `+${points} points earned`,
      });

      onActionLogged?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error logging action",
        description: error.message,
      });
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 animate-fade-in group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl group-hover:scale-110 transition-transform">{icon}</span>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription className="text-sm mt-1">{description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{points}</span>
            <span className="text-sm text-muted-foreground">points</span>
          </div>
          <Button
            onClick={handleLogAction}
            disabled={isLogging}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {isLogging ? "Logging..." : "Log Action"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
