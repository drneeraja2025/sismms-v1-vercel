import React from 'react';
import { useParams } from 'react-router-dom';

const StudentProfilePage: React.FC = () => {
    // useParams grabs the ID from the URL (e.g., /students/1)
    const { studentId } = useParams<{ studentId: string }>();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Student Profile Details</h1>
            <p className="text-lg mb-6">
                Viewing profile for Student ID: <span className="font-semibold text-primary">{studentId}</span>
            </p>
            
            <div className="bg-white p-6 border rounded-lg shadow-md">
                <p>This page will eventually display comprehensive student data (grades, guardian consents, financial records) fetched from multiple Supabase tables based on the RLS policies and the Student ID.</p>
                <p className="mt-4 text-sm text-gray-500">
                    *Note: This is a placeholder page. Actual data fetching will be implemented in the next development iteration.*
                </p>
            </div>
        </div>
    );
};

export default StudentProfilePage;