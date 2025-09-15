import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { StudentModal } from "@/components/modals/StudentModal";
import { GraduationCap, IndianRupee, Bed, Book } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const dashboardStats = stats || {
    totalStudents: 0,
    feesCollected: 0,
    hostelOccupancy: 0,
    booksIssuedToday: 0,
  };

  const { data: examPerformance } = useQuery({
    queryKey: ["/api/dashboard/exam-performance"],
  });

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-student":
        setIsStudentModalOpen(true);
        break;
      // Add other action handlers here
      default:
        console.log(`Action ${action} not implemented yet`);
    }
  };

  if (statsLoading) {
    return <div>Loading dashboard...</div>;
  }

  const performanceData = examPerformance || {
    Mathematics: 87.5,
    Physics: 82.3,
    Chemistry: 79.8,
    English: 91.2,
  };

  const overallAverage = Object.values(performanceData).reduce((sum, val) => sum + val, 0) / Object.values(performanceData).length;

  return (
    <div className="flex-1 ml-64">
      <Header 
        title="Dashboard Overview" 
        subtitle="Welcome back! Here's what's happening at your institution." 
      />
      
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value={dashboardStats.totalStudents}
            change="12% from last month"
            changeType="positive"
            icon={GraduationCap}
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatsCard
            title="Fees Collected"
            value={`₹${(dashboardStats.feesCollected / 100000).toFixed(1)}L`}
            change="8% from last month"
            changeType="positive"
            icon={IndianRupee}
            iconColor="bg-green-100 text-green-600"
          />
          <StatsCard
            title="Hostel Occupancy"
            value={`${dashboardStats.hostelOccupancy}%`}
            change="234 rooms occupied"
            changeType="neutral"
            icon={Bed}
            iconColor="bg-orange-100 text-orange-600"
          />
          <StatsCard
            title="Books Issued Today"
            value={dashboardStats.booksIssuedToday}
            change="23 more than yesterday"
            changeType="positive"
            icon={Book}
            iconColor="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RevenueChart />
          
          {/* Exam Performance */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Exam Performance</h3>
            <div className="space-y-4">
              {Object.entries(performanceData).map(([subject, percentage]) => (
                <div key={subject}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{subject}</span>
                    <span className="text-sm font-medium text-foreground">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        subject === 'Mathematics' ? 'bg-green-500' :
                        subject === 'Physics' ? 'bg-blue-500' :
                        subject === 'Chemistry' ? 'bg-yellow-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Overall Average</span>
                <span className="text-lg font-bold text-green-600">{overallAverage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions onAction={handleQuickAction} />

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Students */}
          <div className="bg-card rounded-lg border border-border shadow-sm">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Recent Admissions</h3>
                <a href="/students" className="text-sm text-primary hover:text-primary/80">View All</a>
              </div>
            </div>
            <div className="p-0">
              {/* Sample recent students - replace with real data */}
              <div className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40" 
                    alt="Student" 
                    className="w-10 h-10 rounded-full border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">New Student</p>
                    <p className="text-xs text-muted-foreground">Recent Admission</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Just now</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1"></span>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-card rounded-lg border border-border shadow-sm">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Pending Tasks</h3>
                <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">7 Urgent</span>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm">!</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-900">Fee Payment Overdue</p>
                  <p className="text-xs text-red-700">23 students have pending payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StudentModal 
        open={isStudentModalOpen} 
        onClose={() => setIsStudentModalOpen(false)} 
      />
    </div>
  );
}
