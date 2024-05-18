"use client"

import React, { useEffect, useState } from 'react';
import { withAuth } from '../protection.js';
import dynamic from 'next/dynamic';

const StudentDashboard = dynamic(() => import('./studentDashboard.tsx'), {
    loading: () => <p>Loading...</p>,
});
const AdminDashboard = dynamic(() => import('./adminDashboard.tsx'), {
    loading: () => <p>Loading...</p>,
});

const DashboardComponent = () => {
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const role = window.localStorage.getItem('role');
        if (role) {
            setUserRole(role);
        }
    }, []);
    return (
        <div className="max-w-[2000px] relative mx-auto">
            {userRole === 'STUDENT' && <StudentDashboard />}
            {userRole === 'ADMIN' && <AdminDashboard />}
        </div>
    );
};

export default withAuth(DashboardComponent);
