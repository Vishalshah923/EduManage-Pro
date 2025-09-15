import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
}

export function StatsCard({ title, value, change, changeType, icon: Icon, iconColor }: StatsCardProps) {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-orange-600",
  };

  const changeIcons = {
    positive: "↗",
    negative: "↘",
    neutral: "→",
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
          <p className={`text-sm mt-1 ${changeColors[changeType]}`}>
            <span className="mr-1">{changeIcons[changeType]}</span>
            {change}
          </p>
        </div>
        <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
