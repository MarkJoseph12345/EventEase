'use client'
import React from 'react';
import StudentDashboard from './studentDashboard';
import AdminDashboard from './adminDashboard';

const Dashboard = () => {
  const userRole = localStorage.getItem("role")

  return (
    <div>
      {userRole === '' && <StudentDashboard />}
      {userRole === 'STUDENT' && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;
