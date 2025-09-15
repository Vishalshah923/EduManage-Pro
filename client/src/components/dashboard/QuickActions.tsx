import { UserPlus, Receipt, Key, FileText } from "lucide-react";

const quickActions = [
  {
    icon: UserPlus,
    title: "Add New Student",
    description: "Register new admission",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    action: "add-student",
  },
  {
    icon: Receipt,
    title: "Process Payment",
    description: "Handle fee collection",
    color: "bg-green-100",
    iconColor: "text-green-600",
    action: "process-payment",
  },
  {
    icon: Key,
    title: "Room Allocation",
    description: "Assign hostel rooms",
    color: "bg-orange-100",
    iconColor: "text-orange-600",
    action: "room-allocation",
  },
  {
    icon: FileText,
    title: "Generate Report",
    description: "Download analytics",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    action: "generate-report",
  },
];

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {quickActions.map((action) => {
        const Icon = action.icon;
        
        return (
          <button
            key={action.action}
            onClick={() => onAction(action.action)}
            className="bg-card border border-border rounded-lg p-4 hover:bg-muted transition-colors text-left"
            data-testid={`action-${action.action}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                <Icon className={action.iconColor} size={20} />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{action.title}</h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
