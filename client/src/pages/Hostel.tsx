import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Bed, Home, Users } from "lucide-react";
import type { Hostel } from "@shared/schema";

export default function HostelPage() {
  const { data: hostels = [], isLoading } = useQuery<Hostel[]>({
    queryKey: ["/api/hostels"],
  });

  const totalRooms = 275;
  const occupiedRooms = hostels.filter(h => h.status === 'allocated').length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  if (isLoading) {
    return (
      <div className="flex-1 ml-64">
        <Header title="Hostel Management" subtitle="Manage room allocations and occupancy" />
        <div className="p-6">Loading hostel data...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-64">
      <Header title="Hostel Management" subtitle="Manage room allocations and occupancy" />
      
      <div className="p-6">
        {/* Hostel Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                  <p className="text-3xl font-bold text-foreground">{totalRooms}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupied Rooms</p>
                  <p className="text-3xl font-bold text-foreground">{occupiedRooms}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
                  <p className="text-3xl font-bold text-foreground">{occupancyRate}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Bed className="text-orange-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Allocations */}
        <Card>
          <CardHeader>
            <CardTitle>Room Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            {hostels.length === 0 ? (
              <div className="text-center py-12">
                <Bed className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Room Allocations</h3>
                <p className="text-muted-foreground">Room allocations will appear here once students are assigned rooms.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">Student ID</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Room No</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Block</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Allocation Date</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hostels.map((hostel) => (
                      <tr key={hostel.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-4 text-sm text-foreground" data-testid={`text-hostel-student-${hostel.id}`}>
                          {hostel.studentId}
                        </td>
                        <td className="p-4 text-sm font-medium text-foreground">
                          {hostel.roomNo}
                        </td>
                        <td className="p-4 text-sm text-foreground">
                          {hostel.block}
                        </td>
                        <td className="p-4 text-sm text-foreground">
                          {new Date(hostel.allocationDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={hostel.status === 'allocated' ? 'default' : 'secondary'}
                          >
                            {hostel.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm" data-testid={`button-manage-room-${hostel.id}`}>
                            Manage Room
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
