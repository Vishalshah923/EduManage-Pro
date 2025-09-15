import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Book, BookOpen, Clock } from "lucide-react";
import type { LibraryBook } from "@shared/schema";

export default function Library() {
  const { data: books = [], isLoading } = useQuery<LibraryBook[]>({
    queryKey: ["/api/library/books"],
  });

  const issuedBooks = books.filter(book => book.status === 'issued').length;
  const overdueBooks = books.filter(book => {
    if (book.status !== 'issued') return false;
    const dueDate = new Date(book.dueDate);
    return dueDate < new Date();
  }).length;
  const returnedBooks = books.filter(book => book.status === 'returned').length;

  if (isLoading) {
    return (
      <div className="flex-1 ml-64">
        <Header title="Library Management" subtitle="Manage book issues and returns" />
        <div className="p-6">Loading library data...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-64">
      <Header title="Library Management" subtitle="Manage book issues and returns" />
      
      <div className="p-6">
        {/* Library Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Books Issued</p>
                  <p className="text-3xl font-bold text-foreground">{issuedBooks}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue Books</p>
                  <p className="text-3xl font-bold text-foreground">{overdueBooks}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-red-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Books Returned</p>
                  <p className="text-3xl font-bold text-foreground">{returnedBooks}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Book className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Book Records */}
        <Card>
          <CardHeader>
            <CardTitle>Book Issue/Return Records</CardTitle>
          </CardHeader>
          <CardContent>
            {books.length === 0 ? (
              <div className="text-center py-12">
                <Book className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Library Records</h3>
                <p className="text-muted-foreground">Book issue and return records will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">Student ID</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Book Title</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Author</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Issue Date</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Due Date</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => {
                      const isOverdue = book.status === 'issued' && new Date(book.dueDate) < new Date();
                      
                      return (
                        <tr key={book.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 text-sm text-foreground" data-testid={`text-book-student-${book.id}`}>
                            {book.studentId}
                          </td>
                          <td className="p-4 text-sm font-medium text-foreground">
                            {book.bookTitle}
                          </td>
                          <td className="p-4 text-sm text-foreground">
                            {book.author}
                          </td>
                          <td className="p-4 text-sm text-foreground">
                            {new Date(book.issueDate).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm text-foreground">
                            {new Date(book.dueDate).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant={
                                book.status === 'returned' ? 'default' :
                                isOverdue ? 'destructive' : 'secondary'
                              }
                            >
                              {isOverdue ? 'overdue' : book.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {book.status === 'issued' && (
                              <Button variant="outline" size="sm" data-testid={`button-return-book-${book.id}`}>
                                Mark Returned
                              </Button>
                            )}
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
