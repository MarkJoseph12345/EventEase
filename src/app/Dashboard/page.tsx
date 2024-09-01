"use client";

import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import Loading from "../Loader/Loading";
import { me } from "@/utils/apiCalls";
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
        setLoading(true);
        const result = await me();
        setRole(result.role)
        setLoading(false);
    };

    fetchRole();
}, []);

  if (loading) {
    return <Loading/>;
  }
  return (    
    <div>
      {role === "ADMIN" && <AdminDashboard />}
      {role === "STUDENT" && <StudentDashboard />}
    </div>
  );
};

export default Dashboard;