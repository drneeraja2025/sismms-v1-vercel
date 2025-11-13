// File: src/pages/Students.tsx
// GNA-FIX-007: The Students Administration Hub (READ Functionality)

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utility/SupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import StudentForm from '@/components/StudentForm'; // Will be created in next step

// Define the expected data structure based on the GNA-FIX-SQL-002 schema
interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  class: string;
  date_of_birth: string;
}

// 1. Data Fetching Function (READ)
const fetchStudents = async (): Promise<Student[]> => {
  // GNA Protocol: Select all fields from the secure 'students' table
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('last_name', { ascending: true });

  if (error) throw new Error(error.message);
  return data as Student[];
};

const StudentsPage: React.FC = () => {
  const { user, loading: authLoading, role } = useAuth();
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  // 2. Query Hook for React Query
  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
    // GNA Mandate: Only enable the query if the user is authenticated (security)
    enabled: !!user && !authLoading, 
  });

  if (authLoading || isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading Students...</div>;
  }

  if (error) {
    // This will catch RLS errors if a non-staff user tries to access the page
    return <div className="text-destructive">Error loading students: {error.message}. Access may be restricted by RLS policy.</div>;
  }

  // GNA Security Check: Only display the list if staff/admin role is confirmed
  const canView = role === 'admin' || role === 'teacher';

  if (!canView) {
      return <div className="text-xl text-red-600">Access Denied: You must be an Admin or Teacher to view this page.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Administration</h1>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" /> Add New Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Students: {students?.length || 0}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students && students.map((student) => (
              <div key={student.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold">{student.last_name}, {student.first_name}</p>
                  <p className="text-sm text-gray-500">ID: {student.student_id} | Class: {student.class}</p>
                </div>
                <Button variant="outline" size="sm">View Profile</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Creation Form Modal */}
      <StudentForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        // Note: For now, the form only handles creation, not editing.
      />
    </div>
  );
};

export default StudentsPage;