import { useState, FormEvent } from 'react';
import { supabase } from '../utility/SupabaseClient'; // Fixed path
import { useAuth } from '../contexts/AuthContext';    // Fixed path
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { toast } from './ui/toaster'; // Using the centralized toaster

interface StudentManagerProps {
  isOpen: boolean;
  onClose: () => void;
  // We'll add a refresh prop later, for now, we just close the form
}

/**
 * Handles the creation of new student records. 
 * This component acts as a controlled modal/card based on the isOpen prop.
 */
export default function StudentManager({ isOpen, onClose }: StudentManagerProps) {
  const { isAdmin, isTeacher, loading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [currentClass, setCurrentClass] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GNA Security Check: Permissions are enforced by RLS, but a UI gate is essential.
  const canManage = isAdmin || isTeacher;

  // --- CORE SUBMISSION LOGIC (CREATE) ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canManage) {
        toast({ title: "Permission Error", description: "You are not authorized to add students.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    toast({ title: "Processing...", description: "Creating student record...", duration: 2000 });

    const newStudent = {
      first_name: firstName,
      last_name: lastName,
      student_id: studentId,
      date_of_birth: dateOfBirth,
      class: currentClass,
    };

    try {
      // Supabase RLS Policy Check: The INSERT is allowed for 'admin' or 'teacher' roles.
      const { error } = await supabase
        .from('students')
        .insert([newStudent]);

      if (error) {
        if (error.code === '23505') { 
          toast({ title: "Submission Failed", description: "Error: Student ID already exists. Use a unique ID.", variant: "destructive" });
        } else {
          toast({ title: "Submission Failed", description: `Error: ${error.message}`, variant: "destructive" });
        }
      } else {
        toast({ title: "Success!", description: `Student ${firstName} successfully registered.`, variant: "default" });
        
        // Clear form and close
        setFirstName(''); setLastName(''); setStudentId(''); setDateOfBirth(''); setCurrentClass('');
        onClose(); 
        
        // NOTE: In the next step, we will add code here to refresh the student list.
      }
    } catch (err) {
        toast({ title: "Error", description: "An unexpected submission error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the form is not open, return null (simple modal control)
  if (!isOpen) {
    return null;
  }

  // If loading or unauthorized, render a denial screen or loading state within the modal
  if (loading || !canManage) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{loading ? "Checking Permissions..." : "Access Denied"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>{!loading && "You do not have the required role to perform this action."}</CardDescription>
                    <Button onClick={onClose} className="mt-4 w-full">Close</Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  // Main Form Render (using a fixed position for modal effect)
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-lg p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">Register New Student</CardTitle>
                <Button variant="ghost" onClick={onClose}>&times;</Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                
                {/* First Name */}
                <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>

                {/* Last Name */}
                <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>

                {/* Student ID */}
                <div className="grid gap-2">
                    <Label htmlFor="studentId">Student ID (Unique)</Label>
                    <Input id="studentId" type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
                </div>

                {/* Date of Birth */}
                <div className="grid gap-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                </div>

                {/* Class */}
                <div className="grid gap-2 col-span-full">
                    <Label htmlFor="class">Class/Grade</Label>
                    <Input id="class" type="text" value={currentClass} onChange={(e) => setCurrentClass(e.target.value)} required />
                </div>
                
                {/* Submit Button */}
                <div className="col-span-full pt-4">
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Registering...' : 'Register Student'}
                    </Button>
                </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}