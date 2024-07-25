"use client";

import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import { role } from "@/utils/data";
import Loading from "../Loader/Loading";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
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
