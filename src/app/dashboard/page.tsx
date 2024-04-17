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

<<<<<<< HEAD
export default withAuth(Dashboard);
=======
export default withAuth(Dashboard);
>>>>>>> 5a32b12cbd9f4e650eca19acde425a8ad6b5768e
