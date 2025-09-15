import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Receipt, IndianRupee } from "lucide-react";
import type { Fee } from "@shared/schema";

export default function FeeManagement() {
  const { data: fees = [], isLoading } = useQuery<Fee[]>({
    queryKey: ["/api/fees"],
  });

  const totalFeesCollected = fees
    .filter(fee => fee.status === 'completed')
    .reduce((sum, fee) => sum + parseFloat(fee.amount), 0);

  const pendingFees = fees.filter(fee => fee.status === 'pending');

  if (isLoading) {
    return (
      <div className="flex-1 ml-64">
        <Header title="Fee Management" subtitle="Handle fee collection and payment tracking" />
        <div className="p-6">Loading fee data...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-64">
      <Header title="Fee Management" subtitle="Handle fee collection and payment tracking" />
      
      <div className="p-6">
        {/* Fee Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
                  <p className="text-3xl font-bold text-foreground">₹{(totalFeesCollected / 100000).toFixed(1)}L</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <IndianRupee className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                  <p className="text-3xl font-bold text-foreground">{pendingFees.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-yellow-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                  <p className="text-3xl font-bold text-foreground">{fees.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Receipt className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Records */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Fee Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {fees.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Fee Records</h3>
                <p className="text-muted-foreground">Fee transactions will appear here once students make payments.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">Student ID</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Payment Date</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Method</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((fee) => (
                      <tr key={fee.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-4 text-sm text-foreground" data-testid={`text-fee-student-${fee.id}`}>
                          {fee.studentId}
                        </td>
                        <td className="p-4 text-sm font-medium text-foreground">
                          ₹{parseFloat(fee.amount).toLocaleString()}
                        </td>
                        <td className="p-4 text-sm text-foreground">
                          {new Date(fee.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm text-foreground capitalize">
                          {fee.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={
                              fee.status === 'completed' ? 'default' :
                              fee.status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {fee.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm" data-testid={`button-view-receipt-${fee.id}`}>
                            View Receipt
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
