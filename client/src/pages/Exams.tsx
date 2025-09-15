import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Trophy, TrendingUp } from "lucide-react";
import type { Exam } from "@shared/schema";

export default function Exams() {
  const { data: exams = [], isLoading } = useQuery<Exam[]>({
    queryKey: ["/api/exams"],
  });

  const totalExams = exams.length;
  const averageMarks = exams.length > 0 
    ? exams.reduce((sum, exam) => sum + (exam.marks / exam.totalMarks) * 100, 0) / exams.length 
    : 0;
  const topPerformers = exams.filter(exam => (exam.marks / exam.totalMarks) * 100 >= 90).length;

  if (isLoading) {
    return (
      <div className="flex-1 ml-64">
        <Header title="Exam Management" subtitle="Manage exam records and student performance" />
        <div className="p-6">Loading exam data...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-64">
      <Header title="Exam Management" subtitle="Manage exam records and student performance" />
      
      <div className="p-6">
        {/* Exam Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Exams</p>
                  <p className="text-3xl font-bold text-foreground">{totalExams}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Performance</p>
                  <p className="text-3xl font-bold text-foreground">{averageMarks.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                  <p className="text-3xl font-bold text-foreground">{topPerformers}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="text-yellow-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exam Records */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Records</CardTitle>
          </CardHeader>
          <CardContent>
            {exams.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Exam Records</h3>
                <p className="text-muted-foreground">Exam results will appear here once marks are entered.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">Student ID</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Subject</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Marks</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Grade</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Exam Date</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam) => {
                      const percentage = (exam.marks / exam.totalMarks) * 100;
                      
                      return (
                        <tr key={exam.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 text-sm text-foreground" data-testid={`text-exam-student-${exam.id}`}>
                            {exam.studentId}
                          </td>
                          <td className="p-4 text-sm font-medium text-foreground">
                            {exam.subject}
                          </td>
                          <td className="p-4 text-sm text-foreground">
                            {exam.marks}/{exam.totalMarks} ({percentage.toFixed(1)}%)
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant={
                                exam.grade === 'A' || exam.grade === 'A+' ? 'default' :
                                exam.grade === 'B' || exam.grade === 'B+' ? 'secondary' : 'destructive'
                              }
                            >
                              {exam.grade}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-foreground">
                            {new Date(exam.examDate).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm text-foreground capitalize">
                            {exam.examType}
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm" data-testid={`button-view-exam-${exam.id}`}>
                              View Details
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
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
