import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

interface AchievementBadgeProps {
  name: string;
  description: string;
  icon: string;
  badgeColor: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const AchievementBadge = ({
  name,
  description,
  icon,
  badgeColor,
  unlocked,
  unlockedAt,
}: AchievementBadgeProps) => {
  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 ${
        unlocked 
          ? 'hover:shadow-lg animate-badge-unlock' 
          : 'opacity-60 grayscale'
      }`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className={`text-5xl ${unlocked ? 'animate-pulse-glow' : ''}`}>
            {unlocked ? icon : <Lock className="h-12 w-12 text-muted-foreground" />}
          </div>
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {unlocked && (
            <Badge 
              variant="secondary"
              className="mt-2"
              style={{ 
                backgroundColor: `hsl(var(--${badgeColor}))`,
                color: 'white'
              }}
            >
              Unlocked
            </Badge>
          )}
          {!unlocked && (
            <Badge variant="outline" className="mt-2">
              Locked
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
