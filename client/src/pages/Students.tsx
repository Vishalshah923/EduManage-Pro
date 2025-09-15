import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { StudentModal } from "@/components/modals/StudentModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Filter } from "lucide-react";
import type { Student } from "@shared/schema";

export default function Students() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 ml-64">
        <Header title="Students" subtitle="Manage student admissions and profiles" />
        <div className="p-6">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-64">
      <Header title="Students" subtitle="Manage student admissions and profiles" />
      
      <div className="p-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
                data-testid="input-search-students"
              />
            </div>
            <Button variant="outline" data-testid="button-filter-students">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
          </div>
          <Button onClick={() => setIsModalOpen(true)} data-testid="button-add-student">
            <UserPlus size={16} className="mr-2" />
            Add Student
          </Button>
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <UserPlus className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Students Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No students match your search criteria." : "Get started by adding your first student."}
              </p>
              <Button onClick={() => setIsModalOpen(true)} data-testid="button-add-first-student">
                <UserPlus size={16} className="mr-2" />
                Add First Student
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground" data-testid={`text-student-name-${student.id}`}>
                          {student.name}
                        </h3>
                        <p className="text-sm text-muted-foreground" data-testid={`text-student-id-${student.id}`}>
                          {student.studentId}
                        </p>
                      </div>
                    </div>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Course:</span>
                      <span className="text-foreground font-medium">{student.course}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Year:</span>
                      <span className="text-foreground font-medium">{student.year}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground font-medium truncate ml-2">{student.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="text-foreground font-medium">{student.phone}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Admitted: {new Date(student.admissionDate).toLocaleDateString()}
                      </span>
                      <Button variant="outline" size="sm" data-testid={`button-view-student-${student.id}`}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <StudentModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
