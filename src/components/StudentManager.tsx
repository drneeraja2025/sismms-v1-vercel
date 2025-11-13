import { useState, FormEvent } from 'react';
import { supabase } from '../utility/SupabaseClient'; 
// NOTE: useAuth is imported but role is not checked, relying on parent for access gate.
import { useAuth } from '../contexts/AuthContext';    
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { toast } from './ui/toaster'; 

interface StudentManagerProps {
  isOpen: boolean;
  onClose: () => void;
  // NOTE: A refresh function will be added here later to update the list on the parent page
}

/**
 * Handles the creation of new student records. 
 * This component relies on its parent (StudentsPage) for access control.
 */
export default function StudentManager({ isOpen, onClose }: StudentManagerProps) {
  // Keeping useAuth() import for potential future logging/ID use, but not destructured.
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [currentClass, setCurrentClass] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- CORE SUBMISSION LOGIC (CREATE) ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    toast({ title: "Processing...", description: "Creating student record...", duration: 2000 });

    const newStudent = {
      first_name: firstName,
      last_name: lastName,
      student_id: studentId, // Must be unique as per SQL script
      date_of_birth: dateOfBirth,
      class: currentClass,
    };

    try {
      // Supabase RLS Policy Check: RLS will enforce admin/teacher check server-side.
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
      }
    } catch (err) {
        toast({ title: "Error", description: "An unexpected submission error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the form is not open, return null 
  if (!isOpen) {
    return null;
  }

  // Main Form Render (using a fixed position for modal effect)
  return (
    // FIX APPLIED HERE: Ensuring the className string is fully terminated.
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