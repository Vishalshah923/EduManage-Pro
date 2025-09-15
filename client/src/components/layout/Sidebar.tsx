import { Link, useLocation } from "wouter";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  GraduationCap, 
  Home, 
  University, 
  CreditCard, 
  Bed, 
  Book, 
  ClipboardList, 
  BarChart3, 
  Settings,
  LogOut
} from "lucide-react";

const navigationItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/students", icon: University, label: "Students", badge: "2,847" },
  { href: "/fees", icon: CreditCard, label: "Fee Management" },
  { href: "/hostel", icon: Bed, label: "Hostel", badge: "85% Full", badgeColor: "bg-green-100 text-green-800" },
  { href: "/library", icon: Book, label: "Library" },
  { href: "/exams", icon: ClipboardList, label: "Exams" },
  { href: "/reports", icon: BarChart3, label: "Reports", separator: true },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="bg-card border-r border-border w-64 fixed h-full z-30 overflow-y-auto">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="text-primary-foreground" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">EduManage Pro</h1>
            <p className="text-sm text-muted-foreground">Admin Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href} className={item.separator ? "pt-4 border-t border-border" : ""}>
                <Link href={item.href}>
                  <a className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-muted"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                        item.badgeColor || "bg-muted text-muted-foreground"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="flex items-center space-x-3 px-4 py-2">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40" 
            alt="Admin profile" 
            className="w-10 h-10 rounded-full border-2 border-border"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate" data-testid="user-name">
              {user?.username || "Dr. Sarah Johnson"}
            </p>
            <p className="text-xs text-muted-foreground truncate">Administrator</p>
          </div>
          <button 
            onClick={logout}
            className="p-1 rounded hover:bg-muted"
            data-testid="button-logout"
          >
            <LogOut className="text-muted-foreground" size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
