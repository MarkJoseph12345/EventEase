'use client'
import React from 'react';
import StudentDashboard from './studentDashboard';
import AdminDashboard from './adminDashboard';

const Dashboard = () => {
  const userRole = localStorage.getItem("role")

  return (
    <div>
      {userRole === 'STUDENT' && <StudentDashboard />}
      {userRole === '' && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;
