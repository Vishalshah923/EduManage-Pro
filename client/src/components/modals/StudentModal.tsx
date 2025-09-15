import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface StudentModalProps {
  open: boolean;
  onClose: () => void;
}

export function StudentModal({ open, onClose }: StudentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    course: "",
    year: 1,
    address: "",
    admissionDate: new Date().toISOString().split('T')[0],
    status: "active"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createStudentMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/students", data),
    onSuccess: () => {
      toast({ title: "Success", description: "Student added successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        course: "",
        year: 1,
        address: "",
        admissionDate: new Date().toISOString().split('T')[0],
        status: "active"
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to add student",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStudentMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter student name"
                required
                data-testid="input-student-name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="student@example.com"
                required
                data-testid="input-student-email"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 9876543210"
                required
                data-testid="input-student-phone"
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                required
                data-testid="input-student-dob"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course">Course</Label>
              <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                <SelectTrigger data-testid="select-student-course">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B.Tech Computer Science">B.Tech Computer Science</SelectItem>
                  <SelectItem value="B.Tech Electronics">B.Tech Electronics</SelectItem>
                  <SelectItem value="MBA Finance">MBA Finance</SelectItem>
                  <SelectItem value="M.Sc Physics">M.Sc Physics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Select value={formData.year.toString()} onValueChange={(value) => handleInputChange("year", parseInt(value))}>
                <SelectTrigger data-testid="select-student-year">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              required
              data-testid="textarea-student-address"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              data-testid="button-cancel-student"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createStudentMutation.isPending}
              data-testid="button-submit-student"
            >
              {createStudentMutation.isPending ? "Adding..." : "Add Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
