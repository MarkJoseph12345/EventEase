'use client'

import { useRouter } from 'next/navigation';
import { withAuth } from '../protection'

const Dashboard = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div>
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
};

export default withAuth(Dashboard);
